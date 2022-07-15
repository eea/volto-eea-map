import React from 'react';
import { Menu, Tab } from 'semantic-ui-react';
import { ObjectWidget } from '@plone/volto/components';

export const ObjectTypesWidget = (props) => {
  const { schemas, value = {}, onChange, errors = {}, id } = props;
  const objectId = id;

  const defaultActiveTab = 0;

  const [activeTab, setActiveTab] = React.useState(
    defaultActiveTab > -1 ? defaultActiveTab : 0,
  );
  const createTab = ({ schema, id, icon }, index) => {
    return {
      menuItem: () => (
        <Menu.Item
          onClick={() => setActiveTab(index)}
          active={activeTab === index}
          key={id}
        >
          <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{schema.title}</p>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane>
            <ObjectWidget
              schema={schema}
              id={id}
              errors={errors}
              value={value[id] || {}}
              onChange={(schemaId, v) => {
                onChange(objectId, { ...value, [schemaId]: v });
              }}
            />
          </Tab.Pane>
        );
      },
    };
  };

  return (
    <Tab
      menu={{ fluid: true, vertical: true, tabular: true }}
      panes={schemas.map(createTab)}
      activeIndex={activeTab}
      grid={{ paneWidth: 8, tabWidth: 4 }}
    />
  );
};

export default ObjectTypesWidget;