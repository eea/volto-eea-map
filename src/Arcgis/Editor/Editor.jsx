import { memo, useState, useMemo } from 'react';

import SidebarGroup from './SidebarGroup';

import _MapBuilder from '../Map/MapBuilder';

import {
  StructureBaseLayerPanel,
  StructureLayersPanel,
  SettingsGeneralPanel,
  StylesGeneralPanel,
  StylesLayersPanel,
} from './Panels';

import EditorContext from './EditorContext';

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
  ],
  settings: [{ title: 'General', Panel: SettingsGeneralPanel }],
  styles: [
    {
      title: 'General',
      Panel: StylesGeneralPanel,
    },
    {
      title: 'Layers',
      Panel: StylesLayersPanel,
    },
  ],
};

export default function Editor({ value, onChangeValue }) {
  const [active, setActive] = useState({
    sidebar: 'structure',
    panel: panels.structure[0],
  });
  const [servicesData, setServicesData] = useState({});
  const [layersData, setLayersData] = useState({});

  const Panel = useMemo(() => active.panel.Panel, [active]);

  return (
    <EditorContext.Provider
      value={{ servicesData, layersData, setServicesData, setLayersData }}
    >
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
            <Panel value={value} onChangeValue={onChangeValue} />
          </div>
        </div>
        <div className="arcgis-map__view">
          <MapBuilder data={value} />
        </div>
      </div>
    </EditorContext.Provider>
  );
}
