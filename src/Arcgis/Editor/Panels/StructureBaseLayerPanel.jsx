import { useMemo } from 'react';
import { InlineForm } from '@plone/volto/components';
import { basemaps } from '@eeacms/volto-eea-map/constants';
import { getBasemap } from '@eeacms/volto-eea-map/Arcgis/helpers';
import Fold from '../Fold/Fold';

import Panel from './Panel';

const schema = {
  title: 'Base layer',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['name', 'url_template'],
    },
  ],
  properties: {
    name: {
      title: 'Name',
      choices: basemaps,
    },
    url_template: {
      title: 'Custom basemap',
      widget: 'textarea',
    },
  },
  required: [],
};

export default function StructureBaseLayerPanel({ value, onChangeValue }) {
  const basemap = useMemo(
    () => getBasemap({ basemap: value.basemap, base: value.base }) || {},
    [value.basemap, value.base],
  );

  return (
    <Panel
      content={
        <Fold title="Base layer" foldable>
          <InlineForm
            schema={schema}
            formData={basemap}
            onChangeField={(id, fieldValue) => {
              const $value = { ...value };
              delete $value.base; // not needed (backward compatibility)
              onChangeValue({
                ...$value,
                basemap: {
                  ...basemap,
                  [id]: fieldValue,
                },
              });
            }}
          />
        </Fold>
      }
    />
  );
}
