const admin = require("firebase-admin");
const system = require("../System/System");

const museum = require("../Model/Museum");
const model = require("../AttendanceModel/AttendanceModel");


const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const Distance = require("geo-distance");

/**
 * @author Giulio Serra
 * [create a record inside backend]
 *  * @param  {String} path [the path of the record to create]
 *  * @param  {JSON} object [object describing the new record , must be in ID:{...} format]
 */
exports.createRecord = function (path, object) {
  return new Promise((res, rej) => {
    admin
      .database()
      .ref(path)
      .set(object)
      .then(() => {
        return res(true);
      })
      .catch((error) => {
        return rej(error);
      });
  });
};

/**
 * @author Giulio Serra
 * [update a record inside backend]
 *  * @param  {String} path [the path of the record to update]
 *  * @param  {JSON} object [object describing the new record , must be in ID:{...} format]
 */
exports.updateRecord = function (path, object) {
  return new Promise((res, rej) => {
    admin
      .database()
      .ref(path)
      .update(object)
      .then(() => {
        return res(true);
      })
      .catch((error) => {
        return rej(error);
      });
  });
};

/**
 * @author Giulio Serra
 * [delete a record inside backend]
 * @param  {String} path [the path of the record to delete]
 */
exports.deleteRecord = function (path) {
  return new Promise((res, rej) => {
    admin
      .database()
      .ref(path)
      .remove()
      .then(() => {
        return res(true);
      })
      .catch((error) => {
        return rej(error);
      });
  });
};

/**
 * @author Giulio Serra
 * [Get a curator with all the relationship inside the persistance storage]
 * @param {String} curatorID [ID the curator to retrieve]
 * @return {Object} [containing the curator object with all the relationship in {[ID]:Object} form]
 */
exports.getCuratorsGraphAsync = function (curatorID) {
  return new Promise((res, rej) => {
    return getCuratorAsync(curatorID)
      .then((curator) => {
        return getCuratorMuseumAsync(curatorID).then((museums) => {
          let museumIDs = [];
          curator.museums = {};
          for (const museumID in museums) {
            museumIDs.push(museumID);
          }

          if (museums !== null && museums !== undefined) {
            curator.museums = Object.assign(curator.museums, museums);
          }

          return res({ [curatorID]: curator });
        });
      })
      .catch((error) => {
        return rej(error);
      });
  });
};

/**
 * @author Giulio Serra
 * [Get a piece from the ID of the sensor placed on top of it]
 * @param {String} sensorID [ID of the sensor placed on the piece]
 * @return {Object} [Containig the piece where the sensor is placed on]
 */
exports.getPieceFromSensorID = function (sensorID) {
  return new Promise((res, rej) => {
    return admin
      .database()
      .ref("Piece")
      .orderByChild("sensorID")
      .equalTo(sensorID)
      .once("value")
      .then((snap) => {
        const piece = snap.val();

        if (piece === null || piece === undefined) {
          return res({});
        }

        return res(snap.val());
      })
      .catch((error) => {
        return rej(error);
      });
  });
};

/**
 * @author Giulio Serra
 * [Return a museum from the ID]
 * @param {String} museumID [ID of the museum to retrieve]
 * @return {Object} [Containig the piece where the sensor is placed on]
 */
exports.getMuseumGrapFromIDAsync = function (museumID) {
  return new Promise((res, rej) => {
    return getMuseumGraphFromIDAsync(museumID)
      .then((response) => {
        return res(response);
      })
      .catch((error) => {
        return rej(error);
      });
  });
};

/**
 * @author Giulio Serra
 * [Return the closest museum from a position]
 * @param {Object} wrapper [ID of the museum to retrieve]
 * @return {Object} [Containig the piece where the sensor is placed on]
 */
