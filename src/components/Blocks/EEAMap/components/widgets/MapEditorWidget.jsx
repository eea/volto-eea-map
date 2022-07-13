import React from 'react';
import { Tab, Modal, Button, Grid } from 'semantic-ui-react';
import Webmap from '../Webmap';
import LayersPanel from './LayersPanel';
import BaseLayerWidget from './BaseLayerWidget';
import { FormFieldWrapper } from '@plone/volto/components';

const panelsSchema = [
  {
    menuItem: 'Layers',
    Panel: LayersPanel,
  },
  {
    menuItem: 'Base Layer',
    Panel: BaseLayerWidget,
  },
];

const MapEditorWidget = (props) => {
  const [open, setOpen] = React.useState(false);
  const { onChange = {}, block = {}, value = {} } = props;
  return (
    <FormFieldWrapper {...props}>
      <Modal
        id="map-editor-modal"
        style={{ width: '95% !important' }}
        size="fullscreen"
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
                <Tab
                  menu={{ fluid: true, vertical: true, tabular: true }}
                  grid={{ paneWidth: 8, tabWidth: 4 }}
                  panes={panelsSchema.map((p, i) => {
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
