import React, {Component} from 'react';
import GeoHashs from './components/GeoHashs/GeoHashs.js';
import Bearings from './components/Bearings/Bearings.js';

class Features extends Component {

    constructor(props) {
        super(props);
        this.state = {
            geohashs_state: {
                geohashs: "tdr1wv9\ntdr1wd6",
                geohashsL: [],
                geohashLabelsL: []
            },
            bearings_state: {
                pointsTxt: "12.946077,77.647268,0\n12.951380,77.639756,180",
                markersL: []
            }
        }
    }

    updateState(name, state) {
        switch (name) {
            case "geohashs":
                this.state.geohashs_state = state;
                return;
            case "bearings":
                this.state.bearings_state = state;
                return;
            default:
                alert("Invalid Component Name!");
        }
    }

    render() {
        return (
            <div>
                {this.props.feature === "geohashs"
                    ? <GeoHashs
                            name="geohashs"
                            updateState={this
                            .updateState
                            .bind(this)}
                            state={this.state.geohashs_state}
                            googlemaps={this.props.googlemaps}/>
                    : null}
                {this.props.feature === "bearings"
                    ? <Bearings
                            name="bearings"
                            updateState={this
                            .updateState
                            .bind(this)}
                            state={this.state.bearings_state}
                            googlemaps={this.props.googlemaps}/>
                    : null}
            </div>
        );
    }
}

export default Features;