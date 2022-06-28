import React from 'react';
import Map from './Map';
import config from './config';

const View = (props) => {
  const { data } = props || {};
  const mapId = data?.id;
  const mapHeight = data?.height;

  if (__SERVER__) return '';

  return <Map id={mapId} height={mapHeight} cfg={config} />;
};

export default View;
