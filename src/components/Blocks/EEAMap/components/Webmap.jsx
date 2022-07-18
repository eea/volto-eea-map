/* eslint-disable */
import React from 'react';
import { loadModules } from 'esri-loader';

const MODULES = [
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/layers/MapImageLayer',
  'esri/widgets/Legend',
  'esri/widgets/Expand',
  'esri/widgets/Print',
];

const Webmap = (props) => {
  const { data = {}, editMode } = props;
  const { base = {}, layers = {}, id, height, legend = {}, print = {} } = data;

  const { base_layer = '' } = base;

  const map_layers =
    layers &&
    layers.map_layers &&
    layers.map_layers
      .filter(({ map_layer }) => map_layer)
      .map((l, i) => l.map_layer);
  const options = {
    css: true,
  };
  const mapRef = React.useRef();
  const [modules, setModules] = React.useState({});
  const modules_loaded = React.useRef(false);

  React.useEffect(() => {
    if (!modules_loaded.current) {
      modules_loaded.current = true;
      loadModules(MODULES, options).then((modules) => {
        const [
          Map,
          MapView,
          FeatureLayer,
          MapImageLayer,
          Legend,
          Expand,
          Print,
        ] = modules;
        setModules({
          Map,
          MapView,
          FeatureLayer,
          MapImageLayer,
          Legend,
          Expand,
          Print,
        });
      });
    }
  }, [setModules, options]);

  const esri = React.useMemo(() => {
    if (Object.keys(modules).length === 0) return {};

    const {
      Map,
      MapView,
      FeatureLayer,
      MapImageLayer,
      Legend,
      Expand,
      Print,
    } = modules;
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
                url: map_service_url,
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

    if (legend?.legend?.show_legend) {
      const legend = new Expand({
        content: new Legend({
          view: view,
          style: 'classic', // other styles include 'classic'
        }),
        view: view,
        expanded: false,
        expandIconClass: 'esri-icon-legend',
        expandTooltip: 'Legend',
        classNames: 'some-cool-expand',
      });
      view.ui.add(legend, 'top-right');
    }

    if (print?.print?.show_print) {
      const print = new Expand({
        content: new Print({
          view: view,
        }),
        view: view,
        expanded: false,
        expandIconClass: 'esri-icon-printer',
        expandTooltip: 'Print',
      });
      view.ui.add(print, 'top-right');
    }

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
