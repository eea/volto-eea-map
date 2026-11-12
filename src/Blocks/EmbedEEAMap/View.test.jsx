import React from 'react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';

import { View } from './View';

const mockMapBuilder = jest.fn(() => <div data-testid="live-map" />);

jest.mock(
  '@eeacms/volto-eea-map/Arcgis/Map/MapBuilder',
  () => (props) => mockMapBuilder(props),
);
jest.mock('@eeacms/volto-eea-map/Toolbar/Toolbar', () => () => null);
jest.mock('@eeacms/volto-embed', () => ({
  PrivacyProtection: ({ children }) => children,
}));

const data = {
  vis_url: '/map',
  dataprotection: { enabled: false },
  map_visualization_data: {
    title: 'Example map',
    layers: [],
  },
};

const renderView = (props = {}) =>
  render(
    <View
      id="map-block"
      mode="view"
      data={data}
      getContent={jest.fn()}
      content={{}}
      {...props}
    />,
  );

describe('EmbedEEAMap print readiness', () => {
  beforeEach(() => mockMapBuilder.mockClear());

  it('always uses the live ArcGIS map', () => {
    const { getByTestId, queryByRole } = renderView();

    expect(getByTestId('live-map')).toBeInTheDocument();
    expect(queryByRole('img')).not.toBeInTheDocument();
  });

  it('reports loading, ready, and later map updates', () => {
    const { container } = renderView();
    const wrapper = container.querySelector('[data-print-block="eea-map"]');
    const mapProps = mockMapBuilder.mock.calls.at(-1)[0];

    expect(wrapper).toHaveAttribute('data-print-status', 'loading');

    act(() => mapProps.onReady());

    expect(wrapper).toHaveAttribute('data-print-status', 'ready');

    act(() => mapProps.onLoading());

    expect(wrapper).toHaveAttribute('data-print-status', 'loading');

    act(() => mapProps.onReady());

    expect(wrapper).toHaveAttribute('data-print-status', 'ready');
  });

  it('settles the print wait when ArcGIS fails', () => {
    const { container } = renderView();
    const wrapper = container.querySelector('[data-print-block="eea-map"]');

    act(() => mockMapBuilder.mock.calls.at(-1)[0].onError());

    expect(wrapper).toHaveAttribute('data-print-status', 'failed');
  });
});
