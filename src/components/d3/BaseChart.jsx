import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";

window.d3 = d3;

class BaseChart extends React.Component {
    getD3Svg(width = 800, height = 600) {
        const svg = d3.select(this.svgRef);
        svg.attr('width', width);
        svg.attr('height', height);
        return svg;
    }

    getD3Canvas(width = 800, height = 600) {
        const canvas = d3.select(this.canvasRef);
        canvas.attr('width', width);
        canvas.attr('height', height);
        return canvas;
    }
   
    render() {
        return (
            <div className="chart-d3">
                <svg ref={(r) => this.svgRef = r}></svg>
                <div style={{clear:'both'}}></div>
                <canvas ref={(r) => this.canvasRef = r}></canvas>
            </div>
        )
    }
}

BaseChart.propTypes = {
    data: PropTypes.any,
};

export default BaseChart;