import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import "./test.css";
import "./Header.css";

class test extends Component {
  render() {
    return (
      <div>
        <div className="header">
          <div className="JEBOBADA">JEBOBADA</div>
        </div>
        <div className="flex-container">
            <div className="main_1"></div>
            <div className="main_2"></div>
            <div className="main_3"></div>
        </div>
      </div>
    );
  }
}

export default test;
