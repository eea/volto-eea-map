import React from 'react';
import { Modal, Button, Grid } from 'semantic-ui-react';
import Webmap from '../Webmap';
import { FormFieldWrapper, InlineForm } from '@plone/volto/components';

import PanelsSchema from './panelsSchema';

const MapEditorWidget = (props) => {
  const [open, setOpen] = React.useState(false);
  const { onChange = {}, id } = props;
  const block = React.useMemo(() => props.block, [props.block]);
  const value = React.useMemo(() => props.value, [props.value]);

  const [intValue, setIntValue] = React.useState(value);

  const dataForm = { map_data: intValue };
  const handleApplyChanges = () => {
    onChange(id, intValue);

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
      <Modal
        id="map-editor-modal"
        className="map-editor-modal"
        onClose={handleClose}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button size="tiny" className="map-modal-trigger-button">
            Open Map Editor
          </Button>
        }
      >
        <Modal.Content scrolling>
          <Grid stackable reversed="mobile vertically tablet vertically">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={5}
              className="map-editor-column"
            >
              <InlineForm
                block={block}
                schema={schema}
                onChangeField={(id, value) => {
                  handleChangeField(id, value);
                }}
                formData={dataForm}
              />
            </Grid.Column>
            <Grid.Column mobile={12} tablet={12} computer={7}>
              <div className="webmap-container">
                <Webmap data={intValue} editMode={true} />
              </div>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Grid>
            <Grid.Row>
              <div className="map-edit-actions-container">
                <Button onClick={handleClose}>Close</Button>
                <Button color="green" onClick={handleApplyChanges}>
                  Apply changes
                </Button>
              </div>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </FormFieldWrapper>
  );
};

export default MapEditorWidget;
