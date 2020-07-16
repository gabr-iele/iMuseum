import React, { Component } from "react";
import { Graph } from "react-d3-graph";
import global from "../global.json";
import System from "../System/System";

/**
 * Class to display to a user the dashboard of his/her museum
 * @author Giulio Serra
 */
export default class VisitGraph extends Component {
  generateDataFromTransits(transits) {
    let data = {
      nodes: [],
      links: [],
    };

    if (transits === undefined || System.prototype.isObjectEmpty(transits)) {
      return data;
    }

    let precursor = {id:"start"}; // last node created
    data.nodes.push(precursor);

    let created = {}; // all the created nodes

    for (const timestamp in transits) {
      const current_transit = transits[timestamp];
      const piece = current_transit.piece;

      if (piece !== undefined) {
        const new_node = { id: piece.title };

        if (created[piece.title] !== undefined) {
          data.links.push({ source: precursor.id, target: new_node.id });
        } else {
          data.nodes.push(new_node);
          created = Object.assign(created, { [piece.title]: new_node });
          data.links.push({ source: precursor.id, target: new_node.id });
        }

        precursor = new_node;
      }
    }

    data.nodes.push({id:"end"})
    data.links.push({source:precursor.id,target:"end"})
    
    return data;
  }

  render() {

    if(this.props.transits === undefined || 
        System.prototype.isObjectEmpty(this.props.transits)){ return <div></div>};

    const data = this.generateDataFromTransits(this.props.transits);

    if(System.prototype.isObjectEmpty(data)){ return <div></div>}


    // the graph configuration, you only need to pass down properties
    // that you want to override, otherwise default ones will be used
    const myConfig = {
      nodeHighlightBehavior: true,
      automaticRearrangeAfterDropNode: false,
      directed: true,
      height: 400,
      maxZoom: 8,
      minZoom: 0.1,
      panAndZoom: true,
      staticGraph: false,
      node: {
        color: global.GUI.RED,
        size: 200,
        highlightStrokeColor: global.GUI.GREY,
      },
      link: {
        highlightColor: global.GUI.RED,
      },
    };
    return (
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={data}
        config={myConfig}
      />
    );
  }
}
