const storage = require("../PersistanceStorage/PersistanceStorage");

function Piece(jbody) {
  let ID = jbody.ID;
  let image = jbody.image;
  let title = jbody.title;
  let sensorID = jbody.sensorID;
  let museumID = jbody.museumID;
  let description = jbody.description;
  let column = jbody.column !== undefined? jbody.column : 0
  let row = jbody.row !== undefined? jbody.row : 0
  
  let sensor = jbody.sensor;
  let attendance = jbody.attendance;

  /***
   * @author Giulio Serra
   * [Validate the information of the piece]
   */
  this.validate = function () {
    if (ID === undefined) {
      return { code: "400", message: "missing ID of the piece!" };
    }

    if (image === undefined) {
      return { code: "400", message: "missing piece's image." };
    }

    if (title === undefined) {
      return { code: "400", message: "missing piece's title." };
    }

    if (description === undefined) {
      return { code: "400", message: "missing piece's description." };
    }

    if (museumID === undefined) {
      return { code: "400", message: "missing ID of the museum" };
    }

    if (sensorID === undefined) {
      return { code: "400", message: "missing ID of the piece's sensor." };
    }

    return { code: "200", message: "ok" };
  };

  /***
   * @author Giulio Serra
   * [Post a piece in the persistance storage]
   */
  this.postAsync = function () {
    return new Promise((res, rej) => {
      const path = "Piece/";
      const body = {
        title: title,
        description: description,
        image: image,
        museumID: museumID,
        sensorID: sensorID,
        column:column,
        row:row
      };

      return storage
        .updateRecord(path, { [ID]: body })
        .then(() => {
          return res({ [ID]: body });
        })
        .catch((err) => {
          return rej(err);
        });
    });
  };
}

exports.Piece = Piece;
