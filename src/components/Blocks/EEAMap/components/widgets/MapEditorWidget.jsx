import React from 'react';
import { Modal, Button, Grid } from 'semantic-ui-react';
import Webmap from '../Webmap';
import { FormFieldWrapper, InlineForm } from '@plone/volto/components';
import { PickObjectWidget } from '@eeacms/volto-datablocks/components';

import { panelsSchema } from './panelsSchema';

const MapEditorWidget = (props) => {
  const [open, setOpen] = React.useState(false);
  const { onChange = {}, block = {}, value = {}, id } = props;
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

  return (
    <FormFieldWrapper {...props}>
      <Modal
        id="map-editor-modal"
        style={{ width: '95% !important' }}
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
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <InlineForm
                  block={block}
                  title={panelsSchema.title}
                  schema={panelsSchema}
                  onChangeField={(id, value) => {
                    handleChangeField(id, value);
                  }}
                  formData={dataForm}
                />
              </Grid.Column>
              <Grid.Column width={8}>
                <Webmap data={intValue} editMode={true} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <PickObjectWidget
                  title="Sources"
                  id="sources"
                  onChange={(_, provider_url) => {
                    // this.setState({
                    //   value: { ...this.state.value, provider_url },
                    // });
                    console.log('provurl', provider_url);
                  }}
                  // value={this.state.value?.provider_url}
                  showReload={true}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <Button onClick={() => setOpen(false)}>Close</Button>
                <Button color="green" onClick={handleApplyChanges}>
                  Apply changes
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </FormFieldWrapper>
  );
};

export default MapEditorWidget;
