import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { Schema } from './Schema';
import Webmap from './components/Webmap';
import './styles/map.css';

const Edit = (props) => {
  const { block, data, onChangeBlock, selected } = props;
  const schema = React.useMemo(() => Schema(props), [props]);

  const { map_data = {} } = data;

  if (__SERVER__) return '';
  return (
    <>
      <Webmap data={map_data} />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          block={block}
          title={schema.title}
          schema={schema}
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
