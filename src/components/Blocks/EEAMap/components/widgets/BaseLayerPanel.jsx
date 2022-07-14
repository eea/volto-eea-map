import React from 'react';
import { Button, Grid, Select } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

import saveSVG from '@plone/volto/icons/save.svg';

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

  const [baseLayer, setBaseLayer] = React.useState(value ? value : '');

  const handleSave = () => {
    onChange('base_layer', baseLayer);
  };

  return (
    <Grid>
      <Grid.Row>
        <h4>Select base layer:</h4>
        <Select
          onChange={(e, { value }) => setBaseLayer(value)}
          style={{ width: '100%' }}
          options={base_layers}
          placeholder="Select layer"
          value={baseLayer}
        />
      </Grid.Row>
      <Grid.Row>
        <Button>
          <Button color="green" icon onClick={handleSave}>
            <Icon name={saveSVG} size="16px" title="Save changes" />
          </Button>
        </Button>
      </Grid.Row>
    </Grid>
  );
};

export default BaseLayerPanel;
