import React, {Component} from 'react';
import GeoHashs from './components/GeoHashs/GeoHashs.js';
import Bearings from './components/Bearings/Bearings.js';

class Features extends Component {

    constructor(props) {
        super(props);

        this.geohashs_vars = {
            geohashs: "tdr1wv9\ntdr1wd6",
            geohashsL: [],
            geohashLabelsL: []
        };

        this.bearings_vars = {
            pointsTxt: "12.946077,77.647268,0\n12.951380,77.639756,180",
            markersL: []
        };
    }

    updateState(name, state) {
        switch (name) {
            default:
                alert("STATE: Invalid Component Name!");
        }
    }

    render() {
        return (
            <div>
                {this.props.feature === "geohashs"
                    ? <GeoHashs vars={this.geohashs_vars} googlemaps={this.props.googlemaps}/>
                    : null}
                {this.props.feature === "bearings"
                    ? <Bearings vars={this.bearings_vars} googlemaps={this.props.googlemaps}/>
                    : null}
            </div>
        );
    }
}

export default Features;