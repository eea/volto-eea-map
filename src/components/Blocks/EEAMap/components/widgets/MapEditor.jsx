import React from 'react';
import { Tab } from 'semantic-ui-react';
import LayersPanel from './LayersPanel';

const MapEditor = ({ onChangeBlock, data, block }) => {
  return (
    <div>
      <Tab
        menu={{ fluid: true, vertical: true, tabular: true }}
        grid={{ paneWidth: 9, tabWidth: 3 }}
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
    </div>
  );
};

export default MapEditor;
