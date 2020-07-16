import System from "../System/System";

/**
 * Pure fabrication that order objects
 * @author Giulio Serra <giulio.serra1995@gmail.com>
 */
export default class Comparator {
  /**
   * Order visits based on the beginning date
   * @author Giulio Serra <giulio.serra1995@gmail.com>
   * @param {JSON} visits [Visits to sort in the format {visitID:{eventbody}}]
   * @returns {JSON} [Of ordered visits]
   */
  visitsDateComparator(visits) {
    if (System.prototype.isObjectEmpty(visits)) return {};

    var sorted = {};
    var objectsArray = []; // array to sort

    for (const visitID in visits) {
      let visit = visits[visitID];
      visit.ID = visitID;
      objectsArray.push(visit);
    }

    objectsArray.sort(function (visitA, visitB) {
      return visitB.start - visitA.start;
    });

    for (const index in objectsArray) {
      const visit = objectsArray[index];
      sorted = Object.assign(sorted, { [visit.ID]: visit });
    }

    return sorted;
  }

   /**
   * Order transits based on the date
   * @author Giulio Serra <giulio.serra1995@gmail.com>
   * @param {JSON} transits [transits to sort]
   * @returns {JSON} [Of ordered visits]
   */
  transitDateComparator(transits){

    if (transits === undefined || transits.lenght === 0) {
      return {} 
    };

    var sorted = {};
    var sortedStamps = []; // array to sort

    for (const index in transits) {
      const transit = transits[index];
      const timeStamp = Object.keys(transit)[0];
      sortedStamps.push(timeStamp);
    }

    sortedStamps.sort(function (stampA, stampB) {
      return stampB - stampA;
    });

    for (const index in sortedStamps) {
      const timestamp_key = sortedStamps[index];

      for (const transit_index in transits) {
        const transit = transits[index];
        const timeStamp = Object.keys(transit)[0];
        const pieceID = transit[timeStamp];

        sorted = Object.assign(sorted,{[timeStamp]:{timestamp:timeStamp,pieceID:pieceID}})
        
      }
    }
    return sorted;
  }

}
