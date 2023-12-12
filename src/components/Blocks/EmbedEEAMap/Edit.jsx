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

const Edit = (props) => {
  const {
    id,
    block,
    onChangeBlock,
    selected,
    data,
    mapContent,
    getContent,
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

  const map_visualization_data = useMemo(
    () => getMapVisualizationData({ mapContent, data }),
    [mapContent, data],
  );

  useEffect(() => {
    const mapVisId = flattenToAppURL(map_visualization_data['@id'] || '');
    if (vis_url && vis_url !== mapVisId) {
      getContent(vis_url, null, id);
    }
    if (!vis_url) {
      setMapData('');
    }
  }, [id, getContent, vis_url, map_visualization_data]);

  React.useEffect(() => {
    const updatedMapData = applyQueriesToMapLayers(
      map_visualization_data,
      data_query_params,
      enable_queries,
    );
    setMapData(updatedMapData);
  }, [map_visualization_data, data_query_params, enable_queries]);

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
    (state, props) => {
      const pathname = flattenToAppURL(state.content.data['@id']);
      return {
        mapContent: state.content.subrequests?.[props.id]?.data,
        data_query: state.connected_data_parameters.byContextPath[pathname],
      };
    },
    {
      getContent,
    },
  ),
)(Edit);
