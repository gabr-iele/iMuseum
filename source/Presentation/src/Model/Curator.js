import System from "../System/System";
import Storage from "../PersistanceStorage/PersistanceStorage";
import Firebase from "../Firebase/Firebase";

import placeholder from "../../src/resource/placeholder.png"

/**
 * Class that rappresent the curator
 * @author Giulio Serra
 */
export default class Curator {
  constructor(jCurator) {
    this.ID = jCurator.ID;
    this.name = jCurator.name;
    this.surname = jCurator.surname;
    this.profileImmage = jCurator.profileImmage;
    this.museums = (jCurator.museums !== undefined)? jCurator.museums: {};
  }

  /**
   * Returns the description of the curatorn in json format
   * @author Giulio Serra
   * @returns {Object} [Containing the description of the current object]
   */
  getJsonDescription(){
    return {
      [this.ID]:{
        name:this.name,
        surname:this.surname,
        profileImmage:this.profileImmage,
        museums:this.museums
      }
    }
  }

   /**
   * Return the default museum of the curator
   * @author Giulio Serra
   */
  getDefaultMuseum(){
    const museum_key = Object.keys(this.museums)[0];
    return {[museum_key]:this.museums[museum_key]};
  }

  /**
   * Validate a wrapper to register a curator inside the storage
   * @author Giulio Serra
   * @param {Object} signupWrapper [Wrapper containing the informations of the curator to signup in the service]
   * @returns {Object} [Containing the result of the logic ]
   */
  validate(signupWrapper) {
 
    if (System.prototype.isObjectEmpty(signupWrapper)) {
      return {
        code: "500",
        message: "You must provide the required informations for your account.",
      };
    }

    if (
      signupWrapper.credentialWrapper === undefined ||
      System.prototype.isObjectEmpty(signupWrapper.credentialWrapper)
    ) {
      return {
        code: "500",
        message: "Missing email and password informations.",
      };
    }

    if (signupWrapper.immageFile === undefined) {
      return {
        code: "500",
        message: "You must select a profile pic.",
      };
    }

    if (signupWrapper.credentialWrapper.email === undefined) {
      return {
        code: "500",
        message: "You must specify a valid email",
      };
    }

    if (signupWrapper.credentialWrapper.password === undefined) {
      return {
        code: "500",
        message: "You must specify a valid password",
      };
    }

    if (
      signupWrapper.credentialWrapper.password !==
      signupWrapper.credentialWrapper.repeatePassword
    ) {
      return {
        code: "500",
        message:
          "The password field and repeate password field must be the same",
      };
    }

    if (this.name === undefined) {
      return {
        code: "500",
        message: "You must specify a name.",
      };
    }

    if (this.surname === undefined) {
      return {
        code: "500",
        message: "You must specify a surname.",
      };
    }

    return { code: "200", message: "ok" };
  }

  /**
   * Create a new curator inside the persistance storage
   * @author Giulio Serra
   * @param {Object} signupWrapper [Wrapper containing the informations of the curator to signup in the service]
   * @returns {Object} [Containing the result of the request]
   */
  signupAsync(signupWrapper) {
    return new Promise((res, rej) => {
      const credentials = signupWrapper.credentialWrapper;
      Firebase.prototype
        .createUserAsync(credentials.email, credentials.password)
        .then((response) => {
          this.ID = response.user.uid;
          const img_path =
            "curator/" + this.ID + "/image/" + signupWrapper.immageFile.name;
          Firebase.prototype
            .uploadImmageAsync(signupWrapper.immageFile, img_path)
            .then((ImageResponse) => {
              this.profileImmage = ImageResponse;
              Storage.prototype
                .postCuratorAsync({
                  [this.ID]: {
                    name: signupWrapper.name,
                    surname: signupWrapper.surname,
                    profileImmage: this.profileImmage,
                  },
                })
                .then((response) => {
                  return res(response);
                }).catch((err) => {
                  return rej(err);
                });
            });
        })
        .catch((err) => {
          return rej(err);
        });
    });
  }

  /**
   * Return the immage of the curator, if it's not available it returns a placeholder
   * @author Giulio Serra
   */
  getImmage(){
    if(this.profileImmage !== undefined){
      return this.profileImmage;
    }else{
      return placeholder;
    }
  }
}
