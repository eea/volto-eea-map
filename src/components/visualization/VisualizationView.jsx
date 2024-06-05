import React from 'react';
import { hasBlocksData } from '@plone/volto/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { pickMetadata } from '@eeacms/volto-embed/helpers';
import Webmap from '../Webmap';
import ExtraViews from '../ExtraViews';

const VisualizationView = (props) => {
  const content = props && props.content ? props.content : {};

  const map_visualization_data =
    content && content.map_visualization_data
      ? content.map_visualization_data
      : {};

  return (
    <div id="page-document" className="view-viewarcgismap">
      {hasBlocksData(content) ? (
        <RenderBlocks {...props} />
      ) : (
        <>
          <Webmap data={map_visualization_data} />
          {/* <ExtraViews
            data={{
              show_viewer: true,
              show_legend: true,
              show_note: false,
              show_sources: false,
              show_more_info: false,
              show_share: true,
              map_visualization_data: {
                ...map_visualization_data,
                ...pickMetadata(content),
              },
            }}
          /> */}
        </>
      )}
    </div>
  );
};

export default VisualizationView;
