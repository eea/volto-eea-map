import { useState } from 'react';
import NumberWidget from '@plone/volto/components/manage/Widgets/NumberWidget';
import CheckboxWidget from '@plone/volto/components/manage/Widgets/CheckboxWidget';
import Panel from './Panel';
import Fold from '../Fold/Fold';

export default function SettingsGeneralPanel({ value, onChangeValue }) {
  const [state, setState] = useState({});

  function onChange(id, newValue) {
    onChangeValue({
      ...value,
      settings: {
        ...(value.settings || {}),
        [id]: newValue,
      },
    });
  }

  console.log(value);

  return (
    <Panel
      content={
        <>
          <Fold
            title={
              <>
                <a
                  href="https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#constraints"
                  style={{ color: '#fff' }}
                >
                  View constraints
                </a>
              </>
            }
          >
            <NumberWidget
              title="Min scale"
              id="minScale"
              minimum={0}
              onChange={onChange}
            />
            <NumberWidget
              title="Max scale"
              id="maxScale"
              minimum={0}
              onChange={onChange}
            />
            <NumberWidget
              title="Min scale"
              id="minScale"
              minimum={0}
              onChange={onChange}
            />
            <NumberWidget
              title="Max scale"
              id="maxScale"
              minimum={0}
              onChange={onChange}
            />
            <CheckboxWidget
              title="Rotation enabled"
              id="rotationEnabled"
              onChange={onChange}
            />
          </Fold>
        </>
      }
    />
  );
}
