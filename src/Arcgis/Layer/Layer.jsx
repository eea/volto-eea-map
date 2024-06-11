import { useContext, useEffect, useMemo } from 'react';
import { EventEmitter } from 'events';

import MapContext from '../Map/MapContext';

import useClass from '@eeacms/volto-eea-map/hooks/useClass';

let modules = {};

class $Layer extends EventEmitter {
  #isReady = false;
  #props = {};
  #name = '';
  #layer = null;
  #modulesLoaded = false;

  constructor(props) {
    super();

    this.#name = props.name || 'FeatureLayer';
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
    if (!this.#modulesLoaded) {
      const AgLayer = modules[`Ag${this.#name}`];
      modules[`Ag${this.#name}`] =
        AgLayer || (await $arcgis.import(`esri/layers/${this.#name}`));
      this.#modulesLoaded = true;
    }
    return Promise.resolve();
  }

  async init() {
    const $map = this.#props.$map;
    const AgLayer = modules[`Ag${this.#name}`];
    if (!this.#modulesLoaded || !$map.isReady) return;
    if (!AgLayer) {
      throw new Error('$Layer modules not loaded');
    }

    this.#layer = new AgLayer({
      ...(this.#props || {}),
    });

    $map.map.add(this.#layer);

    this.#isReady = true;
  }

  disconnect() {
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
  const context = useMemo(() => ({ ...props, $map }), [props, $map]);

  const $layer = useClass($Layer, context);

  useEffect(() => {
    if (!$layer) return;

    $layer.connect();

    return () => {
      $layer.disconnect();
    };
  }, [$layer]);

  return null;
}
