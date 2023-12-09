import React, { useEffect, useMemo } from 'react';
import { Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { SidebarPortal } from '@plone/volto/components';
import { getContent } from '@plone/volto/actions';
import { flattenToAppURL } from '@plone/volto/helpers';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Webmap from '@eeacms/volto-eea-map/components/Webmap';
import ExtraViews from '@eeacms/volto-eea-map/components/ExtraViews';

import { Schema } from './Schema';
import { applyQueriesToMapLayers } from '@eeacms/volto-eea-map/utils';
import { getMapVisualizationData } from './helpers';
import { isEqual } from 'lodash';

const Edit = (props) => {
  const {
    id,
    block,
    onChangeBlock,
    selected,
    data,
    getContent,
    unsaved_data_queries,
  } = props;

  const {
    data_query_params,
    enable_queries,
    show_legend = true,
    show_note = true,
    show_sources = true,
    show_more_info = true,
    show_share = true,
    dataprotection = { enabled: true },
    height = '',
  } = data;

  const schema = Schema(props);
  const [mapData, setMapData] = React.useState('');

  const vis_url = useMemo(() => flattenToAppURL(data.vis_url), [data.vis_url]);
  const map_visualization_data = useMemo(() => getMapVisualizationData(props), [
    props,
  ]);

  useEffect(() => {
    const mapVisId = flattenToAppURL(map_visualization_data['@id'] || '');
    if (vis_url && vis_url !== mapVisId) {
      getContent(vis_url, null, id);
    }
    if (!vis_url) {
      setMapData('');
    }
  }, [id, getContent, vis_url, map_visualization_data]);

  useEffect(() => {
    const mergedQueries = unsaved_data_queries.map((unsavedQuery, index) => {
      const correspondingQuery = data_query_params[index];
      return { ...unsavedQuery, alias: correspondingQuery?.alias };
    });
    const queriesToUse =
      mergedQueries.length > 0 ? mergedQueries : data_query_params;

    const updatedMapData = applyQueriesToMapLayers(
      map_visualization_data,
      queriesToUse,
      enable_queries,
    );

    if (!isEqual(mapData, updatedMapData)) {
      setMapData(updatedMapData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    map_visualization_data,
    data_query_params,
    enable_queries,
    unsaved_data_queries,
  ]);

  return (
    <>
      {!vis_url && (
        <Message>Please select a visualization from block editor.</Message>
      )}
      {!!vis_url && mapData && (
        <div>
          <Webmap data={mapData} height={height} isEdit={true} />
          <ExtraViews
            data={{
              ...data,
              show_legend,
              show_note,
              show_sources,
              show_more_info,
              show_share,
              dataprotection,
              map_visualization_data,
            }}
          />
        </div>
      )}
      <SidebarPortal selected={selected}>
        <BlockDataForm
          block={block}
          title={schema.title}
          schema={schema}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default compose(
  connect(
    (state, props) => ({
      mapContent: state.content.subrequests?.[props.id]?.data,
      data_query: state.content.data.data_query,
      unsaved_data_queries: state.unsaved_data_queries,
      state,
    }),
    { getContent },
  ),
)(Edit);
