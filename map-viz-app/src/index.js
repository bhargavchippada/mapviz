import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import HealthCheck from './HealthCheck';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route} from 'react-router-dom';
require('bootstrap/dist/css/bootstrap.min.css');

ReactDOM.render(
    <Router>
    <div>
        <Route path="/health_check" component={HealthCheck}/>
        <Route exact path="/" component={App}/>
    </div>
</Router>, document.getElementById('root'));
registerServiceWorker();
