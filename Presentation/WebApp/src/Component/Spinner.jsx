import React, { Component } from 'react';

export default class Spinner extends Component {

    render (){
        return(
        <div className="d-flex justify-content-center">  
                <div className="spinner-border text-primary m-5" role="status" >
        <span className="sr-only">Loading...</span>
      </div></div>);
    }
}