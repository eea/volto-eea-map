import React from 'react';
import { Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

import TextView from '../TextView';
import LegendWidget from './LegendWidget';

import worldSVG from '@plone/volto/icons/world.svg';
import downloadSVG from '@plone/volto/icons/download.svg';

const ExtraViews = ({ data }) => {
  const { map_data = {}, description, show_description } = data;
  const { general = {} } = map_data;
  return (
    <>
      {general.show_legend && <LegendWidget data={map_data} />}
      {show_description && description && <TextView text={description} />}
      {(general.show_download || general.show_viewer) && (
        <div
          style={{ display: 'flex', justifyContent: 'end', margin: '10px 0' }}
        >
          {general.show_download && (
            <a
              target="_blank"
              rel="noreferrer"
              href={`${map_data.layers.map_layers[0].map_layer.map_service_url}?f=lyr&v=9.3`}
            >
              <Button size="tiny">
                <Icon name={downloadSVG} title="Download" size="25px" />
              </Button>
            </a>
          )}
          {general.show_viewer && (
            <a
              target="_blank"
              rel="noreferrer"
              href={
                `https://www.arcgis.com/home/webmap/viewer.html?url=` +
                `${map_data.layers.map_layers[0].map_layer.map_service_url}&source=sd`
              }
            >
              <Button size="tiny">
                <Icon name={worldSVG} title="Check Url" size="25px" />
              </Button>
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default ExtraViews;
