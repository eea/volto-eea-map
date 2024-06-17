import { SelectWidget, TextareaWidget } from '@plone/volto/components';
import { basemaps } from '@eeacms/volto-eea-map/constants';
import { getBasemap } from '@eeacms/volto-eea-map/Arcgis/helpers';
import Fold from '../Fold/Fold';

import Panel from './Panel';

export default function StructureBaseLayerPanel({ value, onChangeValue }) {
  const basemap = getBasemap(value);

  return (
    <Panel
      content={
        <Fold title="Base layer" foldable>
          <SelectWidget
            title="Basemap"
            id="basemap"
            choices={basemaps}
            value={basemap.name}
            onChange={(id, newValue) => {
              const $value = { ...value };
              delete $value.base; // not needed (backward compatibility)
              onChangeValue({
                ...$value,
                [id]: {
                  ...$value[id],
                  name: newValue,
                },
              });
            }}
          />

          <TextareaWidget
            title="Custom Basemap"
            id="basemap"
            value={basemap.url_template}
            onChange={(id, newValue) => {
              const $value = { ...value };
              delete $value.base; // not needed (backward compatibility)
              onChangeValue({
                ...$value,
                [id]: {
                  ...$value[id],
                  url_template: newValue,
                },
              });
            }}
          />
        </Fold>
      }
    />
  );
}
