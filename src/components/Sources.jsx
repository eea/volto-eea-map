import React from 'react';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';

const Link = ({ children, ...props }) => {
  if (props.href) {
    return <UniversalLink {...props}>{children}</UniversalLink>;
  }
  return <span {...props}>{children}</span>;
};

const Source = ({ source }) => {
  if (source.chart_source_link && source.chart_source) {
    return <Link href={source.chart_source_link}>{source.chart_source}</Link>;
  }
  if (source.chart_source) {
    return <span>{source.chart_source}</span>;
  }
  return (
    <>
      <Link className="embed-sources-param-title" href={source.link}>
        {source.title}
      </Link>
      ,<span style={{ marginLeft: '5px' }}>{source.organisation}</span>
    </>
  );
};

const SourcesWidget = ({ sources }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="eea-map-sources-container">
      <Popup
        content={
          sources?.length ? (
            <ol className="eea-map-sources-list">
              {sources?.map((source, index) => {
                return (
                  <li key={index}>
                    <Source source={source} />
                  </li>
                );
              })}
            </ol>
          ) : (
            <p>Data provenance is not set for this visualization.</p>
          )
        }
        position="bottom left"
        popper={{ id: 'eea-map-sources-popup' }}
        trigger={
          <button className={cx('eea-map-sources-button', { expanded })}>
            Sources
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

export default SourcesWidget;
