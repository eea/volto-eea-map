/* eslint-disable */
import React from 'react';
import { loadModules } from 'esri-loader';

const MODULES = [
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/layers/MapImageLayer',
];

export const filterToWhereParams = (map_filters) => {
  //  `Country_co = 'DK'`
  let acc = '';
  Object.keys(map_filters).forEach((name) => {
    if (map_filters[name]) {
      if (acc) acc += ' AND ';
      acc += `${name} = '${map_filters[name]}' `;
    }
  });

  return acc;
};

const Webmap = (props) => {
  const { data = {}, editMode } = props;
  const { base_layer = {}, map_layers = [], id, height } = data;
  // map_filters, map_service_url, layer,
  const options = {
    css: true,
  };
  const mapRef = React.useRef();
  const [modules, setModules] = React.useState({});
  const modules_loaded = React.useRef(false);

  // Load the ESRI JS API
  React.useEffect(() => {
    if (!modules_loaded.current) {
      modules_loaded.current = true;
      loadModules(MODULES, options).then((modules) => {
        const [Map, MapView, FeatureLayer, MapImageLayer] = modules;
        setModules({
          Map,
          MapView,
          FeatureLayer,
          MapImageLayer,
        });
      });
    }
  }, [setModules, options]);

  const esri = React.useMemo(() => {
    if (Object.keys(modules).length === 0) return {};

    const { Map, MapView, FeatureLayer, MapImageLayer } = modules;
    let layers =
      map_layers &&
      map_layers.length > 0 &&
      map_layers
        .filter(({ map_service_url, layer }) => map_service_url && layer)
        .map(({ map_service_url, layer }) => {
          const url = `${map_service_url}/${layer}`;

          let mapLayer;

          //TODO: add more layers and error catch for unrecognized layer

          switch (layer.type) {
            case 'Raster Layer':
              mapLayer = new MapImageLayer({
                url: map_service_url, //  uses the map service directly
              });
              break;
            case 'Feature Layer':
              mapLayer = new FeatureLayer({ url });
              break;
            default:
              break;
          }
          return mapLayer;
        });

    const map = new Map({
      basemap: base_layer || 'hybrid',
      layers,
    });
    const view = new MapView({
      container: mapRef.current,
      map,
    });

    if (layers && layers.length > 0) {
      view.whenLayerView(layers[0]).then((layerView) => {
        layerView.watch('updating', (val) => {});
      });
    }
    return { view, map };
  }, [modules, base_layer, map_layers]);

  const currentLayerView = esri.view?.layerViews?.items?.[0];

  return (
    <div>
      <div
        style={{
          height: height && !editMode ? `${height}px` : '450px',
        }}
        ref={mapRef}
        className="esri-map"
      ></div>
    </div>
  );
};

export default Webmap;
