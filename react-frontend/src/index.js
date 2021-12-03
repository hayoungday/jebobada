import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import Home from './components/Home';
import Header from './components/Header';
// import About from './components/About';
import Upload from './components/Upload';
import Download from './components/Download';
import Analysis from './components/Analysis';

import Oauth from './components/oauth';
import Logout from './components/Logout'
import PostView from './components/PostView'
import CasePage from './components/CasePage'
import test from './components/test'
import Modal from './components/Modal';
import Access_log_modal from './components/Access_log_modal';
import UploadEvidence from './components/UploadEvidence';
import EvidenceEdit from './components/EvidenceEdit'
import makeReport from './report/makeReport'
import printReport from './report/printReport'
import AllEvidence from './report/allEvidence'
import RecordEvidence from "./report/recordEvidence"
import PictureEvidence from "./report/pictureEvidence"
import MainBullying from "./report/MainBullying"
import Overview from './report/Overview'
import Main from './components/Main'
import CheckList from './components/CheckList'
import AboutUs from './components/AboutUs'
import uploadevidence_artifact from './components/UploadEvidence_artifact'
import Editevidence_artifact from './components/Editevidence_artifact'
import BullyingTypePage from './report/BullyingTypePage'
import AttackerTypePage from './report/AttackerTypePage'
import EvidenceDetails from './report/EvidenceDetails';
import EvidenceDetailsEdit from './report/EvidenceDetailsEdit';
import Footer from './components/Footer';

ReactDOM.render(
    // <App />,
    <Router>
      <Route path="/" component={App}>
        <Route exact path="/" component={Header}/>
        <Route exact path="/" component={Home}/>
        <Route exact path="/" component={Footer}/>
        {/* <Route path="/about" component={About}/> */}
        <Route path="/upload/:casenum" component={Upload}/>
        <Route path="/download" component={Download}/>
        <Route path="/analysis" component={Analysis}/>
        <Route path="/oauth" component={Oauth}/>
        <Route path="/logout" component={Logout}/>
        <Route path="/PostView/:casenum?/:no?/:keyword?" component={PostView}/>
        <Route path="/casepage" component={CasePage}/>
        <Route path="/test" component={test}/>
        <Route path="/Modal" component={Modal}/>
        <Route path="/Access_log_modal" component={Access_log_modal}/>
        <Route path="/uploadevidence" component={UploadEvidence}/>
        <Route path="/editevidence" component={EvidenceEdit}/>
        <Route path="/makereport" component={makeReport}/>
        <Route path="/printreport" component={printReport}/>
        <Route path="/allevidence" component={AllEvidence}/>
        <Route path="/recordevidence" component={RecordEvidence}/>
        <Route path="/pictureevidence" component={PictureEvidence}/>
        <Route path="/mainbullying" component={MainBullying}/>
        <Route path="/overview" component={Overview}/>
        <Route path="/main" component={Main}/>
        <Route path="/checklist" component={CheckList}/>
        <Route path="/aboutus" component={AboutUs}/>
        <Route path="/uploadevidence_artifact" component={uploadevidence_artifact}/>
        <Route path="/Editevidence_artifact" component = {Editevidence_artifact}/>
        <Route path="/bullyingtypepage" component={BullyingTypePage}/>
        <Route path="/attackertypepage" component={AttackerTypePage}/>
        <Route path="/evidencedetails" component={EvidenceDetails}/>
        <Route path="/evidencedetailedit" component = {EvidenceDetailsEdit}/>
      </Route>
     </Router>, 
  document.getElementById('root')
);
