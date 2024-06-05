import { useContext, useEffect } from 'react';
import { EventEmitter } from 'events';

import MapContext from '../Map/MapContext';

import useClass from '@eeacms/volto-eea-map/hooks/useClass';

let modules = {
  loaded: false,
};

class $Layer extends EventEmitter {
  #isReady = false;
  #props = {};
  #layer = null;

  constructor(props) {
    super();

    this.#props = props;
  }

  get isReady() {
    return this.#isReady && !!this.#layer;
  }

  get layer() {
    return this.#layer;
  }

  connect() {
    this.loadModules().then(() => {
      this.init();
      this.emit('connected');
    });
  }

  async loadModules() {
    const $arcgis = __CLIENT__ ? window.$arcgis : null;
    if (__SERVER__ || !$arcgis) return Promise.reject();
    if (!modules.loaded) {
      switch (this.#props.type) {
        default:
          modules.Layer = await $arcgis.import('esri/layers/FeatureLayer');
          break;
      }
      modules.loaded = true;
    }
    return Promise.resolve();
  }

  async init() {
    const { Layer, loaded } = modules;
    if (!loaded) return;
    if (!Layer) {
      throw new Error('$Layer modules not loaded');
    }
    this.#layer = new Layer({
      ...(this.#props || {}),
    });
    this.#isReady = true;
  }

  destroy() {
    if (this.#layer) {
      this.#layer.destroy();
    }
    this.#layer = null;
    this.#isReady = false;
    this.emit('destroyed');
  }
}

// https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-Layer.html
export default function Layer(props) {
  const { $map } = useContext(MapContext);
  const $layer = useClass($Layer, props);

  useEffect(() => {
    if (!$layer) return;

    function onConnect() {
      $map.emit('add-layer', $layer);
    }

    $layer.connect();
    $layer.on('connected', onConnect);

    return () => {
      $layer.off('connected', onConnect);
      $layer.destroy();
    };
  }, [$map, $layer]);

  return null;
}
