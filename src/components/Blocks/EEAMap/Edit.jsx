import React from 'react';
import { SidebarPortal, Icon } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { Schema } from './Schema';
import Webmap from './components/Webmap';
import './styles/map.css';
import TextView from './components/TextView';
import { Button } from 'semantic-ui-react';
import LegendWidget from './components/widgets/LegendWidget';
import worldSVG from '@plone/volto/icons/world.svg';
import downloadSVG from '@plone/volto/icons/download.svg';

const Edit = (props) => {
  const { block, data, onChangeBlock, selected } = props;
  const schema = React.useMemo(() => Schema(props), [props]);

  const { map_data = {} } = data;
  const { general = {} } = map_data;

  if (__SERVER__) return '';

  return (
    <>
      <Webmap data={map_data} />
      {general.show_legend && <LegendWidget data={map_data} />}
      {general.show_description && general.description && (
        <TextView text={general.description} />
      )}
      {(general.show_download || general.show_viewer) && (
        <div
          style={{ display: 'flex', justifyContent: 'end', margin: '10px 0' }}
        >
          {general.show_download && (
            <a
              target="_blank"
              href={`${map_data.layers.map_layers[0].map_layer.map_service_url}?f=lyr&v=9.3`}
            >
              <Button size="tiny">
                <Icon name={downloadSVG} title="Download" size="25px" />
              </Button>
            </a>
          )}
          {general.show_viewer && (
            <a
              target="_blank"
              href={
                `https://www.arcgis.com/home/webmap/viewer.html?url=` +
                `${map_data.layers.map_layers[0].map_layer.map_service_url}&source=sd`
              }
            >
              <Button size="tiny">
                <Icon name={worldSVG} title="Check Url" size="25px" />
              </Button>
            </a>
          )}
        </div>
      )}

      <SidebarPortal selected={selected}>
        <BlockDataForm
          block={block}
          title={schema.title}
          schema={schema}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default Edit;

// https://land.discomap.eea.europa.eu/arcgis/rest/services/Background/CLC2012_v_18_5_land_mask/MapServer?f=lyr&v=9.3
