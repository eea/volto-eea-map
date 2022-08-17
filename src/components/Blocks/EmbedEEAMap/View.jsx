import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { PrivacyProtection } from '@eeacms/volto-embed';
import Webmap from '../EEAMap/components/Webmap';
import ExtraViews from '../EEAMap/components/widgets/ExtraViews';
import { getVisualization } from '@eeacms/volto-eea-map/actions';
import { getContent } from '@plone/volto/actions';

const View = (props) => {
  const { data, viz_content = {}, id } = props || {};
  const { height = '', vis_url = '' } = data;

  const { map_visualization_data = '', data_provenance = {} } =
    viz_content || {};

  React.useEffect(() => {
    if (vis_url) {
      props.getContent(vis_url, null, id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vis_url]);

  return (
    <div>
      <PrivacyProtection data={data} {...props}>
        {map_visualization_data && (
          <div>
            <Webmap data={map_visualization_data} height={height} />
            <ExtraViews
              data={{
                ...data,
                data_provenance,
                map_data: map_visualization_data,
              }}
            />
          </div>
        )}
        {!map_visualization_data && (
          <p>No map view to show. Set visualization in block configuration.</p>
        )}
      </PrivacyProtection>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      state,
      viz_content: state.content.subrequests?.[props.id]?.data,
    }),
    {
      getVisualization,
      getContent,
    },
  ),
)(View);
