import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { Schema } from './Schema';
import Map from './Map';
import config from './config';

const Edit = (props) => {
  const { block, data, onChangeBlock, selected } = props;
  const mapId = data?.id;
  const mapHeight = data?.height;

  if (__SERVER__) return '';

  return (
    <>
      <Map id={mapId} height={mapHeight} cfg={config} />
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
