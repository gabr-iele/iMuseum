import { v4 as uuidv4 } from 'uuid';

/**
 * @author Giulio Serra
 * Pure fabrication to rappresent the persistance storage
 */
export default class PersistanceStorage {
  /***
   * @author Giulio Serra
   * get a curator from the ID
   * @param {String} ID [ID of the curator to retrieve]
   * @returns {Object} [Containing the curator]
   */
  getCuratorAsync(ID) {
    return new Promise((res, rej) => {
      return res({})
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
      return res({})
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
      return res({[uuidv4()]:museumWrapper})
    });
  }
}
