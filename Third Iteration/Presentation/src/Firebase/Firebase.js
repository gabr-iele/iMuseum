import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage'

import global from "../global.json";

const firebaseConfig = {
  apiKey: global.SERVICES.FIREBASE.API,
  authDomain: "iot2020-def28.firebaseapp.com",
  databaseURL: "https://iot2020-def28.firebaseio.com",
  projectId: "iot2020-def28",
  storageBucket: "iot2020-def28.appspot.com",
  messagingSenderId: "428607492320",
  appId: global.SERVICES.FIREBASE.APPID,
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const storage = firebase.storage();

export default class Firebase {


  /**
   * Close the firebase session
   * @author Giulio Serra
   * @returns {Object} containing the response of the signout operation
   */
  closeSessionAsync(){
    return new Promise((res, rej) => {
      auth.signOut().then(response=>{
        return res(response);
      }).catch(err=>{
        return rej(err);
      })
    })
  }

  /**
   * Signin a user inside the service, using email and password
   * @author Giulio Serra
   * @param {String} email [Email of the user]
   * @param {String} password [Password of the user]
   * @returns {Object} containing the response of the login operation
   */
  signInWithEmailAndPassword(email, password) {
    return new Promise((res, rej) => {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          return res(response);
        })
        .catch((err) => {
          return rej(err);
        });
    });
  }

  /**
   * Upload an immage in the database
   * @author Giulio Serra
   * @param {Array} bytes [Containing the data to upload]
   * @param {String} datapath [Path of the immage to upload, must contaib the filename at the end]
   * @returns {String} containing the url of the response of the upload operation
   */
  uploadImmageAsync(bytes,datapath){
    return new Promise((res, rej) => {
      storage.ref().child(datapath).put(bytes).then(response=>{
        response.ref.getDownloadURL().then(url=>{
          return res(url);
        })
       
      })
        .catch((err) => {
          return rej(err);
        });
    });
  }

   /**
   * Create a user with email and password
   * @author Giulio Serra
   * @param {String} email [Email of the user]
   * @param {String} password [Password of the user]
   * @returns {Object} containing the response of the user creation operation
   */
  createUserAsync(email, password) {
    return new Promise((res, rej) => {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
            return res(response);
        })
        .catch((err) => {
          return rej(err);
        });
    });
  }
}
