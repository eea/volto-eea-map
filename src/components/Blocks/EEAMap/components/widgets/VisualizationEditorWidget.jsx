import React from 'react';
import { Modal, Button, Grid } from 'semantic-ui-react';
import Webmap from '../Webmap';
import { FormFieldWrapper, InlineForm } from '@plone/volto/components';
import { VisibilitySensor } from '@eeacms/volto-datablocks/components';

import PanelsSchema from './panelsSchema';

const VisualizationEditorWidget = (props) => {
  const [open, setOpen] = React.useState(false);
  const { onChange = {}, id } = props;
  const block = React.useMemo(() => props.block, [props.block]);
  const value = React.useMemo(() => props.value, [props.value]);

  const [intValue, setIntValue] = React.useState(value);

  const dataForm = { map_data: intValue };
  const handleApplyChanges = () => {
    onChange(id, intValue);
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
      <div className="wrapper">
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
      </div>

      {open && (
        <Modal
          id="map-editor-modal"
          style={{ width: '95% !important' }}
          open={true}
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
                <VisibilitySensor>
                  <Webmap data={intValue} editMode={true} />
                </VisibilitySensor>
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
      )}
      <Webmap data={intValue} editMode={true} />
    </FormFieldWrapper>
  );
};

export default VisualizationEditorWidget;
