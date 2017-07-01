import React, {Component} from 'react';

class FeaturesNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feature: props.feature
        };
    }

    featureClassName(feature) {
        if (this.state.feature === feature) {
            return "active";
        } else {
            return "";
        }
    }

    selectFeature(feature) {
        if (this.state.feature !== feature) {
            this
                .props
                .selectFeature(feature);
            this.setState({feature: feature});
        }
    }

    actionTab(feature, featureTxt) {
        return (
            <li
                className={this.featureClassName(feature)}
                onClick={() => this.selectFeature(feature)}>
                <a href="#">{featureTxt}</a>
            </li>
        )
    }

    render() {
        return (
            <ul className="nav nav-tabs">
                {this.actionTab("geohashs", "GeoHashs")}
                {this.actionTab("vectors", "Vectors")}
            </ul>
        );
    }
}

export default FeaturesNav;