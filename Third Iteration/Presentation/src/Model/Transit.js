
import System from "../System/System";
/**
 * Class that rappresent a transit
 * @author Giulio Serra
 */
export default class Transit {

    constructor(jTransit) {
        this.timestamp = jTransit.timestamp
        this.pieceID = jTransit.pieceID
        this.piece = jTransit.piece !== undefined? jTransit.piece : {};
      }

      /**
   * Return a wrapper to describe a transit
   * @author Giulio Serra <giulio.serra1995@gmail.com>
   * @returns {Object} [describing the object]
   */
    getWrapper(){
        let wrapper = {};


        const transit_date = new Date(this.timestamp * 1000);
        wrapper.time =  transit_date.getUTCHours() + ":" + transit_date.getUTCMinutes();
        wrapper.pieceName = "piece not found."
      
        if(!System.prototype.isObjectEmpty(this.piece)){
          wrapper.pieceName = this.piece.title;
          
        }

        return wrapper;
    }
}