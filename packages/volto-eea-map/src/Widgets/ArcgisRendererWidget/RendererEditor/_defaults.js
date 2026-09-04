export const simpleFillSymbol = {
  type: 'simple-fill',
  color: [17, 157, 255, 0.5],
  outline: {
    color: [17, 157, 255, 0.6],
    width: 0.5,
  },
};

export const simpleMarkerSymbol = {
  type: 'simple-marker',
  size: 8,
  color: [17, 157, 255, 0.2],
  outline: {
    color: [17, 157, 255, 0.8],
    width: 0.5,
  },
};

export const simpleLineSymbol = {
  type: 'simple-line',
  color: [17, 157, 255, 0.5],
  width: 1,
};

export const simpleSymbols = {
  'simple-fill': simpleFillSymbol,
  'simple-line': simpleLineSymbol,
  'simple-marker': simpleMarkerSymbol,
};
