import React from 'react';
import { Button } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';

import LegendWidget from './widgets/LegendWidget';
import { serializeNodes } from 'volto-slate/editor/render';

import codeSVG from '../static/code-line.svg';

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
      {map_data && map_data.layers?.map_layers[0] && show_viewer && (
        <div
          style={{ display: 'flex', justifyContent: 'end', margin: '10px 0' }}
        >
          {show_viewer && (
            <a
              target="_blank"
              rel="noreferrer"
              href={
                `https://www.arcgis.com/home/webmap/viewer.html?url=` +
                `${map_data.layers.map_layers[0].map_layer.map_service_url}&source=sd`
              }
            >
              <Button size="tiny">
                <Button.Content>
                  <img
                    className="extra-view-external-button"
                    src={codeSVG}
                    alt=""
                    title="Show API link"
                  />
                </Button.Content>
              </Button>
            </a>
          )}
        </div>
      )}
      {show_legend && map_data && <LegendWidget data={map_data} />}
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
