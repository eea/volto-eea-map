import React from 'react';
import { Checkbox, Grid, Select } from 'semantic-ui-react';
import { positions } from '../../constants';

const LegendWidget = (props) => {
  const { value } = props;

  const handleToggleLegend = (show_legend) => {
    props.onChange('legend', { ...value, show_legend });
  };

  const handlePositionChange = (position) => {
    props.onChange('legend', { ...value, position });
  };

  return (
    <>
      <div style={{ margin: '10px 0' }}>
        <Grid>
          <Grid.Row>
            <h4 style={{ marginRight: '5px' }}>Show legend: </h4>
            <Checkbox
              checked={value?.show_legend}
              onClick={(e, { checked }) => handleToggleLegend(checked)}
            />
          </Grid.Row>
          <Grid.Row>
            <h4 style={{ marginRight: '5px' }}>Legend position: </h4>
            <Select
              onChange={(e, { value }) => handlePositionChange(value)}
              options={positions}
              placeholder="Select position"
              value={value?.position}
            />
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default LegendWidget;
