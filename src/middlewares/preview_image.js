import {
  CREATE_CONTENT,
  UPDATE_CONTENT,
} from '@plone/volto/constants/ActionTypes';

export const preview_image = (middlewares) => [
  (store) => (next) => async (action) => {
    if (![CREATE_CONTENT, UPDATE_CONTENT].includes(action.type)) {
      return next(action);
    }
    const state = store.getState();
    const contentData = state.content.data;
    const type = action?.request?.data?.['@type'] || contentData['@type'];

    if (
      !contentData ||
      type !== 'map_visualization' ||
      contentData.preview_image_saved ||
      !action?.request?.data?.map_visualization_data?.preview
    ) {
      return next(action);
    }

    if (
      (contentData?.preview_image &&
        contentData?.preview_image?.filename !==
          'preview_image_generated_map_simple.png') ||
      (action?.request?.data?.preview_image &&
        action?.request?.data?.preview_image?.filename !==
          'preview_image_generated_map_simple.png')
    ) {
      return next(action);
    }
    const preview = action?.request?.data?.map_visualization_data?.preview;
    if (
      preview === 'loading' &&
      // eslint-disable-next-line no-alert
      window.confirm('Do you want to save a preview image?')
    ) {
      // eslint-disable-next-line no-alert
      window.alert('Wait for the preview image to generate!');
      return;
    } else if (
      preview !== 'loading' &&
      // eslint-disable-next-line no-alert
      !window.confirm('Do you want to save a preview image?')
    ) {
      return next(action);
    }
    try {
      const previewImage = {
        preview_image: {
          data: action.request.data.map_visualization_data.preview.split(
            ',',
          )[1],
          encoding: 'base64',
          'content-type': 'image/png',
          filename: 'preview_image_generated_map_simple.png',
        },
        preview_image_saved: true,
      };

      const mapVisualizationData = {
        ...action.request.data.map_visualization_data,
      };
      delete mapVisualizationData.preview;

      return next({
        ...action,
        request: {
          ...action.request,
          data: {
            ...action.request.data,
            ...previewImage,
            map_visualization_data: mapVisualizationData,
          },
        },
      });
    } catch (error) {
      return next(action);
    }
  },
  ...middlewares,
];
