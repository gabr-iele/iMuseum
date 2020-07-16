const storage = require("../PersistanceStorage/PersistanceStorage");
const distance = require("geo-distance");

function Museum(jbody) {
  let ID = jbody.ID;
  let curatorID = jbody.curatorID;
  let name = jbody.name;
  let coverImmage = jbody.coverImmage;
  let openingHours = jbody.openingHours;
  let closingHours = jbody.closingHours;
  let latitude = jbody.latitude;
  let longitude = jbody.longitude;
  let street = jbody.street;
  let city = jbody.city;
  let postalCode = jbody.postalCode;
  let planimetry = jbody.planimetry;

  /***
   * @author Giulio Serra
   * [Validate the information of the museum]
   */
  this.validate = function () {
    if (ID === undefined) {
      return { code: "400", message: "missing ID of the museum!" };
    }

    if (curatorID === undefined) {
      return { code: "400", message: "missing the ID of the curator" };
    }

    if (name === undefined) {
      return { code: "400", message: "missing name of the museum!" };
    }

    if (coverImmage === undefined) {
      return { code: "400", message: "missing cover for the museum!" };
    }

    if (openingHours === undefined) {
      return { code: "400", message: "missing opening hours for the museum" };
    }

    if (closingHours === undefined) {
      return { code: "400", message: "missing closing hours for the museum" };
    }

    if (latitude === undefined || longitude === undefined) {
      return { code: "400", message: "invalid position for the museum" };
    }

    if(street === undefined || city === undefined || postalCode === undefined){
        return { code: "400", message: "Missing either city, street or postal code." };
    }

    return { code: "200", message: "ok" };
  };

  /***
   * @author Giulio Serra
   * [Get the museum's distance from a position in ]
   */
  this.getDistance = function(position){
    if (position === undefined || position.lon === undefined || position.lat === undefined) {
      return new Error("Missing data from the position");
    }

    const museumPosition={
      lat:latitude,
      lon:longitude
    }

    return distance.between(museumPosition, position);
  }

    /***
   * @author Giulio Serra
   * [Post a musuem in the persistance storage]
   */
  this.postAsync = function () {
    return new Promise((res, rej) => {
      const path = "Museum/";
      let body = {
        curatorID : curatorID,
        name : name,
        coverImmage : coverImmage,
        openingHours : openingHours,
        closingHours : closingHours,
        latitude : latitude,
        longitude : longitude,
        street : street,
        city : city,
        postalCode : postalCode
      };

      if(planimetry !== undefined)
      {
        body.planimetry = planimetry;
      }

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

exports.Museum = Museum;
