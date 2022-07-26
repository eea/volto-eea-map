import React from 'react';
import Webmap from './components/Webmap';
import ExtraViews from './components/widgets/ExtraViews';

const View = (props) => {
  const { data } = props || {};

  const { map_data = {} } = data;

  if (__SERVER__) return '';

  return (
    <div>
      <Webmap data={map_data} />
      <ExtraViews data={data} />
    </div>
  );
};

export default View;
