import React from 'react';

export default function withScreenSize(WrappedComponent) {
  return (props) => {
    const [screenHeight, setScreenHeight] = React.useState(null);
    const [screenWidth, setScreenWidth] = React.useState(null);
    const [device, setDevice] = React.useState(null);

    const updateScreenSize = () => {
      if (__CLIENT__) {
        const screenHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight ||
          0;
        const screenWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth ||
          0;

        setScreenHeight(screenHeight);
        setScreenWidth(screenWidth);
        setDevice(getDeviceConfig(screenWidth));
      }
    };

    const getDeviceConfig = (width) => {
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

    return (
      <WrappedComponent
        {...props}
        screenHeight={screenHeight}
        screenWidth={screenWidth}
        device={device}
      />
    );
  };
}
