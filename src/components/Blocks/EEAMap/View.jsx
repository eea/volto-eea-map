import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import Webmap from './components/Webmap';
import ExtraViews from './components/widgets/ExtraViews';
import { PrivacyProtection } from '@eeacms/volto-embed';
import { getVisualization } from '@eeacms/volto-eea-map/actions';

const View = (props) => {
  const { data, state, map_visualization } = props || {};
  const {
    map_data = {},
    height = '',
    use_visualization = false,
    vis_url = '',
  } = data;

  //move it in a new ember-eea-map block
  // React.useEffect(() => {
  //   if (use_visualization) {
  //     const reqUrl = data.vis_url;
  //     props.getVisualization(reqUrl);
  //   }
  // }, [data]);

  if (__SERVER__) return '';

  return (
    <div>
      <PrivacyProtection data={data} {...props}>
        <Webmap data={map_data} height={height} />
        <ExtraViews data={data} />
      </PrivacyProtection>
    </div>
  );
};

export default View;

// export default compose(
//   connect(
//     (state, props) => ({
//       map_visualization: state.map_visualizations[props.data.vis_url],
//     }),
//     {
//       getVisualization,
//     },
//   ),
// )(View);
