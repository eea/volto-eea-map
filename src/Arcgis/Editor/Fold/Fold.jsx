import { useState } from 'react';
import cx from 'classnames';

import { Icon } from '@plone/volto/components';

import clearSVG from '@plone/volto/icons/clear.svg';
import upKeySVG from '@plone/volto/icons/up-key.svg';

export default function Fold({
  children,
  title,
  icon,
  foldable,
  deletable,
  onDelete,
}) {
  const [fold, setFold] = useState(false);

  const isfolded = foldable && fold;

  return (
    <div className={cx('fold', { fold__open: !isfolded, foldable })}>
      <div
        className="fold--top"
        {...(foldable
          ? {
              role: 'button',
              tabIndex: 0,
              onClick: () => setFold(!fold),
              onKeyDown: () => {},
            }
          : {})}
      >
        <div className="fold--top__content">
          {foldable && (
            <Icon name={upKeySVG} className="fold--top__fold" size="16px" />
          )}
          {!!icon && <Icon name={icon} size="16px" />}
          {!!title && <div className="fold--top__title">{title}</div>}
        </div>
        {deletable && (
          <Icon
            name={clearSVG}
            className="fold--top__delete"
            size="16px"
            onClick={(e) => {
              onDelete(e);
              e.stopPropagation();
            }}
          />
        )}
      </div>
      {!isfolded && <div className="fold--content">{children}</div>}
    </div>
  );
}
