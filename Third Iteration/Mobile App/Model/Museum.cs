using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using iMuseum.PersistanceStorage;

namespace iMuseum.Model
{
    /// <summary>
    /// Rappresent a museum
    /// </summary>
    /// @author Gabriele Ursini
    public class Museum
    {

        public string ID { get; set; }
        string curatorID { get; set; }
        string name { get; set; }
        string coverImmage { get; set; }

        long openingHours { get; set; }
        long closingHours { get; set; }

        double latitude { get; set; }
        double longitude { get; set; }

        string street { get; set; }
        string city { get; set; }
        string postalCode { get; set; }

        /// <summary>
        /// Get the time of a closure expressed as a date
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> a Date </returns>
        public DateTime getClosureDateTime {
            get {
                TimeSpan time = TimeSpan.FromMilliseconds(this.closingHours);
                DateTime startdate = new DateTime(1970, 1, 1) + time;
                return startdate.AddHours(1);
            }
        }

        public List<Piece> pieces = new List<Piece>();

        public Visit current;

        /// <summary>
        /// Check if there is a visit in progress inside the museum
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> Return true if there is a visit in progres, otherwise false </returns>
        public bool isThereAVisitInProgress {
            get {
                return current != null;
            }
        }

        /// <summary>
        /// Returns all the IDs of the sensors on the pieces inside the museums
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> a list with all the sensors IDS </returns>
        public List<string> getAllSensorID() {
            List<string> ids = new List<string>();

            foreach(Piece current in this.pieces) {
                ids.Add(current.sensorID);
            }

            return ids;
        }

        public Museum()
        {

        }

        public class museumWrapper {

            public string curatorID { get; set; }
            public string name { get; set; }
            public string coverImmage { get; set; }

            public long openingHours { get; set; }
            public long closingHours { get; set; }

            public double latitude { get; set; }
            public double longitude { get; set; }

            public string street { get; set; }
            public string city { get; set; }
            public string postalCode { get; set; }

            public Dictionary<String, Piece.pieceWrapper> pieces;

            public Museum generateMuseum(String ID) {

                Museum museum = new Museum()
                {
                    ID = ID,
                    curatorID = this.curatorID,

                    name = this.name,
                    coverImmage = this.coverImmage,

                    openingHours = this.openingHours,
                    closingHours = this.closingHours,

                    latitude = this.latitude,
                    longitude = this.longitude,

                    street = this.street,
                    city = this.city,
                    postalCode = this.postalCode
                };

                if (pieces != null) {
                    foreach (String pieceID in pieces.Keys) {
                        Piece piece = pieces[pieceID].createPiece(pieceID);
                        museum.pieces.Add(piece);
                    }
                }

                return museum;
            }
        }


        /// <summary>
        /// Create a new visit inside the museum
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> a wrapper with the response</returns>
        public async Task<PersistanceStorage.PersistanceStorage.visitWrapper> startVisitAsync() {

            var request = await PersistanceStorage.PersistanceStorage.Instance.postVisitBeginAsync(this);

            if (request.isSuccessFull()) {
                current = request.getVisit(this);
            }

            return request;
        }

        /// <summary>
        /// End a visit
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> a wrapper with the response</returns>
        public async Task<PersistanceStorage.PersistanceStorage.visitWrapper> endVisitAsync() {

            if (this.current == null) {
                return new PersistanceStorage.PersistanceStorage.visitWrapper() { code = "500", message="There is no visit in progress to end" };
            }

            var request = await PersistanceStorage.PersistanceStorage.Instance.postVisitEndAsync(current);

            if (request.isSuccessFull()) { this.current = null; }

            return request;
        }

        /// <summary>
        /// Return the description of the closure hours
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> the descriprion of the museum</returns>
        public string getClosureDescription {
            get {
                return "The museum will close at " + this.getClosureDateTime.Hour; 
            }
        }

        /// <summary>
        /// Return the description of the museum
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> the descriprion of the museum</returns>
        public string getMuseumDescription {
            get{
                return "Welcome to the " + this.name + " museum of " + this.city + "!"; 
            }
        }

        /// <summary>
        /// Return the cover of the museum
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> The url of the cover of the museum or a placeholder</returns>
        public String getMuseumImage {
            get {
                if (this.coverImmage != null) return this.coverImmage;
                else if (App.isIosPlatform())
                    return "placeholder.png";
                else
                {
                  return "drawable/placeholder.png";
                    
                }

            }
        }
    }
}
