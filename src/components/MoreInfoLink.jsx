import React from 'react';
import cx from 'classnames';
import { UniversalLink } from '@plone/volto/components';

const Link = ({ children, ...props }) => {
  if (props.href) {
    return <UniversalLink {...props}>{children}</UniversalLink>;
  }
  return <span {...props}>{children}</span>;
};

const MoreInfoLink = ({ contentTypeLink }) => {
  return (
    <Link href={contentTypeLink}>
      <button className={cx('eea-map-more-info-button')}>
        More info <i className="ri-external-link-line"></i>
      </button>
    </Link>
  );
};

export default MoreInfoLink;
