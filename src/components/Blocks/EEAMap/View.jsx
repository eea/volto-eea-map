import React from 'react';
import Webmap from './components/Webmap';

const View = (props) => {
  const { data } = props || {};

  const { map_data = {} } = data;

  if (__SERVER__) return '';

  return <Webmap data={map_data} />;
};

export default View;
