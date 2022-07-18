import React from 'react';
import { Checkbox, Grid, Segment } from 'semantic-ui-react';

const LegendWidget = (props) => {
  const { value } = props;

  const handleToggleLegend = (show_legend) => {
    props.onChange('legend', { ...value, show_legend });
  };

  return (
    <>
      <div style={{ margin: '10px 0' }}>
        <Grid>
          <Grid.Row>
            <h4 style={{ marginRight: '5px' }}>Show Legend: </h4>
            <Checkbox
              checked={value?.show_legend}
              onClick={(e, { checked }) => handleToggleLegend(checked)}
            />
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default LegendWidget;
