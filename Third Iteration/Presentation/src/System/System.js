
/**
 * Pure fabrication class to extend the system0s functionalities
 * @author Giulio Serra
 */
export default class System {


  /**
   * @author Giulio Serra
   * Check if two objects are the same 
   * @param {Object} first 
   * @param {Object} second 
   */
  areObjectSame(first,second){
    return JSON.stringify(first) === JSON.stringify(second); 
  }

  /***
   * @author Giulio Serra
   * Check if an object is empty.
   * @param {Object} object [Object to inspect]
   * @returns {Boolean} [if the object is empty or not]
   */
  isObjectEmpty(object) {

    if(object === null || object === undefined){
      return true;
    }

    return Object.keys(object).length === 0 && object.constructor === Object;
  }

   /***
   * @author Giulio Serra
   * Check if two arrays are the same
   * @param {Array} first [First Array to compare]
   * @param {Array} second [Second Array to compare]
   * @returns {Boolean} [if the two array are the same]
   */
  areArraySame(first,second){
    return first.length === second.length && first.sort().every(function(value, index) { return value === second.sort()[index]});
  }

  /**
   * Takes as input a {[key]:value} JSON and output a {value:value,ID:key} JSON
   * @author Giulio Serra <giulio.serra1995@gmail.com>
   * @param {Object} keyValue [Object to check]
   */
  getJsonFromKeyValueForm(keyValue) {

    if (keyValue === undefined || keyValue === null) {
      return {};
    }

    if(this.isObjectEmpty(keyValue)){
      return {};
    }

    let data = {};

    let key;
    data =
      keyValue[
        (function () {
          for (const ID in keyValue) {
            key = ID;
            return key;
          }
        })()
      ];

    data.ID = key;
    return data;
  }


}
