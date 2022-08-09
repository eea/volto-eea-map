import React from 'react';
import Webmap from '../Webmap';

const VisualizationView = (props) => {
  const { content = {} } = props;

  const { map_visualization_data = {} } = content;

  return (
    <div>
      <Webmap data={map_visualization_data} />
    </div>
  );
};

export default VisualizationView;
