import React, { Component } from "react";

import System from "../System/System";
import obj_Visit from "../Model/Visit";
import Visit from "../Component/Visit";


import Comparator from "../Comparator/Comparator";

/**
 * Class to display to a user the dashboard of his/her museum
 * @author Giulio Serra
 */
export default class Visits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      museum: {},
      currentVisit: {},
    };

    this.handleVisitDetails = this.handleVisitDetails.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const museum = newProps.museum;
    if (museum === undefined) {
      return;
    }

    if (!System.prototype.areObjectSame(this.state.museum, newProps.museum)) {
      this.setState({ museum: museum });
    }
  }

  /**
   * Handle the delection of a piece
   * @author Giulio Serra
   */
  handleVisitDetails(e) {
    e.preventDefault();
    const visitID = e.currentTarget.id;
    const visit = System.prototype.getJsonFromKeyValueForm(this.state.museum).visits[visitID];
    console.log({currentVisit:this.state.currentVisit})
    this.setState({currentVisit:{[visitID]:visit}})
  }

  /**
   * Create a table to diplay all the visits of the museum
   * @author Giulio Serra
   */
  createTable() {
    return (
      <div>
        <table
          className="table"
          style={{ objectFit: "cover", marginTop: "30px" }}
        >
          <thead>
            <tr>
              <th scope="col">Begin</th>
              <th scope="col">End</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>{this.createRows()}</tbody>
        </table>
      </div>
    );
  }

  /**
   * Create all the rows in the table
   * @author Giulio Serra
   */
  createRows() {
    let visits = [];
    const current_museum = System.prototype.getJsonFromKeyValueForm(
      this.state.museum
    );

    const sortedVisits = Comparator.prototype.visitsDateComparator(
      current_museum.visits
    );

    for (const visitID in sortedVisits) {
      const currentVisit = sortedVisits[visitID];
      currentVisit.ID = visitID;
      const ob_Visit = new obj_Visit(currentVisit);

      visits.push(
        <tr key={visitID}>
          <th scope="row">{ob_Visit.getBeginningDateDescription()}</th>
          <td>{ob_Visit.getEndDateDescription()}</td>
          <td>
            <button
              id={visitID}
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#visitModal"
              onClick={this.handleVisitDetails}
            >
              <b>Details</b>
            </button>
          </td>
        </tr>
      );
    }

    return visits;
  }

  /**
   * Modal to view the details of a visit
   * @author Giulio Serra
   */
  createVisitModal() {
    return (
      <div
        className="modal fade bd-example-modal-lg"
        id="visitModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Visit Details
              </h5>

              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body"><Visit currentVisit={this.state.currentVisit} museum={this.state.museum}/></div>
            <div className="modal-footer">
              <button
                type="button"
                id="btn_close_modal"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {this.createVisitModal()}
        {this.createTable()}
      </div>
    );
  }
}
