import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Grid } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { FormFieldWrapper, Icon, Toast } from '@plone/volto/components';

import MapBuilder from '@eeacms/volto-eea-map/Arcgis/Map/MapBuilder';
import {
  initEditor,
  destroyEditor,
  validateEditor,
  onPasteEditor,
} from '@eeacms/volto-eea-map/jsoneditor';

import editSVG from '@plone/volto/icons/editing.svg';

import '@eeacms/volto-eea-map/styles/editor.less';
import MapEditor from '../Arcgis/Editor/Editor';
import { debounce } from '../Arcgis/helpers';

function JsonEditorModal(props) {
  const { value, onClose, onChange } = props;
  const editor = useRef();
  const initailValue = useRef(props.value);

  async function getValue() {
    const valid = await validateEditor(editor);
    if (!valid) {
      throw new Error('Invalid JSON');
    }
    try {
      return editor.current.get();
    } catch {
      throw new Error('Invalid JSON');
    }
  }

  useEffect(() => {
    initEditor({
      el: 'jsoneditor-plotlyjson',
      editor,
      options: {
        schema: undefined,
      },
      dflt: initailValue.current,
    });

    const editorCurr = editor.current;

    return () => {
      destroyEditor(editorCurr);
    };
  }, []);

  return (
    <Modal size="fullscreen" open={true} className="plotly-json-modal">
      <Modal.Content scrolling>
        <div
          id="jsoneditor-plotlyjson"
          style={{ width: '100%', height: '100%' }}
          onPaste={(e) => {
            onPasteEditor(editor);
          }}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            onChange(initailValue.current);
            onClose();
          }}
        >
          Close
        </Button>
        <Button
          primary
          onClick={async () => {
            try {
              const newValue = {
                ...value,
                ...(await getValue()),
              };
              onChange(newValue);
              onClose();
            } catch (error) {
              toast.error(
                <Toast error title={'JSON error'} content={error.message} />,
              );
            }
          }}
        >
          Apply
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

function MapEditorModal(props) {
  const [value, setValue] = useState(props.value);
  const [open, setOpen] = useState(false);

  const properties = props.formData;

  return (
    <>
      <Modal open={true} size="fullscreen" className="chart-editor-modal">
        <Modal.Content scrolling>
          <MapEditor
            value={value}
            properties={properties}
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
                  onClick={() => setOpen(true)}
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
      {open && (
        <JsonEditorModal
          value={value}
          onChange={setValue}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

const VisualizationWidget = (props) => {
  const $map = useRef();
  const controller = useRef({});
  const { id, title, description, value } = props;
  const [showMapEditor, setShowMapEditor] = useState(false);

  function onConnect() {
    if (controller.current.multiple && !props.block) return;
    props.onChange(props.id, {
      ...value,
      preview: 'loading',
    });
    controller.current.agReactive = $map.current.modules.agReactiveUtils.watch(
      () => $map.current.view.updating,
      async (updating) => {
        if (updating || !$map.current.view) return;
        debounce(
          async () => {
            const preview = await $map.current.view.takeScreenshot({
              format: 'png',
            });
            props.onChange(props.id, {
              ...value,
              preview: preview.dataUrl,
            });
          },
          300,
          'visualization-widget-screenshot',
        );
      },
    );
  }

  function onDisconnect() {
    if (!controller.current.agReactive) return;
    controller.current.agReactive.remove();
  }

  useEffect(() => {
    if (!$map.current) return;

    const widgets = document.querySelectorAll(
      '.field-wrapper-map_visualization_data',
    );

    if (widgets.length > 1) {
      controller.current.multiple = true;
    }

    $map.current.on('connected', onConnect);
    $map.current.on('disconnected', onDisconnect);

    return () => {
      if (!$map.current) return;
      $map.current.off('connected', onConnect);
      $map.current.off('disconnected', onDisconnect);
    };
  }, []);

  if (__SERVER__ || !value) return null;

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
      <MapBuilder data={value} ref={$map} />
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
