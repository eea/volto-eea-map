import { pickMetadata } from '@eeacms/volto-embed/helpers';
// import { updateBlockQueryFromPageQuery } from '@eeacms/volto-eea-map/utils';

const deepUpdateDataQueryParams = (
  block,
  data,
  effectiveQueryParams,
  onChangeBlock,
) => {
  const updatedQueryParams = effectiveQueryParams.map((param) => {
    // Find the matching query in the block's current data_query_params
    const existingParam =
      data?.data_query_params &&
      data.data_query_params.find((p) => p.i === param.i);

    // If found, merge it with the effective query parameter, preserving the alias
    return existingParam ? { ...param, alias: existingParam.alias } : param;
  });

  // Update the block data if there are changes
  if (
    JSON.stringify(data.data_query_params) !==
    JSON.stringify(updatedQueryParams)
  ) {
    onChangeBlock(block, {
      ...data,
      data_query_params: updatedQueryParams,
    });
  }
};

function getMapVisualizationData(props) {
  const content = props.mapContent || {};
  const map_visualization_data =
    content.map_visualization_data || props.data?.map_visualization_data || {};
  return {
    ...pickMetadata(content),
    ...map_visualization_data,
  };
}

export { deepUpdateDataQueryParams, getMapVisualizationData };
