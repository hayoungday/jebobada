import React, {Component} from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import "./fonts/font.css";

class App extends Component {
    render() {
        return (
            <div>
                <Header/>   
                <div>
                  <Home/>
                </div>  
                <Footer/>              
            </div>
        );
    }
}

export default App;