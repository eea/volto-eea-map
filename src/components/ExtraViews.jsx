import React from 'react';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import {
  FigureNote,
  Sources,
  MoreInfo,
  Share,
} from '@eeacms/volto-embed/Toolbar';
import LegendView from '@eeacms/volto-eea-map/components/LegendView';

import '@eeacms/volto-embed/Toolbar/styles.less';

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
    <>
      {show_legend && map_data && (
        <LegendView data={map_data} show_viewer={show_viewer} />
      )}
      <div className="visualization-toolbar">
        <div className="left-col">
          {show_note && <FigureNote note={figure_note || []} />}
          {show_sources && <Sources sources={data_provenance?.data} />}
          {show_more_info && <MoreInfo href={data['@id']} />}
        </div>
        <div className="right-col">
          {show_share && <Share href={data['@id']} />}
        </div>
      </div>
      {description && serializeNodes(description)}
    </>
  );
};

export default ExtraViews;
