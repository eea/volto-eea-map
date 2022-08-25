import React from 'react';
import { FormFieldWrapper, Field } from '@plone/volto/components';

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
            <div key={i}>
              <h5 style={{ fontWeight: 'bold' }}>{param.i}</h5>
              <Field
                id={i}
                title="Alias"
                type="string"
                description="Data connector parameter alias for matchings. Default is {Key}"
                onChange={onChangeAlias}
                value={param?.alias}
              />
              <Field
                id={param.i}
                title="Values"
                type="string"
                disabled={true}
                description="Parameter value/s"
                value={param.v.join(',')}
              />
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No parameters set</p>
        )}
      </div>
    </div>
  );
};

export default DataQueryWidget;
