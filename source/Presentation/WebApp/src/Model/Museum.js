import System from "../System/System";
import Firebase from "../Firebase/Firebase";
import Storage from "../PersistanceStorage/PersistanceStorage";
/**
 * Class that rappresent a museum
 * @author Giulio Serra
 */
export default class Museum {
  constructor(jMuseum) {
    this.curatorID = jMuseum.curatorID;
    this.name = jMuseum.name;
    this.coverImmage = jMuseum.coverImmage;
    this.openingHours = jMuseum.openingHours;
    this.closingHours = jMuseum.closingHours;
    this.latitude = jMuseum.latitude;
    this.longitude = jMuseum.longitude;
    this.street = jMuseum.street;
    this.city = jMuseum.city;
    this.postalCode = jMuseum.postalCode;
  }

  /**
   * Returns the description of the curatorn in json format
   * @author Giulio Serra
   * @returns {Object} [Containing the description of the current object]
   */
  getJsonDescription() {
    return {
      [this.ID]: {
        curatorID: this.curatorID,
        name: this.name,
        coverImmage: this.coverImmage,
        openingHours: this.openingHours,
        closingHours: this.closingHours,
        latitude: this.latitude,
        longitude: this.longitude,
        street: this.street,
        city: this.city,
        postalCode: this.postalCode,
      },
    };
  }

  /**
   * Validate a wrapper to upload a museum inside the storage
   * @author Giulio Serra
   * @param {Object} uploadWrapper [Wrapper containing the informations of the museum to upload in the service]
   * @returns {Object} [Containing the result of the logic]
   */
  validate(uploadWrapper) {
    if (System.prototype.isObjectEmpty(uploadWrapper)) {
      return {
        code: "500",
        message: "You must provide the required informations for your museum.",
      };
    }

    if (uploadWrapper.immageFile === undefined) {
      return {
        code: "500",
        message: "You must provide a cover for the museum.",
      };
    }

    if (this.name === undefined) {
      return {
        code: "500",
        message: "The museum must have a name.",
      };
    }

    if (this.openingHours === undefined || this.closingHours === undefined) {
      return {
        code: "500",
        message: "The museum must have a name.",
      };
    }

    if (
      this.street === undefined ||
      this.city === undefined ||
      this.postalCode === undefined
    ) {
      return {
        code: "500",
        message:
          "You must complete all the address informations for the museum.",
      };
    }

    if (this.latitude === undefined || this.longitude === undefined) {
      return {
        code: "500",
        message: "You must localize the museum.",
      };
    }

    return { code: "200", message: "ok" };
  }

  /**
   * Post a new museum inside the storage
   * @author Giulio Serra
   * @param {Object} creationWrapper [Oject containing additional info for the creation]
   * @returns {Object} [Containing the result of the request]
   */
  postAsync(creationWrapper) {
    if (creationWrapper.ownerID === undefined)
      throw new Error("Missing owner ID of the museusm");

    return new Promise((res, rej) => {
      const img_path =
        "museum/" + this.ID + "/cover/" + creationWrapper.immageFile.name;

      Firebase.prototype
        .uploadImmageAsync(creationWrapper.immageFile, img_path)
        .then((ImageResponse) => {
          this.coverImmage = ImageResponse.ref.fullPath;
          return Storage.prototype
            .postMuseumAsync({
              name: this.name,
              openingHours: this.openingHours,
              closingHours: this.closingHours,
              curatorID: this.curatorID,
              coverImmage: this.coverImmage,
              latitude: this.latitude,
              longitude: this.longitude,
              street: this.street,
              postalCode: this.postalCode,
            })
            .then((response) => {
              // handle id
              return res(response);
            });
        })
        .catch((err) => {
          return rej(err);
        });
    });
  }

  /**
   * Display the museum opening hours in human readable form
   * @author Giulio Serra
   * @returns {String} [Containing the opening hours]
   */
  getHumanReadableOpeningHours() {
    if (this.openingHours !== undefined) {
      const date = new Date(this.openingHours);
      const hours = date.getHours();
      if (hours.toString().length < 5) return undefined;

      return hours;
    }

    return this.openingHours;
  }

  /**
   * Display the museum opening hours in human readable form
   * @author Giulio Serra
   * @returns {String} [Containing the closing hours]
   */
  getHumanReadableClosingHours() {
    if (this.closingHours !== undefined) {
      const date = new Date(this.closingHours);
      const hours = date.getHours();
      if (hours.toString().length < 5) return undefined;

      return hours;
    }

    return this.closingHours;
  }
}
