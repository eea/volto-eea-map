import React from 'react';
import { FormFieldWrapper, Field, Icon } from '@plone/volto/components';
import { Accordion, Button, Segment } from 'semantic-ui-react';
import downSVG from '@plone/volto/icons/down.svg';

const DataQueryWidget = (props) => {
  const { value, onChange, id } = props;

  const onChangeAlias = (fieldId, fieldValue) => {
    let altValue = value;
    value[fieldId] = { ...value[fieldId], alias: fieldValue };
    onChange(id, altValue);
  };

  return (
    <div>
      <FormFieldWrapper {...props} noForInFieldLabel></FormFieldWrapper>
      <div className="data-query-widget-field">
        {value && value.length > 0 ? (
          value.map((param, i) => (
            <Accordion
              key={i}
              fluid
              styled
              style={{ border: '1px solid lightgray' }}
            >
              {/* <Accordion.Title>
                <div>
                  <Icon name={downSVG} size="12px" />
                  {param.i}
                </div>
              </Accordion.Title> */}

              <Accordion.Content active={true}>
                <Segment>
                  <p className="data-param-title">
                    <strong> Parameter: </strong>
                    {param.i}
                  </p>
                  <p className="data-param-values">
                    <strong>Values:</strong> {param.v.join(',')}
                  </p>
                  <Field
                    id={i}
                    title="Alias"
                    type="string"
                    description={`Will try to match Layer field name with Alias to apply query. If it's not set, it will try to match with ${param.i} (Parameter)`}
                    onChange={onChangeAlias}
                    value={param?.alias}
                  />
                </Segment>
              </Accordion.Content>
            </Accordion>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No parameters set</p>
        )}
      </div>
    </div>
  );
};

export default DataQueryWidget;
