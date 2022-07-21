import React from 'react';
import { Checkbox, Grid, Select } from 'semantic-ui-react';
import { positions } from '../../constants';

const PrintWidget = (props) => {
  const { value } = props;

  const handleTogglePrint = (show_print) => {
    props.onChange('print', { ...value, show_print });
  };

  const handlePositionChange = (position) => {
    props.onChange('print', { ...value, position });
  };

  return (
    <>
      <div style={{ margin: '10px 0' }}>
        <Grid>
          <Grid.Row>
            <h4 style={{ marginRight: '5px' }}>Show Print: </h4>
            <Checkbox
              checked={value?.show_print}
              onClick={(e, { checked }) => handleTogglePrint(checked)}
            />
          </Grid.Row>
          <Grid.Row>
            <h4>Print position: </h4>
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

export default PrintWidget;
