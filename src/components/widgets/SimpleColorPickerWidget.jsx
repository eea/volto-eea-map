import React from 'react';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import { Button } from 'semantic-ui-react';
import loadable from '@loadable/component';
import clearSVG from '@plone/volto/icons/clear.svg';

const ReactColor = loadable.lib(() => import('react-color'));

export default (props) => {
  const { id, value, onChange, available_colors } = props;
  const [showPicker, setShowPicker] = React.useState(false);

  return (
    <FormFieldWrapper
      {...props}
      draggable={false}
      className="simple-color-picker-widget"
    >
      <div>
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
        </Button.Group>

        {showPicker ? (
          <ReactColor>
            {({ SketchPicker }) => {
              return (
                <SketchPicker
                  width="180px"
                  colors={available_colors}
                  color={value || '#000'}
                  onChangeComplete={(value) => {
                    setShowPicker(false);
                    onChange(id, value.hex);
                  }}
                ></SketchPicker>
              );
            }}
          </ReactColor>
        ) : (
          ''
        )}
      </div>
    </FormFieldWrapper>
  );
};
