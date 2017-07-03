import React, {Component} from 'react';
import GeoHashs from './components/GeoHashs/GeoHashs.js';
import Bearings from './components/Bearings/Bearings.js';

class Features extends Component {

    render() {
        return (
            <div>
                <GeoHashs
                    googlemaps={this.props.googlemaps}
                    name="geohashs"
                    feature={this.props.feature}/>
                <Bearings
                    googlemaps={this.props.googlemaps}
                    name="bearings"
                    feature={this.props.feature}/>
            </div>
        );
    }
}

export default Features;