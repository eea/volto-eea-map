import { useEffect, useState } from 'react';
import { EventEmitter } from 'events';

import loadArcgis from '@eeacms/volto-eea-map/arcgis';
import useClass from '@eeacms/volto-eea-map/hooks/useClass';

import MapContext from './MapContext';

let modules = {
  loaded: false,
};

class $Map extends EventEmitter {
  #isReady = false;
  #props = {};
  #map = null;
  #view = null;
  #layers = [];

  constructor(props) {
    super();

    this.#props = props;

    loadArcgis();

    this.on('add-layer', ($layer) => {
      if (this.isReady && $layer.isReady) {
        this.#map.add($layer.layer);
      }
    });

    __CLIENT__ && window.addEventListener('message', this.interceptArcgis);
  }

  get isReady() {
    return this.#isReady && !!(this.#map && this.#view);
  }

  get map() {
    return this.#map;
  }

  get view() {
    return this.#view;
  }

  get layers() {
    return this.#layers;
  }

  connect() {
    this.loadModules().then(() => {
      this.init();
      this.emit('connected');
    });
  }

  interceptArcgis = (event) => {
    if (event.type === 'message' && event.data.type === 'arcgis-loaded') {
      this.connect();
    }
  };

  async loadModules() {
    const $arcgis = __CLIENT__ ? window.$arcgis : null;
    if (__SERVER__ || !$arcgis) return Promise.reject();
    if (!modules.loaded) {
      modules.Map = await $arcgis.import('esri/Map');
      switch (this.#props.dimension) {
        case '3d':
          modules.View = await $arcgis.import('esri/views/SceneView');
          break;
        default:
          modules.View = await $arcgis.import('esri/views/MapView');
          break;
      }
      modules.loaded = true;
    }
    return Promise.resolve();
  }

  init() {
    const { View, Map, loaded } = modules;
    if (!loaded) return;
    if (!View || !Map) {
      throw new Error('$Map modules not loaded');
    }
    const { id, ViewProperties = {}, MapProperties = {} } = this.#props;
    this.#map = new Map({
      basemap: 'topo',
      ...MapProperties,
    });
    this.#view = new View({
      container: id,
      map: this.#map,
      ...ViewProperties,
    });
    this.#isReady = true;
  }

  destroy() {
    if (__CLIENT__ && modules.loaded) {
      window.removeEventListener('message', this.interceptArcgis);
    }
    if (this.#view) {
      this.#view.destroy();
    }
    this.#map = null;
    this.#view = null;
    this.#isReady = false;
    this.emit('destroyed');
  }
}

/**
 * Renders a map component with the specified ID and dimensions.
 * @param {object} props - The component props.
 * @param {string} props.id - The unique identifier for the map component.
 * @param {object} props.dimension - The dimensions of the map component.
 * @param {object} props.MapProperties - The properties of the map. See https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html
 * @param {object} props.ViewProperties - The properties of the view. See https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html
 * @returns {JSX.Element} The rendered map component.
 */
export default function Map(props) {
  const { id, children } = props;
  const $map = useClass($Map, props);
  const [isReady, setIsReady] = useState(false);

  console.log(isReady);

  useEffect(() => {
    if (!$map) return;

    function onConnect() {
      setIsReady(true);
    }

    if (window.$arcgis) {
      $map.connect();
    }
    $map.on('connected', onConnect);

    return () => {
      if (!$map) return;
      $map.off('connected', onConnect);
      $map.destroy();
    };
  }, [$map]);

  return (
    <MapContext.Provider
      value={{
        id,
        $map,
      }}
    >
      <div id={id} style={{ height: '600px' }}>
        {isReady && children}
      </div>
    </MapContext.Provider>
  );
}
