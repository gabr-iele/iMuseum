using System;
using System.Collections.Generic;

namespace iMuseum.Model
{
    /// <summary>
    /// Rapprensent a visit inside the museum
    /// </summary>
    /// @author Gabriele Ursini
    public class Visit
    {

        public String ID { get; set; }
        public long start { get; set; }
        public long end { get; set; }

        List<Piece> visited = new List<Piece>();

        public Museum parent; // parent museum where the visit is taking place

        public event EventHandler pieceSeen;
        


        public Visit(Museum parent)
        {
            start = DateTime.Now.Ticks;
            this.parent = parent;
        }

        /// <summary>
        /// Get the elapsed time from the beginning of the visit
        /// </summary>
        public String getElapsedTime {
            get {

                DateTime now = DateTime.Now;
                DateTime startTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                startTime = startTime.AddSeconds(this.start);
                startTime = startTime.AddHours(2);

                TimeSpan span = now.Subtract(startTime);

                return "Visit duration: " + span.Hours + "h " + span.Minutes + "m " + span.Seconds + "s ";

            }
        }

        public class visitWrapper {
            public String museumID;
            public long start;
            public long end;

            public Visit generateVisit(String ID,Museum parent) {
                return new Visit(parent)
                {
                   ID = ID,
                   start = start,
                   end = end
                };
            }
        }

        /// <summary>
        /// Add piece seen during a visit 
        /// </summary>
        /// @author Gabriele Ursini
        public void addPieceToList(Piece seen) {
            this.visited.Add(seen);
            if (pieceSeen != null)
                pieceSeen(this, new EventArgs());
        }

        /// <summary>
        /// End a visit
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> a wrapper with the response</returns>
        public String getVisitProgress {
            get {

                List<Piece> withoutRepetition = new List<Piece>();

                foreach (Piece piece in visited) {
                    if (!withoutRepetition.Contains(piece) && parent.pieces.Contains(piece)) { withoutRepetition.Add(piece); }
                }


                return withoutRepetition.Count + "/" + parent.pieces.Count + " pieces seen, keep discovering!";
            }
        }

        /// <summary>
        /// Return an uploadable version of the visit
        /// </summary>
        /// @author Gabriele Ursini
        public string getUploadableVersion()
        {
            var body = new Dictionary<String, Object>()
            {
                {"start",start},
                {"end",end},
                {"museumID",parent.ID},
                {"ID",ID }
            };

            return Newtonsoft.Json.JsonConvert.SerializeObject(body);
        }
    }
}
