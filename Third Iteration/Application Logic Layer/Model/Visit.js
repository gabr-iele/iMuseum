const storage = require("../PersistanceStorage/PersistanceStorage");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

function Visit(jbody) {
    
  let ID = jbody.ID;
  let start = jbody.start;
  let end = jbody.end;
  let transits = jbody.transits;
  let museumID = jbody.museumID;


  /**
   * @author Giulio Serra
   * [Check if a piece has been seen during a visit]
   * @return {Object} [containing the response object]
   */
  this.doesPieceHasBeenSee = function(pieceID){

    
    if(transits === undefined || transits.length === 0){return false;}

    for (const transit_index in transits) {
      const transit = transits[transit_index];
      const timeStamp = Object.keys(transit)[0];
      const piece_ID = transit[timeStamp];

      if(piece_ID === pieceID){console.log("piece " + pieceID + " is in visit " + ID); return true;}
      
    } 

    return false;

    
  }


  /**
   * @author Giulio Serra
   * [Create a new visit in the persistance storage]
   * @return {Object} [containing the response object]
   */
  this.postBeginningAsync = function () {
    return new Promise((res, rej) => {
      if (ID === undefined) {
        ID = uuidv4();
        start = moment().unix();
      }

      if (museumID === undefined) {
        return rej(
          new Error("missing the museumID where the visit is taking place.")
        );
      }

      const path = "Visit/" + museumID + "/" + ID;
      const body = {
        museumID: museumID,
        start: start,
      };
      return storage
        .updateRecord(path, body)
        .then((response) => {
          return res({[ID]:{
              museumID:museumID,
              start:start
          }});
        })
        .catch((err) => {
          return rej(err);
        });
    });
  };

  this.postEndAsync = function () {
    return new Promise((res, rej) => {
      end = moment().unix();
      
      if (ID === undefined) {
        return rej(new Error("missing ID of the visit to conclude."));
      }
      if (museumID === undefined) {
        return rej(
          new Error("missing the museumID where the visit is taking place.")
        );
      }

      const path = "Visit/" + museumID + "/" + ID;
      const body = {
        museumID: museumID,
        end: end,
      };
      return storage
        .updateRecord(path, body)
        .then((response) => {
          return res({[ID]:{
              museumID:museumID,
              end:end
          }});
        })
        .catch((err) => {
          return rej(err);
        });
    });
  };
}

exports.Visit = Visit;
