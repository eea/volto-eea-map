import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { Schema } from './Schema';
import View from './View';
import { addPrivacyProtectionToSchema } from '@eeacms/volto-embed';
import './styles/map.css';

const Edit = (props) => {
  const { block, data, onChangeBlock, selected } = props;
  const schema = React.useMemo(() => Schema(props), [props]);

  return (
    <div>
      <View data={data} />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          block={block}
          title={schema.title}
          schema={addPrivacyProtectionToSchema(schema)}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </div>
  );
};

export default Edit;
