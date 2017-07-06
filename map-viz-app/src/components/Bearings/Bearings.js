import React, {Component} from 'react';
import './Bearings.css';

class Bearings extends Component {
    constructor(props) {
        super(props);
        this.vars = this.props.vars;
        this.info_window = new window
            .google
            .maps
            .InfoWindow();
    }

    plotGeomsOnMap() {
        if (this.vars.markersL.length === 0) {
            return;
        }
        // View Bounds
        var vbounds = new window
            .google
            .maps
            .LatLngBounds();
        for (var ind = 0; ind < this.vars.markersL.length; ind++) {
            vbounds.extend(this.vars.markersL[ind].getPosition());
        }
        this
            .props
            .googlemaps
            .fitBounds(vbounds);

        // Plot Markers
        for (ind = 0; ind < this.vars.markersL.length; ind++) {
            this
                .vars
                .markersL[ind]
                .setMap(this.props.googlemaps);
        }
    }

    parseAndPlotNewPoints() {
        // Now parse the new points from textarea
        var points = this
            .vars
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
            this
                .info_window
                .setContent(contentString);
            this
                .info_window
                .setPosition(event.latLng);
            this
                .info_window
                .open(this.props.googlemaps);
        }

        // set vars and plot new geoms on map
        this.vars.markersL = markersL;
        this.plotGeomsOnMap();
    }

    renderNewPoints() {
        this.removeGeomsFromMap();
        // clear the geoms
        this.vars.markersL = [];
        this.parseAndPlotNewPoints();
    }

    removeGeomsFromMap() {
        // Remove currently plotted Markers from map

        if (this.info_window !== null) {
            this
                .info_window
                .close();
        }

        for (var ind = 0; ind < this.vars.markersL.length; ind++) {
            this
                .vars
                .markersL[ind]
                .setMap(null);
        }
    }

    updateInputValue(evt) {
        this.vars.pointsTxt = evt.target.value;
    }

    componentDidMount() {
        this.plotGeomsOnMap();
    }

    componentWillUnmount() {
        this.removeGeomsFromMap();
    }

    render() {
        return (
            <div className="Bearings-Div">
                <h4>Lat,Lng,Bearing</h4>
                <textarea
                    rows="10"
                    cols="32"
                    defaultValue={this.vars.pointsTxt}
                    onChange={evt => this.updateInputValue(evt)}></textarea>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => this.renderNewPoints()}>plot</button>
                </div>
            </div>
        )

    }
}
export default Bearings;