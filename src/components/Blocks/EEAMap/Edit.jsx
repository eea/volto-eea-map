import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { Schema } from './Schema';

const Edit = (props) => {
  const { block, data, onChangeBlock, selected } = props;

  return (
    <>
      <div>the edit zone</div>
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
