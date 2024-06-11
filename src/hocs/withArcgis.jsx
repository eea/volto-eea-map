import React, { useEffect, useState } from 'react';
import loadArcgis from '@eeacms/volto-eea-map/arcgis';

export default function withArcgis(WrappedComponent) {
  return (props) => {
    const [agLoaded, setAgLoaded] = useState(false);

    const interceptArcgis = (event) => {
      if (event.type === 'message' && event.data.type === 'arcgis-loaded') {
        setAgLoaded(true);
      }
    };

    useEffect(() => {
      loadArcgis();
      window.addEventListener('message', interceptArcgis);
      return () => {
        window.removeEventListener('message', interceptArcgis);
      };
    }, []);

    return <WrappedComponent {...props} agLoaded={agLoaded} />;
  };
}
