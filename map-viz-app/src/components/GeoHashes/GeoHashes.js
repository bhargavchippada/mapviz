import React, {Component} from 'react';
import './GeoHashes.css';
import Geohash from 'latlon-geohash';
import '../../libraries/maplabel.js';

class GeoHashes extends Component {
    constructor(props) {
        super(props);
        this.vars = this.props.vars;
        this.info_window = new window
            .google
            .maps
            .InfoWindow();
    }

    plotGeomsOnMap() {
        if (this.vars.geohashesL.length === 0) {
            return;
        }
        // View Bounds
        var vbounds = new window
            .google
            .maps
            .LatLngBounds();
        for (var ind = 0; ind < this.vars.geohashesL.length; ind++) {
            var path = this
                .vars
                .geohashesL[ind]
                .getPath();
            for (var i = 0; i < path.getLength(); i++) {
                vbounds.extend(path.getAt(i));
            }
        }
        this
            .props
            .googlemaps
            .fitBounds(vbounds);

        // Plot GeoHashes
        for (ind = 0; ind < this.vars.geohashesL.length; ind++) {
            this
                .vars
                .geohashesL[ind]
                .setMap(this.props.googlemaps);
        }

        // Plot GeoHashes Labels
        for (ind = 0; ind < this.vars.geohashLabelsL.length; ind++) {
            this
                .vars
                .geohashLabelsL[ind]
                .setMap(this.props.googlemaps);
        }
    }

    parseAndPlotNewGeoHashes() {
        // Now parse the new geohashes from textarea
        var geohashes = this
            .vars
            .geohashes
            .split("\n");

        var geohashesL = [];
        var geohashLabelsL = [];
        for (var index = 0; index < geohashes.length; index++) {
            try {
                var gbounds = Geohash.bounds(geohashes[index]);
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
                        name: geohashes[index]
                    });

                geohash.addListener('click', showInfo);

                // Label for the geohash
                var pcenter = Geohash.decode(geohashes[index]);
                var geohashLabel = new window.MapLabel({
                    text: geohashes[index],
                    position: new window
                        .google
                        .maps
                        .LatLng(pcenter.lat, pcenter.lon),
                    fontSize: 16,
                    strokeWeight: 2
                });

                geohashesL.push(geohash);
                geohashLabelsL.push(geohashLabel);
            } catch (e) {
                alert('An error has occurred: ' + e.message);
            }
        }

        function showInfo(event) {
            var contentString = '<b>' + this.name + '</b>';
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
        this.vars.geohashesL = geohashesL;
        this.vars.geohashLabelsL = geohashLabelsL;
        this.plotGeomsOnMap();
    }

    renderNewGeoHashes() {
        this.removeGeomsFromMap();
        // clear the geoms
        this.vars.geohashesL = [];
        this.vars.geohashLabelsL = [];
        this.parseAndPlotNewGeoHashes();
    }

    removeGeomsFromMap() {
        // Remove currently plotted geohashes from map

        if (this.info_window !== null) {
            this
                .info_window
                .close();
        }
        for (var ind = 0; ind < this.vars.geohashesL.length; ind++) {
            this
                .vars
                .geohashesL[ind]
                .setMap(null);
        }

        for (ind = 0; ind < this.vars.geohashLabelsL.length; ind++) {
            this
                .vars
                .geohashLabelsL[ind]
                .setMap(null);
        }
    }

    updateInputValue(evt) {
        this.vars.geohashes = evt.target.value;
    }

    componentDidMount() {
        this.plotGeomsOnMap();
    }

    componentWillUnmount() {
        this.removeGeomsFromMap();
    }

    render() {
        return (
            <div className="GeoHashes-Div">
                <h4>GeoHashes</h4>
                <textarea
                    rows="10"
                    cols="16"
                    defaultValue={this.vars.geohashes}
                    onChange={evt => this.updateInputValue(evt)}></textarea>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => this.renderNewGeoHashes()}>plot geohashes</button>
                </div>
            </div>
        )
    }
}
export default GeoHashes;