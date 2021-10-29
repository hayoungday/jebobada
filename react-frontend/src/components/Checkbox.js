import React, { Component, useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'
import axios from 'axios'
import Header from "./Header";
import "./Agree.css";
 

const Checkbox = (props) => {
    const [checked, setChecked] = useState(false);

    const toggleCheckboxChange = () => {
        const handleCheckboxChange = props.handleCheckboxChange
        const label = props.label

        setChecked(!checked)
        handleCheckboxChange(label)
    }
    
    return(
        <div>
            {console.log("호출됨")}
            <label>
                <input type="checkbox" value={props.label} checked={checked} onChange={toggleCheckboxChange}/>
            </label>
        </div>
    );
}
export default Checkbox;