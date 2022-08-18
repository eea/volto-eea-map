import React from 'react';
import { Grid } from 'semantic-ui-react';
import { fetchArcgisData } from '../../utils';
import { Icon } from '@plone/volto/components';

import rightKeySVG from '@plone/volto/icons/right-key.svg';
import downKeySVG from '@plone/volto/icons/down-key.svg';

const LayerLegend = ({ data }) => {
  const [expand, setExpand] = React.useState(true);
  const [legendRows, setLegendRows] = React.useState([]);

  const { id, name } = data.layer || {};

  const fetchLegend = async (url, activeLayerID) => {
    let legendData = await fetchArcgisData(url);

    const { layers = [] } = legendData;
    const selectedLayer = layers.filter((l, i) => l.layerId === activeLayerID);
    setLegendRows(selectedLayer[0].legend);
  };

  React.useEffect(() => {
    if (data.map_service_url && id !== undefined) {
      fetchLegend(`${data.map_service_url}/legend`, id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, data.map_service_url]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h5
        role="presentation"
        onClick={() => setExpand(!expand)}
        style={{
          marginTop: '15px',
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
          legendRows.length > 0 &&
          legendRows.map((item, i) => {
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

  return (
    <>
      <div style={{ margin: '10px 0' }}>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <h4>Legend:</h4>
              {map_layers.length === 0 && (
                <p>
                  No layer found for legend. Please add a map layer from editor.
                </p>
              )}

              {map_layers &&
                map_layers.length > 0 &&
                map_layers.map((l, i) => (
                  <LayerLegend key={i} data={l.map_layer} />
                ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default React.memo(LegendWidget);
