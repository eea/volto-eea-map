import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import {
  FigureNote,
  Sources,
  MoreInfo,
  Share,
} from '@eeacms/volto-embed/Toolbar';
import LegendView from '@eeacms/volto-eea-map/components/LegendView';

import '@eeacms/volto-embed/Toolbar/styles.less';

const ExtraViews = ({ data, screen }) => {
  const toolbar = useRef();
  const [mobile, setMobile] = useState(false);
  const {
    map_visualization_data = {},
    description,
    show_legend,
    show_viewer,
    show_note = true,
    show_sources = true,
    show_more_info = true,
    show_share = true,
  } = data;

  const { data_provenance = {}, figure_note = [] } = map_visualization_data;

  useEffect(() => {
    if (toolbar.current) {
      const toolbarParentWidth = toolbar.current.parentElement.offsetWidth;

      if (toolbarParentWidth < 600 && !mobile) {
        setMobile(true);
      } else if (toolbarParentWidth >= 600 && mobile) {
        setMobile(false);
      }
    }
  }, [screen, mobile]);

  return (
    <>
      {show_legend && map_visualization_data && (
        <LegendView data={map_visualization_data} show_viewer={show_viewer} />
      )}
      <div className={cx('visualization-toolbar', { mobile })} ref={toolbar}>
        <div className="left-col">
          {show_note && <FigureNote notes={figure_note || []} />}
          {show_sources && <Sources sources={data_provenance?.data} />}
          {show_more_info && <MoreInfo href={map_visualization_data['@id']} />}
        </div>
        <div className="right-col">
          {show_share && <Share href={map_visualization_data['@id']} />}
        </div>
      </div>
      {description && serializeNodes(description)}
    </>
  );
};

export default connect((state) => ({
  screen: state.screen,
}))(ExtraViews);
