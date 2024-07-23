import { useContext, useEffect, useMemo, memo } from 'react';
import { EventEmitter } from 'events';

import MapContext from '../Map/MapContext';

import useClass from '@eeacms/volto-eea-map/hooks/useClass';

const modules = {};

const TIMEOUT = 2000;

class $Widget extends EventEmitter {
  #isReady = false;
  #props = {};
  #name = '';
  #order = -1;
  #initiate = false;
  #widget = null;
  #expand = null;
  #modulesLoaded = false;
  #clock = null;

  constructor(props) {
    super();

    this.#props = props;
    this.#name = props.name;
    this.#order = props.order || 1;

    if (this.order <= 1) {
      this.#initiate = true;
      return;
    }

    this.#props.$map.on('widget-added', (widget) => {
      if (this.#isReady) return;
      if (this.#order - widget.order === 1) {
        this.#initiate = true;
      }
    });
  }

  get isReady() {
    return this.#isReady && !!this.#widget;
  }

  get widget() {
    return this.#widget;
  }

  get order() {
    return this.#order;
  }

  async loadModules() {
    const $arcgis = __CLIENT__ ? window.$arcgis : null;
    if (__SERVER__ || !$arcgis || !this.#name) return Promise.reject();
    if (!this.#modulesLoaded) {
      const AgWidget = modules[`Ag${this.#name}`];
      modules[`Ag${this.#name}`] =
        AgWidget || (await $arcgis.import(`esri/widgets/${this.#name}`));
      modules.AgExpand = await $arcgis.import('esri/widgets/Expand');
      this.#modulesLoaded = true;
    }
    return Promise.resolve();
  }

  init() {
    const {
      $map,
      expand,
      position = 'top-left',
      ExpandProperties = {},
    } = this.#props;
    const AgWidget = modules[`Ag${this.#name}`];
    const AgExpand = modules.AgExpand;
    if (!this.#modulesLoaded || !$map.isReady) return;
    if (!AgWidget || !AgExpand) {
      throw new Error('$Widget modules not loaded');
    }

    this.#widget = new AgWidget({
      view: $map.view,
      ...(!this.#expand ? { id: this.#name } : {}),
      ...(this.#props || {}),
    });

    if (expand) {
      this.#expand = new AgExpand({
        view: $map.view,
        content: this.#widget,
        id: this.#name,
        mode: 'floating',
        ...ExpandProperties,
      });
    }

    const content = this.#expand || this.#widget;

    $map.view.ui.add(content, position);

    this.#isReady = true;
    this.#initiate = false;

    this.emit('connected');
    $map.emit('widget-added', this);
  }

  connect() {
    clearInterval(this.#clock);
    this.loadModules()
      .then(() => {
        if (this.#order <= 1) {
          this.init();
          return;
        }
        let time = 0;
        this.#clock = setInterval(() => {
          if (time >= TIMEOUT || this.#isReady) {
            clearInterval(this.#clock);
            return;
          }
          time += 50;
          if (!this.#initiate) return;
          clearInterval(this.#clock);
          this.init();
        }, 50);
      })
      .catch(() => {});
  }

  disconnect() {
    if (!this.#isReady) return;
    if (this.#widget) {
      this.#widget.destroy();
    }
    if (this.#expand) {
      this.#expand.destroy();
    }
    this.#widget = null;
    this.#expand = null;
    this.#isReady = false;
    clearInterval(this.#clock);
    this.emit('disconnected');
  }
}

// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Widget.html
function Widget(props) {
  const { $map } = useContext(MapContext);
  const context = useMemo(() => ({ ...props, $map }), [props, $map]);

  const $widget = useClass($Widget, context);

  useEffect(() => {
    if (!$widget) return;

    if ($map.isReady) {
      $widget.connect();
    }

    return () => {
      $widget.disconnect();
    };
  }, [$map, $widget]);

  return null;
}

export default memo(Widget);
