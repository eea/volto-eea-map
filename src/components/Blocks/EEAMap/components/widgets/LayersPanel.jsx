import React from 'react';
import { Button, Input, Select, Label } from 'semantic-ui-react';
import { getBaseUrl } from '@plone/volto/helpers';
import LayerTab from './LayerTab';

const fetchLayers = (url) => {
  fetch(`${getBaseUrl('')}/cors-proxy/${url}?f=json`).then((response) =>
    console.log('response', response),
  );
};

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
      map_layers: [...data.map_layers, { map_service_url: '', layer: '' }],
    });
  };

  const handleLayerChange = (layer, index) => {};

  const handleServiceUrlChange = (url, index) => {
    let layer = map_layers[index];
    layer.map_service_url = url;

    onChangeBlock(block, {
      ...data,
      map_layers: [
        ...data.map_layers.slice(0, index),
        layer,
        ...data.map_layers.slice(index + 1),
      ],
    });
    fetchLayers(url);
  };

  const handleDeleteLayer = (index) => {
    onChangeBlock(block, {
      ...data,
      map_layers: [
        ...data.map_layers.slice(0, index),
        ...data.map_layers.slice(index + 1),
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
            handlLayerSelect={handleLayerChange}
            handleUrlChange={handleServiceUrlChange}
            handleDeleteLayer={handleDeleteLayer}
          />
        ))}

      <Button size="tiny" onClick={handleAddLayer}>
        Add Layer
      </Button>
    </div>
  );
};

export default LayersPanel;
