import React, { useMemo } from 'react';
import { Message } from 'semantic-ui-react';

import { SidebarPortal } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';

import { schema } from './schema';
import View from './View';

const Edit = (props) => {
  const { block, onChangeBlock, selected, data } = props;

  const url = useMemo(() => flattenToAppURL(data.vis_url), [data.vis_url]);

  return (
    <>
      {!url && (
        <Message>Please select a "Map (simple)" from block editor.</Message>
      )}
      <View {...props} mode="edit" />
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
