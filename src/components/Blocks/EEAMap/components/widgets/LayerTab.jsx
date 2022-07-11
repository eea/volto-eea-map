import React from 'react';
import { Input, Select, Button } from 'semantic-ui-react';
import deleteSVG from '@plone/volto/icons/delete.svg';
import { Icon } from '@plone/volto/components';

const countryOptions = [
  { key: 'af', value: 'af', text: 'Afghanistan' },
  { key: 'ax', value: 'ax', text: 'Aland Islands' },
  { key: 'al', value: 'al', text: 'Albania' },
  { key: 'dz', value: 'dz', text: 'Algeria' },
  { key: 'as', value: 'as', text: 'American Samoa' },
];

const LayerTab = ({
  index,
  layer,
  handleUrlChange,
  handlLayerSelect,
  handleDeleteLayer,
}) => {
  return (
    <div
      style={{
        margin: '10px 0',
        padding: '5px 0',
        borderBottom: '1px solid lightgray',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p>Layer {index + 1}</p>{' '}
        <button
          style={{
            marginLeft: 'auto',
            background: '#d02144',
            border: 'none',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => handleDeleteLayer(index)}
        >
          <Icon name={deleteSVG} size="24px" title="Delete block style" />
        </button>
      </div>
      <div
        style={{
          margin: '2px 0',
        }}
      >
        <p style={{ fontSize: '13px', fontWeight: 'bold' }}>Service URL</p>
        <Input
          onChange={(e, { value }) => handleUrlChange(value, index)}
          style={{ width: '100%' }}
          label
          value={layer.map_service_url}
        />
      </div>
      <div
        style={{
          margin: '2px 0',
        }}
      >
        <p style={{ fontSize: '13px', fontWeight: 'bold' }}>Layer</p>
        <Select
          onChange={(e, { value }) => handlLayerSelect(value, index)}
          style={{ width: '100%' }}
          options={countryOptions}
        />
      </div>
    </div>
  );
};

export default LayerTab;
