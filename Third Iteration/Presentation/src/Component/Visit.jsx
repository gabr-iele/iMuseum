import React, { Component } from "react";

import VisitGraph from "../Component/VisitGraph";

import obj_Visit from "../Model/Visit";
import obj_Transit from "../Model/Transit";

import System from "../System/System";

/**
 * Class to display to a user the dashboard of his/her museum
 * @author Giulio Serra
 */
export default class Visit extends Component {

  /**
   * Create a table to diplay all the transit in a visit
   * @author Giulio Serra
   * @param {Object} transits [Transists to display in the visit]
   */
  createTable(transits) {

    if(transits === null || transits === undefined){return <div></div>}

    return (
      <div>
        <table
          className="table"
          style={{ objectFit: "cover", marginTop: "30px" }}
        >
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Piece</th>
            </tr>
          </thead>
          <tbody>{this.createRows(transits)}</tbody>
        </table>
      </div>
    );
  }

  /**
   * Create all the rows in the table
   * @author Giulio Serra
   */
  createRows(transits) {

    let rows = [];
  
    for (const transitID in transits) {
      
      let j_transit = transits[transitID];
      j_transit.ID = transitID;

      const obj_transit  = new obj_Transit(j_transit);
      const wrapper = obj_transit.getWrapper();

      rows.push(
        <tr id={transitID} key={transitID}>
          <th scope="row">{wrapper.time}</th>
          <td>{wrapper.pieceName}</td>
        </tr>
      );
    }

    return rows;
  }


  render() {

    let currentVisit = System.prototype.getJsonFromKeyValueForm(this.props.currentVisit);
    currentVisit.parent = this.props.museum;

    const visit = new obj_Visit(currentVisit);
    const transits = visit.getSortedTransits();
  
    return (
      <div style={{overflow:"hidden"}}> 
        <div className="row">
          <div className="col">
              {this.createTable(transits)}
          </div>
          <div className="col">
              <VisitGraph transits={transits}/>
          </div>
        </div>
      </div>
    );
  }
}
