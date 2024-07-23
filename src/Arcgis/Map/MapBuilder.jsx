import React, {
  memo,
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
  const { data, properties } = props || {};
  const data_query = properties?.data_query;
  const definitionExpression = properties?.definitionExpression;
  const $map = useRef(null);
  const [renderWidgets, setRenderWidgets] = useState(true);
  const basemap = useMemo(
    () => getBasemap({ basemap: data.basemap, base: data.base }),
    [data.basemap, data.base],
  );
  const layers = useMemo(
    () =>
      getLayers({
        layers: data.layers,
        styles: data.styles,
        data_query: data_query,
        definitionExpression,
      }),
    [data.layers, data.styles, data_query, definitionExpression],
  );
  const widgets = useMemo(() => getWidgets({ widgets: data.widgets }), [
    data.widgets,
  ]);
  const settings = useMemo(() => data.settings || {}, [data.settings]);
  const viewSettings = useMemo(() => settings.view || {}, [settings.view]);
  const initialViewpoint = useMemo(
    () => ({ center: viewSettings.center, zoom: viewSettings.zoom }),
    [viewSettings.center, viewSettings.zoom],
  );
  const zoomToLayer = useMemo(
    () =>
      layers.filter((layer) => layer.zoomToExtent).length === 0 ? 0 : null,
    [layers],
  );

  const rotationEnabled = settings.view?.constraints?.rotationEnabled ?? false;

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
        <Layer
          {...layer}
          key={index}
          zoomToExtent={zoomToLayer === index}
          opacity={layer.opacity ?? 1}
        />
      ))}
    </Map>
  );
});
export default memo(MapBuilder);
