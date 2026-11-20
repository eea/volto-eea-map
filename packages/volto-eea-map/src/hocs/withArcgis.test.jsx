import React from 'react';
import { act, render, screen } from '@testing-library/react';

import withArcgis from './withArcgis';

vi.mock('@eeacms/volto-eea-map/arcgis', () => ({ default: vi.fn() }));

const Map = ({ agLoaded }) => (
  <div data-testid="map">{agLoaded ? 'loaded' : 'loading'}</div>
);
const MapWithArcgis = withArcgis(Map);

const post = (origin, data = { type: 'arcgis-loaded' }) =>
  act(() => {
    window.dispatchEvent(new MessageEvent('message', { data, origin }));
  });

describe('withArcgis', () => {
  afterEach(() => {
    delete window.$arcgis;
  });

  it('is loaded once ArcGIS posts the message from this window', () => {
    render(<MapWithArcgis />);
    expect(screen.getByTestId('map')).toHaveTextContent('loading');

    post(window.location.origin);

    expect(screen.getByTestId('map')).toHaveTextContent('loaded');
  });

  it('ignores the message when it comes from another origin', () => {
    render(<MapWithArcgis />);

    post('https://evil.example.com');

    expect(screen.getByTestId('map')).toHaveTextContent('loading');
  });

  it('ignores other messages from this window', () => {
    render(<MapWithArcgis />);

    post(window.location.origin, { type: 'something-else' });
    post(window.location.origin, null);

    expect(screen.getByTestId('map')).toHaveTextContent('loading');
  });

  it('is loaded right away when ArcGIS is already on the page', () => {
    window.$arcgis = {};
    render(<MapWithArcgis />);

    expect(screen.getByTestId('map')).toHaveTextContent('loaded');
  });
});
