import System from "../System/System";
import Firebase from "../Firebase/Firebase";
import Storage from "../PersistanceStorage/PersistanceStorage";

import { v4 as uuidv4 } from "uuid";

import placeholder from "../../src/resource/placeholder.png";

/**
 * Class that rappresent a piece in the museum
 * @author Giulio Serra
 */
export default class Piece {
  constructor(jPiece) {
    this.ID = jPiece.ID;
    this.image = jPiece.image;
    this.title = jPiece.title;
    this.sensorID = jPiece.sensorID;
    this.museumID = jPiece.museumID;
    this.description = jPiece.description;
    this.sensor = jPiece.sensor !== undefined ? jPiece.sensor : {};
    this.attendance =
      jPiece.attendance !== undefined ? jPiece.attendance : "not enough data";
    this.column = (jPiece.column !== undefined && jPiece.column !== "") ? jPiece.column : 0;
    this.row = (jPiece.row !== undefined && jPiece.row !== "") ? jPiece.row : 0;
  }

  /**
   * Returns the description of the piece in json format
   * @author Giulio Serra
   * @returns {Object} [Containing the description of the current object]
   */
  getJsonDescription() {
    return {
      [this.ID]: {
        name: this.name,
        image: this.image,
        title: this.title,
        museumID: this.museumID,
        description: this.description,
        sensorID: this.sensorID,
        column:this.column,
        row:this.row
      },
    };
  }

  /**
   * Validate a wrapper to upload a piece inside the storage
   * @author Giulio Serra
   * @param {Object} uploadWrapper [Wrapper containing the informations of the piece to upload in the service]
   * @returns {Object} [Containing the result of the logic]
   */
  validate(uploadWrapper) {
    if (System.prototype.isObjectEmpty(uploadWrapper)) {
      return {
        code: "500",
        message: "You must provide all the required informations.",
      };
    }

    if (uploadWrapper.immageFile === undefined) {
      return {
        code: "500",
        message: "You must provide a cover for the piece.",
      };
    }

    if (this.title === undefined) {
      return {
        code: "500",
        message: "The piece must have a title.",
      };
    }

    if (this.description === undefined) {
      return {
        code: "500",
        message: "The piece must have a description",
      };
    }

    if (this.sensorID === undefined) {
      return {
        code: "500",
        message: "The piece must have a sensor where it's placed",
      };
    }

    return { code: "200", message: "ok" };
  }

  /**
   * Returns the description of the piece along with the informations of the sensor
   * @author Giulio Serra
   * @returns {Object} [Containing the description of the current object]
   */
  getSensorDescription() {
    const sensor = this.sensor;
    const isSensorEmpty =
      sensor === undefined || System.prototype.isObjectEmpty(this.sensor);

    return {
      title: this.title,
      attendance: this.attendance,
      sensorStatus: isSensorEmpty ? "Sensor undetected" : sensor.status,
      battery: isSensorEmpty ? "Sensor undetected" : sensor.battery + "%",
    };
  }

  getHeatLevel() {
    if (this.attendance === undefined || this.attendance === "low") {
      return 32;
    }

    if (this.attendance === "medium") {
      return 64;
    }

    return 128;
  }

  /**
   * Post a new piece in the persistance storage
   * @author Giulio Serra
   * @param {Object} uploadWrapper [Containing all the informations of the piece to upload]
   * @returns {Object} [Containing the response of the upload request]
   */
  postAsync(uploadWrapper) {
    if (this.ID === undefined) {
      this.ID = uuidv4();
    }

    return new Promise((res, rej) => {
      const img_path =
        "piece/" + this.ID + "/image/" + uploadWrapper.immageFile.name;

      Firebase.prototype
        .uploadImmageAsync(uploadWrapper.immageFile, img_path)
        .then((ImageResponse) => {
          this.image = ImageResponse;
          return Storage.prototype
            .postPieceAsync(this.getJsonDescription())
            .then((response) => {
              return res(response);
            })
            .catch((err) => {
              return rej(err);
            });
        })
        .catch((err) => {
          return rej(err);
        });
    });
  }

  putAsync() {
    return new Promise((res, rej) => {
      if (this.ID === undefined) {
        return rej(new Error("Missing ID of the piece."));
      }
      return Storage.prototype
        .postPieceAsync(this.getJsonDescription())
        .then((response) => {
          return res(response);
        })
        .catch((err) => {
          return rej(err);
        });
    });
  }

  /**
   * Return the image of the piece if it's not available it returns a placeholder
   * @author Giulio Serra
   */
  getImmage() {
    if (this.image !== undefined) {
      return this.image;
    } else {
      return placeholder;
    }
  }
}
