import System from "../System/System";
import Comparator from "../Comparator/Comparator"

/**
 * Class that rappresent a visit
 * @author Giulio Serra
 */
export default class Visit {
  constructor(jVisit) {
    this.ID = jVisit.ID;
    this.end = jVisit.end;
    this.start = jVisit.start;
    this.transits = jVisit.transits !== undefined? jVisit.transits : [];
    this.parent = jVisit.parent
  }

  getSortedTransits(){
    if(this.transits === undefined || this.transits.length === 0){return {}}
    const sorted_transits = Comparator.prototype.transitDateComparator(this.transits);
    const parent_museum = System.prototype.getJsonFromKeyValueForm(this.parent);

    let response = {}
    
    for(const timestamp in sorted_transits){
      let transit = sorted_transits[timestamp];
      const piece = parent_museum.pieces[transit.pieceID];
      transit.piece = piece;
      response = Object.assign(response,{[timestamp]:transit})
    }


    return response;

  }

   /**
   * Returns the begin of a visit
   * @author Giulio Serra
   */
  getBeginningDateDescription() {
    return new Date(this.start * 1000).toUTCString()
  }

   /**
   * Returns the end of a visit
   * @author Giulio Serra
   */
  getEndDateDescription() {
    return new Date(this.end * 1000).toUTCString()
  }
}
