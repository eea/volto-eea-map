import React from 'react';
import { Tab, Modal, Button, Grid } from 'semantic-ui-react';
import Webmap from '../Webmap';
import LayersPanel from './LayersPanel';

const MapEditor = ({ onChangeBlock, data, block }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Modal
        id="map-editor-modal"
        style={{ width: '95% !important' }}
        size="fullscreen"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button className="map-modal-trigger-button">Open Map Editor</Button>
        }
      >
        <Modal.Content scrolling>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
                <Tab
                  menu={{ fluid: true, vertical: true, tabular: true }}
                  grid={{ paneWidth: 10, tabWidth: 2 }}
                  panes={[
                    {
                      menuItem: 'Layers',
                      render: () => (
                        <Tab.Pane>
                          <LayersPanel
                            block={block}
                            onChangeBlock={onChangeBlock}
                            data={data}
                          />
                        </Tab.Pane>
                      ),
                    },
                  ]}
                />
              </Grid.Column>
              <Grid.Column width={9}>
                <Webmap data={data} editMode={true} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default MapEditor;
