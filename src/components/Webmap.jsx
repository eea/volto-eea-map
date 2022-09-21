/* eslint-disable */
import React from 'react';
import { withDeviceSize } from '../hocs';
import { loadModules } from 'esri-loader';
import { formatQuery } from 'react-querybuilder';

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
  'esri/widgets/ScaleBar',
];

const Webmap = (props) => {
  const { editMode, height, id } = props;

  const data = React.useMemo(() => props.data || {}, [props.data]);

  const device = React.useMemo(() => props.device || {}, [props.device]);
  const { base = {}, layers = {}, legend = {}, general = {} } = data;

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
          ScaleBar,
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
          ScaleBar,
        });
      });
    }
  }, [setModules, options]);

  //eslint-disable-next-line no-unused-vars
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
      ScaleBar,
      Renderer,
    } = modules;
    let layers =
      map_layers && map_layers.length > 0
        ? map_layers
            .filter(({ map_service_url, layer }) => map_service_url && layer)
            .map(({ map_service_url, layer, fullLayer, query = '' }, index) => {
              const url = `${map_service_url}/${layer?.id}`;
              let mapLayer;
              switch (layer.type) {
                case 'Raster Layer':
                  mapLayer = new MapImageLayer({
                    url: map_service_url,
                    minScale: layer?.minScale,
                    maxScale: layer?.maxScale,
                  });
                  break;
                case 'Feature Layer':
                  mapLayer = new FeatureLayer({
                    layerId: layer.id,
                    url,
                    definitionExpression: query
                      ? formatQuery(query, 'sql')
                      : '',
                    minScale: layer?.minScale,
                    maxScale: layer?.maxScale,
                  });
                  break;
                case 'Group Layer':
                  mapLayer = new GroupLayer({ url });
                  break;
                default:
                  break;
              }
              return mapLayer;
            })
        : [];
    const map = new Map({
      basemap: base_layer || 'hybrid',
      layers,
    });
    const view = new MapView({
      container: mapRef.current,
      map,
      center:
        general?.long && general?.lat ? [general.long, general.lat] : [0, 40],
      zoom: general?.zoom_level ? general?.zoom_level : 2,
      ui: {
        components: ['attribution'],
      },
    });
    if (general && general.scalebar) {
      const scaleBarWidget = new ScaleBar({
        view: view,
        unit: general.scalebar,
      });

      view.ui.add(scaleBarWidget, {
        position: 'bottom-left',
      });
    }

    if (layers && layers[0] && general && general.centerOnExtent) {
      const firstLayer = layers[0];
      firstLayer
        .when(() => {
          return firstLayer.queryExtent();
        })
        .then((response) => {
          view.goTo(response.extent);
        });
    }

    const zoomPosition =
      general && general.zoom_position ? general.zoom_position : '';

    if (zoomPosition) {
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
          style: 'classic',
        }),
        view: view,
        expanded: false,
        expandIconClass: 'esri-icon-legend',
        expandTooltip: 'Legend',
        classNames: 'some-cool-expand',
      });
      view.ui.add(legendWidget, legendPosition);
    }

    const printPosition =
      general && general.print_position ? general.print_position : '';

    if (printPosition) {
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
      layers.forEach((layer) => {
        view.whenLayerView(layer).then((layerView) => {
          layerView.watch('updating', (val) => {});
        });
      });
    }
    return { view, map };
  }, [modules, data, data.layers, map_layers]);

  return (
    <div>
      <div
        style={{
          height:
            height && !editMode
              ? `${height}px`
              : device === 'tablet' || device === 'mobile'
              ? '300px'
              : '500px',
        }}
        ref={mapRef}
        className="esri-map"
      ></div>
    </div>
  );
};

export default withDeviceSize(React.memo(Webmap));
