import { connect } from 'react-redux';
import { pickMetadata } from '@eeacms/volto-embed/helpers';
import MapBuilder from '@eeacms/volto-eea-map/Arcgis/Map/MapBuilder';
import ExtraViews from '../components/ExtraViews';

function VisualizationViewWidget(props) {
  const { value: map_visualization_data = {} } = props;

  return (
    <>
      <MapBuilder data={map_visualization_data} />
      <ExtraViews
        data={{
          show_viewer: true,
          show_legend: true,
          show_note: false,
          show_sources: false,
          show_more_info: false,
          show_share: true,
          map_visualization_data: {
            ...map_visualization_data,
            ...pickMetadata(props.content),
          },
        }}
      />
    </>
  );
}

export default connect((state) => ({
  content: state.content.data,
}))(VisualizationViewWidget);
