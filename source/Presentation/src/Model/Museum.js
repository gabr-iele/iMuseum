import System from "../System/System";
import Firebase, { storage } from "../Firebase/Firebase";
import Storage from "../PersistanceStorage/PersistanceStorage";

import { v4 as uuidv4 } from "uuid";

import placeholder from "../../src/resource/placeholder.png";

/**
 * Class that rappresent a museum
 * @author Giulio Serra
 */
export default class Museum {
  constructor(jMuseum) {
    this.ID = jMuseum.ID;
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
    this.pieces = jMuseum.pieces !== undefined ? jMuseum.pieces : {};
    this.planimetry = jMuseum.planimetry;
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
        planimetry: this.planimetry,
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
    else {
      this.curatorID = creationWrapper.ownerID;
    }

    if (this.ID === undefined) {
      this.ID = uuidv4();
    }

    return new Promise((res, rej) => {
      const img_path =
        "museum/" + this.ID + "/cover/" + creationWrapper.immageFile.name;

      Firebase.prototype
        .uploadImmageAsync(creationWrapper.immageFile, img_path)
        .then((ImageResponse) => {
          this.coverImmage = ImageResponse;
          return Storage.prototype
            .postMuseumAsync(this.getJsonDescription())
            .then((response) => {
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
   * Post a new
   * @author Giulio Serra
   * @param {Object} imageFile [File containing the image to upload]
   * @returns {Object} [Containing the result of the request]
   */
  postPlanimetryAsync(imageFile) {
    return new Promise((res, rej) => {
      if (this.ID === undefined) {
        return rej(new Error("Missing ID of the museum."));
      }

      const planimetry_path =
        "museum/" + this.ID + "/planimetry/" + imageFile.name;

      Firebase.prototype
        .uploadImmageAsync(imageFile, planimetry_path)
        .then((ImageResponse) => {
          this.planimetry = ImageResponse;
          return Storage.prototype
            .putMuseumAsync(this.getJsonDescription())
            .then((response) => {
              return res({ planimetry: this.planimetry });
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
   * Delete a piece from the museum and returns the remaining pieces
   * @author Giulio Serra
   * @param {String} pieceID [ID of the piece to delete]
   * @returns {Object} [Containing the result of the request]
   */
  deletePieceAsync(pieceID) {
    if (pieceID === undefined)
      throw new Error("Missing owner ID of the piece to delete");

    return new Promise((res, rej) => {
      Storage.prototype
        .deletePieceAsync(pieceID)
        .then((response) => {
          if (response.data.code === "200") {
            let remaining_pieces = {};

            for (const current_pieceID in this.pieces) {
              const current_piece = this.pieces[current_pieceID];
              if (pieceID !== current_pieceID) {
                remaining_pieces = Object.assign(remaining_pieces, {
                  [current_pieceID]: current_piece,
                });
              }
            }
            response.data.pieces = remaining_pieces;
          }

          return res(response);
        })
        .catch((error) => {
          return rej(error);
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

  /**
   * Return the description of the opening of the museum
   * @author Giulio Serra
   */
  getOpeningDescription() {
    const now = new Date();
    const hours = now.getHours();

    const closingDate = new Date(this.closingHours);
    const openingDate = new Date(this.openingHours);

    const closing_hours = closingDate.getHours();
    const opening_hours = openingDate.getHours();

    if (hours < opening_hours || hours > closing_hours)
      return `The museum is now closed, it will open tomorrow at ${opening_hours}`;
    else return `The museum is open, it will close at ${closing_hours}`;
  }

  /**
   * Return the image of the museum, if it's not available it returns a placeholder
   * @author Giulio Serra
   */
  getImmage() {
    if (this.coverImmage !== undefined) {
      return this.coverImmage;
    } else {
      return placeholder;
    }
  }

  /**
   * Return the planimetry of the, if it's not available it returns a placeholder
   * @author Giulio Serra
   */
  getPlanimetry() {
    if (this.planimetry !== undefined) {
      return this.planimetry;
    } else {
      return placeholder;
    }
  }
}
