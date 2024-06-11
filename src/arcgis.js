export default function arcgis(version = '4.29') {
  if (__SERVER__) return null;

  const getId = (type) => {
    return `arcgis${type}-${version}`;
  };

  const linkId = getId('css');
  const scriptId = getId('js');

  function loadCss() {
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://js.arcgis.com/${version}/esri/themes/light/main.css`;
      link.id = getId('css', version);
      document.head.appendChild(link);
      link.addEventListener('load', () => {
        loadScript();
      });
    }
  }

  function loadScript() {
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.src = `https://js.arcgis.com/${version}/init.js`;
      script.id = scriptId;
      document.body.appendChild(script);
      script.addEventListener('load', () => {
        if (window.$arcgis) {
          window.postMessage({
            type: 'arcgis-loaded',
          });
        }
      });
    }
  }

  if (window.$arcgis) {
    return window.$arcgis;
  } else {
    loadCss();
    return null;
  }
}
