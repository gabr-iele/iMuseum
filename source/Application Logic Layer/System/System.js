
/**
 * @author Giulio Serra
 * [Check if an object is empty]
 * @param  {Object} obj [Object to check if it's empty]
 */
exports.isObjectEmpty = function (obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
      }
      return true;
}

 /**
   * Takes as input a {[key]:value} JSON and output a {value:value,ID:key} JSON
   * @author Giulio Serra <giulio.serra1995@gmail.com>
   * @param {Object} keyValue [Object to check]
   */
  exports.getJsonFromKeyValueForm = function(keyValue) {
    if (keyValue === undefined) {
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