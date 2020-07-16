import React, { Component } from "react";
import obj_Piece from "../Model/Piece";
import global from "../global.json";

import placeholder from "../../src/resource/placeholder.png";

/**
 * Component create a new piece
 * @author Giulio Serra
 */
export default class Piece extends Component {

  componentDidMount(){

  }

  render() {
  
    const piece = new obj_Piece(this.props.newPiece);

    const pieceImage =
    this.props.newPiece.immageFile !== undefined
      ? URL.createObjectURL(this.props.newPiece.immageFile)
      : placeholder;

    return (
      <div
        className="col"
        style={{
          overflow: "hidden",
          paddingLeft: "5px",
          paddingRight: "5px",
          paddingBottom: "5px",
          color: global.GUI.RED,
        }}
      >
        <img
          style={{ maxHeight: "400px", width: "100%", objectFit: "scale-down" }}
          id="piece_img"
          alt="piece_img"
          src={pieceImage}
          onClick={this.props.handleUploadImmageRequest}
        />

        <input id="piece_cover_picker" type="file" hidden />
        <div style={{ marginTop: "10px", textAlign: "left" }}>
          <b>Piece</b>
        </div>

        <input
          style={{ marginTop: 10 }}
          className="form-control"
          placeholder="Piece Title"
          value={(piece.title !== undefined)? piece.title : ""}
          onChange={this.props.handleTextInput}
          id="title_field"
        />

        <textarea
          style={{ marginTop: 10 }}
          placeholder="Piece Description"
          value={(piece.description !== undefined)? piece.description : ""}
          class="form-control"
          onChange={this.props.handleTextInput}
          id="description_field"
        ></textarea>

        <div style={{ marginTop: "10px", textAlign: "left" }}>
          <b>Sensor ID</b>
        </div>

        <input
          style={{ marginTop: 10 }}
          className="form-control"
          placeholder="Sensor ID"
          value={(piece.sensorID !== undefined)? piece.sensorID : ""}
          onChange={this.props.handleTextInput}
          id="sensor_field"
        />

      </div>
    );
  }
}
