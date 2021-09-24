import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import Home from './components/Home';
import Header from './components/Header';
import About from './components/About';
import Upload from './components/Upload';
import Download from './components/Download';
import Faq from './components/Faq';
import Login from './components/Login';
import Signup from './components/signup';
import Oauth from './components/oauth';

ReactDOM.render(
    // <App />,
    <Router>
      <Route path="/" component={App}>
        <Route exact path="/" component={Header}/>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/upload" component={Upload}/>
        <Route path="/download" component={Download}/>
        <Route path="/faq" component={Faq}/>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/oauth" component={Oauth}/>
      </Route>
     </Router>, 
  document.getElementById('root')
);
