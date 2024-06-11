import { useEffect, useState, useRef, useMemo } from 'react';
import { EventEmitter } from 'events';

import useClass from '@eeacms/volto-eea-map/hooks/useClass';

import MapContext from './MapContext';
import withArcgis from '../../hocs/withArcgis';

import '@eeacms/volto-eea-map/styles/map.less';

let modules = {
  loaded: false,
};

class $Map extends EventEmitter {
  #isReady = false;
  #props = {};
  #map = null;
  #view = null;

  constructor(props) {
    super();

    this.#props = props;
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
      modules.AgMap = await $arcgis.import('esri/Map');
      switch (this.#props.dimension) {
        case '3d':
          modules.AgView = await $arcgis.import('esri/views/SceneView');
          break;
        default:
          modules.AgView = await $arcgis.import('esri/views/MapView');
          break;
      }
      modules.loaded = true;
    }
    return Promise.resolve();
  }

  init() {
    const { AgView, AgMap, loaded } = modules;
    if (!loaded) return;
    if (!AgView || !AgMap) {
      throw new Error('$Map modules not loaded');
    }
    const { mapEl, ViewProperties = {}, MapProperties = {} } = this.#props;
    this.#map = new AgMap({
      basemap: 'topo',
      ...MapProperties,
    });
    this.#view = new AgView({
      container: mapEl.current,
      map: this.#map,
      ...ViewProperties,
    });
    this.#isReady = true;
  }

  disconnect() {
    if (this.#view) {
      this.#view.destroy();
    }
    this.#map = null;
    this.#view = null;
    this.#isReady = false;
    this.emit('disconnected');
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
function Map(props) {
  const mapEl = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const { children, agLoaded } = props;

  const context = useMemo(() => ({ ...props, mapEl }), [props, mapEl]);

  const $map = useClass($Map, context);

  useEffect(() => {
    if (!$map) return;

    function onConnect() {
      setIsReady(true);
    }

    function onDisconnect() {
      setIsReady(false);
    }

    if (agLoaded) {
      $map.connect();
    }

    $map.on('connected', onConnect);
    $map.on('disconnected', onDisconnect);

    return () => {
      if (!$map) return;
      $map.disconnect();
      $map.off('connected', onConnect);
      $map.off('disconnected', onDisconnect);
    };
  }, [$map, agLoaded]);

  return (
    <MapContext.Provider
      value={{
        mapEl,
        $map,
      }}
    >
      <div ref={mapEl} style={{ '--ag-map-height': '600px' }}>
        {isReady && children}
      </div>
    </MapContext.Provider>
  );
}

export default withArcgis(Map);
