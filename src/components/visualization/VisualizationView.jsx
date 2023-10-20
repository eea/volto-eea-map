import React from 'react';
import Webmap from '../Webmap';
import LegendView from '../LegendView';
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
        <>
          <Webmap data={map_visualization_data} />
          <LegendView data={map_visualization_data} show_viewer={true} />
        </>
      )}
    </div>
  );
};

export default VisualizationView;
