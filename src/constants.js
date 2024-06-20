import { capitalize } from 'lodash';

export const positions = [
  'top-left',
  'top-right',
  'bottom-right',
  'bottom-left',
].map((n) => {
  return [n, capitalize(n.replaceAll('-', ' '))];
});

export const basemaps = [
  'positron-composite',
  'blossom-composite',
  'dark-gray',
  'dark-gray-vector',
  'gray',
  'gray-vector',
  'hybrid',
  'national-geographic',
  'oceans',
  'osm',
  'satellite',
  'streets',
  'streets-navigation-vector',
  'streets-night-vector',
  'streets-relief-vector',
  'streets-vector',
  'terrain',
  'topo',
  'topo-vector',
].map((n) => {
  return [n, capitalize(n.replaceAll('-', ' '))];
});

export const widgets = [
  'AreaMeasurement2D',
  'AreaMeasurement3D',
  'Attachments',
  'Attribution',
  'BasemapGallery',
  'BasemapLayerList',
  'BasemapToggle',
  'Bookmarks',
  'BuildingExplorer',
  'Compass',
  'CoordinateConversion',
  'Daylight',
  'DirectLineMeasurement3D',
  'DirectionalPad',
  'Directions',
  'DistanceMeasurement2D',
  'Editor',
  'ElevationProfile',
  'Feature',
  'FeatureForm',
  'FeatureTable',
  'FeatureTemplates',
  'Features',
  'FloorFilter',
  'Fullscreen',
  'Histogram',
  'HistogramRangeSlider',
  'Home',
  'LayerList',
  'Legend',
  'LineOfSight',
  'Locate',
  'Measurement',
  'NavigationToggle',
  'OrientedImageryViewer',
  'Print',
  'ScaleBar',
  'ScaleRangeSlider',
  'Search',
  'ShadowCast',
  'Sketch',
  'Slice',
  'Slider',
  'TableList',
  'TimeSlider',
  'TimeZoneLabel',
  'Track',
  'UtilityNetworkAssociations',
  'UtilityNetworkTrace',
  'UtilityNetworkValidateTopology',
  'ValuePicker',
  'Weather',
  'Zoom',
].map((n) => {
  return [n, n];
});

export const blendModes = [
  'average',
  'color-burn',
  'color-dodge',
  'color',
  'darken',
  'destination-atop',
  'destination-in',
  'destination-out',
  'destination-over',
  'difference',
  'exclusion',
  'hard-light',
  'hue',
  'invert',
  'lighten',
  'lighter',
  'luminosity',
  'minus',
  'multiply',
  'normal',
  'overlay',
  'plus',
  'reflect',
  'saturation',
  'screen',
  'soft-light',
  'source-atop',
  'source-in',
  'source-out',
  'vivid-light',
  'xor',
].map((n) => {
  return [n, capitalize(n.replaceAll('-', ' '))];
});

export const geometryTypes = [
  'point',
  'multipoint',
  'polyline',
  'polygon',
  'multipatch',
  'mesh',
].map((n) => {
  return [n, capitalize(n.replaceAll('-', ' '))];
});

export const rendererTypes = [
  'simple',
  'unique-value',
  'heatmap',
  'class-breaks',
  'dictionary',
  'dot-density',
  'pie-chart',
].map((n) => ({ value: n, label: capitalize(n.replaceAll('-', ' ')) }));

export const simpleSymbols = [
  'simple-fill',
  'simple-marker',
  'simple-line',
].map((n) => {
  return [n, capitalize(n.replaceAll('-', ' '))];
});

export const expandKeys = ['expandTooltip'];

export const getDefaultWidgets = (dimension = '2d') => [
  { name: 'Zoom', position: 'top-left' },
  ...(dimension === '3d'
    ? [{ name: 'NavigationToggle', position: 'top-left' }]
    : []),
  {
    name: 'Home',
    position: 'top-left',
  },
  {
    name: 'Compass',
    position: 'top-left',
  },
  {
    name: 'LayerList',
    position: 'top-right',
    expand: true,
    ExpandProperties: {
      expandTooltip: 'Layers',
    },
  },
  {
    name: 'Print',
    position: 'top-right',
    expand: true,
    ExpandProperties: {
      expandTooltip: 'Print',
    },
  },
  {
    name: 'Fullscreen',
    position: 'top-right',
  },
  {
    name: 'Legend',
    position: 'bottom-left',
    expand: true,
    respectLayerVisibility: false,
    ExpandProperties: {
      expandTooltip: 'Legend',
    },
  },
  {
    name: 'ScaleBar',
    position: 'bottom-right',
    unit: 'dual',
  },
];

export const widgetsSchema = {
  ScaleBar: {
    unit: {
      title: 'Unit',
      choices: [
        ['metric', 'Metric'],
        ['imperial', 'Imperial'],
        ['dual', 'Dual'],
        ['non-metric', 'Non metric'],
      ],
    },
  },
  Legend: {
    respectLayerVisibility: {
      title: 'Respect layer visibility',
      type: 'boolean',
    },
  },
};

export const withSublayers = ['MapImageLayer'];

export const layersMapping = {
  'Raster Layer': 'MapImageLayer',
};

export const geometryTypeMapping = {
  esriGeometryPoint: 'point',
  esriGeometryMultipoint: 'multipoint',
  esriGeometryPolyline: 'polyline',
  esriGeometryPolygon: 'polygon',
  esriGeometryMultipatch: 'multipatch',
  esriGeometryMesh: 'mesh',
};

export const renderersMapping = {
  uniqueValue: 'unique-value',
};
