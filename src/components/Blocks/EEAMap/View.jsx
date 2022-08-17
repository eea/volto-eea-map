import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import Webmap from './components/Webmap';
import ExtraViews from './components/widgets/ExtraViews';
import { PrivacyProtection } from '@eeacms/volto-embed';
import { getContent } from '@plone/volto/actions';

const View = (props) => {
  const { data, id, path, data_provenance } = props || {};
  const { map_data = {}, height = '' } = data;

  React.useEffect(() => {
    //   get content from document
    if (path) {
      props.getContent(path, null, id);
    }
    //    eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <div>
      <PrivacyProtection data={data} {...props}>
        <Webmap data={map_data} height={height} id={id} />
        <ExtraViews data={{ ...data, data_provenance }} />
      </PrivacyProtection>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      data_provenance:
        state.content.subrequests?.[props.id]?.data?.data_provenance,
    }),
    {
      getContent,
    },
  ),
)(View);
