import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import Webmap from './components/Webmap';
import ExtraViews from './components/widgets/ExtraViews';
import { PrivacyProtection } from '@eeacms/volto-embed';
import { getVisualization } from '@eeacms/volto-eea-map/actions';

const View = (props) => {
  const { data } = props || {};

  const { map_data = {}, height = '' } = data;

  // React.useEffect(() => {
  //   const reqUrl = data.vis_url;
  //   props.getVisualization(reqUrl);
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

//use get visualization to retrieve data from map viz
// export default compose(
//   connect(
//     (state, props) => ({
//       state,
//     }),
//     {
//       getVisualization,
//     },
//   ),
// )(View);
