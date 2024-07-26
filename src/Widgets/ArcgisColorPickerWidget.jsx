import { useEffect, useState, useRef } from 'react';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import { Button } from 'semantic-ui-react';
import loadable from '@loadable/component';
import clearSVG from '@plone/volto/icons/clear.svg';

const ReactColor = loadable.lib(() => import('react-color'));

function colorToRGBA(color) {
  const r = color.r;
  const g = color.g;
  const b = color.b;
  const a = color.a;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function ArcgisColorPickerWidget(props) {
  const el = useRef(null);
  const colorPickerEl = useRef(null);
  const { $map, id, value, onChange, available_colors } = props;
  const [showColorPicker, setShowColorPicker] = useState(false);

  const color = new $map.current.modules.AgColor(value);

  function onClickOutside(e) {
    if (el.current && !el.current.contains(e.target)) {
      setShowColorPicker(false);
    }
  }

  useEffect(() => {
    window.addEventListener('click', onClickOutside);

    return () => {
      window.removeEventListener('click', onClickOutside);
    };
  }, []);

  return (
    <FormFieldWrapper {...props}>
      <div ref={el} style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          style={{
            margin: 0,
            backgroundColor: colorToRGBA(color),
          }}
          onClick={() =>
            setShowColorPicker((showColorPicker) => !showColorPicker)
          }
          size="small"
          fluid
          title="Show color picker"
        />
        <Button
          compact
          style={{ margin: 0, padding: '8px' }}
          onClick={() => onChange(id, null)}
        >
          <Icon name={clearSVG} size="18px" color="red" style={{ margin: 0 }} />
        </Button>
        {showColorPicker && (
          <div
            ref={colorPickerEl}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <ReactColor>
              {({ SketchPicker }) => {
                return (
                  <SketchPicker
                    width="180px"
                    style={{
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    colors={available_colors}
                    color={color}
                    onChangeComplete={(color) => {
                      const { r, g, b, a } = color.rgb;
                      onChange(id, [r, g, b, a]);
                    }}
                  />
                );
              }}
            </ReactColor>
          </div>
        )}
      </div>
    </FormFieldWrapper>
  );
}
