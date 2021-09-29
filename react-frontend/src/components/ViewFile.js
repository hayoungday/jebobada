import React, { Component } from 'react';

class ViewFile extends Component {
    render() {
        return (
            <div>
                <h1>{this.props.name}</h1>
                {this.props.text}
            </div>
        );
    }
}

export default ViewFile;