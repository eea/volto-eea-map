import React from 'react';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';

const FigureNote = ({ note }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="eea-map-note-container">
      <Popup
        content={
          note ? (
            <p>{note}</p>
          ) : (
            <p>Notes are not set for this visualization.</p>
          )
        }
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
      />
    </div>
  );
};

export default FigureNote;
