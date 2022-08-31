import React from 'react';
import { UniversalLink } from '@plone/volto/components';

import LegendWidget from './widgets/LegendWidget';
import { serializeNodes } from 'volto-slate/editor/render';

const ExtraViews = ({ data }) => {
  const {
    map_data = {},
    description,
    show_legend,
    show_viewer,
    show_sources,
    data_provenance = {},
  } = data;
  return (
    <div className="extra-eea-map-content">
      {show_legend && map_data && (
        <LegendWidget data={map_data} show_viewer={show_viewer} />
      )}
      {show_sources && (
        <>
          {data_provenance &&
          data_provenance.data &&
          data_provenance.data.length > 0 ? (
            <div>
              <h3>Sources:</h3>
              <ul>
                {data_provenance.data.map((param, i) => (
                  <li key={i}>
                    <div className="map_source_param_container">
                      <UniversalLink
                        className="map_source_title"
                        href={param.link}
                      >
                        {param.title}
                      </UniversalLink>
                      ,
                      <span className="map_source_description">
                        {param.organisation}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Data provenance is not set for visualization used or page</p>
          )}
        </>
      )}
      {description && serializeNodes(description)}
    </div>
  );
};

export default ExtraViews;
