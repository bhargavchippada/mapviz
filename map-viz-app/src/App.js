import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';

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
      google: new window
        .google
        .maps
        .Map(document.getElementById('googlemaps'), {
          zoom: 14,
          center: {
            lat: 12.950488,
            lng: 77.641877
          }
        }),
      mapbox: new mapboxgl.Map({
        container: 'mapboxmaps',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [
          77.641877, 12.950488
        ], // starting position
        zoom: 14 // starting zoom
      })
    };
  }

  selectMap(mapname) {
    this.setState({chosen_map: mapname});
  }

  render() {
    return (
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
    );
  }
}
export default App;
