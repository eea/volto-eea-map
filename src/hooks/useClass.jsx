import { useEffect, useRef } from 'react';

export default function useClass(Class, ...props) {
  const refObject = useRef(null);

  useEffect(() => {
    return () => {
      refObject.current = null;
    };
  }, []);

  if (refObject.current === null) {
    refObject.current = new Class(...props);
  }

  return refObject.current;
}
