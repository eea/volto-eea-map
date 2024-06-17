import { useContext, useEffect, useMemo, memo } from 'react';
import { EventEmitter } from 'events';
import { uniq } from 'lodash';

import useClass from '@eeacms/volto-eea-map/hooks/useClass';
import { omitBy } from '@eeacms/volto-eea-map/Arcgis/helpers';
import {
  layersMapping,
  withSublayers,
  geometryMapping,
} from '@eeacms/volto-eea-map/constants';

import MapContext from '@eeacms/volto-eea-map/Arcgis/Map/MapContext';

let modules = {};

class $Layer extends EventEmitter {
  #isReady = false;
  #props = {};
  #layer = null;
  #modulesLoaded = false;

  constructor(props = {}) {
    super();

    this.#props = props;
  }

  get isReady() {
    return this.#isReady && !!this.#layer;
  }

  get layer() {
    return this.#layer;
  }

  set props(props = {}) {
    this.#props = props;
    this.update();
  }

  getUrl(id) {
    return this.#props.url
      ? `${this.#props.url}${id ? `/${id}` : ''}`
      : undefined;
  }

  getType(type) {
    return layersMapping[type] || type?.replaceAll(' ', '');
  }

  getLayersTypes(layer) {
    return uniq([
      this.getType(layer.type),
      ...(layer.subLayers || []).reduce((acc, layer) => {
        acc.push(...this.getLayersTypes(layer));
        return acc;
      }, []),
    ]);
  }

  async loadModules() {
    const $arcgis = __CLIENT__ ? window.$arcgis : null;
    if (__SERVER__ || !$arcgis) return Promise.reject();
    if (!this.#modulesLoaded) {
      const types = this.getLayersTypes(this.#props);
      for (const type of types) {
        if (!modules[`Ag${type}`] && type) {
          modules[`Ag${type}`] = await $arcgis.import(`esri/layers/${type}`);
        }
      }
      this.#modulesLoaded = true;
    }
    return Promise.resolve();
  }

  createLayer(props) {
    const type = this.getType(props.type);

    if (!type) return null;

    const AgLayer = modules[`Ag${type}`];

    if (!AgLayer) {
      throw new Error('$Layer modules not loaded');
    }

    const layerProps = omitBy(props || {}, [
      '$map',
      'type',
      'url',
      'id',
      'geometryType',
      'opacity',
    ]);

    if (layerProps.geometryType) {
      layerProps.geometryType =
        geometryMapping[layerProps.geometryType] || layerProps.geometryType;
    }

    layerProps.opacity = parseInt(layerProps.opacity ?? 1);

    const layer = new AgLayer(
      withSublayers.includes(type)
        ? {
            url: this.getUrl(),
            sublayers: props.sublayers || [layerProps],
          }
        : {
            url: this.getUrl(props.id),
            ...layerProps,
          },
    );

    if (props.subLayers) {
      props.subLayers.forEach((subLayer) => {
        layer.add(this.createLayer(subLayer));
      });
    }

    return layer;
  }

  init() {
    const $map = this.#props.$map;
    if (!$map.isReady || (!this.#props.url && !this.#props.source)) return;
    if (!this.#modulesLoaded) {
      throw new Error('$Layer modules not loaded');
    }

    this.#layer = this.createLayer(this.#props);

    if (this.#layer) {
      $map.map.add(this.#layer);
    }

    this.#isReady = true;
    this.emit('connected');
  }

  update() {
    const { $map, url, id } = this.#props;
    if (!this.isReady || !$map.isReady) return;

    console.log('HERE', this.#layer.url !== url || this.#layer.layerId !== id);

    if (this.#layer.url !== url || this.#layer.layerId !== id) {
      this.disconnect();
      this.connect();
      return;
    }

    Object.keys(
      omitBy(this.#props || {}, ['$map', 'type', 'url', 'id']),
    ).forEach((key) => {
      switch (key) {
        case 'geometryType':
          this.#layer.geometryType =
            geometryMapping[this.#props[key]] || this.#props[key];
          break;
        case 'opacity':
          this.#layer.opacity = parseInt(this.#props[key]);
          break;
        default:
          this.#layer[key] = this.#props[key];
          break;
      }
    });
  }

  connect() {
    this.loadModules().then(() => {
      this.init();
    });
  }

  disconnect() {
    if (!this.#isReady) return;
    if (this.#layer) {
      this.#layer.destroy();
    }
    this.#layer = null;
    this.#isReady = false;
    this.#modulesLoaded = false;
    this.emit('disconnected');
  }
}

// https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-Layer.html
function Layer(props) {
  const { $map } = useContext(MapContext);
  const context = useMemo(() => ({ ...props, $map }), [props, $map]);

  const $layer = useClass($Layer, context);

  useEffect(() => {
    if (!$layer) return;

    if ($map.isReady) {
      console.log('CONNECTING LAYER');
      $layer.connect();
    }

    return () => {
      console.log('DISCONNECTING LAYER');
      $layer.disconnect();
    };
  }, [$map, $layer]);

  useEffect(() => {
    console.log('HERE UPDATE', $layer.layer);
    if (!$map.isReady) return;
    if (!$layer.isReady) {
      $layer.props = context;
      $layer.disconnect();
      $layer.connect();
      return;
    }
    $layer.props = context;
  }, [$map, $layer, context]);

  return null;
}

export default memo(Layer);
