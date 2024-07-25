import { useEffect, useRef } from 'react';
import { isFunction, isEqual } from 'lodash';

export default function useChangedEffect(callback, props) {
  const prevPropsRef = useRef(props);

  useEffect(() => {
    const currentChangedProps = Object.keys(props).reduce((acc, key) => {
      if (
        !['children'].includes(key) &&
        !isEqual(props[key], prevPropsRef.current[key])
      ) {
        acc[key] = props[key];
      }
      return acc;
    }, {});

    if (isFunction(callback)) {
      callback(currentChangedProps);
    }

    prevPropsRef.current = props;
  }, [callback, props]);
}
