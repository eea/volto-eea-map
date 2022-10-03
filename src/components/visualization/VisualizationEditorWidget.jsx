import React from 'react';
import { Modal, Button, Grid } from 'semantic-ui-react';

import { FormFieldWrapper, InlineForm } from '@plone/volto/components';

import PanelsSchema from './panelsSchema';
import Webmap from '../Webmap';

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

  const handleChangeField = (val) => {
    setIntValue(val);
  };

  let schema = PanelsSchema({ data: dataForm });

  React.useEffect(() => {
    if (!intValue?.general) {
      setIntValue({
        ...intValue,
        general: {
          print_position: 'top-right',
          zoom_position: 'top-right',
          centerOnExtent: true,
          scalebar: 'metric',
        },
      });
    }
    if (!intValue?.base) {
      setIntValue({
        ...intValue,
        base: {
          base_layer: 'gray-vector',
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intValue]);

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
                    handleChangeField(value);
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
      )}
      <Webmap data={value} editMode={true} />
    </FormFieldWrapper>
  );
};

export default VisualizationEditorWidget;
