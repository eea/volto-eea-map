import React, { useState, useMemo } from 'react';
import { Modal, Button, Grid } from 'semantic-ui-react';

import { FormFieldWrapper, Icon, InlineForm } from '@plone/volto/components';
import config from '@plone/volto/registry';

import MapBuilder from '@eeacms/volto-eea-map/Arcgis/Map/MapBuilder';

import PanelsSchema from './panelsSchema';

import editSVG from '@plone/volto/icons/editing.svg';

import '@eeacms/volto-eea-map/styles/editor.less';
import MapEditor from '../Arcgis/Editor/Editor';

function MapEditorModal(props) {
  const [value, setValue] = useState(props.value);
  const [showImportJSON, setShowMapEditor] = useState(false);

  return (
    <>
      <Modal open={true} size="fullscreen" className="chart-editor-modal">
        <Modal.Content scrolling>
          <MapEditor
            value={value}
            onChangeValue={(value) => {
              setValue(value);
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Grid>
            <Grid.Row>
              <Grid.Column
                verticalAlign="middle"
                style={{
                  display: 'inline-flex',
                  flexFlow: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  secondary
                  className="json-btn"
                  // onClick={() => setShowImportJSON(true)}
                >
                  <Icon name={editSVG} size="20px" />
                  JSON
                </Button>
                <div style={{ display: 'flex' }}>
                  <Button floated="right" onClick={props.onClose}>
                    Close
                  </Button>
                  <Button
                    primary
                    floated="right"
                    onClick={() => {
                      props.onChange(props.id, value);
                      props.onClose();
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
      {/* {showImportJSON && (
        <PlotlyJsonModal
          value={value}
          onChange={setValue}
          onClose={() => setShowImportJSON(false)}
        />
      )} */}
    </>
  );
}

const VisualizationWidget = (props) => {
  const { id, title, description, error, value } = props;
  const [showMapEditor, setShowMapEditor] = useState(false);

  if (__SERVER__) return '';

  return (
    <FormFieldWrapper {...props} columns={1}>
      <div className="wrapper">
        <label htmlFor={`field-${id}`}>{title}</label>
        <Button
          floated="right"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMapEditor(true);
          }}
        >
          Open Map Editor
        </Button>
      </div>
      {description && <p className="help">{description}</p>}
      <MapBuilder data={value} />
      {showMapEditor && (
        <MapEditorModal
          {...props}
          value={value || {}}
          onClose={() => setShowMapEditor(false)}
        />
      )}
    </FormFieldWrapper>
  );
};

export default VisualizationWidget;
