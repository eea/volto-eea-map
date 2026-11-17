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

  it('builds a definition expression from valid data queries', () => {
    renderView({
      metadata: { country: 'RO' },
      data: {
        ...data,
        enable_queries: true,
        data_query_params: [
          { alias: 'country', i: 'country-code' },
          { alias: '', i: 'missing-alias' },
          { alias: 'missing-index', i: '' },
        ],
        map_visualization_data: {
          ...data.map_visualization_data,
          layers: [{ url: 'https://example.com/MapServer' }],
        },
      },
    });

    expect(mockMapBuilder.mock.calls.at(-1)[0].properties).toMatchObject({
      country: 'RO',
      definitionExpression: {
        combinator: 'and',
        not: false,
        rules: [
          {
            dataQuery: ['country-code'],
            field: 'country',
            operator: '=',
            value: '',
            valueSource: 'value',
          },
        ],
      },
    });
  });

  it('loads referenced map data while editing', () => {
    const getContent = jest.fn();

    renderView({
      mode: 'edit',
      getContent,
      data: {
        ...data,
        map_visualization_data: {
          ...data.map_visualization_data,
          '@id': '/different-map',
        },
      },
    });

    expect(getContent).toHaveBeenCalledWith('/map', null, 'map-block');
  });

  it('handles missing and erroneous map data', () => {
    const { container, rerender } = renderView({
      data: { ...data, vis_url: '' },
    });

    expect(container).toBeEmptyDOMElement();

    rerender(
      <View
        id="map-block"
        mode="view"
        data={{
          ...data,
          map_visualization_data: { error: '<strong>Map unavailable</strong>' },
        }}
        getContent={jest.fn()}
        content={{}}
      />,
    );

    expect(container).toHaveTextContent('Map unavailable');
    expect(mockMapBuilder).not.toHaveBeenCalled();
  });
});
