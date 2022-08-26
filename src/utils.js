/* eslint-disable no-throw-literal */
import { getBaseUrl } from '@plone/volto/helpers';
const setLegendColumns = (legendsNo, device) => {
  switch (device) {
    case 'widescreen':
      return legendsNo ? legendsNo : 1;
    case 'large':
      return legendsNo ? legendsNo : 1;
    case 'computer':
      return legendsNo ? legendsNo : 1;
    case 'tablet':
      return 1;
    case 'mobile':
      return 1;
    default:
      return 1;
  }
};

const fetchArcGISData = async (url) => {
  const res = await fetch(`${getBaseUrl('')}/cors-proxy/${url}?f=json`);
  if (res.status !== 200) {
    const error = await res.json();
    throw { message: error.message, status: error.cod };
  }
  const data = await res.json();
  if (data.error && data.error.code === 400) {
    throw { message: data.error.message.message, status: data.status };
  }
  return data;
};

export { setLegendColumns, fetchArcGISData };
