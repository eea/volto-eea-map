import Webmap from '../Webmap';

export default function VisualizationViewWidget(props) {
  const { value: map_visualization_data = {} } = props;
  return <Webmap data={map_visualization_data} />;
}
