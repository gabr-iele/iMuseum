using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using iMuseum.Model;
using Newtonsoft.Json;

namespace iMuseum.PersistanceStorage
{
    public class PersistanceStorage
    {
        public PersistanceStorage()
        {
        }

        private static readonly PersistanceStorage instance = new PersistanceStorage();
        public static PersistanceStorage Instance // single istance of the persistance Storage
        {
            get
            {
                return instance;
            }
        }

        static PersistanceStorage()
        {
        }

        private const string URLREST = "https://europe-west1-iot2020-def28.cloudfunctions.net"; // endpoint to comunicate with iMusuem API
        private HttpClient RestClient = new HttpClient();



        public class requestWrapper {
            public double lat;
            public double lon;
            public double range;

            public requestWrapper() {
                range = 1; // a museum is near if it's in a 1km range
            }
        }

        public class persistanceStorageWrapper
        {

            public String message;
            public String code;

            public bool isSuccessFull() { return code.Equals("200"); }

        }

        public class museumWrappper : persistanceStorageWrapper {
            public Dictionary<String, Museum.museumWrapper> data;

            public Museum getMuseum() {

                if (data != null)
                {
                    foreach (String museumID in data.Keys)
                    {
                        return data[museumID].generateMuseum(museumID);
                    }
                }

                return null;
            }
        }

        public class pieceWrapper : persistanceStorageWrapper {
            public Dictionary<String, Piece.pieceWrapper> data;

            public Piece getPiece() {
                if (data != null) {
                    foreach (String pieceID in data.Keys) {
                        return data[pieceID].createPiece(pieceID);
                    }
                }

                return null;
            }
        }

        public class visitWrapper : persistanceStorageWrapper {
            public Dictionary<String, Visit.visitWrapper> data;

            public Visit getVisit(Museum parent)
            {
                if (data != null)
                {
                    foreach (String pieceID in data.Keys)
                    {
                        return data[pieceID].generateVisit(pieceID, parent);
                    }
                }

                return null;
            }
        }


        /// <summary>
        /// Get a resource using the rest client
        /// </summary>
        /// <returns>The data.</returns>
        /// <param name="url">URL.</param>
        public async Task<HttpResponseMessage> requestData(String url)
        {
            var uri = new Uri(string.Format(url, string.Empty));
            return await RestClient.GetAsync(uri);
        }

        /// <summary>
        /// Return the closest museum for the user position 
        /// </summary>
        /// @Author Gabriele Ursini
        /// <returns>
        /// A wrapper containing the information of the closest museum or nothing
        /// </returns>
        public async Task<museumWrappper> getClosestMuseumAsync(requestWrapper requestWrapper)
        {
            var url = URLREST + "/getMuseumFromPosition?test=false" + "&lat=" + requestWrapper.lat + "&lon=" + requestWrapper.lon + "&range=" + requestWrapper.range;
            var request = await requestData(url);
            if (request.IsSuccessStatusCode)
            {
                try
                {

                    var response = await request.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<museumWrappper>(response);

                }
                catch (Exception e)
                {
                    return new museumWrappper()
                    {
                        message = e.Message,
                        code = "500"
                    };
                }

            }

            return new museumWrappper()
            {
                message = request.ReasonPhrase,
                code = "500"
            };
        }

        /// <summary>
        /// Return a museum from the ID
        /// </summary>
        /// @Author Gabriele Ursini
        /// <returns>
        /// A wrapper containing the information of the museum or nothing
        /// </returns>
        public async Task<museumWrappper> getMuseumFromIDAsync(String museumID)
        {
            var url = URLREST + "/getMuseumFromID/" + museumID;
            var request = await requestData(url);
            if (request.IsSuccessStatusCode)
            {
                try
                {

                    var response = await request.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<museumWrappper>(response);

                }
                catch (Exception e)
                {
                    return new museumWrappper()
                    {
                        message = e.Message,
                        code = "500"
                    };
                }

            }

            return new museumWrappper()
            {
                message = request.ReasonPhrase,
                code = "500"
            };
        }


        /// <summary>
        /// Return a piece from the ID of a sensor
        /// </summary>
        /// @Author Gabriele Ursini
        /// <returns>
        /// A wrapper containing the piece or error
        /// </returns>
        public async Task<pieceWrapper> getPieceFromSensor(String sensorID,String visitID) {

            var url = URLREST + "/getPieceFromSensorID?test=false" + "&sensorID=" + sensorID + "&visitID=" + visitID;
            var request = await requestData(url);
            if (request.IsSuccessStatusCode)
            {
                try
                {
                    var response = await request.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<pieceWrapper>(response);

                }
                catch (Exception e)
                {

                    return new pieceWrapper()
                    {
                        message = e.Message,
                        code = "500"
                    };
                }

            }

            return new pieceWrapper()
            {
                message = request.ReasonPhrase,
                code = "500"
            };
        }


        /// <summary>
        /// Create a new visit in the persistance storage
        /// </summary>
        /// @Author Gabriele Ursini
        /// <returns>
        /// A wrapper containing the response
        /// </returns>
        public async Task<visitWrapper> postVisitBeginAsync(Museum museum) {

            var url = URLREST + "/postVisitStart/" + museum.ID;
            var request = await requestData(url);
            if (request.IsSuccessStatusCode)
            {
                try
                {
                    var response = await request.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<visitWrapper>(response);

                }
                catch (Exception e)
                {

                    return new visitWrapper()
                    {
                        message = e.Message,
                        code = "500"
                    };
                }

            }

            return new visitWrapper()
            {
                message = request.ReasonPhrase,
                code = "500"
            };
        }


        /// <summary>
        /// End a visit in the persistance storage
        /// </summary>
        /// @Author Gabriele Ursini
        /// <returns>
        /// A wrapper containing the response
        /// </returns>
        public async Task<visitWrapper> postVisitEndAsync(Visit visit) {

            var url = URLREST + "/postVisitEnd";
            var response = await new HttpClient().PostAsync(url, new StringContent(visit.getUploadableVersion(), Encoding.UTF8, "application/json"));

            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var recensioneRequest = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<visitWrapper>(recensioneRequest);

                }
                catch (Exception e)
                {

                    return new visitWrapper()
                    {
                        code = "500",
                        message = e.Message
                    };
                }
            }

            return new visitWrapper()
            {
                code = "500",
                message = response.ReasonPhrase
            };
        }
        

    }
}
