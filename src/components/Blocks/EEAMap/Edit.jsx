import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { Schema } from './Schema';
import Webmap from './components/Webmap';
import './styles/map.css';
import TextView from './components/TextView';
import { Button } from 'semantic-ui-react';

const Edit = (props) => {
  const { block, data, onChangeBlock, selected } = props;
  const schema = React.useMemo(() => Schema(props), [props]);

  const { map_data = {} } = data;
  const { general = {} } = map_data;

  if (__SERVER__) return '';

  return (
    <>
      <Webmap data={map_data} />
      {general.show_description && <TextView text={general.description} />}
      {general.show_download && (
        <a
          target="_blank"
          href={`${map_data.layers.map_layers[0].map_layer.map_service_url}?f=lyr&v=9.3`}
        >
          Download layer
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
          {' '}
          Open Map Viewer{' '}
        </a>
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
