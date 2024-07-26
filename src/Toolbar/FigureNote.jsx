import React from 'react';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';
import {
  serializeNodes,
  serializeNodesToText,
} from '@plone/volto-slate/editor/render';
import { isArray } from 'lodash';

export const serializeText = (note) => {
  if (!serializeNodesToText(note))
    return <p>There are no notes set for this visualization</p>;
  return isArray(note) ? serializeNodes(note) : note;
};

const FigureNote = ({ note = [] }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="eea-map-note-container">
      <Popup
        position="bottom left"
        popper={{ id: 'eea-map-note-popup' }}
        trigger={
          <button className={cx('eea-map-note-button', { expanded })}>
            Note
          </button>
        }
        on="click"
        onClose={() => {
          setExpanded(false);
        }}
        onOpen={() => {
          setExpanded(true);
        }}
      >
        <Popup.Content>{serializeText(note)}</Popup.Content>
      </Popup>
    </div>
  );
};

export default FigureNote;
