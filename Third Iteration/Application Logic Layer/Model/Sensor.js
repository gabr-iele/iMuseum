const storage = require("../PersistanceStorage/PersistanceStorage");
const { v4: uuidv4 } = require("uuid");

function Sensor(jbody) {
  let ID = jbody.ID;
  let status = jbody.status !== undefined ? jbody.status : "On"; // on - off
  let battery = jbody.battery !== undefined ? jbody.battery : 100; // percentage

  /***
   * @author Giulio Serra
   * [Post a sensor in the persistance storage]
   */
  this.postAsync = function () {
    return new Promise((res, rej) => {
      if (ID === undefined) {
        ID = uuidv4();
      }

      const path = "Sensor/";
      const body = {
        status: status,
        battery: battery,
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

    /***
   * @author Giulio Serra
   * [Update the status of a sensor in the persistance storage]
   */
  this.updateStatusAsync = function(){

    return new Promise((res, rej) => {

        const path = "Sensor/";
        const body = {
          status: status,
          battery: battery,
        };
    
        return storage
        .updateRecord(path, { [ID]: body })
        .then(() => {
          return res({ [ID]: body });
        })
        .catch((err) => {
          return rej(err);
        });
    })
  }
}

exports.Sensor = Sensor;
