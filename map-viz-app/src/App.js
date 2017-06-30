import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './App.css';
import GeoHashs from './GeoHashs';
import FeaturesNav from './FeaturesNav.js';

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
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhcmdhdmNoaXBwYWRhIiwiYSI6ImNpcjF6ZG90cjAyeXpmcG1nMjlnbGZseHgifQ.7o' +
        'OTXISE23jfe7TVxhM-zg';

    this.state = {
      chosen_map: 'google',
      chosen_feature: 'geohashs',
      google: new window
        .google
        .maps
        .Map(document.getElementById('googlemaps'), {
          zoom: 16,
          center: {
            lat: 12.950488,
            lng: 77.641877
          },
          zoomControl: true
        }),
      mapbox: new mapboxgl.Map({
        container: 'mapboxmaps',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [
          77.641877, 12.950488
        ], // starting position
        zoom: 15, // starting zoom
        interactive: false
      })
    };
  }

  displayMap(mapname) {
    switch (mapname) {
      case "google":
        {
          document
            .getElementById('googlemaps')
            .style
            .display = "block";
          document
            .getElementById('mapboxmaps')
            .style
            .display = "none";
          return;
        }
      case "mapbox":
        {
          document
            .getElementById('googlemaps')
            .style
            .display = "none";
          document
            .getElementById('mapboxmaps')
            .style
            .display = "block";
          var center = this
            .state
            .google
            .getCenter();
          this
            .state
            .mapbox
            .setCenter([
              center.lng(),
              center.lat()
            ]);
          this
            .state
            .mapbox
            .setZoom(this.state.google.zoom - 1);
          return;
        }
      default:
        alert("Invalid mapname!");
    }
  }

  selectMap(mapname) {
    this.setState({chosen_map: mapname});
  }

  selectFeature(feature) {
    this.setState({chosen_feature: feature});
  }

  componentDidMount() {
    ReactDOM.render(
      <FeaturesNav
      feature={this.state.chosen_feature}
      selectFeature={this
      .selectFeature
      .bind(this)}/>, document.getElementById('actionbar'));
  }

  render() {
    this.displayMap(this.state.chosen_map);
    return (
      <div>
        <GeoHashs googlemaps={this.state.google}/>
        <div className="Choose-Map">
          <RadioBtn
            value="google"
            name="maptype"
            text="Google Maps"
            selected={this.state.chosen_map}
            onChange={() => this.selectMap("google")}/>
          <RadioBtn
            value="mapbox"
            name="maptype"
            text="Mapbox Maps"
            selected={this.state.chosen_map}
            onChange={() => this.selectMap("mapbox")}/>
        </div>
      </div>
    );
  }
}
export default App;