exports.getMuseumFromDistanceAsync = function (wrapper) {
  return new Promise((res, rej) => {
    admin
      .database()
      .ref("Museum")
      .once("value")
      .then((snap) => {
        return getPiecesGraphAsync().then((pieces) => {
          const museums = snap.val();

          if (museums === null || museums === undefined) {
            return res({});
          }

          let closest_museum = undefined;
          let response = {};

          for (const museumID in museums) {

            let curr_museum = museums[museumID];
            curr_museum.ID = museumID;

            const obj_curr_museum = new museum.Museum(curr_museum);

            if (closest_museum === undefined && 
              obj_curr_museum.getDistance(wrapper) <= Distance(wrapper.range + "km")) {
              closest_museum = curr_museum;

            } else if(closest_museum !== undefined){
                const obj_closest_museum = new museum.Museum(closest_museum);
                if(obj_curr_museum.getDistance(wrapper) < obj_closest_museum.getDistance(wrapper)){
                  closest_museum = curr_museum;
                }
            }
          }

          if(closest_museum !== undefined){

            closest_museum.pieces = {};

            for(const pieceID in pieces){
              
              const current_piece = pieces[pieceID]
              if(current_piece.museumID === closest_museum.ID){
                closest_museum.pieces = Object.assign(closest_museum.pieces,{[pieceID]:current_piece})
              }
            }
            
            response = {[closest_museum.ID]:closest_museum};
          
          }

          return res(response);
        });
      })
      .catch((err) => {
        return rej(err);
      });
  });
};

/**
 * @author Giulio Serra
 * [Create a new transit inside the storage]
 * @param {Object} wrapper [Wrapper containing the visit where the transit happened and the piece]
 * @return {Object} [Containig the piece response]
 */
exports.postTransit = function (wrapper) {
  return new Promise((res, rej) => {
    const body = { [moment().unix()]: wrapper.pieceID };
    return admin
      .database()
      .ref("Transit")
      .child(wrapper.visitID)
      .update(body)
      .then(() => {
        return res(body);
      })
      .catch((error) => {
        return rej(error);
      });
  });
};

/**
 * @author Giulio Serra
 * [Get the curator record from his ID]
 * @param {String} curatorID [ID the curator to retrieve]
 * @return {Object} [containing the curator object]
 */
function getCuratorAsync(curatorID) {
  return new Promise((res, rej) => {
    return admin
      .database()
      .ref("Curator")
      .child(curatorID)
      .once("value")
      .then((snap) => {
        return res(snap.val());
      })
      .catch((error) => {
        return rej(error);
      });
  });
}

/**
 * @author Giulio Serra
 * [Get the curator's museums from his ID]
 * @param {String} curatorID [ID the curator to retrieve]
 * @return {Object} [containing the response object]
 */
