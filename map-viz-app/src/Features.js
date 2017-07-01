import React, {Component} from 'react';
import GeoHashs from './components/GeoHashs.js';

class Features extends Component {

    render() {
        return (<GeoHashs
            googlemaps={this.props.googlemaps}
            name="geohashs"
            feature={this.props.feature}/>);
    }
}

export default Features;