import React, { useMemo, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getContent } from '@plone/volto/actions';
import { PrivacyProtection } from '@eeacms/volto-embed';
import { getLayers } from '@eeacms/volto-eea-map/Arcgis/helpers';
import MapBuilder from '@eeacms/volto-eea-map/Arcgis/Map/MapBuilder';
import Toolbar from '@eeacms/volto-eea-map/Toolbar/Toolbar';

import { getMapData } from './helpers';

const View = (props) => {
  const { id, mode, data, getContent, content } = props;
  const {
    vis_url,
    data_query_params,
    enable_queries,
    show_note = true,
    show_more_info = true,
    show_share = true,
    dataprotection = { enabled: true },
    height = '',
  } = data;

  const url = useMemo(() => flattenToAppURL(vis_url), [vis_url]);

  const mapData = useMemo(() => getMapData({ content, data }), [content, data]);

  const mapServiceURL = useMemo(() => {
    const url = getLayers(mapData)?.[0]?.url;

    if (url) {
      return `${url}?f=jsapi`;
    }
    return '';
  }, [mapData]);

  const definitionExpression = useMemo(
    () =>
      enable_queries
        ? {
            id: uuid(),
            combinator: 'and',
            not: false,
            rules: data_query_params
              .map((query) => {
                if (!query.alias || !query.i) {
                  return null;
                }
                return {
                  id: uuid(),
                  dataQuery: [query.i],
                  field: query.alias,
                  operator: '=',
                  value: '',
                  valueSource: 'value',
                };
              })
              .filter((query) => {
                return query?.field;
              }),
          }
        : null,
    [data_query_params, enable_queries],
  );

  useEffect(() => {
    if (mode !== 'edit') return;
    const mapPath = flattenToAppURL(mapData['@id'] || '');
    if (!mapData?.error && url && url !== mapPath) {
      getContent(url, null, id);
    }
  }, [id, mode, url, mapData, getContent]);

  if (!mapData || !url) {
    return null;
  }

  if (mapData?.error) {
    return <p dangerouslySetInnerHTML={{ __html: mapData.error }} />;
  }

  return (
    <PrivacyProtection
      {...props}
      data={mapServiceURL ? { ...data, url: mapServiceURL } : data}
    >
      <div className="embed-map-visualization">
        <MapBuilder
          data={mapData}
          properties={{ ...(props.properties || {}), definitionExpression }}
          height={height}
        />
        <Toolbar
          style={{ marginTop: '1rem' }}
          data={{
            ...data,
            show_note,
            show_sources: true,
            show_more_info,
            show_share,
            dataprotection,
            mapData,
          }}
        />
      </div>
    </PrivacyProtection>
  );
};

export default compose(
  connect(
    (state, props) => {
      return {
        content: state.content.subrequests?.[props.id]?.data,
      };
    },
    { getContent },
  ),
)(View);
