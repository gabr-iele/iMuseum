import Geocode from "react-geocode";
import global from "../global.json";
/**
 * Pure Fabrication that rappresent a geocoder
 * @author Giulio Serra
 */
export default class Geocoder {




  getCoordinatesFromAddressAsync(address) {
    return new Promise((res, rej) => {
      Geocode.setApiKey(global.SERVICES.GOOGLEMAPS.API);
      Geocode.setLanguage("en");
      Geocode.enableDebug();
      Geocode.fromAddress(address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          return res({ lat: lat, long: lng });
        },
        (error) => {
          return rej(error);
        }
      );
    });
  }
}
