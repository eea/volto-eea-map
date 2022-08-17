import React from 'react';
import { Button } from 'semantic-ui-react';
import { Icon, UniversalLink } from '@plone/volto/components';

import LegendWidget from './LegendWidget';
import { serializeNodes } from 'volto-slate/editor/render';

import worldSVG from '@plone/volto/icons/world.svg';
import downloadSVG from '@plone/volto/icons/download.svg';

const ExtraViews = ({ data }) => {
  const {
    map_data = {},
    description,
    show_legend,
    show_download,
    show_viewer,
    show_sources,
    data_provenance = {},
  } = data;
  return (
    <div className="extra-eea-map-content">
      {map_data &&
        map_data.layers?.map_layers[0] &&
        (show_download || show_viewer) && (
          <div
            style={{ display: 'flex', justifyContent: 'end', margin: '10px 0' }}
          >
            {show_download && (
              <a
                target="_blank"
                rel="noreferrer"
                href={`${map_data.layers.map_layers[0].map_layer.map_service_url}?f=lyr&v=9.3`}
              >
                <Button size="tiny">
                  <Button.Content>
                    <Icon name={downloadSVG} title="Download" size="25px" />
                  </Button.Content>
                </Button>
              </a>
            )}
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
                    <Icon name={worldSVG} title="View map" size="25px" />
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
              {data_provenance.data.map((data, i) => (
                <div key={i}>
                  <p className="map_source_title">{data.title}</p>
                  <p className="map_source_description">{data.organisation}</p>
                  <UniversalLink href={data.link}>{data.link} </UniversalLink>
                </div>
              ))}
            </div>
          ) : (
            <p>Data provenance is not set for this visualization</p>
          )}
        </>
      )}
      {description && serializeNodes(description)}
    </div>
  );
};

export default ExtraViews;
