import React, { createRef } from 'react';
import classNames from 'classnames';
import { loadModules, loadCss } from 'esri-loader';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { useIntl } from 'react-intl';
// import BasemapWidget from './BasemapWidget';
// import MeasurementWidget from './MeasurementWidget';
// import PrintWidget from './PrintWidget';
// import AreaWidget from './AreaWidget';
// import ScaleWidget from './ScaleWidget';
// import LegendWidget from './LegendWidget';
// import InfoWidget from './InfoWidget';
// import MenuWidget from './MenuWidget';

//import "isomorphic-fetch";  <-- Necessary to use fetch?
var Map, MapView, Zoom, intl;

class MapViewer extends React.Component {
  /**
   * This method does the creation of the main component
   * @param {*} props
   */
  constructor(props) {
    super(props);
    //we create a reference to the DOM element that will
    //be later mounted. We will use the reference that we
    //create here to reference the DOM element from javascript
    //code, for example, to create later a MapView component
    //that will use the map div to show the map
    this.mapdiv = createRef();
    this.mapCfg = props.cfg.Map;
    this.compCfg = this.props.cfg.Components;
    this.url = this.props.cfg.url || ''; // Get url or default
    this.map = null;
    this.id = props.id;
    this.mapClass = classNames('map-container', {
      [`${props.customClass}`]: props.customClass || null,
    });
    this.state = {};
  }

  updateArea(shared_value) {
    this.mapViewer.setState({ area: shared_value });
  }

  loader() {
    return loadModules([
      'esri/WebMap',
      'esri/views/MapView',
      'esri/widgets/Zoom',
      'esri/intl',
    ]).then(([_Map, _MapView, _Zoom, _intl]) => {
      [Map, MapView, Zoom, intl] = [_Map, _MapView, _Zoom, _intl];
    });
  }

  /**
   * Once the component has been mounted in the screen, this method
   * will be executed, so we can access to the DOM elements, since
   * they are already mounted
   */
  async componentDidMount() {
    loadCss();
    await this.loader();

    // this.mapdiv.current is the reference to the current DOM element of
    // this.mapdiv after it was mounted by the render() method
    this.map = new Map({
      basemap: 'topo',
      portalItem: {
        // autocasts as new PortalItem()
        id: this.id,
      },
    });
    this.view = new MapView({
      container: this.mapdiv.current,
      map: this.map,
      center: this.mapCfg.center,
      zoom: this.mapCfg.zoom,
      constraints: {
        minZoom: this.mapCfg.minZoom,
        maxZoom: this.mapCfg.maxZoom,
      },
      ui: {
        components: ['attribution'],
      },
    });
    this.zoom = new Zoom({
      view: this.view,
    });
    this.view.ui.add(this.zoom, {
      position: 'top-right',
    });
    this.view.popup.autoOpenEnabled = false;
    // After launching the MapViewerConfig action
    // we will have stored the json response here:
    // this.props.mapviewer_config
    // this.props.MapViewerConfig(flattenToAppURL(this.props.url));
    //Once we have created the MapView, we need to ensure that the map div
    //is refreshed in order to show the map on it. To do so, we need to
    //trigger the renderization again, and to trigger the renderization
    //we invoke the setState method, that changes the state and forces a
    //react component to render itself again
    //this.setState({});
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.id !== this.props.id) {
      this.setState({});
    }
  }

  setActiveWidget(widget) {
    if (!widget) {
      this.activeWidget = null;
      return;
    }
    if (this.activeWidget === widget) return;
    this.closeActiveWidget();
    this.activeWidget = widget;
  }
  closeActiveWidget() {
    if (this.activeWidget) {
      this.activeWidget.openMenu();
      this.activeWidget = null;
    }
  }

  /**
   * This method renders the map viewer, invoking if necessary the methods
   * to render the other widgets to display
   * @returns jsx
   */
  render() {
    // we use a reference (ref={this.mapdiv}) in order to reference a
    // DOM element to be mounted (but not yet mounted)
    return (
      <div className={this.mapClass}>
        <div
          style={{
            height: this.props.height ? `${this.props.height}px` : 'auto',
          }}
          ref={this.mapdiv}
          className="map"
        >
          {/* {this.appLanguage()}
          {this.renderBasemap()}
          {this.renderLegend()}
          {this.renderMeasurement()}
          {this.renderPrint()}
          {this.renderArea()}
          {this.renderScale()}
          {this.renderInfo()}
          {this.renderMenu()} */}
        </div>
      </div>
    );
  }
}

export default compose(connect((state, props) => ({}), {}))(MapViewer);
