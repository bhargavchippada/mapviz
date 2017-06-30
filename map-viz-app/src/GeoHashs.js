import React, {Component} from 'react';
import './GeoHashs.css';
import Geohash from 'latlon-geohash';
import './maplabel.js';

var info_window;
var googlemaps;
class GeoHashs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geohashs: "tdr1wv9\ntdr1wd6",
            plotted_geohashs: []
        }
        info_window = new window
            .google
            .maps
            .InfoWindow();
        googlemaps = props.googlemaps;
    }

    plotGeoHashs() {
        // Now plot the new geohashs
        var geohashs = this
            .state
            .geohashs
            .split("\n");
        var geohashsL = [];
        var vbounds = new window
            .google
            .maps
            .LatLngBounds();
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
                        name: geohashs[index],
                        map: googlemaps
                    });

                geohash.addListener('click', showInfo);

                // Label for the geohash
                var pcenter = Geohash.decode(geohashs[index]);
                var mapLabel = new window.MapLabel({
                    text: geohashs[index],
                    position: new window
                        .google
                        .maps
                        .LatLng(pcenter.lat, pcenter.lon),
                    map: googlemaps,
                    fontSize: 16,
                    strokeWeight: 2
                });

                for (var i = 0; i < paths.length; i++) {
                    vbounds.extend(paths[i]);
                }

                var obj = [];
                obj.push(geohash);
                obj.push(mapLabel);
                geohashsL.push(obj);
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

        this.setState({plotted_geohashs: geohashsL});
        googlemaps.fitBounds(vbounds);
    }

    renderGeoHashs() {
        // Remove currently plotted geohashs
        for (var ind = 0; ind < this.state.plotted_geohashs.length; ind++) {
            this
                .state
                .plotted_geohashs[ind][0]
                .setMap(null);
            this
                .state
                .plotted_geohashs[ind][1]
                .setMap(null);
        }
        this.setState({
            plotted_geohashs: []
        }, this.plotGeoHashs);
    }

    updateInputValue(evt) {
        this.setState({geohashs: evt.target.value});
    }

    render() {
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
                        onClick={() => this.renderGeoHashs()}>plot geohashs</button>
                </div>
            </div>
        )
    }
}
export default GeoHashs;