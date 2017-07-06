import React, {Component} from 'react';
import './GeoHashs.css';
import Geohash from 'latlon-geohash';
import '../../libraries/maplabel.js';

class GeoHashs extends Component {
    constructor(props) {
        super(props);
        this.vars = this.props.vars;
        this.info_window = new window
            .google
            .maps
            .InfoWindow();
    }

    plotGeomsOnMap() {
        if (this.vars.geohashsL.length === 0) {
            return;
        }
        // View Bounds
        var vbounds = new window
            .google
            .maps
            .LatLngBounds();
        for (var ind = 0; ind < this.vars.geohashsL.length; ind++) {
            var path = this
                .vars
                .geohashsL[ind]
                .getPath();
            for (var i = 0; i < path.getLength(); i++) {
                vbounds.extend(path.getAt(i));
            }
        }
        this
            .props
            .googlemaps
            .fitBounds(vbounds);

        // Plot Geohashs
        for (ind = 0; ind < this.vars.geohashsL.length; ind++) {
            this
                .vars
                .geohashsL[ind]
                .setMap(this.props.googlemaps);
        }

        // Plot Geohashs Labels
        for (ind = 0; ind < this.vars.geohashLabelsL.length; ind++) {
            this
                .vars
                .geohashLabelsL[ind]
                .setMap(this.props.googlemaps);
        }
    }

    parseAndPlotNewGeoHashs() {
        // Now parse the new geohashs from textarea
        var geohashs = this
            .vars
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
        this.vars.geohashsL = geohashsL;
        this.vars.geohashLabelsL = geohashLabelsL;
        this.plotGeomsOnMap();
    }

    renderNewGeoHashs() {
        this.removeGeomsFromMap();
        // clear the geoms
        this.vars.geohashsL = [];
        this.vars.geohashLabelsL = [];
        this.parseAndPlotNewGeoHashs();
    }

    removeGeomsFromMap() {
        // Remove currently plotted geohashs from map

        if (this.info_window !== null) {
            this
                .info_window
                .close();
        }
        for (var ind = 0; ind < this.vars.geohashsL.length; ind++) {
            this
                .vars
                .geohashsL[ind]
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
        this.vars.geohashs = evt.target.value;
    }

    componentDidMount() {
        this.plotGeomsOnMap();
    }

    componentWillUnmount() {
        this.removeGeomsFromMap();
    }

    render() {
        return (
            <div className="GeoHashs-Div">
                <h4>Geohashs</h4>
                <textarea
                    rows="10"
                    cols="16"
                    defaultValue={this.vars.geohashs}
                    onChange={evt => this.updateInputValue(evt)}></textarea>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => this.renderNewGeoHashs()}>plot geohashs</button>
                </div>
            </div>
        )
    }
}
export default GeoHashs;