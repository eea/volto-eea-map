import React from 'react';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import LegendView from '@eeacms/volto-eea-map/components/LegendView';
import Sources from './Sources';
import FigureNote from './FigureNote';
import MoreInfoLink from './MoreInfoLink';

const ExtraViews = ({ data }) => {
  const {
    map_data = {},
    description,
    show_legend,
    show_viewer,
    show_note,
    show_sources,
    data_provenance = {},
  } = data;

  return (
    <div className="extra-eea-map-content">
      {show_legend && map_data && (
        <LegendView data={map_data} show_viewer={show_viewer} />
      )}
      <div className="eea-map-info">
        {show_note && <FigureNote note={'Example note'} />}
        {show_sources && <Sources sources={data_provenance?.data} />}
        <MoreInfoLink contentTypeLink={data?.vis_url} />
      </div>
      {description && serializeNodes(description)}
    </div>
  );
};

export default ExtraViews;
