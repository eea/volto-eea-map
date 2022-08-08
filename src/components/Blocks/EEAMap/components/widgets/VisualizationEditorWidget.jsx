import React from 'react';
import { Modal, Button, Grid } from 'semantic-ui-react';
import Webmap from '../Webmap';
import { FormFieldWrapper, InlineForm } from '@plone/volto/components';
import { VisibilitySensor } from '@eeacms/volto-datablocks/components';

import PanelsSchema from './panelsSchema';

const VisualizationEditorWidget = (props) => {
  console.log(props, 'props');
  const [open, setOpen] = React.useState(false);
  const { onChange = {}, id } = props;
  const block = React.useMemo(() => props.block, [props.block]);
  const value = React.useMemo(() => props.value, [props.value]);

  const [intValue, setIntValue] = React.useState(value);

  const dataForm = { map_data: intValue };
  const handleApplyChanges = () => {
    //onChange(id, intValue);

    //set map data for screenshot
    // if (intValue.layers?.map_layers[0].map_layer?.map_service_url) {
    //   onChange(
    //     'url',
    //     `${intValue.layers?.map_layers[0].map_layer?.map_service_url}?f=jsapi`,
    //   );
    // }
    setOpen(false);
  };

  const handleClose = () => {
    setIntValue(value);
    setOpen(false);
  };

  const handleChangeField = (id, fieldVal) => {
    setIntValue(fieldVal);
  };

  let schema = PanelsSchema({ data: dataForm });

  return (
    <FormFieldWrapper {...props}>
      <Button
        floated="right"
        size="tiny"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        Open Map Editor
      </Button>
      {open && (
        <Modal
          id="map-editor-modal"
          style={{ width: '95% !important' }}
          open={true}
        >
          <Modal.Content scrolling>
            <Grid>
              <Grid.Row>
                <Grid.Column width={4}>
                  <InlineForm
                    block={block}
                    title={schema.title}
                    schema={schema}
                    onChangeField={(id, value) => {
                      handleChangeField(id, value);
                    }}
                    formData={dataForm}
                  />
                </Grid.Column>
                <Grid.Column width={8}>
                  <VisibilitySensor>
                    <Webmap data={intValue} editMode={true} />
                  </VisibilitySensor>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}></Grid.Column>
                <Grid.Column width={4}>
                  <Button onClick={() => handleClose()}>Close</Button>
                  <Button color="green" onClick={() => handleApplyChanges()}>
                    Apply changes
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Actions>
        </Modal>
      )}
    </FormFieldWrapper>
  );
};

export default VisualizationEditorWidget;
