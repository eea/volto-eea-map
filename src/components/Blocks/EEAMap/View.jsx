import React from 'react';
import Webmap from './components/Webmap';

const View = (props) => {
  const { data } = props || {};

  if (__SERVER__) return '';

  return <Webmap data={data} />;
};

export default View;
