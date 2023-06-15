import React from 'react';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import LegendView from '@eeacms/volto-eea-map/components/LegendView';
import Sources from './Sources';

const ExtraViews = ({ data }) => {
  const {
    map_data = {},
    description,
    show_legend,
    show_viewer,
    show_sources,
    data_provenance = {},
  } = data;

  return (
    <div className="extra-eea-map-content">
      {show_legend && map_data && (
        <LegendView data={map_data} show_viewer={show_viewer} />
      )}
      {show_sources && <Sources sources={data_provenance?.data} />}
      {description && serializeNodes(description)}
    </div>
  );
};

export default ExtraViews;
