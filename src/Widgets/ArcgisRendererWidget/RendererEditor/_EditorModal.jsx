import { useEffect, useRef } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { Toast } from '@plone/volto/components';
import {
  initEditor,
  destroyEditor,
  validateEditor,
  onPasteEditor,
} from '@eeacms/volto-eea-map/jsoneditor';

export default function EditorModal(props) {
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
