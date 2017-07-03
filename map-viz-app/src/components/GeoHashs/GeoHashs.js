import React, {Component} from 'react';
import './GeoHashs.css';
import Geohash from 'latlon-geohash';
import '../../libraries/maplabel.js';

var info_window;
var googlemaps;
class GeoHashs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geohashs: "tdr1wv9\ntdr1wd6",
            geohashsL: [],
            geohashLabelsL: []
        }
        info_window = new window
            .google
            .maps
            .InfoWindow();
        googlemaps = props.googlemaps;
    }

    plotGeomsOnMap() {
        if (this.state.geohashsL.length === 0) {
            return;
        }
        // View Bounds
        var vbounds = new window
            .google
            .maps
            .LatLngBounds();
        for (var ind = 0; ind < this.state.geohashsL.length; ind++) {
            var path = this
                .state
                .geohashsL[ind]
                .getPath();
            for (var i = 0; i < path.getLength(); i++) {
                vbounds.extend(path.getAt(i));
            }
        }
        googlemaps.fitBounds(vbounds);

        // Plot Geohashs
        for (var ind = 0; ind < this.state.geohashsL.length; ind++) {
            this
                .state
                .geohashsL[ind]
                .setMap(googlemaps);
        }

        // Plot Geohashs Labels
        for (var ind = 0; ind < this.state.geohashLabelsL.length; ind++) {
            this
                .state
                .geohashLabelsL[ind]
                .setMap(googlemaps);
        }
    }

    parseAndPlotNewGeoHashs() {
        // Now parse the new geohashs from textarea
        var geohashs = this
            .state
            .geohashs
            .split("\n");

        var geohashsL = [];
        var geohashLabelsL = [];
        for (var index = 0; index < geohashs.length; index++) {
            try {
                var gbounds = Geohash.bounds(geohashs[index]);
                var paths = [
                    new window
                        .google
                        .maps
                        .LatLng(gbounds.sw.lat, gbounds.sw.lon),
                    new window
                        .google
                        .maps
                        .LatLng(gbounds.sw.lat, gbounds.ne.lon),
                    new window
                        .google
                        .maps
                        .LatLng(gbounds.ne.lat, gbounds.ne.lon),
                    new window
                        .google
                        .maps
                        .LatLng(gbounds.ne.lat, gbounds.sw.lon),
                    new window
                        .google
                        .maps
                        .LatLng(gbounds.sw.lat, gbounds.sw.lon)
                ];

                var geohash = new window
                    .google
                    .maps
                    .Polygon({
                        paths: paths,
                        strokeColor: '#FFA500',
                        strokeOpacity: 0.9,
                        strokeWeight: 1,
                        fillColor: '#FFA500',
                        fillOpacity: 0.4,
                        name: geohashs[index]
                    });

                geohash.addListener('click', showInfo);

                // Label for the geohash
                var pcenter = Geohash.decode(geohashs[index]);
                var geohashLabel = new window.MapLabel({
                    text: geohashs[index],
                    position: new window
                        .google
                        .maps
                        .LatLng(pcenter.lat, pcenter.lon),
                    fontSize: 16,
                    strokeWeight: 2
                });

                geohashsL.push(geohash);
                geohashLabelsL.push(geohashLabel);
            } catch (e) {
                alert('An error has occurred: ' + e.message);
            }
        }

        function showInfo(event) {
            var contentString = '<b>' + this.name + '</b>';
            info_window.setContent(contentString);
            info_window.setPosition(event.latLng);
            info_window.open(googlemaps);
        }

        // set state and plot new geoms on map
        this.setState({
            geohashsL: geohashsL,
            geohashLabelsL: geohashLabelsL
        }, this.plotGeomsOnMap);
    }

    renderNewGeoHashs() {
        this.removeGeomsFromMap();
        // clear the geoms from state
        this.setState({
            geohashsL: [],
            geohashLabelsL: []
        }, this.parseAndPlotNewGeoHashs);
    }

    removeGeomsFromMap() {
        // Remove currently plotted geohashs from map

        if (info_window !== null) {
            info_window.close();
        }

        for (var ind = 0; ind < this.state.geohashsL.length; ind++) {
            this
                .state
                .geohashsL[ind]
                .setMap(null);
        }

        for (var ind = 0; ind < this.state.geohashLabelsL.length; ind++) {
            this
                .state
                .geohashLabelsL[ind]
                .setMap(null);
        }
    }

    updateInputValue(evt) {
        this.state.geohashs = evt.target.value;
    }

    render() {
        if (this.props.name === this.props.feature) {
            this.plotGeomsOnMap();
            return (
                <div className="GeoHashs-Div">
                    <h4>Geohashs</h4>
                    <textarea
                        rows="10"
                        cols="16"
                        defaultValue={this.state.geohashs}
                        onChange={evt => this.updateInputValue(evt)}></textarea>
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => this.renderNewGeoHashs()}>plot geohashs</button>
                    </div>
                </div>
            )
        } else {
            this.removeGeomsFromMap();
            return null;
        }

    }
}
export default GeoHashs;