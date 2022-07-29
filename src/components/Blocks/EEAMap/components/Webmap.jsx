/* eslint-disable */
import React from 'react';
import { loadModules } from 'esri-loader';

const MODULES = [
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/layers/MapImageLayer',
  'esri/layers/GroupLayer',
  'esri/widgets/Legend',
  'esri/widgets/Expand',
  'esri/widgets/Print',
  'esri/widgets/Zoom',
];

const Webmap = (props) => {
  const { data = {}, editMode, height } = props;
  const {
    base = {},
    layers = {},
    id,
    legend = {},
    print = {},
    zoom = {},
  } = data;

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
          GroupLayer,
          Legend,
          Expand,
          Print,
          Zoom,
        ] = modules;
        setModules({
          Map,
          MapView,
          FeatureLayer,
          MapImageLayer,
          GroupLayer,
          Legend,
          Expand,
          Print,
          Zoom,
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
      GroupLayer,
      Legend,
      Expand,
      Print,
      Zoom,
    } = modules;
    let layers =
      map_layers &&
      map_layers.length > 0 &&
      map_layers
        .filter(({ map_service_url, layer }) => map_service_url && layer)
        .map(({ map_service_url, layer, query = '' }) => {
          const url = `${map_service_url}/${layer}`;

          let mapLayer;
          switch (layer.type) {
            case 'Raster Layer':
              mapLayer = new MapImageLayer({
                url: map_service_url,
              });
              break;
            case 'Feature Layer':
              mapLayer = new FeatureLayer({
                url,
                definitionExpression: query,
              });
              break;
            case 'Group Layer':
              mapLayer = new GroupLayer({ url });
              break;
            default:
              break;
          }
          return mapLayer;
        });

    // //this next layer will be used to filter country and intersect with existing layer
    // const allCountriesLayer = new FeatureLayer({
    //   url:
    //     'https://trial.discomap.eea.europa.eu/arcgis/rest/services/CLMS/WorldCountries/MapServer/1',
    //   definitionExpression: `(CNTR_ID = 'BG')`,
    // });

    const map = new Map({
      basemap: base_layer || 'hybrid',
      layers,
    });

    const view = new MapView({
      container: mapRef.current,
      map,
      center: zoom?.long && zoom?.lat ? [zoom.long, zoom.lat] : [0, 40],
      zoom: zoom?.zoom_level ? zoom?.zoom_level : 2,
      ui: {
        components: ['attribution'],
      },
    });

    if (zoom?.show_zoom) {
      const zoomPosition = zoom && zoom.position ? zoom.position : 'top-right';
      const zoomWidget = new Zoom({
        view: view,
      });
      view.ui.add(zoomWidget, zoomPosition);
    }

    if (legend?.legend?.show_legend) {
      const legendPosition =
        legend && legend.legend && legend.legend.position
          ? legend.legend.position
          : 'top-right';

      const legendWidget = new Expand({
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
      view.ui.add(legendWidget, legendPosition);
    }

    if (print?.show_print) {
      const printPosition =
        print && print.position ? print.position : 'top-right';
      const printWidget = new Expand({
        content: new Print({
          view: view,
        }),
        view: view,
        expanded: false,
        expandIconClass: 'esri-icon-printer',
        expandTooltip: 'Print',
      });
      view.ui.add(printWidget, printPosition);
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
          height: height && !editMode ? `${height}px` : '500px',
        }}
        ref={mapRef}
        className="esri-map"
      ></div>
    </div>
  );
};

export default Webmap;
