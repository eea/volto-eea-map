import { useState } from 'react';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import {
  customSelectStyles,
  DropdownIndicator,
  ClearIndicator,
  Option,
  selectTheme,
  MultiValueContainer,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import { normalizeValue } from '@plone/volto/components/manage/Widgets/SelectUtils';
import {
  rendererTypes,
  renderersMapping,
} from '@eeacms/volto-eea-map/constants';
import RendererEditor from './RendererEditor/_Editor';
import RendererEditorModal from './RendererEditor/_EditorModal';
import { simpleFillSymbol } from './RendererEditor/_defaults';

import editSVG from '@plone/volto/icons/editing.svg';

function ArcgisRendererWidget(props) {
  const [open, setOpen] = useState(false);
  const { value, id, intl, onChange } = props;
  const $type = renderersMapping[value?.type] || value?.type;
  const type = normalizeValue(rendererTypes, $type, intl);

  const Select = props.reactSelect.default;

  return (
    <>
      <FormFieldWrapper
        {...props}
        title={
          <button
            className="btn-primary"
            style={{ fontSize: 'var(--font-size-small)' }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Icon name={editSVG} size="20px" />
            Renderer
          </button>
        }
      >
        <Select
          id={`field-${id}`}
          name={id}
          menuShouldScrollIntoView={false}
          isDisabled={false}
          isSearchable={true}
          className="react-select-container"
          classNamePrefix="react-select"
          isMulti={false}
          options={rendererTypes}
          styles={customSelectStyles}
          theme={selectTheme}
          components={{
            MultiValueContainer,
            DropdownIndicator,
            ClearIndicator,
            Option: props.customOptionStyling || Option,
          }}
          value={type}
          placeholder="Select a renderer type..."
          onChange={(selectedOption) => {
            return onChange(id, {
              autocast: true,
              type:
                selectedOption && selectedOption.value !== 'no-value'
                  ? selectedOption.value
                  : undefined,
              ...(selectedOption.value === 'simple'
                ? { symbol: simpleFillSymbol }
                : {}),
            });
          }}
        />
      </FormFieldWrapper>
      <div className="arcgis-renderer-editor">
        <RendererEditor {...props} type={$type} />
        {open && (
          <RendererEditorModal
            value={value}
            onChange={(newValue) => {
              onChange(id, newValue);
            }}
            onClose={() => {
              setOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
}

export const ArcgisRendererWidgetComponent = injectIntl(ArcgisRendererWidget);

export default compose(injectLazyLibs(['reactSelect']))(
  ArcgisRendererWidgetComponent,
);
