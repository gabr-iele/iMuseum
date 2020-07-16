const System = require("../System/System");
const visit = require("../Model/Visit");

/**
 * @author Giulio Serra
 * [Compute the attendance of a piece inside the museum]
 * @param  {String} pieceID [ID of the piece to compute the attendance]
 * @param  {Object} visits [All the visit that took place inside the museum]
 * @param  {JSON} object [object describing the new record , must be in ID:{...} format]
 */
exports.getPieceAttendance = function(pieceID,visits){

    if(visits === undefined || System.isObjectEmpty(visits)){
        return "not enough data."
    }

    let total_visit_count = 0;
    let visit_where_piece_seen = 0;

    for(const visitID in visits){
        total_visit_count += 1;
        let current = visits[visitID];
        current.ID = visitID;

        const obj_visit = new visit.Visit(current);
        if(obj_visit.doesPieceHasBeenSee(pieceID)){visit_where_piece_seen += 1;}
    }

    if(visit_where_piece_seen === 0){return "low"}
    if(visit_where_piece_seen >= ((total_visit_count * 2) / 3)){return "high"}
    if(visit_where_piece_seen >= (total_visit_count / 2)){return "medium"}
    
    return "low";

}