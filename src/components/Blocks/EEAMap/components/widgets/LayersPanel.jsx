import React from 'react';
import { Button, Input, Select, Label } from 'semantic-ui-react';
import LayerTab from './LayerTab';

const LayersPanel = ({ data, onChangeBlock, block }) => {
  const { map_layers } = data || {};

  React.useEffect(() => {
    if (!map_layers) {
      onChangeBlock(block, { ...data, map_layers: [] });
    }
  }, [data, block]);

  const handleAddLayer = () => {
    onChangeBlock(block, {
      ...data,
      map_layers: [
        ...data.map_layers,
        { map_service_url: '', layer: '', available_layers: [], map_data: {} },
      ],
    });
  };

  return (
    <div>
      {map_layers &&
        map_layers.length > 0 &&
        map_layers.map((layer, i) => (
          <LayerTab
            id={i}
            index={i}
            layer={layer}
            onChangeBlock={onChangeBlock}
            block={block}
            data={data}
          />
        ))}

      <Button size="tiny" onClick={handleAddLayer}>
        Add Layer
      </Button>
    </div>
  );
};

export default LayersPanel;
