import React from 'react';
import { Grid } from 'semantic-ui-react';
import { fetchArcgisData } from '../../utils';

const LayerLegend = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {data.length > 0 &&
        data.map((item, i) => {
          return (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <img alt="alt" src={`data:image/png;base64,${item.imageData}`} />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
            </span>
          );
        })}
    </div>
  );
};

const LegendWidget = (props) => {
  const { data = {} } = props;
  const { layers = {} } = data;
  const { map_layers = [] } = layers;
  const [legendLayers, setLegendLayers] = React.useState([]);

  const activeLayer = map_layers.length > 0 ? map_layers[0]?.map_layer : '';
  const fetchLegend = async (url) => {
    let legendData = await fetchArcgisData(url);
    const { layers = [] } = legendData;

    setLegendLayers(layers);
  };

  React.useEffect(() => {
    fetchLegend(activeLayer.map_service_url + '/legend');
  }, [data]);

  return (
    <>
      <div style={{ margin: '10px 0' }}>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <h3>Legend:</h3>
              {legendLayers.length > 0 &&
                legendLayers.map((layer, index) => {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h5>{layer?.layerName}</h5>
                      <LayerLegend data={layer.legend} />
                    </div>
                  );
                })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default LegendWidget;
