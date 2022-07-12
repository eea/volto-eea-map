import { getBaseUrl } from '@plone/volto/helpers';

const fetchLayers = async (url) => {
  const res = await fetch(`${getBaseUrl('')}/cors-proxy/${url}?f=json`);
  if (res.status !== 200) {
    const error = await res.json();
    throw { message: error.message, status: error.cod };
  }
  const data = await res.json();
  return data;
};

export { fetchLayers };
