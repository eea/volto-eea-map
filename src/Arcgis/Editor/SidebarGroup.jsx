import { useEffect, useState, useMemo } from 'react';
import cx from 'classnames';

import { Icon } from '@plone/volto/components';

import upKeySVG from '@plone/volto/icons/up-key.svg';

export default function SidebarGroup({ title, items, active, setActive }) {
  const [expanded, setExpanded] = useState(false);
  const isActive = useMemo(
    () =>
      active.sidebar === title &&
      items.filter((item) => active.panel.title === item.title).length === 1,
    [active, title, items],
  );

  useEffect(() => {
    if (isActive) {
      setExpanded(true);
    }
  }, [isActive]);

  return (
    <div
      className={cx('sidebar-group', {
        'sidebar-group--expanded': expanded,
        'sidebar-group--is-active': isActive,
      })}
    >
      <div
        role="button"
        tabIndex={0}
        className="sidebar-group--title"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={() => {}}
      >
        <div className="sidebar-group--title__icon">
          <Icon name={upKeySVG} size="20px" />
        </div>
        <div className="sidebar-group--title__label">{title}</div>
      </div>
      {expanded &&
        items.map((item) => (
          <div
            role="button"
            tabIndex={0}
            key={item.title}
            className={cx('sidebar-group--item', {
              'sidebar-group--item__is-active':
                isActive && active.panel.title === item.title,
            })}
            onClick={() => {
              setActive({ sidebar: title, panel: item });
            }}
            onKeyDown={() => {}}
          >
            {item.title}
          </div>
        ))}
    </div>
  );
}
