import React from 'react';
import { Checkbox, Grid, Input, Select } from 'semantic-ui-react';
import { positions } from '../../constants';

const ZoomWidget = (props) => {
  const { value } = props;

  const handleToggleZoom = (show_zoom) => {
    props.onChange('zoom', { ...value, show_zoom });
  };

  const handlePositionChange = (position) => {
    props.onChange('zoom', { ...value, position });
  };

  const handleZoomLevel = (zoom_level) => {
    props.onChange('zoom', { ...value, zoom_level });
  };

  const handleLat = (lat) => {
    var newCenter = value && value.center ? value.center : [0, 40];
    newCenter[1] = lat;
    props.onChange('zoom', { ...value, center: newCenter });
  };

  const handleLong = (long) => {
    var newCenter = value && value.center ? value.center : [0, 40];
    newCenter[0] = long;
    props.onChange('zoom', { ...value, center: newCenter });
  };

  return (
    <>
      <div style={{ margin: '10px 0' }}>
        <Grid>
          <Grid.Row>
            <h4 style={{ marginRight: '5px' }}>Show zoom: </h4>
            <Checkbox
              checked={value?.show_zoom}
              onClick={(e, { checked }) => handleToggleZoom(checked)}
            />
          </Grid.Row>
          <Grid.Row>
            <h4 style={{ marginRight: '5px' }}>Zoom position: </h4>
            <Select
              onChange={(e, { value }) => handlePositionChange(value)}
              options={positions}
              placeholder="Select position"
              value={value?.position}
            />
          </Grid.Row>
          <Grid.Row style={{ alignItems: 'center' }}>
            <h4 style={{ margin: '10px 0' }}>Zoom level: </h4>
            <Input
              type="number"
              style={{ width: '100%' }}
              placeholder="Set zoom level"
              value={value?.zoom_level}
              onChange={(e, { value }) => handleZoomLevel(value)}
            />
          </Grid.Row>
          <Grid.Row>
            <h4 style={{ margin: '10px 0' }}>Map center: </h4>
          </Grid.Row>
          <Grid.Row style={{ alignItems: 'center' }}>
            <p
              style={{
                margin: '0',
                width: '50px',
                fontWeight: 'bold',
                color: 'gray',
              }}
            >
              Long
            </p>
            <Input
              type="number"
              placeholder="Set longitude"
              onChange={(e, { value }) => handleLong(value)}
              value={
                value && value.center && value.center[0] ? value.center[0] : ''
              }
            />
          </Grid.Row>
          <Grid.Row style={{ alignItems: 'center' }}>
            <p
              style={{
                margin: '0',
                width: '50px',
                fontWeight: 'bold',
                color: 'gray',
              }}
            >
              Lat
            </p>
            <Input
              type="number"
              placeholder="Set latitude"
              onChange={(e, { value }) => handleLat(value)}
              value={
                value && value.center && value.center[1] ? value.center[1] : ''
              }
            />
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default ZoomWidget;
