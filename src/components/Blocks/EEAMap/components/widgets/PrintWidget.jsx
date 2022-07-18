import React from 'react';
import { Checkbox, Grid, Segment } from 'semantic-ui-react';

const PrintWidget = (props) => {
  const { value } = props;

  const handleTogglePrint = (show_print) => {
    props.onChange('print', { ...value, show_print });
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
        </Grid>
      </div>
    </>
  );
};

export default PrintWidget;
