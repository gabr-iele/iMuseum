const functions = require("firebase-functions");
const admin = require("firebase-admin");
const qs = require("uqs"); // required to parse parameters from URL
const cors = require("cors")({ origin: true }); // allow HTTP calls even in develop mode

const storage = require("./PersistanceStorage/PersistanceStorage");
const system = require("./System/System");

const curator = require("./Model/Curator");
const museum = require("./Model/Museum");
const piece = require("./Model/Piece");
const sensor = require("./Model/Sensor");
const visit = require("./Model/Visit");

//needed to initialize the app
admin.initializeApp();

const REGION = "europe-west1"; // regione to deploy functions

/***
 * @author Giulio Serra
 * [Pack all the informations to return it to the user]
 * @param {String} message [Message to return as a response]
 * @param {String} code [Code of the response]
 * @param {Object} data [Data of the response]
 * @returns {Object} [Containing the data to return from a request]
 */
function packData(data, message, code) {
  return (packagedData = {
    message: message,
    code: code,
    data: data,
  });
}

/***
 * @author Giulio Serra
 * [Post a curator inside the Persistance Storage]
 */
exports.postCurator = functions.region(REGION).https.onRequest((req, res) => {
  cors(req, res, () => {
    const body = req.body;

    if (system.isObjectEmpty(body)) {
      return res
        .status(400)
        .send(packData(null, "missing body in the request.", 400));
    }

    const jCurator = system.getJsonFromKeyValueForm(body);
    const newCurator = new curator.Curator(jCurator);
    const validation = newCurator.validate();

    if (validation.code !== "200") {
      return res.status(400).send(packData(null, validation.message, 400));
    }

    return newCurator
      .postAsync()
      .then((response) => {
        return res.status(200).send(packData(body, "ok", "200"));
      })
      .catch((err) => {
        return res.status(500).send(packData(null, err.message, "500"));
      });
  });
});

/***
 * @author Giulio Serra
 * [Post a piece inside the Persistance Storage]
 */
exports.postPiece = functions.region(REGION).https.onRequest((req, res) => {
  cors(req, res, () => {
    const body = req.body;

    if (system.isObjectEmpty(body)) {
      return res
        .status(400)
        .send(packData(null, "missing body in the request.", 400));
    }

    const jPiece = system.getJsonFromKeyValueForm(body);
    const newPiece = new piece.Piece(jPiece);
    const validation = newPiece.validate();

    if (validation.code !== "200") {
      return res.status(400).send(packData(null, validation.message, 400));
    }

    return newPiece
      .postAsync()
      .then((response) => {
        return res.status(200).send(packData(body, "ok", "200"));
      })
      .catch((err) => {
        return res.status(500).send(packData(null, err.message, "500"));
      });
  });
});


/***
 * @author Giulio Serra
 * [Post a sensor in the persistance storage]
 */
exports.postSensor = functions.region(REGION).https.onRequest((req, res) => {
  cors(req, res, () => {
    const body = req.body;

    if (system.isObjectEmpty(body)) {
      return res
        .status(400)
        .send(packData(null, "missing body in the request.", 400));
    }

    const newSensor = new sensor.Sensor(body);
    return newSensor
      .postAsync()
      .then((response) => {
        return res.status(200).send(packData(response, "ok", "200"));
      })
      .catch((err) => {
        return res.status(500).send(packData(null, err.message, "500"));
      });
  });
});

/***
 * @author Giulio Serra
 * [Put a sensor in the persistance storage]
 */
exports.putSensor = functions.region(REGION).https.onRequest((req, res) => {
  cors(req, res, () => {
    const body = req.body;

    if (system.isObjectEmpty(body)) {
      return res
        .status(400)
        .send(packData(null, "missing body in the request.", 400));
    }

    const sensor_to_update = new sensor.Sensor(
      system.getJsonFromKeyValueForm(body)
    );
    return sensor_to_update
      .updateStatusAsync()
      .then((response) => {
        return res.status(200).send(packData(response, "ok", "200"));
      })
      .catch((err) => {
        return res.status(500).send(packData(null, err.message, "500"));
      });
  });
});


/***
 * @author Giulio Serra
 * [Post the beginning of a visit]
 */
exports.postVisitStart = functions
  .region(REGION)
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      const params = qs.parse(req.url);
      const museum_uid = req.url.replace("/", "");

      if (museum_uid === undefined) {
        return res
          .status(400)
          .send(
            packData(
              null,
              "missing uid of the musuem where the visit is taking place",
              400
            )
          );
      }

      const new_visit = new visit.Visit({ museumID: museum_uid });
      return new_visit
        .postBeginningAsync()
        .then((response) => {
          return res.status(200).send(packData(response, "ok", "200"));
        })
        .catch((err) => {
          return res.status(500).send(packData(null, err.message, "500"));
        });
    });
  });

/***
 * @author Giulio Serra
 * [Post the end of a visit]
 */
exports.postVisitEnd = functions.region(REGION).https.onRequest((req, res) => {
  cors(req, res, () => {
    const params = qs.parse(req.url);
    const body = req.body;

    if (system.isObjectEmpty(body)) {
      return res
        .status(400)
        .send(packData(null, "missing body in the request.", 400));
    }

    const new_visit = new visit.Visit(body);
    return new_visit
      .postEndAsync()
      .then((response) => {
        return res.status(200).send(packData(response, "ok", "200"));
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send(packData(null, err.message, "500"));
      });
  });
});

/***
 * @author Giulio Serra
 * [Post a museum inside the Persistance Storage]
 */
