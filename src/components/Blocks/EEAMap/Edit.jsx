import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { Schema } from './Schema';
import Webmap from './components/Webmap';
import MapEditor from './components/widgets/MapEditor';
import './styles/map.css';

const Edit = (props) => {
  const { block, data, onChangeBlock, selected } = props;

  if (__SERVER__) return '';

  return (
    <>
      <div className="map-edit-container">
        <div style={{ width: '40%' }}>
          <MapEditor data={data} block={block} onChangeBlock={onChangeBlock} />
        </div>
        <div style={{ width: '60%' }}>
          <Webmap data={data} />
        </div>
      </div>
      <SidebarPortal selected={selected}>
        <InlineForm
          schema={Schema()}
          title="EEA map component block"
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default Edit;
