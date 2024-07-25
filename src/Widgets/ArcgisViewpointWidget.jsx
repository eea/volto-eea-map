import { useEffect, useState } from 'react';
import { toNumber } from 'lodash';
import { FormFieldWrapper, InlineForm } from '@plone/volto/components';

export default function ArcgisViewpointWidget(props) {
  const [watchViewpoint, setWatchViewpoint] = useState(false);
  const { $map, id, value, onChange } = props;

  useEffect(() => {
    if (!$map.current?.isReady) return;
    const homeWidget = $map.current.view.ui.find('Home');
    if (!homeWidget) return;
    homeWidget.viewpoint = new $map.current.modules.AgViewpoint({
      center: [value.longitude, value.latitude],
      zoom: value.zoom,
    });
  }, [$map, value]);

  useEffect(() => {
    if (watchViewpoint && $map.current?.isReady) {
      const reactiveUtils = $map.current.modules.agReactiveUtils;

      reactiveUtils.when(
        () => $map.current.view.stationary,
        (stationary) => {
          if (stationary) {
            const { longitude, latitude } = $map.current.view.center;
            const zoom = $map.current.view.zoom;
            onChange(id, {
              ...value,
              longitude,
              latitude,
              zoom,
            });
          }
          setWatchViewpoint(false);
        },
        {
          once: true,
        },
      );
    }
  }, [$map, watchViewpoint, id, value, onChange]);

  return (
    <>
      <FormFieldWrapper {...props}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <button
            className="btn-primary"
            style={{
              fontSize: 'var(--font-size-small)',
              width: '100%',
              display: 'inline-block',
              textAlign: 'center',
            }}
            onClick={() => {
              setWatchViewpoint(true);
            }}
          >
            {watchViewpoint ? 'Waiting...' : 'Drag on map'}
          </button>
        </div>
      </FormFieldWrapper>
      <div className="arcgis-viewpoint-editor">
        <InlineForm
          schema={{
            title: 'Initial viewpoint',
            fieldsets: [
              {
                id: 'default',
                title: 'Default',
                fields: ['longitude', 'latitude', 'zoom'],
              },
            ],
            properties: {
              longitude: {
                title: 'Longitude',
                type: 'number',
                minimum: 0,
              },
              latitude: {
                title: 'Latitude',
                type: 'number',
                minimum: 0,
              },
              zoom: {
                title: 'Zoom',
                type: 'number',
                minimum: 0,
              },
            },
            required: [],
          }}
          formData={value}
          onChangeField={(fieldId, fieldValue) => {
            let $fieldValue = fieldValue;

            if (['longitude', 'latitude', 'zoom'].includes(fieldId)) {
              $fieldValue = Math.max(toNumber($fieldValue) || 0, 0);
            }

            onChange(id, {
              ...value,
              [fieldId]: $fieldValue,
            });
          }}
        />
      </div>
    </>
  );
}
