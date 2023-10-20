import React from 'react';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import LegendView from '@eeacms/volto-eea-map/components/LegendView';
import Sources from './Sources';
import FigureNote from './FigureNote';
import MoreInfoLink from './MoreInfoLink';
import Share from './Share';

const ExtraViews = ({ data }) => {
  const {
    map_data = {},
    description,
    show_legend,
    show_viewer,
    show_note,
    show_sources,
    show_more_info,
    data_provenance = {},
    figure_note = [],
    show_share,
  } = data;

  return (
    <div className="extra-eea-map-content">
      {show_legend && map_data && (
        <LegendView data={map_data} show_viewer={show_viewer} />
      )}
      <div className="visualization-info-container">
        <div className="eea-map-info visualization-info">
          {show_note && <FigureNote note={figure_note || []} />}
          {show_sources && <Sources sources={data_provenance?.data} />}
          {show_more_info && <MoreInfoLink contentTypeLink={data?.vis_url} />}
        </div>
        <div className="visualization-info">
          {show_share && <Share contentTypeLink={data?.vis_url} />}
        </div>
      </div>
      {description && serializeNodes(description)}
    </div>
  );
};

export default ExtraViews;
