import React, { Component } from 'react';

class SearchBox extends Component {
    render() {
        return (
            <div>
                <input 
                className="search"
                type="search"
                placeholder="키워드"
                onChange={this.props.handleChange}
                />
    
            </div>
            
            
        );
    }
}

export default SearchBox;