import React from 'react';
import TextView from './components/TextView';
import Webmap from './components/Webmap';

const View = (props) => {
  const { data } = props || {};

  const { map_data = {} } = data;

  const { general = {} } = map_data;

  if (__SERVER__) return '';

  return (
    <div>
      <Webmap data={map_data} />

      {general.show_description && <TextView text={general.description} />}
    </div>
  );
};

export default View;
