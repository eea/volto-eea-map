import React from 'react';
import { Button } from 'semantic-ui-react';
import LayerSelectWidget from './LayerSelectWidget';

const LayersPanelWidget = ({ data, onChange, block }) => {
  const map_layers = React.useMemo(() => data.map_layers || [], [
    data.map_layers,
  ]);

  React.useEffect(() => {
    if (!data.map_layers) {
      onChange('map_data', {
        ...data,
        map_layers: [
          {
            map_service_url: '',
            layer: '',
            available_layers: [],
            map_data: {},
          },
        ],
      });
    }
  }, [data, block, onChange]);

  const handleAddLayer = () => {
    onChange('map_data', {
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
          <LayerSelectWidget
            key={i}
            index={i}
            layer={layer}
            onChange={onChange}
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

export default LayersPanelWidget;
