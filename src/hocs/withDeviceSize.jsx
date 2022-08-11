import React from 'react';

export default function withDeviceSize(WrappedComponent) {
  return (props) => {
    const [device, setDevice] = React.useState(null);

    const updateScreenSize = () => {
      if (__CLIENT__) {
        const screenWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth ||
          0;

        setDevice(getDeviceConfig(screenWidth));
      }
    };

    const getDeviceConfig = (width) => {
      // semantic ui breakpoints
      if (width < 320) {
        return 'mobile';
      } else if (width >= 320 && width < 768) {
        return 'tablet';
      } else if (width >= 768 && width < 992) {
        return 'computer';
      } else if (width >= 992 && width < 1280) {
        return 'large';
      } else if (width >= 1280) {
        return 'widescreen';
      }
    };

    React.useEffect(() => {
      updateScreenSize();
      window.addEventListener('resize', updateScreenSize);
      return () => {
        window.removeEventListener('resize', updateScreenSize);
      };
      /* eslint-disable-next-line */
    }, []);

    return <WrappedComponent {...props} device={device} />;
  };
}
