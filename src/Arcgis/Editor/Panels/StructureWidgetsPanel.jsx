import { useState } from 'react';
import { Icon, InlineForm } from '@plone/volto/components';
import { withVariationSchemaEnhancer } from '@plone/volto/helpers';
import addSVG from '@plone/volto/icons/add.svg';
import Panel from './Panel';
import Fold from '../Fold/Fold';
import { debounce, getWidgets } from '../../helpers';
import {
  expandKeys,
  positions,
  widgets as widgetsOptions,
  getDefaultWidgets,
  widgetsSchema,
} from '@eeacms/volto-eea-map/constants';

const Form = withVariationSchemaEnhancer(InlineForm);

export default function StructureWidgetsPanel({ value, onChangeValue }) {
  const [widgets, setWidgets] = useState(getWidgets(value));

  return (
    <Panel
      header={
        <div style={{ width: '100%', textAlign: 'right' }}>
          <button
            className="btn-primary"
            onClick={() => {
              const newWidgets = [
                ...widgets,
                { name: null, position: positions[0] },
              ];
              setWidgets(newWidgets);
              debounce(
                () => {
                  onChangeValue({
                    ...value,
                    widgets: newWidgets,
                  });
                },
                600,
                'widgets:update',
              );
            }}
          >
            <Icon name={addSVG} size="16px" /> Widget
          </button>
        </div>
      }
      content={
        <>
          {widgets.map((widget, index) => {
            const title = `Widget ${index + 1}${
              widget.name ? ` (${widget.name})` : ''
            }`;
            const ExpandProperties = widget.ExpandProperties || {};
            return (
              <Fold
                key={index}
                title={title}
                onDelete={() => {
                  const newWidgets = widgets.filter((_, i) => i !== index);
                  setWidgets(newWidgets);
                  debounce(
                    () => {
                      onChangeValue({
                        ...value,
                        widgets: newWidgets,
                      });
                    },
                    600,
                    'widgets:update',
                  );
                }}
                foldable
                deletable
              >
                <Form
                  schema={{
                    title,
                    fieldsets: [
                      {
                        id: 'default',
                        title: 'Default',
                        fields: ['name', 'position', 'expand'],
                      },
                    ],
                    properties: {
                      name: {
                        title: 'Name',
                        choices: widgetsOptions,
                      },
                      position: {
                        title: 'Position',
                        choices: positions,
                      },
                      expand: {
                        title: 'Expand',
                        type: 'boolean',
                      },
                      expandTooltip: {
                        title: 'Expand tooltip',
                      },
                    },
                    required: [],
                  }}
                  blocksConfig={{
                    widget: {
                      schemaEnhancer: ({ schema, formData }) => {
                        return {
                          ...schema,
                          fieldsets: [
                            {
                              id: 'default',
                              title: 'Default',
                              fields: [
                                'name',
                                'position',
                                ...Object.keys(
                                  widgetsSchema[formData.name] || {},
                                ),
                                'expand',
                                ...(formData.expand ? ['expandTooltip'] : []),
                              ],
                            },
                          ],
                          properties: {
                            ...schema.properties,
                            ...(widgetsSchema[formData.name] || {}),
                          },
                        };
                      },
                    },
                  }}
                  formData={{
                    '@type': 'widget',
                    ...widget,
                    ...ExpandProperties,
                  }}
                  onChangeField={(id, fieldValue) => {
                    const newWidget =
                      id === 'name'
                        ? getDefaultWidgets(
                            value.settings?.map?.dimension,
                          ).find(($widget) => $widget.name === fieldValue) || {}
                        : {};
                    const newWidgets = widgets.map(($widget, i) => {
                      if (i !== index) return $widget;
                      return {
                        ...$widget,
                        ...newWidget,
                        ...(expandKeys.includes(id)
                          ? {
                              ExpandProperties: {
                                ...ExpandProperties,
                                [id]: fieldValue,
                              },
                            }
                          : { [id]: fieldValue }),
                      };
                    });
                    setWidgets(newWidgets);
                    debounce(
                      () => {
                        onChangeValue({
                          ...value,
                          widgets: newWidgets,
                        });
                      },
                      600,
                      'widgets:update',
                    );
                  }}
                />
              </Fold>
            );
          })}
        </>
      }
    />
  );
}
