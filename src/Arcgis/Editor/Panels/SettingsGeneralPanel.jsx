import NumberWidget from '@plone/volto/components/manage/Widgets/NumberWidget';
import CheckboxWidget from '@plone/volto/components/manage/Widgets/CheckboxWidget';
import Panel from './Panel';
import Fold from '../Fold/Fold';

export default function SettingsGeneralPanel({ value, onChangeValue }) {
  const constraints = value.settings?.view?.constraints || {};

  function onChange(id, newValue) {
    onChangeValue({
      ...value,
      settings: {
        view: {
          ...(value.settings?.view || {}),
          constraints: {
            ...(value.settings?.view?.constraints || {}),
            [id]: newValue,
          },
        },
      },
    });
  }

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
              value={constraints.minScale}
              minimum={0}
              onChange={onChange}
            />
            <NumberWidget
              title="Max scale"
              id="maxScale"
              value={constraints.maxScale}
              minimum={0}
              onChange={onChange}
            />
            <NumberWidget
              title="Min zoom"
              id="minZoom"
              value={constraints.minZoom}
              minimum={0}
              onChange={onChange}
            />
            <NumberWidget
              title="Max zoom"
              id="maxZoom"
              value={constraints.maxZoom}
              minimum={0}
              onChange={onChange}
            />
            <CheckboxWidget
              title="Rotation enabled"
              id="rotationEnabled"
              value={constraints.rotationEnabled}
              onChange={onChange}
            />
          </Fold>
        </>
      }
    />
  );
}
