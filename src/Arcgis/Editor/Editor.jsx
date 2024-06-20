import { memo, useRef, useState, useMemo } from 'react';
import { isNil } from 'lodash';

import SidebarGroup from './SidebarGroup';

import _MapBuilder from '../Map/MapBuilder';

import {
  StructureBaseLayerPanel,
  StructureLayersPanel,
  StructureWidgetsPanel,
  SettingsGeneralPanel,
  SettingsLayersPanel,
} from './Panels';

import EditorContext from './EditorContext';

import 'react-querybuilder/dist/query-builder.css';
import 'jsoneditor/dist/jsoneditor.min.css';

const MapBuilder = memo(_MapBuilder);

const panels = {
  structure: [
    {
      title: 'Base layer',
      Panel: StructureBaseLayerPanel,
    },
    {
      title: 'Layers',
      Panel: StructureLayersPanel,
    },
    {
      title: 'Widgets',
      Panel: StructureWidgetsPanel,
    },
  ],
  settings: [
    { title: 'General', Panel: SettingsGeneralPanel },
    { title: 'Layers', Panel: SettingsLayersPanel },
  ],
};

function useApi() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [loaded, setLoaded] = useState({});
  const [error, setError] = useState({});

  const load = async (url, opts) => {
    if (data[url]) return data[url];
    let response, result;
    setLoading((prev) => ({ ...prev, [url]: true }));
    try {
      response = await fetch(`${url}?f=json`, opts);
    } catch {
      response = { ok: false, statusText: 'Unexpected error' };
    }
    try {
      result = await response.json();
    } catch {
      result = response.ok
        ? {
            code: 500,
            message: 'Unexpected error',
          }
        : {
            code: response.status,
            message: response.statusText,
          };
    }

    if (!response.ok || (!isNil(result.code) && result.code !== 200)) {
      setData((prev) => ({ ...prev, [url]: null }));
      setError((prev) => ({ ...prev, [url]: result }));
      setLoading((prev) => ({ ...prev, [url]: false }));
      setLoaded((prev) => ({ ...prev, [url]: false }));
      return;
    }
    setData((prev) => ({ ...prev, [url]: result }));
    setError((prev) => ({ ...prev, [url]: null }));
    setLoading((prev) => ({ ...prev, [url]: false }));
    setLoaded((prev) => ({ ...prev, [url]: true }));
  };

  return { data, loading, loaded, error, load };
}

export default function Editor({ value, onChangeValue }) {
  const $map = useRef(null);
  const [active, setActive] = useState({
    sidebar: 'structure',
    panel: panels.structure[0],
  });
  const servicesApi = useApi();
  const layersApi = useApi();

  const Panel = useMemo(() => active.panel.Panel, [active]);

  return (
    <EditorContext.Provider value={{ servicesApi, layersApi }}>
      <div className="arcgis-map__editor">
        <div className="arcgis-map__controls">
          <div className="arcgis-map__sidebar">
            {Object.keys(panels).map((panel) => (
              <SidebarGroup
                key={panel}
                title={panel}
                items={panels[panel]}
                active={active}
                setActive={setActive}
              />
            ))}
          </div>
          <div className="arcgis-map__panel">
            <Panel $map={$map} value={value} onChangeValue={onChangeValue} />
          </div>
        </div>
        <div className="arcgis-map__view">
          <MapBuilder data={value} ref={$map} />
        </div>
      </div>
    </EditorContext.Provider>
  );
}
