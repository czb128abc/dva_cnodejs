import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";

window.d3 = d3;

class BaseChart extends React.Component {
    getD3Svg(width = 400, height = 400) {
        const svg = d3.select(this.getChartDom());
        svg.attr('width', width);
        svg.attr('height', height);
        return svg;
    }
    getChartDom() {
        return this.chartRef;
    }
    render() {
        return (
            <div className="chart-d3">
                <svg ref={(r) => this.chartRef = r}></svg>
            </div>
        )
    }
}

BaseChart.propTypes = {
    data: PropTypes.any,
};

export default BaseChart;