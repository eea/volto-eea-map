import { getBaseUrl } from '@plone/volto/helpers';

const fetchArcgisData = async (url) => {
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

export { fetchArcgisData };
