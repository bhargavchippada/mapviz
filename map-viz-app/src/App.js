import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './App.css';
import FeaturesNav from './FeaturesNav.js';
import Features from './Features.js';

function RadioBtn(props) {
  return (
    <div>
      <input
        type="radio"
        value={props.value}
        name={props.name}
        checked={props.selected === props.value}
        onChange={() => props.onChange()}/> {props.text}
    </div>
  );
}

class App extends Component {

  constructor(props) {
    super(props);

    this.center = [77.641877, 12.950488];
    this.zoom = 15;
    this.google = null;
    this.mapbox = null;

    this.state = {
      chosen_feature: 'geohashes',
      chosen_map: 'google'
    };
  }

  hideMapLayers() {
    document
      .getElementById('googlemaps')
      .style
      .display = "none";
    document
      .getElementById('mapboxmaps')
      .style
      .display = "none";
  }

  getCenterAndZoom() {
    if (this.google != null) {
      var center = this
        .google
        .getCenter();
      this.center = [
        center.lng(),
        center.lat()
      ];
      this.zoom = this.google.zoom;
    }
  }

  renderGoogle() {
    document
      .getElementById('googlemaps')
      .style
      .display = "block";
    if (this.google == null) {
      this.google = new window
        .google
        .maps
        .Map(document.getElementById('googlemaps'), {
          zoom: this.zoom,
          center: {
            lat: this.center[1],
            lng: this.center[0]
          },
          zoomControl: true
        });
    }
  }

  renderMapbox() {
    document
      .getElementById('mapboxmaps')
      .style
      .display = "block";
    if (this.mapbox == null) {
      mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhcmdhdmNoaXBwYWRhIiwiYSI6ImNpcjF6ZG90cjAyeXpmcG1nMjlnbGZseHgifQ.7o' +
          'OTXISE23jfe7TVxhM-zg';
      this.mapbox = new mapboxgl.Map({
        container: 'mapboxmaps',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: this.center,
        zoom: this.zoom - 1,
        interactive: false
      });
    }
    this
      .mapbox
      .setCenter(this.center);
    this
      .mapbox
      .setZoom(this.google.zoom - 1);
  }

  displayMap(mapname) {
    switch (mapname) {
      case "google":
        {
          this.getCenterAndZoom();
          this.hideMapLayers();
          this.renderGoogle();
          return;
        }
      case "mapbox":
        {
          this.getCenterAndZoom();
          this.hideMapLayers();
          this.renderMapbox();
          return;
        }
      default:
        alert("Invalid mapname!");
    }
  }

  chooseMap(mapname) {
    this.setState({chosen_map: mapname});
    this.displayMap(mapname);
  }

  selectFeature(feature) {
    this.setState({chosen_feature: feature});
  }

  componentDidMount() {
    this.displayMap(this.state.chosen_map);
    ReactDOM.render(
      <FeaturesNav
      feature={this.state.chosen_feature}
      selectFeature={this
      .selectFeature
      .bind(this)}/>, document.getElementById('actionbar'));
  }

  render() {
    return (
      <div>
        <Features googlemaps={this.google} feature={this.state.chosen_feature}/>
        <div className="Choose-Map">
          <RadioBtn
            value="google"
            name="maptype"
            text="Google Maps"
            selected={this.state.chosen_map}
            onChange={() => this.chooseMap("google")}/>
          <RadioBtn
            value="mapbox"
            name="maptype"
            text="Mapbox Maps"
            selected={this.state.chosen_map}
            onChange={() => this.chooseMap("mapbox")}/>
        </div>
      </div>
    );
  }
}
export default App;
