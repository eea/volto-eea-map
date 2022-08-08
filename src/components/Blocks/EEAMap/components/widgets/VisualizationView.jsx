import React from 'react';
import Webmap from '../Webmap';

const VisualizationView = (props) => {
  const { content = {} } = props;

  const { map_editor_widget = {} } = content;

  return (
    <div>
      <Webmap data={map_editor_widget} />
    </div>
  );
};

export default VisualizationView;
