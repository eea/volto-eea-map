import React from 'react';
import { hasBlocksData } from '@plone/volto/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { pickMetadata } from '@eeacms/volto-embed/helpers';
import MapBuilder from '@eeacms/volto-eea-map/Arcgis/Map/MapBuilder';
import Toolbar from '../Toolbar/Toolbar';

const VisualizationView = (props) => {
  const content = props && props.content ? props.content : {};

  const mapData =
    content && content.map_visualization_data
      ? content.map_visualization_data
      : {};

  return (
    <div id="page-document" className="view-viewarcgismap">
      {hasBlocksData(content) ? (
        <RenderBlocks {...props} />
      ) : (
        <>
          <MapBuilder data={mapData} />
          <Toolbar
            style={{ marginTop: '1rem' }}
            data={{
              show_note: false,
              show_sources: false,
              show_more_info: false,
              show_share: true,
              mapData: {
                ...mapData,
                ...pickMetadata(content),
              },
            }}
          />
        </>
      )}
    </div>
  );
};

export default VisualizationView;
