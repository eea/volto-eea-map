import { connect } from 'react-redux';
import { pickMetadata } from '@eeacms/volto-embed/helpers';
import MapBuilder from '@eeacms/volto-eea-map/Arcgis/Map/MapBuilder';
import Toolbar from '../Toolbar/Toolbar';

function VisualizationViewWidget(props) {
  const { value: mapData = {}, content } = props;

  return (
    <>
      <MapBuilder data={mapData} />
      <Toolbar
        style={{ marginTop: '1rem' }}
        data={{
          show_note: false,
          show_sources: false,
          show_more_info: false,
          show_share: true,
          mapData: {
            ...mapData,
            ...pickMetadata(content),
          },
        }}
      />
    </>
  );
}

export default connect((state) => ({
  content: state.content.data,
}))(VisualizationViewWidget);
