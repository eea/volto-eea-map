import React from 'react';
import Webmap from './components/Webmap';
import ExtraViews from './components/widgets/ExtraViews';
import { PrivacyProtection } from '@eeacms/volto-embed';

const View = (props) => {
  const { data, id } = props || {};

  const { map_data = {} } = data;

  if (__SERVER__) return '';

  return (
    <div>
      <PrivacyProtection data={data} {...props}>
        <Webmap data={map_data} />
        <ExtraViews data={data} />
      </PrivacyProtection>
    </div>
  );
};

export default View;
