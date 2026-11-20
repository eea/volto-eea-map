import React from 'react';
import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import { EventEmitter } from 'events';

import Map from './Map';

const updateHandle = { remove: jest.fn() };
let notifyUpdating;

const mockMap = Object.assign(new EventEmitter(), {
  connect: jest.fn(),
  disconnect: jest.fn(),
  isReady: true,
  map: {
    layers: {
      length: 1,
      toArray: () => [{ when: jest.fn(() => Promise.resolve()) }],
    },
  },
  reactiveUtils: {
    watch: jest.fn((getValue, callback) => {
      notifyUpdating = callback;
      return updateHandle;
    }),
    whenOnce: jest.fn(() => Promise.resolve()),
  },
  updateProps: jest.fn(),
  waitForPendingOperations: jest.fn(() => Promise.resolve()),
  view: {
    destroy: jest.fn(),
    updating: false,
    when: jest.fn(() => Promise.resolve()),
    whenLayerView: jest.fn(() => Promise.resolve({ updating: false })),
  },
});

mockMap.connect.mockImplementation(() => mockMap.emit('connected'));

jest.mock('@eeacms/volto-eea-map/hooks/useClass', () => () => mockMap);
jest.mock('@eeacms/volto-eea-map/hooks/useChangedProps', () => jest.fn());
jest.mock('@eeacms/volto-eea-map/hocs/withArcgis', () => {
  const ReactLib = require('react');
  return (Component) =>
    ReactLib.forwardRef((props, ref) =>
      ReactLib.createElement(Component, { ...props, agLoaded: true, ref }),
    );
});

describe('Arcgis Map readiness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    notifyUpdating = undefined;
    mockMap.connect.mockImplementation(() => mockMap.emit('connected'));
  });

  it('reports initial readiness and subsequent redraws', async () => {
    const onLoading = jest.fn();
    const onReady = jest.fn();

    render(
      <Map
        MapProperties={{}}
        ViewProperties={{}}
        expectedLayerCount={1}
        onLoading={onLoading}
        onReady={onReady}
      />,
    );

    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));

    act(() => notifyUpdating(true));
    expect(onLoading).toHaveBeenCalledTimes(1);

    act(() => notifyUpdating(false));
    expect(onReady).toHaveBeenCalledTimes(2);
  });
});
