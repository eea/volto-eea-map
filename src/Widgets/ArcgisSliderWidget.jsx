/**
 * ArcgisSliderWidget component.
 * @module components/manage/Widgets/ArcgisSliderWidget
 */

import React, { Component } from 'react';

import { FormFieldWrapper } from '@plone/volto/components';

/**
 * The simple slider widget.
 *
 * It is the default fallback widget, so if no other widget is found based on
 * passed field properties, it will be used.
 */
class ArcgisSliderWidget extends Component {
  /**
   * Component did mount lifecycle method
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.props.focus) {
      this.node.focus();
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { id, value, onChange, min = 0, max = 1, step = 0.1 } = this.props;

    return (
      <FormFieldWrapper {...this.props} className="text">
        <div style={{ display: 'flex', flexFlow: 'column', marginTop: '1rem' }}>
          <input
            className="map-number-input"
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={({ target }) => {
              if (target.value < min) {
                target.value = min;
              }
              if (target.value > max) {
                target.value = max;
              }
              onChange(id, target.value === '' ? undefined : target.value);
            }}
          />
          <input
            className="map-range-input"
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={({ target }) => {
              if (target.value < min) {
                target.value = min;
              }
              if (target.value > max) {
                target.value = max;
              }
              onChange(id, target.value === '' ? undefined : target.value);
            }}
          />
        </div>
      </FormFieldWrapper>
    );
  }
}

export default ArcgisSliderWidget;
