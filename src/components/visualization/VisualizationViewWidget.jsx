import Webmap from '../Webmap';
import LegendView from '../LegendView';

export default function VisualizationViewWidget(props) {
  const { value: map_visualization_data = {} } = props;
  return (
    <>
      <Webmap data={map_visualization_data} />
      <LegendView data={map_visualization_data} show_viewer={true} />
    </>
  );
}
