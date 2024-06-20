import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { EventEmitter } from 'events';

import useClass from '@eeacms/volto-eea-map/hooks/useClass';

import MapContext from './MapContext';
import withArcgis from '@eeacms/volto-eea-map/hocs/withArcgis';

import '@eeacms/volto-eea-map/styles/map.less';

let modules = {
  loaded: false,
};

function getBaseMap(props) {
  const { basemap } = props;

  if (!basemap.name && !basemap.url_template) return 'topo';

  const { AgWebTileLayer, AgBasemap } = modules;

  if (!AgWebTileLayer || !AgBasemap) {
    throw new Error('$Map modules not loaded');
  }

  if (basemap.url_template) {
    return new AgBasemap({
      baseLayers: [
        new AgWebTileLayer({
          urlTemplate: basemap.url_template,
        }),
      ],
    });
  }

  switch (basemap.name) {
    case 'positron-composite':
      return new AgBasemap({
        baseLayers: [
          new AgWebTileLayer({
            urlTemplate:
              'https://gisco-services.ec.europa.eu/maps/tiles/OSMPositronComposite/EPSG3857/{level}/{col}/{row}.png',
          }),
        ],
        thumbnailUrl:
          'https://gisco-services.ec.europa.eu/maps/tiles/OSMPositronComposite/EPSG3857/0/0/0.png',
      });
    case 'blossom-composite':
      return new AgBasemap({
        baseLayers: [
          new AgWebTileLayer({
            urlTemplate:
              'https://gisco-services.ec.europa.eu/maps/tiles/OSMBlossomComposite/EPSG3857/{level}/{col}/{row}.png',
          }),
        ],
        thumbnailUrl:
          'https://gisco-services.ec.europa.eu/maps/tiles/OSMBlossomComposite/EPSG3857/0/0/0.png',
      });
    default:
      return basemap.name;
  }
}

class $Map extends EventEmitter {
  #isReady = false;
  #props = {};
  #map = null;
  #view = null;
  reactiveUtils = null;

  constructor(props) {
    super();

    this.#props = props;
  }

  get isReady() {
    return this.#isReady && !!(this.#map && this.#view);
  }

  get modules() {
    return modules;
  }

  get map() {
    return this.#map;
  }

  get view() {
    return this.#view;
  }

  set props(props) {
    this.updateProps(props);
    this.update();
  }

  async loadModules() {
    const $arcgis = __CLIENT__ ? window.$arcgis : null;
    if (__SERVER__ || !$arcgis) return Promise.reject();
    if (!modules.loaded) {
      modules.AgMap = await $arcgis.import('esri/Map');
      modules.AgWebTileLayer = await $arcgis.import('esri/layers/WebTileLayer');
      modules.AgBasemap = await $arcgis.import('esri/Basemap');
      modules.AgSceneView = await $arcgis.import('esri/views/SceneView');
      modules.AgMapView = await $arcgis.import('esri/views/MapView');
      // Common modules
      modules.AgColor = await $arcgis.import('esri/Color');
      modules.AgViewpoint = await $arcgis.import('esri/Viewpoint');
      modules.agReactiveUtils = await $arcgis.import('esri/core/reactiveUtils');
      modules.agJsonUtils = await $arcgis.import(
        'esri/renderers/support/jsonUtils',
      );
      modules.loaded = true;
    }
    return Promise.resolve();
  }

  init() {
    const { mapEl, ViewProperties = {}, MapProperties = {} } = this.#props;
    const { AgMapView, AgSceneView, AgMap, agReactiveUtils, loaded } = modules;
    const AgView = MapProperties.dimension === '3d' ? AgSceneView : AgMapView;
    if (!loaded) return;
    if (!AgView || !AgMap) {
      throw new Error('$Map modules not loaded');
    }
    this.#map = new AgMap({
      ...MapProperties,
      basemap: getBaseMap(MapProperties),
    });
    this.#view = new AgView({
      container: mapEl.current,
      map: this.#map,
      ...ViewProperties,
    });
    this.#view.ui.components = [];
    this.#isReady = true;
    this.reactiveUtils = agReactiveUtils;
    this.emit('connected');
  }

  updateProps(props) {
    this.#props = props;
  }

  update() {
    if (!this.isReady) return;

    const { ViewProperties = {}, MapProperties = {} } = this.#props;

    if (
      this.#view.constraints.rotationEnabled &&
      !ViewProperties.constraints.rotationEnabled
    ) {
      this.#view.rotation = 0;
    }

    Object.keys(ViewProperties).forEach((key) => {
      this.#view[key] = ViewProperties[key];
    });

    Object.keys(MapProperties).forEach((key) => {
      switch (key) {
        case 'basemap':
          this.#map[key] = getBaseMap(MapProperties);
          break;
        default:
          this.#map[key] = MapProperties[key];
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
 * Renders a map component with the specified dimensions.
 * @param {object} props - The component props.
 * @param {object} props.dimension - The dimensions of the map component.
 * @param {object} props.MapProperties - The properties of the map. See https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html
 * @param {object} props.ViewProperties - The properties of the view. See https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html
 * @returns {JSX.Element} The rendered map component.
 */
const Map = forwardRef((props, ref) => {
  const mapEl = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const { children, agLoaded, MapProperties = {} } = props;

  const context = useMemo(
    () => ({
      ...props,
      mapEl,
    }),
    [props, mapEl],
  );

  const $map = useClass($Map, context);

  useImperativeHandle(ref, () => $map, [$map]);

  useEffect(() => {
    if (!$map.isReady) return;
    $map.props = context;
  }, [$map, context]);

  useEffect(() => {
    if (!$map) return;

    function onConnect() {
      setIsReady(true);
    }

    function onDisconnect() {
      setIsReady(false);
    }

    $map.updateProps(context);

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
    // We handle the props change in the useEffect above.
    /* eslint-disable-next-line */
  }, [$map, agLoaded, MapProperties.dimension]);

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
});

export default withArcgis(Map);
