import { toNumber } from 'lodash';
import { InlineForm } from '@plone/volto/components';
import Panel from './Panel';
import Fold from '../Fold/Fold';
import { getDefaultWidgets } from '@eeacms/volto-eea-map/constants';

const mapSchema = {
  title: '',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['dimension'],
    },
  ],
  properties: {
    dimension: {
      title: 'Dimension',
      choices: [
        ['2d', '2D'],
        ['3d', '3D'],
      ],
    },
  },
  required: [],
};

const getViewConstraintsSchema = ({ $map }) => {
  return {
    title: 'Map View',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['initialExtent'],
      },
      {
        id: 'constraints',
        title: 'Constraints',
        fields: [
          'minScale',
          'maxScale',
          'minZoom',
          'maxZoom',
          'rotationEnabled',
        ],
      },
    ],
    properties: {
      initialExtent: {
        title: 'Initial extent',
        widget: 'arcgis_extent',
        $map,
      },
      minScale: {
        title: 'Min scale',
        type: 'number',
        minimum: 0,
      },
      maxScale: {
        title: 'Max scale',
        type: 'number',
        minimum: 0,
      },
      minZoom: {
        title: 'Min zoom',
        type: 'number',
        minimum: 0,
      },
      maxZoom: {
        title: 'Max zoom',
        type: 'number',
        minimum: 0,
      },
      rotationEnabled: {
        title: 'Rotation enabled',
        type: 'boolean',
      },
    },
    required: [],
  };
};

export default function SettingsGeneralPanel({ $map, value, onChangeValue }) {
  const viewConstraints = value.settings?.view?.constraints || {};
  const dimension = value.settings?.map?.dimension || '2d';

  return (
    <Panel
      content={
        <>
          <Fold
            title={
              <>
                <a
                  href="https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ color: '#fff' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Map
                </a>
              </>
            }
            foldable
          >
            <InlineForm
              schema={mapSchema}
              formData={{
                ...(value.settings?.map || {}),
                dimension: value.settings?.map?.dimension || '2d',
              }}
              onChangeField={(id, fieldValue) => {
                let $fieldValue = fieldValue;

                onChangeValue({
                  ...value,
                  ...(id === 'dimension'
                    ? {
                        widgets: getDefaultWidgets($fieldValue),
                      }
                    : {}),
                  settings: {
                    ...(value.settings || {}),
                    map: {
                      ...(value.settings?.map || {}),
                      [id]: $fieldValue,
                    },
                  },
                });
              }}
            />
          </Fold>
          {dimension === '2d' && (
            <Fold
              title={
                <>
                  <a
                    href="https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{ color: '#fff' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </>
              }
              foldable
            >
              <InlineForm
                schema={getViewConstraintsSchema({ $map })}
                formData={{
                  initialExtent: {
                    longitude: value.settings?.view?.center?.[0],
                    latitude: value.settings?.view?.center?.[1],
                    zoom: value.settings?.view?.zoom,
                  },
                  ...viewConstraints,
                }}
                onChangeField={(id, fieldValue) => {
                  let $fieldValue = fieldValue;

                  if (
                    ['minScale', 'maxScale', 'minZoom', 'maxZoom'].includes(id)
                  ) {
                    $fieldValue = Math.max(toNumber(fieldValue) || 0, 0);
                  }

                  if (id === 'initialExtent') {
                    const center = [
                      $fieldValue.longitude || 0,
                      $fieldValue.latitude || 0,
                    ];
                    const zoom = $fieldValue.zoom;

                    onChangeValue({
                      ...value,
                      settings: {
                        ...(value.settings || {}),
                        view: {
                          ...(value.settings?.view || {}),
                          center,
                          zoom,
                        },
                      },
                    });
                    return;
                  }

                  onChangeValue({
                    ...value,
                    settings: {
                      ...(value.settings || {}),
                      view: {
                        ...(value.settings?.view || {}),
                        constraints: {
                          ...(value.settings?.view?.constraints || {}),
                          [id]: $fieldValue,
                        },
                      },
                    },
                  });
                }}
              />
            </Fold>
          )}
        </>
      }
    />
  );
}
