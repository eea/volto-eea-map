import React from 'react';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import { Button } from 'semantic-ui-react';
import loadable from '@loadable/component';
import clearSVG from '@plone/volto/icons/clear.svg';
import checkSVG from '@plone/volto/icons/check.svg';

const ReactColor = loadable.lib(() => import('react-color'));

export default (props) => {
  const { id, value, onChange, available_colors } = props;
  const [showPicker, setShowPicker] = React.useState(false);

  const [color, setColor] = React.useState(value);

  const handleChangeColor = (valColor) => {
    setColor(valColor.hex);
  };

  const handleConfirmColor = () => {
    onChange(id, color);
    setShowPicker(false);
  };

  const handleAbortColor = () => {
    setColor(value);
    setShowPicker(false);
  };

  return (
    <FormFieldWrapper
      {...props}
      draggable={false}
      className="simple-color-picker-widget"
    >
      <div style={{ position: 'relative' }}>
        <Button.Group fluid>
          <Button
            color={value}
            style={{ backgroundColor: value }}
            onClick={() => setShowPicker(true)}
            size="small"
            fluid
            title="Pick color"
          >
            {''}
          </Button>
          <Button
            compact
            style={{ paddingLeft: '8px', paddingRight: '0px' }}
            onClick={() => onChange(id, null)}
          >
            <Icon name={clearSVG} size="18px" color="red" />
          </Button>
          {showPicker ? (
            <div
              style={{
                position: 'absolute',
                top: '0',
                zIndex: '77',
                background: 'lightgrey',
                display: 'flex',
                flexDirection: 'column',
                padding: '5px',
                borderRadius: '2px',
              }}
            >
              <ReactColor>
                {({ SketchPicker }) => {
                  return (
                    <SketchPicker
                      width="180px"
                      colors={available_colors}
                      color={color || '#000'}
                      onChangeComplete={(value) => {
                        // setShowPicker(false);
                        //onChange(id, value.hex);
                        handleChangeColor(value);
                      }}
                    ></SketchPicker>
                  );
                }}
              </ReactColor>
              <Button.Group>
                <Button
                  size="tiny"
                  compact
                  title="Reset color"
                  style={{ paddingLeft: '8px', paddingRight: '0px' }}
                  onClick={() => handleAbortColor()}
                >
                  <Icon name={clearSVG} size="18px" />
                </Button>
                <Button
                  onClick={() => handleConfirmColor()}
                  color="green"
                  compact
                  size="tiny"
                  title="Confirm color"
                >
                  <Icon name={checkSVG} size="18px" />
                </Button>
              </Button.Group>
            </div>
          ) : (
            ''
          )}
        </Button.Group>
      </div>
    </FormFieldWrapper>
  );
};
