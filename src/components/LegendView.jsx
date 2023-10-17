import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { fetchArcGISData, setLegendColumns } from '../utils';
import { Icon } from '@plone/volto/components';
import { serializeNodes } from '@plone/volto-slate/editor/render';

import rightKeySVG from '@plone/volto/icons/right-key.svg';
import downKeySVG from '@plone/volto/icons/down-key.svg';
import { withDeviceSize } from '@eeacms/volto-eea-map/hocs';

import codeSVG from '@eeacms/volto-eea-map/static/code-line.svg';

const LayerLegend = ({ data, show_viewer }) => {
  const [legendRows, setLegendRows] = React.useState([]);

  const { map_service_url = '', layer = {} } = data;
  const { id, name } = layer || {};

  const fetchLegend = async (url, activeLayerID) => {
    let legendData = await fetchArcGISData(url);

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
    <Grid.Column>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h5
          style={{
            marginTop: '15px',
            marginBottom: '5px',
          }}
        >
          {name}
        </h5>
        {show_viewer && map_service_url && (
          <a
            target="_blank"
            rel="noreferrer"
            title="Open ArcGIS Service location"
            href={
              `https://www.arcgis.com/home/webmap/viewer.html?url=` +
              `${map_service_url}&source=sd`
            }
          >
            <Button size="tiny" className="extra-view-external-button">
              <Button.Content>
                <img
                  className="extra-view-external-icon"
                  src={codeSVG}
                  alt=""
                />
              </Button.Content>
            </Button>
          </a>
        )}
      </div>
      {data.description && serializeNodes(data.description)}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {legendRows.length > 0 &&
          legendRows.map((item, i) => {
            return (
              <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  alt="alt"
                  className="layer-legend-item-color"
                  src={`data:image/png;base64,${item.imageData}`}
                />
                <span style={{ fontSize: '13px', marginLeft: '5px' }}>
                  {item.label}
                </span>
              </span>
            );
          })}
      </div>
    </Grid.Column>
  );
};

const LegendView = (props) => {
  const data = React.useMemo(() => props.data, [props.data]);
  const { device = '', show_viewer = false } = props;

  const [expand, setExpand] = React.useState(true);

  const { layers = {} } = data;

  const visible_layers =
    layers && layers.map_layers && layers.map_layers.length
      ? layers.map_layers.filter((l) => !l?.map_layer?.hide)
      : '';

  const map_layers =
    visible_layers && visible_layers.length > 0 && visible_layers.length > 3
      ? visible_layers.slice(0, 3)
      : visible_layers;

  const legendColumns =
    map_layers && setLegendColumns(map_layers.length, device);
  return (
    <>
      <div className="legend-container">
        <button className="legend-action" onClick={() => setExpand(!expand)}>
          {/* <h3 role="presentation" className="legend-title"> */}
          Legend
          <Icon
            name={expand ? downKeySVG : rightKeySVG}
            title={expand ? 'Collapse' : 'Expand'}
            size="17px"
          />
          {/* </h3> */}
        </button>
        <Grid columns={legendColumns}>
          {(!map_layers || map_layers.length === 0) && (
            <p>
              No layer found for legend. Please add a map layer from editor.
            </p>
          )}
          {expand && (
            <Grid.Row divided>
              {map_layers &&
                map_layers.length > 0 &&
                map_layers.map((l, i) => (
                  <LayerLegend
                    key={i}
                    data={l.map_layer}
                    show_viewer={show_viewer}
                  />
                ))}
            </Grid.Row>
          )}
        </Grid>
      </div>
    </>
  );
};

export default withDeviceSize(React.memo(LegendView));
