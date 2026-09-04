import { useMemo } from 'react';

import Simple from './Simple';
import UniqueValue from './UniqueValue';
import Heatmap from './Heatmap';
import ClassBreaks from './ClassBreaks';
import Dictionary from './Dictionary';
import DotDensity from './DotDensity';
import PieChart from './PieChart';

const types = {
  simle: Simple,
  'unique-value': UniqueValue,
  heatmap: Heatmap,
  'class-breaks': ClassBreaks,
  dictionary: Dictionary,
  'dot-density': DotDensity,
  'pie-chart': PieChart,
};

function getRendererByType(type) {
  return types[type] || Simple;
}

export default function Editor(props) {
  const Renderer = useMemo(() => getRendererByType(props.type), [props.type]);

  return <Renderer {...props} />;
}
