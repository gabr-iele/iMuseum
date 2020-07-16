const storage = require("../PersistanceStorage/PersistanceStorage");

function Curator(jbody) {
  let ID = jbody.ID;
  let name = jbody.name;
  let surname = jbody.surname;
  let profileImmage = jbody.profileImmage;

  /***
   * @author Giulio Serra
   * [Validate the information of the curator]
   */
  this.validate = function () {
    if (ID === undefined) {
      return { code: "400", message: "missing ID of the curator!" };
    }

    if (name === undefined) {
      return { code: "400", message: "missing name of the curator!" };
    }

    if (surname === undefined) {
      return { code: "400", message: "missing surname of the curator!" };
    }

    if (profileImmage === undefined) {
      return { code: "400", message: "missing profile immage of the curator!" };
    }

    return { code: "200", message: "ok" };
  };

  /***
   * @author Giulio Serra
   * [Post a curator in the persistance storage]
   */
  this.postAsync = function () {
    return new Promise((res, rej) => {
      const path = "Curator/";
      const body = {
        name: name,
        surname: surname,
        profileImmage: profileImmage,
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
}

exports.Curator = Curator;
