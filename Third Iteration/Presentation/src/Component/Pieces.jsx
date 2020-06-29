import React, { Component } from "react";
import System from "../System/System";

import Piece from "../Component/Piece";

import obj_Piece from "../Model/Piece";
import Museum from "../Model/Museum";

/**
 * Class to display to a user the dashboard of his/her museum
 * @author Giulio Serra
 */
export default class Pieces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      museum: {},
      newPiece: {},
    };

    this.handlePieceCreation = this.handlePieceCreation.bind(this);
    this.handleUploadImmageRequest = this.handleUploadImmageRequest.bind(this);
    this.handlePieceDelection = this.handlePieceDelection.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
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
  handlePieceDelection(e) {
    e.preventDefault();
    const pieceID = e.currentTarget.id;

    const current_museum = new Museum(
      System.prototype.getJsonFromKeyValueForm(this.state.museum)
    );
    current_museum
      .deletePieceAsync(pieceID)
      .then((response) => {
       
        const status = response.data.code;
        if(status === "200"){
          let museum =  System.prototype.getJsonFromKeyValueForm(this.state.museum)
          const remaining_pieces = response.data.pieces;
          museum.pieces = remaining_pieces;
          this.setState({museum:{[museum.ID]:museum},newPiece:{}});

        }else{
          alert(response.data.message)
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  /**
   * Create a table to diplay all the pieces of the museum
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
              <th scope="col">Name</th>
              <th scope="col">Attendance</th>
              <th scope="col">Sensor Status</th>
              <th scope="col">Battery Level</th>
              <th scope="col">Options</th>
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
    let pieces = [];
    const current_museum = System.prototype.getJsonFromKeyValueForm(
      this.state.museum
    );

    for (const pieceID in current_museum.pieces) {
      const piece = current_museum.pieces[pieceID];
      piece.ID = pieceID;
      const obj_piece = new obj_Piece(piece);
      const wrapper = obj_piece.getSensorDescription();

      pieces.push(
        <tr id={pieceID} key={pieceID}>
          <th scope="row">{wrapper.title}</th>
          <td>{wrapper.attendance}</td>
          <td>{wrapper.sensorStatus}</td>
          <td>{wrapper.battery}</td>
          <td>
            <button
              id={pieceID}
              className="btn btn-danger"
              onClick={this.handlePieceDelection}
            >
              <b>Delete</b>
            </button>
          </td>
        </tr>
      );
    }

    return pieces;
  }

  /**
   * Modal to create a new piece
   * @author Giulio Serra
   */
  createPieceModal() {
    return (
      <div
        className="modal fade"
        id="pieceModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                New Piece
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
            <div className="modal-body">
              <Piece
                newPiece={this.state.newPiece}
                handleUploadImmageRequest={this.handleUploadImmageRequest}
                handleTextInput={this.handleTextInput}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btn_close_modal"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handlePieceCreation}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Handle the creation of a new piece
   * @author Giulio Serra
   */
  handlePieceCreation(e) {
    let newPiece = this.state.newPiece;
    newPiece.museumID = System.prototype.getJsonFromKeyValueForm(
      this.state.museum
    ).ID;

    const new_Piece = new obj_Piece(newPiece);
    const validation = new_Piece.validate(newPiece);

    if (validation.code !== "200") {
      alert(validation.message);
      return;
    }

    new_Piece
      .postAsync(newPiece)
      .then((response) => {
       
        const status = response.data.code;
        if(status === "200"){
          let museum =  System.prototype.getJsonFromKeyValueForm(this.state.museum)
          museum.pieces = Object.assign(museum.pieces,new_Piece.getJsonDescription())
          this.setState({museum:{[museum.ID]:museum},newPiece:{museumID:museum.ID}});
          document.getElementById("btn_close_modal").click();
        }else{
          alert(response.data.message)
        }

      })
      .catch((err) => {
        alert(err);
      });
  }

  /**
   * Handle the request to upload an immage for the new piece
   * @author Giulio Serra
   */
  handleUploadImmageRequest(e) {
    e.preventDefault();

    document.getElementById("piece_cover_picker").click();
    document.getElementById("piece_cover_picker").onchange = (e) => {
      const file = e.target.files[0];
      if (file === undefined) return;

      let newPiece = this.state.newPiece;
      newPiece.immageFile = file;
      this.setState({ newPiece: newPiece });
    };
  }

  /**
   * Handle the input of new text for creating a new piece
   * @author Giulio Serra
   */
  handleTextInput(e) {
    e.preventDefault();
    const callerID = e.target.id;
    const value = e.target.value;

    let piece = this.state.newPiece;

    switch (callerID) {
      case "title_field":
        piece.title = value;
        break;

      case "description_field":
        piece.description = value;
        break;

      case "sensor_field":
        piece.sensorID = value;
        break;

      default:
        break;
    }

    this.setState({ newPiece: piece });
  }

  render() {

    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#pieceModal"
        >
          <b>New Piece</b>
        </button>

        {this.createPieceModal()}
        <div>{this.createTable()}</div>
      </div>
    );
  }
}
