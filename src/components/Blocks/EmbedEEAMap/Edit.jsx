import React from 'react';
import { SidebarPortal } from '@plone/volto/components';

import { connect } from 'react-redux';
import { compose } from 'redux';

import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Webmap from '@eeacms/volto-eea-map/components/Webmap';
import ExtraViews from '@eeacms/volto-eea-map/components/ExtraViews';

import { expandToBackendURL } from '@plone/volto/helpers';

import { Schema } from './Schema';
import { applyQueriesToMapLayers } from '@eeacms/volto-eea-map/utils';

import { getVisualization } from '@eeacms/volto-eea-map/actions';

const Edit = (props) => {
  const { block, onChangeBlock, selected, data_provenance = {} } = props;
  const schema = Schema(props);
  const [mapData, setMapData] = React.useState('');
  const data = React.useMemo(() => props.data, [props.data]);
  const { height = '' } = data;
  React.useEffect(() => {
    if (props.data.vis_url) {
      props.getVisualization(expandToBackendURL(props.data.vis_url));
    }
    if (!props.data.vis_url) {
      setMapData('');
    }
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
    <>
      {mapData && (
        <div>
          <Webmap data={mapData} height={height} isEdit={true} />
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
      data_query: state.content.data.data_query,
      map_visualization: props.data.vis_url
        ? state.map_visualizations?.data[expandToBackendURL(props.data.vis_url)]
            ?.data
        : '',
      data_provenance: props.data.vis_url
        ? state.map_visualizations?.data[expandToBackendURL(props.data.vis_url)]
            ?.data_provenance
        : '',
    }),
    {
      getVisualization,
    },
  ),
)(Edit);
