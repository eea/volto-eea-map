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

import '@eeacms/volto-embed/Toolbar/styles.less';

const Toolbar = ({ data, screen, style }) => {
  const el = useRef();
  const [mobile, setMobile] = useState(false);
  const {
    mapData = {},
    description,
    show_note = true,
    show_sources = true,
    show_more_info = true,
    show_share = true,
  } = data;

  const { data_provenance = {}, figure_note = [] } = mapData;

  useEffect(() => {
    if (el.current) {
      const toolbarParentWidth = el.current.parentElement.offsetWidth;

      if (toolbarParentWidth < 600 && !mobile) {
        setMobile(true);
      } else if (toolbarParentWidth >= 600 && mobile) {
        setMobile(false);
      }
    }
  }, [screen, mobile]);

  return (
    <>
      <div
        className={cx('visualization-toolbar', { mobile })}
        style={style}
        ref={el}
      >
        <div className="left-col">
          {show_note && <FigureNote notes={figure_note || []} />}
          {show_sources && <Sources sources={data_provenance?.data} />}
          {show_more_info && <MoreInfo href={mapData['@id']} />}
        </div>
        <div className="right-col">
          {show_share && <Share href={mapData['@id']} />}
        </div>
      </div>
      {description && serializeNodes(description)}
    </>
  );
};

export default connect((state) => ({
  screen: state.screen,
}))(Toolbar);
