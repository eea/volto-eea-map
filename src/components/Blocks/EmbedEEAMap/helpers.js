import { updateBlockQueryFromPageQuery } from '@eeacms/volto-eea-map/utils';

const deepUpdateDataQueryParams = (block, data, data_query, onChangeBlock) => {
  // If block data_query_params do not exist, init them
  if (!data?.data_query_params) {
    onChangeBlock(block, {
      ...data,
      data_query_params: [...data_query],
    });
  }

  // If block data_query_params exist, deep check them then change them in block data
  if (data_query && data?.data_query_params) {
    const newDataQuery = updateBlockQueryFromPageQuery(
      data_query,
      data?.data_query_params,
    );

    if (
      JSON.stringify(newDataQuery) !== JSON.stringify(data.data_query_params)
    ) {
      onChangeBlock(block, {
        ...data,
        data_query_params: [...newDataQuery],
      });
    }
  }
};

export { deepUpdateDataQueryParams };
