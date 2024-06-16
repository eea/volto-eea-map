/* eslint-disable no-throw-literal */
import React from 'react';
import { getBaseUrl } from '@plone/volto/helpers';

export function setLegendColumns(legendsNo, device) {
  switch (device) {
    case 'widescreen':
      return legendsNo ? legendsNo : 1;
    case 'large':
      return legendsNo ? legendsNo : 1;
    case 'computer':
      return legendsNo ? legendsNo : 1;
    case 'tablet':
      return 1;
    case 'mobile':
      return 1;
    default:
      return 1;
  }
}

export async function fetchArcGISData(url) {
  const res = await fetch(`${getBaseUrl('')}/cors-proxy/${url}?f=json`);
  if (res.status !== 200) {
    const error = await res.json();
    throw { message: error.message, status: error.cod };
  }
  const data = await res.json();
  if (data.error && data.error.code === 400) {
    throw { message: data.error.message.message, status: data.status };
  }
  return data;
}

export function applyQueriesToMapLayers(
  map_visualization,
  block_data_query_params,
  enable_queries,
) {
  //break reference to the original map_visualization object
  //so i safely manipulate data
  var altMapData = map_visualization
    ? JSON.parse(JSON.stringify(map_visualization))
    : '';

  var rules = [];
  if (
    enable_queries &&
    block_data_query_params &&
    block_data_query_params.length > 0 &&
    altMapData.layers &&
    altMapData.layers.map_layers &&
    altMapData.layers.map_layers.length > 0
  ) {
    altMapData.layers.map_layers.forEach((l, j) => {
      block_data_query_params.forEach((param, i) => {
        const matchingFields =
          l.map_layer && l.map_layer.fields && l.map_layer.fields.length > 0
            ? l.map_layer.fields.filter(
                (field, k) =>
                  field.name === param.alias || field.name === param.i,
              )
            : [];
        matchingFields.forEach((m, i) => {
          const newRules = param.v
            ? param.v.map((paramVal, i) => {
                return {
                  field: m.name,
                  operator: '=',
                  value: paramVal,
                };
              })
            : [];
          const concatRules = rules.concat(newRules);
          const filteredRules = concatRules.filter(
            (v, i, a) =>
              a.findLastIndex(
                (v2) => v2.field === v.field && v2.value === v.value,
              ) === i,
          );
          rules = filteredRules;
        });
      });
      let autoQuery = {
        combinator: 'or',
        rules,
      };
      altMapData.layers.map_layers[j].map_layer.query = autoQuery;
    });
  }
  return altMapData;
}

export function updateBlockQueryFromPageQuery(data_query, data_query_params) {
  var pageDataQuery = JSON.parse(JSON.stringify(data_query));
  var blockDataQuery = data_query_params
    ? JSON.parse(JSON.stringify(data_query_params))
    : '';
  var newDataQuery = pageDataQuery.map((parameter, index) => {
    //check if the parameter exists in data and has value
    // then get its alias value and update it
    //check if data_query param value is changed
    //and change it in block data
    if (
      blockDataQuery &&
      blockDataQuery[index] &&
      parameter.i &&
      blockDataQuery[index].i &&
      parameter.i === blockDataQuery[index].i
    ) {
      return {
        ...parameter,
        alias: blockDataQuery[index]?.alias ? blockDataQuery[index]?.alias : '',
        v: parameter?.v ? parameter?.v : '',
      };
    }

    return parameter;
  });
  return newDataQuery;
}

export function useCopyToClipboard(text) {
  const [copyStatus, setCopyStatus] = React.useState('inactive');
  const copy = React.useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => setCopyStatus('copied'),
      () => setCopyStatus('failed'),
    );
  }, [text]);

  React.useEffect(() => {
    if (copyStatus === 'inactive') {
      return;
    }

    const timeout = setTimeout(() => setCopyStatus('inactive'), 3000);

    return () => clearTimeout(timeout);
  }, [copyStatus]);

  return [copyStatus, copy];
}
