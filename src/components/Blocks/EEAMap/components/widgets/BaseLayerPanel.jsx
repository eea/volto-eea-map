import React from 'react';
import { Grid, Select } from 'semantic-ui-react';

const base_layers = [
  'dark-gray',
  'dark-gray-vector',
  'gray',
  'gray-vector',
  'hybrid',
  'national-geographic',
  'oceans',
  'osm',
  'satellite',
  'streets',
  'streets-navigation-vector',
  'streets-night-vector',
  'streets-relief-vector',
  'streets-vector',
  'terrain',
  'topo',
  'topo-vector',
].map((n) => {
  return { key: n, value: n, text: n };
});

const BaseLayerPanel = (props) => {
  const { value = {}, onChange } = props;

  const handleBaseLayerChange = (baseLayer) => {
    onChange('base_layer', baseLayer);
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <Grid>
        <Grid.Row>
          <h4>Base layer:</h4>
          <Select
            onChange={(e, { value }) => handleBaseLayerChange(value)}
            style={{ width: '100%' }}
            options={base_layers}
            placeholder="Select layer"
            value={value}
          />
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default BaseLayerPanel;
