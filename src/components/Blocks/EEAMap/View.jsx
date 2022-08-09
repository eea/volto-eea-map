import React from 'react';
import Webmap from './components/Webmap';
import ExtraViews from './components/widgets/ExtraViews';
import { PrivacyProtection } from '@eeacms/volto-embed';

const View = (props) => {
  const { data } = props || {};

  const { map_data = {}, height = '' } = data;

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
