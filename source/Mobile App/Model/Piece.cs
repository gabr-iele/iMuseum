using System;
namespace iMuseum.Model
{

    /// <summary>
    /// Rappresent a piece inside the museum
    /// </summary>
    /// @author Gabriele Ursini
    public class Piece
    {
        string ID { get; set; }
        public string image { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string sensorID { get; set; }

        public Piece()
        {
        }

        /// <summary>
        /// Return the image of a the piece
        /// </summary>
        /// @author Gabriele Ursini
        /// <returns> The url of the cover of the museum or a placeholder</returns>
        public String getPieceImage
        {
            get
            {
                if (this.image != null) return this.image;
                else if (App.isIosPlatform())
                    return "placeholder.png";
                else
                {
                    return "drawable/placeholder.png";

                }

            }
        }

        public class pieceWrapper {
            public string image { get; set; }
            public string title { get; set; }
            public string description { get; set; }
            public string sensorID { get; set; }

            public Piece createPiece(String ID) {
                return new Piece()
                {
                    image = this.image,
                    title = this.title,
                    description = this.description,
                    ID = ID,
                    sensorID = sensorID
                };
            }
        }

        public override bool Equals(object obj)
        {
            if (obj is Piece) {
                var that = (Piece)obj;
                return this.ID.Equals(that.ID);
            }

            return false;
        }

        public override int GetHashCode()
        {
            return this.ID.GetHashCode();
        }
    }
}
