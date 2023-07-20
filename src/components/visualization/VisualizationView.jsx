import React from 'react';
import Webmap from '../Webmap';
import { hasBlocksData } from '@plone/volto/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';

const VisualizationView = (props) => {
  const { content = {} } = props;

  const { map_visualization_data = {} } = content;

  return (
    <div id="page-document" className="view-viewarcgismap">
      {hasBlocksData(content) ? (
        <RenderBlocks {...props} />
      ) : (
        <Webmap data={map_visualization_data} />
      )}
    </div>
  );
};

export default VisualizationView;
