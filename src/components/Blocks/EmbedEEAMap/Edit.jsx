import React from 'react';
import { SidebarPortal } from '@plone/volto/components';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { getContent } from '@plone/volto/actions';

import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import View from './View';
import { Schema } from './Schema';
import { addPrivacyProtectionToSchema } from '@eeacms/volto-embed';
import './styles/map.css';

const Edit = (props) => {
  const { block, data, onChangeBlock, selected, id } = props;
  const schema = React.useMemo(() => Schema(props), [props]);

  React.useEffect(() => {
    props.getContent(data.vis_url, null, id);
    //    eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.vis_url]);

  React.useEffect(() => {
    if (
      !data.data_query_params ||
      props.data_query !== data.data_query_params
    ) {
      onChangeBlock(block, {
        ...data,
        data_query_params: props.data_query,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data_query, block, data]);

  return (
    <div>
      <View data={data} id={id} />
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

export default compose(
  connect(
    (state, props) => ({
      data_query: state.content.data.data_query,
      data_provenance:
        state.content.subrequests?.[props.id]?.data?.data_provenance,
    }),
    {
      getContent,
    },
  ),
)(Edit);
