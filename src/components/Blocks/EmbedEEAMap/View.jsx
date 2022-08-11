import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { PrivacyProtection } from '@eeacms/volto-embed';
import Webmap from '../EEAMap/components/Webmap';
import ExtraViews from '../EEAMap/components/widgets/ExtraViews';
import { getVisualization } from '@eeacms/volto-eea-map/actions';

const View = (props) => {
  const { data, map_visualization } = props || {};
  const { height = '', vis_url = '' } = data;

  React.useEffect(() => {
    if (vis_url) {
      props.getVisualization(vis_url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vis_url]);

  return (
    <div>
      <PrivacyProtection data={data} {...props}>
        {map_visualization && (
          <div>
            <Webmap data={map_visualization.data} height={height} />
            <ExtraViews data={{ ...data, map_data: map_visualization.data }} />
          </div>
        )}
        {!map_visualization && (
          <p>No map view to show. Set visualization in block configuration.</p>
        )}
      </PrivacyProtection>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      map_visualization: state.map_visualizations.data[props.data.vis_url],
    }),
    {
      getVisualization,
    },
  ),
)(View);
