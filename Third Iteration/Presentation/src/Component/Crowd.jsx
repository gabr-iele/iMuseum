import React, { Component } from "react";
import System from "../System/System";

import obj_Museum from "../Model/Museum";
import obj_Piece from "../Model/Piece";

import { Heatmap } from "@uztbt/react-heatmap";

/**
 * Class to display to a user the dashboard of his/her museum
 * @author Giulio Serra
 */
export default class Crowd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMuseum: {},
    };

    this.handleUploadImmageRequest = this.handleUploadImmageRequest.bind(this);
    this.handlePieceUpdate = this.handlePieceUpdate.bind(this);
    this.handleCoordinatesUpdate = this.handleCoordinatesUpdate.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const museum = newProps.museum;
    if (museum === undefined) {
      return;
    }

    if (
      !System.prototype.areObjectSame(this.state.currentMuseum, newProps.museum)
    ) {
      this.setState({ currentMuseum: museum });
    }
  }

  /**
   * Handle the request to upload an image for the new piece
   * @author Giulio Serra
   */
  handleUploadImmageRequest(e) {
    e.preventDefault();

    document.getElementById("planimetry_picker").click();
    document.getElementById("planimetry_picker").onchange = (e) => {
      const file = e.target.files[0];
      if (file === undefined) return;

      let current_museum = System.prototype.getJsonFromKeyValueForm(
        this.state.currentMuseum
      );

      const obj_current = new obj_Museum(current_museum);
      return obj_current
        .postPlanimetryAsync(file)
        .then((response) => {
          current_museum.planimetry = response.planymetry;
          this.setState({
            currentMuseum: { [current_museum.ID]: current_museum },
          });
          alert("Planimetry successfully uploaded.");
        })
        .catch((err) => {
          alert(err);
        });
    };
  }

  /**
   * Handle the request to update a piece
   * @author Giulio Serra
   */
  handlePieceUpdate(e) {
    e.preventDefault();
    const pieceID = e.currentTarget.id;

    const current_museum = System.prototype.getJsonFromKeyValueForm(
      this.state.currentMuseum
    );

    let piece = current_museum.pieces[pieceID];
    piece.ID = pieceID;

    if (piece === undefined) {
      alert("piece " + pieceID + " not found in parent museum.");
    }

    const obj_piece = new obj_Piece(piece);
    return obj_piece
      .putAsync()
      .then((response) => {
        alert("Piece position saved successfully.");
      })
      .catch((err) => {
        alert(err);
      });
  }

  /**
   * Handle the request to update the position of a piece
   * @author Giulio Serra
   */
  handleCoordinatesUpdate(e) {
    e.preventDefault();
    const senderID = e.currentTarget.id;
    const value = e.target.value;

    console.log(value);
    const current_museum = System.prototype.getJsonFromKeyValueForm(
      this.state.currentMuseum
    );

    if (senderID.includes("col_field")) {
      const pieceID = senderID.replace(" col_field", "");

      if (current_museum.pieces !== undefined) {
        current_museum.pieces[pieceID].column = value;
      }
    }

    if (senderID.includes("row_field")) {
      const pieceID = senderID.replace(" row_field", "");
      if (current_museum.pieces !== undefined) {
        current_museum.pieces[pieceID].row = value;
      }
    }

    this.setState({ currentMuseum: { [current_museum.ID]: current_museum } });
  }

  /**
   * Generate a view to let the user upload the planimetry
   * @author Giulio Serra
   */
  generatePlanimetryUploadButton() {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <div>
          <b>
            To start monitoring the museum please upload the planimetry (please
            provide a 700x700 image for best results.)
          </b>
        </div>
        <div style={{ marginTop: "20px" }}>
          <button
            className="btn btn-primary"
            onClick={this.handleUploadImmageRequest}
          >
            <b>Upload planimetry</b>
          </button>
          <input id="planimetry_picker" type="file" hidden />
        </div>
      </div>
    );
  }

  /**
   * Create a table to diplay all the pieces
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
              <th scope="col">Piece</th>
              <th scope="col">Attendance</th>
              <th scope="col">Row</th>
              <th scope="col">Column</th>
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
      this.state.currentMuseum
    );

    for (const pieceID in current_museum.pieces) {
      const currentPiece = current_museum.pieces[pieceID];
      currentPiece.ID = pieceID;

      const obj_piece = new obj_Piece(currentPiece);

      pieces.push(
        <tr key={pieceID}>
          <th scope="row">{obj_piece.title}</th>
          <td>{obj_piece.attendance}</td>
          <td>
            {
              <div>
                <input
                  style={{ maxWidth: "70px" }}
                  className="form-control"
                  onChange={this.handleCoordinatesUpdate}
                  placeholder="row 1-7"
                  value={obj_piece.row}
                  id={pieceID + " " + "row_field"}
                />
              </div>
            }
          </td>
          <td>
            <input
              style={{ maxWidth: "70px" }}
              onChange={this.handleCoordinatesUpdate}
              className="form-control"
              placeholder="column 1-7"
              value={obj_piece.column}
              id={pieceID + " " + "col_field"}
            />
          </td>
          <td>
            {
              <div className="row">
                <button
                  id={pieceID}
                  onClick={this.handlePieceUpdate}
                  className="btn btn-primary"
                  style={{ marginLeft: "10px" }}
                >
                  Save
                </button>
              </div>
            }
          </td>
        </tr>
      );
    }

    return pieces;
  }

  /**
   * Generate an heat map to display data of the museum pieces
   * @author Giulio Serra
   */
  generateHeatMapView() {
    let matrix = [
      [70, 70, 70, 70, 70, 70, 70],
      [70, 70, 70, 70, 70, 70, 70],
      [70, 70, 70, 70, 70, 70, 70],
      [70, 70, 70, 70, 70, 70, 70],
      [70, 70, 70, 70, 70, 70, 70],
      [70, 70, 70, 70, 70, 70, 70],
      [70, 70, 70, 70, 70, 70, 70],
    ];

    const current_museum = System.prototype.getJsonFromKeyValueForm(
      this.state.currentMuseum
    );

    for (const pieceID in current_museum.pieces) {
      const currentPiece = current_museum.pieces[pieceID];
      currentPiece.ID = pieceID;
      const obj_piece = new obj_Piece(currentPiece);

      let row_index = obj_piece.row;
      if(row_index !== 0){row_index = row_index -1}

      let col_index = obj_piece.column;
      if(col_index !== 0){col_index = col_index -1};

      let row = matrix[row_index];
      console.log({col:obj_piece.column,row:obj_piece.row})
      row[col_index] = row[col_index] + obj_piece.getHeatLevel();
    }

    console.log(matrix);

    const obj_current = new obj_Museum(current_museum);

    return (
      <div className="row justify-content-center" style={{ marginTop: "20px" }}>
        <div className="container">
          <div
            className="col"
            style={{
              paddingLeft: "0",
              paddingRight: "0px",
            }}
          >
            <center>
              <Heatmap
                height={700}
                width={700}
                opacity={0.7}
                heatmapArray={matrix}
                src={obj_current.getPlanimetry()}
              />
            </center>
            {this.createTable()}
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (System.prototype.isObjectEmpty(this.state.currentMuseum)) {
      return <div></div>;
    }

    const current_museum = System.prototype.getJsonFromKeyValueForm(
      this.state.currentMuseum
    );
    if (current_museum.planimetry === undefined) {
      return this.generatePlanimetryUploadButton();
    } else {
      return this.generateHeatMapView();
    }
  }
}
