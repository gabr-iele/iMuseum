
import axios from "axios";
const ENDPOINT = "https://europe-west1-iot2020-def28.cloudfunctions.net/"

/**
 * @author Giulio Serra
 * Pure fabrication to rappresent the persistance storage
 */
export default class PersistanceStorage {

  handleError(error){
    try{
      return error.response.data.message;
    }catch(err){
      return error;
    }
  }

  /***
   * @author Giulio Serra
   * get a curator from the ID
   * @param {String} ID [ID of the curator to retrieve]
   * @returns {Object} [Containing the curator]
   */
  getCuratorAsync(ID) {
    return new Promise((res, rej) => {
      const URL = ENDPOINT + "/getCurator/" + ID;
      axios
        .get(URL)
        .then((response) => {
          return res(response);
        })
        .catch((error) => {
          return rej(this.handleError(error));
        });
    });
  }

  /***
   * @author Giulio Serra
   * Create a curator inside the storage
   * @param {Object} curatorWrapper [Wrapper containing the informations of the curator to signup]
   * @returns {Object} [Containing the curator]
   */
  postCuratorAsync(curatorWrapper) {
    return new Promise((res, rej) => {
      const URL = ENDPOINT + "/postCurator";
      axios
        .post(URL, curatorWrapper)
        .then((response) => {
          return res(response);
        })
        .catch((error) => {
          console.log(error);
          return rej(this.handleError(error));
        });
    });
  }

  /***
   * @author Giulio Serra
   * Create a museum inside the storage
   * @param {Object} museumWrapper [Wrapper containing the informations of the museum to create]
   * @returns {Object} [Containing the museum]
   */
  postMuseumAsync(museumWrapper) {
    return new Promise((res, rej) => {
      const URL = ENDPOINT + "/postMuseum";
      axios
        .post(URL, museumWrapper)
        .then((response) => {
          return res(response);
        })
        .catch((error) => {
          console.log(error);
          return rej(this.handleError(error));
        });
    });
  }

   /***
   * @author Giulio Serra
   * Update a museum inside the storage
   * @param {Object} body [Contains the new informations of the museum]
   * @returns {Object} [Containing the museum]
   */
  putMuseumAsync(body){
    return new Promise((res, rej) => {
      const URL = ENDPOINT + "/putMuseum";
      axios
        .put(URL, body)
        .then((response) => {
          return res(response);
        })
        .catch((error) => {
          console.log(error);
          return rej(this.handleError(error));
        });
    });
  }

    /***
   * @author Giulio Serra
   * Create a piece inside the storage
   * @param {Object} pieceWrapper [Wrapper containing the new piece to create]
   * @returns {Object} [Containing the created piece]
   */
  postPieceAsync(pieceWrapper){
    return new Promise((res, rej) => {
      const URL = ENDPOINT + "/postPiece";
      axios
        .post(URL, pieceWrapper)
        .then((response) => {
          return res(response);
        })
        .catch((error) => {
          console.log(error);
          return rej(this.handleError(error));
        });
    });
  }


    /***
   * @author Giulio Serra
   * Delete a piece in the storage
   * @param {String} pieceID [ID of the piece to delete]
   * @returns {Object} [Containing the response]
   */
  deletePieceAsync(pieceID){
    return new Promise((res, rej) => {
      const URL = ENDPOINT + "/deletePiece/" + pieceID;
      axios
      .delete(URL)
      .then((response) => {
        return res(response);
      })
      .catch((error) => {
        console.log(error);
        return rej(this.handleError(error));
      });
    })
  }
}
