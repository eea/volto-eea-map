import React from 'react';
import { Popup, Input, Button } from 'semantic-ui-react';
import { useCopyToClipboard } from '../utils.js';
import cx from 'classnames';

const Share = ({ contentTypeLink = '' }) => {
  const [expanded, setExpanded] = React.useState(false);
  const popupRef = React.useRef();

  const CopyUrlButton = ({ className, url, buttonText }) => {
    const [copyUrlStatus, copyUrl] = useCopyToClipboard(url);

    if (copyUrlStatus === 'copied') {
      buttonText = 'Copied!';
    } else if (copyUrlStatus === 'failed') {
      buttonText = 'Copy failed. Please try again.';
    }

    return (
      <Button
        primary
        onClick={copyUrl}
        className={cx('copy-button', className)}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <Popup
      popper={{ id: 'eea-map-share-popup' }}
      trigger={
        <div className="eea-map-share-container">
          <button className={cx('eea-map-share-button', { expanded })}>
            <span>Share</span>
            <i class="ri-share-fill"></i>
          </button>
        </div>
      }
      position="bottom left"
      on="click"
      onClose={() => {
        setExpanded(false);
      }}
      onOpen={() => {
        setExpanded(true);
      }}
      ref={popupRef}
    >
      <div>
        <span className="eea-map-share-popup-text">Copy link</span>
        <div className="eea-map-share-popup-container">
          <Input
            className="eea-map-share-link"
            defaultValue={contentTypeLink}
          />
          <CopyUrlButton
            className="eea-map-copy-button"
            url={contentTypeLink}
            buttonText="Copy"
          />
        </div>
      </div>
    </Popup>
  );
};

export default Share;
