import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { PrivacyProtection } from '@eeacms/volto-embed';

import { getContent } from '@plone/volto/actions';
import Webmap from '@eeacms/volto-eea-map/components/Webmap';
import ExtraViews from '@eeacms/volto-eea-map/components/ExtraViews';
import { applyQueriesToMapLayers } from '@eeacms/volto-eea-map/utils';

const View = (props) => {
  const { data, id, data_provenance = {} } = props || {};
  const { height = '' } = data;

  const [mapData, setMapData] = React.useState('');

  React.useEffect(() => {
    props.getContent(props.data.vis_url, null, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data.vis_url]);

  React.useEffect(() => {
    const updatedMapData = applyQueriesToMapLayers(
      props.map_visualization,
      props.data.data_query_params,
      props.data.enable_queries,
    );

    setMapData(updatedMapData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.map_visualization, props.data]);

  return (
    <PrivacyProtection data={data} height={height} {...props}>
      {mapData && (
        <div>
          <Webmap data={mapData} height={height} />
          <ExtraViews
            data={{
              ...data,
              data_provenance,
              map_data: props.map_visualization,
            }}
          />
        </div>
      )}
      {!mapData && (
        <p>No map view to show. Set visualization in block configuration.</p>
      )}
    </PrivacyProtection>
  );
};

export default compose(
  connect(
    (state, props) => ({
      data_provenance:
        state.content.subrequests?.[props.id]?.data?.data_provenance,
      map_visualization:
        state.content.subrequests?.[props.id]?.data?.map_visualization_data,
    }),
    {
      getContent,
    },
  ),
)(View);
