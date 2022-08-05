import React from 'react';
import { Grid } from 'semantic-ui-react';
import { fetchArcgisData } from '../../utils';
import { Icon } from '@plone/volto/components';

import rightKeySVG from '@plone/volto/icons/right-key.svg';
import downKeySVG from '@plone/volto/icons/down-key.svg';

const LayerLegend = ({ data, name }) => {
  const [expand, setExpand] = React.useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h5
        role="presentation"
        onClick={() => setExpand(!expand)}
        style={{
          marginTop: '10px',
          marginBottom: '5px',
          cursor: 'pointer',
          display: 'flex',
        }}
      >
        <Icon
          name={expand ? downKeySVG : rightKeySVG}
          title={expand ? 'Collapse' : 'Expand'}
          size="17px"
        />
        {name}
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {expand &&
          data.length > 0 &&
          data.map((item, i) => {
            return (
              <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  alt="alt"
                  src={`data:image/png;base64,${item.imageData}`}
                />
                <span style={{ fontSize: '13px', marginLeft: '5px' }}>
                  {item.label}
                </span>
              </span>
            );
          })}
      </div>
    </div>
  );
};

const LegendWidget = (props) => {
  const data = React.useMemo(() => props.data, [props.data]);
  const { layers = {} } = data;
  const { map_layers = [] } = layers;
  const [legendLayers, setLegendLayers] = React.useState([]);

  const activeLayer = map_layers.length > 0 ? map_layers[0]?.map_layer : '';

  const fetchLegend = async (url) => {
    let legendData = await fetchArcgisData(url);

    //TODO: configure this for multiple layers
    const { layers = [] } = legendData;
    const selectedLayerLedend = layers.filter(
      (l, i) => l.layerId === activeLayer.layer.id,
    );
    setLegendLayers(selectedLayerLedend);
  };

  React.useEffect(() => {
    if (activeLayer) {
      fetchLegend(`${activeLayer.map_service_url}/legend`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, activeLayer.map_service_url]);
  return (
    <>
      <div style={{ margin: '10px 0' }}>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <h3>Legend:</h3>
              {!activeLayer && (
                <p>
                  No layer found for legend. Please add a map layer from editor.
                </p>
              )}
              {legendLayers.length > 0 &&
                legendLayers.map((layer, i) => {
                  return (
                    <LayerLegend
                      key={i}
                      name={layer?.layerName}
                      data={layer?.legend}
                    />
                  );
                })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default React.memo(LegendWidget);
