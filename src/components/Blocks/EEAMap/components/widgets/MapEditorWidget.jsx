import React from 'react';
import { Tab, Modal, Button, Grid } from 'semantic-ui-react';
import Webmap from '../Webmap';
import LayersPanel from './LayersPanel';
import BaseLayerPanel from './BaseLayerPanel';
import { FormFieldWrapper, InlineForm } from '@plone/volto/components';

import { panelsSchema } from './panelsSchema';

const panelsSchemaInit = [
  {
    menuItem: 'Layers',
    Panel: LayersPanel,
  },
  {
    menuItem: 'Base Layer',
    Panel: BaseLayerPanel,
  },
];

const MapEditorWidget = (props) => {
  const [open, setOpen] = React.useState(false);
  const { onChange = {}, block = {}, value = {} } = props;

  const dataForm = { map_data: value };
  return (
    <FormFieldWrapper {...props}>
      <Modal
        id="map-editor-modal"
        style={{ width: '95% !important' }}
        onClose={() => setOpen(false)}
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
                {/* <Tab
                  menu={{ fluid: true, vertical: true, tabular: true }}
                  grid={{ paneWidth: 8, tabWidth: 4 }}
                  panes={panelsSchemaInit.map((p, i) => {
                    return {
                      menuItem: p.menuItem,
                      render: () => (
                        <Tab.Pane>
                          <p.Panel
                            block={block}
                            onChange={onChange}
                            data={value}
                          />
                        </Tab.Pane>
                      ),
                    };
                  })}
                /> */}
                <InlineForm
                  block={block}
                  title={panelsSchema.title}
                  schema={panelsSchema}
                  onChangeField={onChange}
                  formData={dataForm}
                />
              </Grid.Column>
              <Grid.Column width={8}>
                <Webmap data={value} editMode={true} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    </FormFieldWrapper>
  );
};

export default MapEditorWidget;