function getCuratorMuseumAsync(curatorID) {
  return new Promise((res, rej) => {
    admin
      .database()
      .ref("Museum")
      .orderByChild("curatorID")
      .equalTo(curatorID)
      .once("value")
      .then((snap) => {
        const museums = snap.val();
        let response = {};

        if (museums === undefined || museums === null) {
          return res(response);
        }

        return getPiecesGraphAsync()
          .then((pieces) => {
            let museumsID = [];
            for (const museumID in museums) {
              museumsID.push(museumID);
            }

            return getVisitsGraphAsync(museumsID).then((visits) => {
              for (const museumID in museums) {
                let museum = museums[museumID];
                museum.pieces = {};
                museum.visits = {};

                const musuemVisits = visits[museumID];
                if (musuemVisits !== undefined) {
                  museum.visits = musuemVisits;
                }

                for (const pieceID in pieces) {
                  let piece = pieces[pieceID];
                  piece.attendance = model.getPieceAttendance(pieceID,museum.visits);

                  if (piece.museumID === museumID) {
                    museum.pieces = Object.assign(museum.pieces, {
                      [pieceID]: piece,
                    });
                  }
                }

                
                response = Object.assign(response, { [museumID]: museum });
              }

              return res(response);
            });
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

/**
 * @author Giulio Serra
 * [Get all the informations of a museum from its ID]
 * @param {String} curatorID [ID the curator to retrieve]
 * @return {Object} [containing the response object]
 */
function getMuseumGraphFromIDAsync(museumID) {
  return new Promise((res, rej) => {
    admin
      .database()
      .ref("Museum")
      .child(museumID)
      .once("value")
      .then((snap) => {
        let museum = snap.val();
        museum.ID = museumID;

        if (museum === null || museum === undefined) {
          return res({});
        }

        if (museum === undefined || museum === null) {
          return res(response);
        }

        return getPiecesGraphAsync()
          .then((pieces) => {
            let museums = [];
            museums.push(museumID);

            return getVisitsGraphAsync(museums).then((visits) => {
              let response = {};

              let current_museum = museum;
              current_museum.pieces = {};
              current_museum.visits = {};

              const musuemVisits = visits[museumID];
              if (musuemVisits !== undefined) {
                current_museum.visits = musuemVisits;
              }

              for (const pieceID in pieces) {
                let piece = pieces[pieceID];
                piece.attendance = model.getPieceAttendance(pieceID, current_museum.visits);
                if (piece.museumID === museumID) {
                  current_museum.pieces = Object.assign(current_museum.pieces, {
                    [pieceID]: piece,
                  });
                }
              }
              
        
              response = Object.assign(response, {
                [museumID]: current_museum,
              });

              return res(response);
            });
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

/**
 * @author Giulio Serra
 * [Get all the visits that took places in a list of museums]
 * @param {Array} museumsID [ID of the museums to retrieve the ]
 * @return {Object} [containing the response object]
 */
function getVisitsGraphAsync(museumsID) {
  return new Promise((res, rej) => {
    admin
      .database()
      .ref("Visit")
      .once("value")
      .then((snap) => {
        const visitResponse = snap.val();
        if (visitResponse === null || visitResponse === undefined) {
          return res({});
        }

        return getFormattedTransits().then((transits)=>{

            let response = {};

            for (const museumID in visitResponse) {

              if (museumsID.includes(museumID)) {

                response[museumID] = {};

                const visits = visitResponse[museumID]; // all the visits that took place in the museum
             
                for (const visitID in visits) {
                  let currentVisit =  visits[visitID];

                  currentVisit.transits =
                  transits[visitID] !== undefined
                    ? transits[visitID]
                    : [];

                  response[museumID] = Object.assign(response[museumID], {
                    [visitID]: currentVisit,
                  });
                }
              }
            }

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


/**
 * @author Giulio Serra
 * [Get all the transit occured during a visit in an array format]
 * @return {Object} [containing the response object]
 */
function getFormattedTransits(){
  return new Promise((res, rej) => {
    return admin
    .database()
    .ref("Transit")
    .once("value")
    .then((transitSnap) => {
      const transits = transitSnap.val();
      if(transits === null || transits === undefined){return res({});}

      var respose = {};
      for(const visitID in transits){
        var formatted_transits = [];

        const visit_transits = transits[visitID];
      
        for(const timestamp in visit_transits){ 
          formatted_transits.push({[timestamp]:visit_transits[timestamp]});
        }

        response = Object.assign(respose,{[visitID]:formatted_transits});
      }
      return res(respose);

    }).catch((err) => {
      return rej(err);
    });
  })
}

/**
 * @author Giulio Serra
 * [Get all the pieces in the storage]
 * @return {Object} [containing all the pieces in the storage]
 */
function getPiecesGraphAsync() {
  return new Promise((res, rej) => {
    admin
      .database()
      .ref("Piece")
      .once("value")
      .then((snapPieces) => {

        const pieces = snapPieces.val();
        if (pieces === undefined || pieces === null) {
          return res({});
        }
        
        return admin.database().ref("Sensor").once("value").then((snapSensor)=>{
          const sensors = snapSensor.val();
          let response = {};

          for(const pieceID in pieces){

            let currentPiece = pieces[pieceID];
            let sensor = sensors[currentPiece.sensorID];

            if(sensor !== undefined){
              currentPiece.sensor = sensor;
            }

            response = Object.assign(response,{[pieceID]:currentPiece});
          }
          
  
          return res(response);
        })
      })
      .catch((err) => {
        return rej(err);
      });
  });
}
