import React, {Component} from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';


class App extends Component {
    render() {
        return (
            <div>
                <Header/>   
                <div>
                  <Home/>
                </div>                
            </div>
        );
    }
}

export default App;