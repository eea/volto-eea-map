import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import Map from './Map';
import Layer from '../Layer/Layer';
import Widget from '../Widget/Widget';

import { getBasemap, getLayers, getWidgets } from '../helpers';

const MapBuilder = forwardRef((props, ref) => {
  const { data } = props || {};
  const { styles } = data || {};
  const $map = useRef(null);
  const [renderWidgets, setRenderWidgets] = useState(true);
  const basemap = useMemo(
    () => getBasemap({ basemap: data.basemap, base: data.base }),
    [data.basemap, data.base],
  );
  const layers = useMemo(
    () => getLayers({ layers: data.layers }),
    [data.layers],
  );
  const widgets = useMemo(
    () => getWidgets({ widgets: data.widgets }),
    [data.widgets],
  );
  const settings = useMemo(() => data.settings || {}, [data.settings]);
  const viewSettings = useMemo(() => settings.view || {}, [settings.view]);
  const initialViewpoint = useMemo(
    () => ({ center: viewSettings.center, zoom: viewSettings.zoom }),
    [viewSettings.center, viewSettings.zoom],
  );

  const rotationEnabled = settings.view?.constraints?.rotationEnabled ?? false;

  const customFeatureLayerRenderer = {
    type: 'simple',
    symbol: {
      type: 'simple-fill',
      color: styles?.symbol_color
        ? styles?.symbol_color?.rgb
        : {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
          },
      style: 'solid',
      outline: {
        color: styles?.outline_color
          ? styles?.outline_color?.rgb
          : {
              r: 0,
              g: 0,
              b: 0,
              a: 1,
            },
        width: styles?.outline_width ? styles?.outline_width : 1,
      },
    },
  };

  useEffect(() => {
    setRenderWidgets(false);
  }, [widgets]);

  useEffect(() => {
    if (!renderWidgets) {
      setRenderWidgets(true);
    }
  }, [renderWidgets]);

  useEffect(() => {
    if (!$map.current?.isReady) return;
    const homeWidget = $map.current.view.ui.find('Home');
    if (!homeWidget || !initialViewpoint.center) return;
    console.log('Setting initial viewpoint');
    homeWidget.viewpoint = new $map.current.modules.AgViewpoint({
      center: initialViewpoint.center,
      zoom: initialViewpoint.zoom || 0,
    });
  }, [ref, initialViewpoint]);

  useImperativeHandle(ref, () => $map.current);

  return (
    <Map
      MapProperties={{
        ...(settings.map || {}),
        basemap,
      }}
      ViewProperties={{
        ...(settings.view || {}),
        constraints: {
          ...(settings.view?.constraints || {}),
          rotationEnabled,
        },
      }}
      ref={$map}
    >
      {renderWidgets &&
        widgets.map((widget, index) => (
          <Widget key={index} order={index + 1} {...widget} />
        ))}
      {layers.map((layer, index) => (
        <Layer key={index} {...layer} opacity={layer.opacity ?? 1} />
      ))}
      {/* <Layer url="https://water.discomap.eea.europa.eu/arcgis/rest/services/Marine/MPA_networks_in_EEA_marine_assessment_areas_2021/MapServer/0" /> */}
      {/* <Layer url="https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/CDDA_Dyna_WM/MapServer/0" /> */}
    </Map>
  );

  // const editMode = props && props.editMode ? props.editMode : false;
  // const height = props && props.height ? props.height : '';
  // const id = props && props.id ? props.id : '';
  // const device = props && props.device ? props.device : {};
  // const data = props && props.data ? props.data : {};

  // const layers =
  //   props && props.data && props.data.layers ? props.data.layers : {};
  // const base = props && props.data && props.data.base ? props.data.base : {};
  // const general =
  //   props && props.data && props.data.general ? props.data.general : {};
  // const styles =
  //   props && props.data && props.data.styles ? props.data.styles : {};
  // const base_layer = base && base.base_layer ? base.base_layer : '';

  // const map_layers =
  //   layers &&
  //   layers.map_layers &&
  //   layers.map_layers
  //     .filter(({ map_layer }) => map_layer)
  //     .map((l, i) => l.map_layer);

  // const mapRef = React.useRef();
  // const [modules, setModules] = React.useState({});

  // const modules_loaded = React.useRef(false);

  // React.useEffect(() => {
  //   if (!modules_loaded.current) {
  //     modules_loaded.current = true;
  //     loadModules(MODULES, {
  //       css: true,
  //     }).then((modules) => {
  //       const [
  //         MapBlock,
  //         MapView,
  //         FeatureLayer,
  //         MapImageLayer,
  //         GroupLayer,
  //         WebTileLayer,
  //         Basemap,
  //         Legend,
  //         Expand,
  //         Print,
  //         Zoom,
  //         ScaleBar,
  //         Fullscreen,
  //       ] = modules;
  //       setModules({
  //         MapBlock,
  //         MapView,
  //         FeatureLayer,
  //         MapImageLayer,
  //         GroupLayer,
  //         WebTileLayer,
  //         Basemap,
  //         Legend,
  //         Expand,
  //         Print,
  //         Zoom,
  //         ScaleBar,
  //         Fullscreen,
  //       });
  //     });
  //   }
  // }, [setModules]);

  //eslint-disable-next-line no-unused-vars
  // const esri = React.useMemo(() => {
  //   if (Object.keys(modules).length === 0) return {};
  //   const {
  //     MapBlock,
  //     MapView,
  //     FeatureLayer,
  //     MapImageLayer,
  //     GroupLayer,
  //     WebTileLayer,
  //     Basemap,
  //     Legend,
  //     Expand,
  //     Print,
  //     Zoom,
  //     ScaleBar,
  //     Fullscreen,
  //   } = modules;
  //   let layers =
  //     map_layers && map_layers.length > 0
  //       ? map_layers
  //           .filter(({ map_service_url, layer }) => map_service_url && layer)
  //           .map(
  //             (
  //               {
  //                 map_service_url = '',
  //                 layer,
  //                 fullLayer,
  //                 query = '',
  //                 opacity = 1,
  //                 maxScaleOverride = '',
  //                 minScaleOverride = '',
  //               },
  //               index,
  //             ) => {
  //               const url = `${map_service_url}/${layer?.id}`;
  //               let mapLayer;
  //               switch (layer.type) {
  //                 case 'Raster Layer':
  //                   mapLayer = new MapImageLayer({
  //                     url: map_service_url,
  //                     sublayers: [
  //                       {
  //                         id: layer.id,
  //                         minScale: minScaleOverride
  //                           ? minScaleOverride
  //                           : layer?.minScale,
  //                         maxScale: maxScaleOverride
  //                           ? maxScaleOverride
  //                           : layer?.maxScale,
  //                         opacity: opacity ? parseFloat(opacity) : 1,
  //                         definitionExpression: query
  //                           ? formatQuery(query, 'sql')
  //                           : '',
  //                       },
  //                     ],
  //                   });
  //                   break;
  //                 case 'Feature Layer':
  //                   mapLayer = new FeatureLayer({
  //                     layerId: layer.id,
  //                     url,
  //                     definitionExpression: query
  //                       ? formatQuery(query, 'sql')
  //                       : '',
  //                     minScale: minScaleOverride
  //                       ? minScaleOverride
  //                       : layer?.minScale,
  //                     maxScale: maxScaleOverride
  //                       ? maxScaleOverride
  //                       : layer?.maxScale,
  //                     opacity: opacity ? parseFloat(opacity) : 1,
  //                     ...(styles?.override_styles && {
  //                       renderer: customFeatureLayerRenderer,
  //                     }),
  //                   });
  //                   break;
  //                 default:
  //                   break;
  //               }
  //               return mapLayer;
  //             },
  //           )
  //       : [];

  //   const generateMapBaselayer = (compositeType) => {
  //     return new WebTileLayer({
  //       urlTemplate: `https://gisco-services.ec.europa.eu/maps/tiles/OSM${compositeType}Composite/EPSG3857/{level}/{col}/{row}.png`,
  //     });
  //   };

  //   // Create a Basemap with the WebTileLayer.

  //   const positronCompositeBasemap = new Basemap({
  //     baseLayers: [generateMapBaselayer('Positron')],
  //     title: 'Positron Composite',
  //     id: 'positron-composite',
  //     thumbnailUrl:
  //       'https://gisco-services.ec.europa.eu/maps/tiles/OSMPositronComposite/EPSG3857/0/0/0.png',
  //   });

  //   const blossomCompositeBasemap = new Basemap({
  //     baseLayers: [generateMapBaselayer('Blossom')],
  //     title: 'Blossom Composite',
  //     id: 'blossom-composite',
  //     thumbnailUrl:
  //       'https://gisco-services.ec.europa.eu/maps/tiles/OSMBlossomComposite/EPSG3857/0/0/0.png',
  //   });

  //   const setBasemap = (basemap) => {
  //     if (basemap === 'positron-composite') {
  //       return positronCompositeBasemap;
  //     }
  //     if (basemap === 'blossom-composite') {
  //       return blossomCompositeBasemap;
  //     }
  //     if (!basemap) {
  //       return 'hybrid';
  //     }
  //     return basemap;
  //   };

  //   const setCustomBasemap = (urlTemplate) => {
  //     const mapBaseLayer = new WebTileLayer({
  //       urlTemplate,
  //     });

  //     // Create a Basemap with the WebTileLayer.
  //     const customBase = new Basemap({
  //       baseLayers: [mapBaseLayer],
  //       title: 'Custom Base Layer',
  //       id: 'custom-base',
  //     });
  //     return customBase;
  //   };

  //   const map = new MapBlock({
  //     basemap:
  //       data?.base?.use_custom_base && data?.base?.custom_base_layer
  //         ? setCustomBasemap(data?.base?.custom_base_layer)
  //         : setBasemap(base_layer),
  //     layers,
  //   });
  //   const view = new MapView({
  //     container: mapRef.current,
  //     map,
  //     center:
  //       general?.long && general?.lat ? [general.long, general.lat] : [0, 40],
  //     zoom: general?.zoom_level ? general?.zoom_level : 2,
  //     ui: {
  //       components: ['attribution'],
  //     },
  //   });
  //   if (general && general.scalebar) {
  //     const scaleBarWidget = new ScaleBar({
  //       view: view,
  //       unit: general.scalebar,
  //     });

  //     view.ui.add(scaleBarWidget, {
  //       position: 'bottom-left',
  //     });
  //   }

  //   const fullscreenWidget = new Fullscreen({
  //     view: view,
  //   });

  //   view.ui.add(fullscreenWidget, 'top-right');

  //   //detect when fullscreen is on

  //   if (layers && layers[0] && general && general.centerOnExtent) {
  //     const firstLayer = layers[0];
  //     if (firstLayer.type === 'feature') {
  //       firstLayer
  //         .when(() => {
  //           return firstLayer.queryExtent();
  //         })
  //         .then((response) => {
  //           view.goTo(response.extent);
  //         });
  //     }
  //     if (firstLayer.type === 'map-image') {
  //       firstLayer.when(() => {
  //         view.goTo(firstLayer.fullExtent);
  //       });
  //     }
  //   }

  //   const zoomPosition =
  //     general && general.zoom_position ? general.zoom_position : '';

  //   if (zoomPosition) {
  //     const zoomWidget = new Zoom({
  //       view: view,
  //     });
  //     view.ui.add(zoomWidget, zoomPosition);
  //   }
  //   const printPosition =
  //     general && general.print_position ? general.print_position : '';

  //   if (printPosition) {
  //     const printWidget = new Expand({
  //       content: new Print({
  //         view: view,
  //       }),
  //       view: view,
  //       expanded: false,
  //       expandIconClass: 'esri-icon-printer',
  //       expandTooltip: 'Print',
  //     });
  //     view.ui.add(printWidget, printPosition);
  //   }

  //   if (layers && layers.length > 0) {
  //     layers.forEach((layer) => {
  //       view.whenLayerView(layer).then((layerView) => {
  //         layerView.watch('updating', (val) => {});
  //       });
  //     });
  //   }
  //   return { view, map };
  // }, [modules, data, data.layers, map_layers]);

  // const heightPx =
  //   height && !editMode
  //     ? `${height}px`
  //     : device === 'tablet' || device === 'mobile'
  //     ? '300px'
  //     : '500px';

  // const dynamicStyle = `
  // .esri-map {
  //   height: ${heightPx} !important
  // }
  // `;

  // return (
  //   <div className="esri-map-wrapper">
  //     <style>{dynamicStyle}</style>
  //     <div ref={mapRef} className="esri-map"></div>
  //   </div>
  // );
});

// export default withDeviceSize(React.memo(MapBuilder));
export default MapBuilder;
