
/**
 * Pure fabrication class to extend the system0s functionalities
 * @author Giulio Serra
 */
export default class System {

  convertImmageToBase64Async(file) {
    return new Promise((res,rej)=>{
      try{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => res(reader.result);
        reader.onerror = error => rej(error);
      }catch(err){
        return rej(err);
      }
    })
  }

  /***
   * @author Giulio Serra
   * Check if an object is empty.
   * @param {Object} object [Object to inspect]
   * @returns {Boolean} [if the object is empty or not]
   */
  isObjectEmpty(object) {
    return Object.keys(object).length === 0 && object.constructor === Object;
  }
}
