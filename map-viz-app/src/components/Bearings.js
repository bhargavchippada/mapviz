import React, {Component} from 'react';
import './Bearings.css';

var info_window;
var googlemaps;
class Bearings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pointsTxt: "12.946077,77.647268,0\n12.951380,77.639756,180",
            markersL: []
        }
        info_window = new window
            .google
            .maps
            .InfoWindow();
        googlemaps = props.googlemaps;
    }

    plotGeomsOnMap() {
        if (this.state.markersL.length === 0) {
            return;
        }
        // View Bounds
        var vbounds = new window
            .google
            .maps
            .LatLngBounds();
        for (var ind = 0; ind < this.state.markersL.length; ind++) {
            vbounds.extend(this.state.markersL[ind].getPosition());
        }
        googlemaps.fitBounds(vbounds);

        // Plot Markers
        for (var ind = 0; ind < this.state.markersL.length; ind++) {
            this
                .state
                .markersL[ind]
                .setMap(googlemaps);
        }
    }

    parseAndPlotNewPoints() {
        // Now parse the new points from textarea
        var points = this
            .state
            .pointsTxt
            .split("\n");

        var markersL = [];
        for (var index = 0; index < points.length; index++) {
            try {
                var point = points[index].split(",");
                var lat = parseFloat(point[0]);
                var lng = parseFloat(point[1]);
                var bearing = null;
                if (point.length >= 3) {
                    bearing = parseFloat(point[2]);
                }

                var position = new window
                    .google
                    .maps
                    .LatLng(lat, lng);

                var icon = null;
                if (bearing != null) {
                    icon = {
                        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 4,
                        rotation: bearing
                    };
                }

                var marker = new window
                    .google
                    .maps
                    .Marker({position: position, title: points[index], icon: icon});

                marker.addListener('click', showInfo);

                markersL.push(marker);
            } catch (e) {
                alert('An error has occurred: ' + e.message);
            }
        }

        function showInfo(event) {
            var contentString = '<b>' + this.title + '</b>';
            info_window.setContent(contentString);
            info_window.setPosition(event.latLng);
            info_window.open(googlemaps);
        }

        // set state and plot new geoms on map
        this.setState({
            markersL: markersL
        }, this.plotGeomsOnMap);
    }

    renderNewPoints() {
        this.removeGeomsFromMap();
        // clear the geoms from state
        this.setState({
            markersL: []
        }, this.parseAndPlotNewPoints);
    }

    removeGeomsFromMap() {
        // Remove currently plotted Markers from map

        if (info_window !== null) {
            info_window.close();
        }

        for (var ind = 0; ind < this.state.markersL.length; ind++) {
            this
                .state
                .markersL[ind]
                .setMap(null);
        }
    }

    updateInputValue(evt) {
        this.state.pointsTxt = evt.target.value;
    }

    render() {
        if (this.props.name === this.props.feature) {
            this.plotGeomsOnMap();
            return (
                <div className="Bearings-Div">
                    <h4>Lat,Lng,Bearing</h4>
                    <textarea
                        rows="10"
                        cols="32"
                        defaultValue={this.state.pointsTxt}
                        onChange={evt => this.updateInputValue(evt)}></textarea>
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => this.renderNewPoints()}>plot</button>
                    </div>
                </div>
            )
        } else {
            this.removeGeomsFromMap();
            return null;
        }

    }
}
export default Bearings;