exports.postMuseum = functions.region(REGION).https.onRequest((req, res) => {
  cors(req, res, () => {
    const body = req.body;

    if (system.isObjectEmpty(body)) {
      return res
        .status(400)
        .send(packData(null, "missing body in the request.", 400));
    }

    const jMuseum = system.getJsonFromKeyValueForm(body);
    const newMuseum = new museum.Museum(jMuseum);

    const validation = newMuseum.validate();

    if (validation.code !== "200") {
      return res.status(400).send(packData(null, validation.message, 400));
    }

    return newMuseum
      .postAsync()
      .then((response) => {
        return res.status(200).send(packData(body, "ok", "200"));
      })
      .catch((err) => {
        return res.status(500).send(packData(null, err.message, "500"));
      });
  });
});


/***
 * @author Giulio Serra
 * [Update a museum inside the Persistance Storage]
 */
exports.putMuseum = functions.region(REGION).https.onRequest((req, res) => {
  cors(req, res, () => {
    const body = req.body;

    if (system.isObjectEmpty(body)) {
      return res
        .status(400)
        .send(packData(null, "missing body in the request.", 400));
    }

    const jMuseum = system.getJsonFromKeyValueForm(body);
    const newMuseum = new museum.Museum(jMuseum);

    const validation = newMuseum.validate();

    if (validation.code !== "200") {
      return res.status(400).send(packData(null, validation.message, 400));
    }

    return newMuseum
      .postAsync()
      .then((response) => {
        return res.status(200).send(packData(body, "ok", "200"));
      })
      .catch((err) => {
        return res.status(500).send(packData(null, err.message, "500"));
      });
  })
})

/***
 * @author Giulio Serra
 * [Get a curator from the Persistance Storage]
 */
exports.getCurator = functions.region(REGION).https.onRequest((req, res) => {
  cors(req, res, () => {
    const params = qs.parse(req.url);
    const uid = req.url.replace("/", "");

    if (uid === undefined) {
      return res.status(400).send(packData(null, "missing curator uid", 400));
    }

    return storage
      .getCuratorsGraphAsync(uid)
      .then((response) => {
        return res.status(200).send(packData(response, "ok", "200"));
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send(packData(null, err.message, "500"));
      });
  });
});

/***
 * @author Giulio Serra
 * [Get a piece from the ID of the sensor attached on it]
 */
exports.getPieceFromSensorID = functions
  .region(REGION)
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      const params = qs.parse(req.url);
      const sensor_uid = params.sensorID;
      const visit = params.visitID;

      if (sensor_uid === undefined) {
        return res
          .status(400)
          .send(packData(null, "missing uid of the sensor", 400));
      }

      return storage
        .getPieceFromSensorID(sensor_uid)
        .then((response) => {
          if (visit !== undefined) {
            const piece = system.getJsonFromKeyValueForm(response);
            const wrapper = {
              pieceID: piece.ID,
              visitID: visit,
            };

            return storage.postTransit(wrapper).then((transit)=>{
              return res.status(200).send(packData(response, "ok", "200"));
            }).catch((err) => {
              console.log(err);
              return res.status(500).send(packData(null, err.message, "500"));
            });
          }else{
            return res.status(200).send(packData(response, "ok", "200"));
          }

        })
        .catch((err) => {
          return res.status(500).send(packData(null, err.message, "500"));
        });
    });
  });

/***
 * @author Giulio Serra
 * [Return the closest museum from a position]
 */
exports.getMuseumFromPosition = functions
  .region(REGION)
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      var params = qs.parse(req.url);

      var position = {
        lat: parseFloat(params.lat),
        lon: parseFloat(params.lon),
      };

      const range = parseFloat(params.range);

      if (params.lat === undefined || params.lon === undefined) {
        return res
          .status(400)
          .send(
            packData(null, "Missing either laititude or longitude.", "400")
          );
      }

      if (range === undefined) {
        return res.status(400).send(packData(null, "Missing range.", "400"));
      }

      const str_lat = new String(params.lat);
      const str_lon = new String(params.lon);

      const lat_flot = parseFloat(str_lat.replace(",", "."));
      const lon_float = parseFloat(str_lon.replace(",", "."));

      console.log(lat_flot + " " + lon_float);

      return storage
        .getMuseumFromDistanceAsync({
          lat: lat_flot,
          lon: lon_float,
          range: range,
        })
        .then((response) => {
          return res.status(200).send(packData(response, "ok", "200"));
        })
        .catch((err) => {
          return res.status(500).send(packData(null, err.message, "500"));
        });
    });
  });

/***
 * @author Giulio Serra
 * [Return a museum from an ID *ONLY FOR DEBUG PURPOSES*]
 */
exports.getMuseumFromID = functions
  .region(REGION)
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      const params = qs.parse(req.url);
      const uid = req.url.replace("/", "");

      if (uid === undefined) {
        return res.status(400).send(packData(null, "missing museum uid", 400));
      }

      return storage
        .getMuseumGrapFromIDAsync(uid)
        .then((response) => {
          return res.status(200).send(packData(response, "ok", "200"));
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send(packData(null, err.message, "500"));
        });
    });
  });

/***
 * @author Giulio Serra
 * [Delete a piece in the storage]
 */
exports.deletePiece = functions.region(REGION).https.onRequest((req, res) => {
  cors(req, res, () => {
    const params = qs.parse(req.url);
    const uid = req.url.replace("/", "");

    if (uid === undefined) {
      return res.status(400).send(packData(null, "missing piece uid", 400));
    }

    const path = "Piece/" + uid;
    return storage
      .deleteRecord(path)
      .then((response) => {
        return res.status(200).send(packData(response, "ok", "200"));
      })
      .catch((err) => {
        return res.status(500).send(packData(null, err.message, "500"));
      });
  });
});
