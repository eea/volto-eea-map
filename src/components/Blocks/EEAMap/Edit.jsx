import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { Schema } from './Schema';
import Webmap from './components/Webmap';
import './styles/map.css';
import ExtraViews from './components/widgets/ExtraViews';
import {
  PrivacyProtection,
  addPrivacyProtectionToSchema,
} from '@eeacms/volto-embed';

const Edit = (props) => {
  const { block, data, onChangeBlock, selected, id } = props;
  const schema = React.useMemo(() => Schema(props), [props]);

  const { map_data = {}, height } = data;
  if (__SERVER__) return '';

  return (
    <div>
      <PrivacyProtection data={data} {...props}>
        <Webmap data={map_data} height={height} />
        <ExtraViews data={data} />
      </PrivacyProtection>
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
