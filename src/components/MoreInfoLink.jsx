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
        More info <span className="eea-map-more-info">{'>'}</span>
      </button>
    </Link>
  );
};

export default MoreInfoLink;
