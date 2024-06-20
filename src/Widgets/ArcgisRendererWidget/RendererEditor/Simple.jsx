import { toNumber } from 'lodash';

import { InlineForm } from '@plone/volto/components';

import { simpleSymbols as simpleSymbolsOptions } from '@eeacms/volto-eea-map/constants';

import { simpleSymbols } from '../RendererEditor/_defaults';

export default function Simple(props) {
  const { $map, value, id, onChange } = props;

  const symbol = value?.symbol || {};

  return (
    <InlineForm
      schema={{
        title: 'Symbol',
        fieldsets: [
          {
            id: 'default',
            title: 'Default',
            fields: [],
          },
          {
            id: 'symbol',
            title: 'Symbol',
            fields: [
              'type',
              'color',
              ...(['simple-fill', 'simple-marker'].includes(symbol.type)
                ? ['outline_color', 'outline_width']
                : []),
              ...(symbol.type === 'simple-marker' ? ['size'] : []),
              ...(symbol.type === 'simple-line' ? ['width'] : []),
            ],
          },
        ],
        properties: {
          type: {
            title: 'Type',
            choices: simpleSymbolsOptions,
          },
          color: {
            title: 'Color',
            widget: 'arcgis_color_picker',
            $map,
          },
          outline_color: {
            title: 'Outline color',
            widget: 'arcgis_color_picker',
            $map,
          },
          outline_width: {
            title: 'Outline width',
            type: 'number',
            minimum: 0,
            step: 0.1,
          },
          size: {
            title: 'Size',
            type: 'number',
            minimum: 0,
            step: 0.1,
          },
          width: {
            title: 'Width',
            type: 'number',
            minimum: 0,
            step: 0.1,
          },
        },
        required: [],
      }}
      formData={{
        ...symbol,
        outline_color: symbol.outline?.color,
        outline_width: symbol.outline?.width,
      }}
      onChangeField={(symbolId, fieldValue) => {
        let $fieldValue = fieldValue;

        if (['outline_width', 'size', 'width'].includes(symbolId)) {
          $fieldValue = Math.max(toNumber(fieldValue) || 0, 0);
        }

        onChange(id, {
          ...(value || {}),
          symbol: {
            ...(symbolId === 'type' ? simpleSymbols[fieldValue] || {} : {}),
            ...symbol,
            ...(['outline_color', 'outline_width'].includes(symbolId)
              ? {
                  outline: {
                    ...(symbol.outline || {}),
                    [symbolId.replace('outline_', '')]: $fieldValue,
                  },
                }
              : { [symbolId]: $fieldValue }),
          },
        });
      }}
    />
  );
}
