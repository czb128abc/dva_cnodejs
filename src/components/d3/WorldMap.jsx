import BaseChart from './BaseChart';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import versor from '../../utils/versor';
import './WorldMap.less';
import mapJson from '../../json/china';
import { decodeEchartsGeoJson } from '../../utils/echarts';

const worldJson = decodeEchartsGeoJson(mapJson);
console.log('mapJson', mapJson)
console.log('worldJson', worldJson)
export default class WorldMap extends BaseChart {
    componentDidMount() {
        this.createCanvas();
        this.createSVG();
    }
    createSVG() {
        const height = 800, width = 1200;
        const svg = this.getD3Svg(width, height);
        const path = d3.geoPath().projection(d3.geoMercator().scale((height - 10) / 2));
        const color = d3.scaleOrdinal(d3.schemeBlues[9]);
        d3.json('https://unpkg.com/world-atlas@1/world/110m.json').then(us => {
            console.log('topojson.feature(us, us.objects.countries).features', topojson.feature(us, us.objects.countries).features)
            svg.append('g')
                .attr('class', 'states')
                .selectAll('path')
                .style('fill-opacity', 1)
                .data(mapJson.features)
                .enter().append("path")
                .attr("d", path)
                .attr('fill', (d, i) => color(i))
                .style('fill-opacity', 0)
                .transition()
                .duration(200)
                .delay(function (d, i) {
                    return i;
                })
                .style('fill-opacity', 1);
            /**    
            svg.append('g').attr('class', 'map-title-wrapper')
                .selectAll('text')
                .data(worldJson.features)
                .enter()
                .append('text')
                .attr('class', 'map-title')
                .text(function (d) { return d.properties.name; })
                .attr('transform', function (d) {
                    const centroid = path.centroid(d),
                        x = centroid[0],
                        y = centroid[1];
                    return "translate(" + x + ", " + y + ")";
                });
            */

            //  svg.append('point')   
            // svg.append("path")
            //     .attr("class", "state-borders")
            //     .attr("d", path(topojson.mesh(us, us.objects.countries, function (a, b) { return a !== b; })));

            /**
            svg.append("g")
                .attr("class", "states")
              .selectAll("path")
              .data(topojson.feature(us, us.objects.states).features)
              .enter().append("path")
                .attr("d", path);
          
            svg.append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));    
            */
        });
    }
    createCanvas() {
        d3.json('https://unpkg.com/world-atlas@1/world/110m.json').then(world => {
            console.log('https://unpkg.com/world-atlas@1/world/110m.json', world);
            const canvas = this.getD3Canvas();
            console.log('canvas', canvas);

            const width = canvas.property('width'),
                height = canvas.property('height'),
                context = canvas.node().getContext('2d');

            const projection = d3.geoOrthographic()
                .scale((height - 10) / 2)
                .translate([width / 2, height / 2])
                .precision(0.1);
            const path = d3.geoPath()
                .projection(projection)
                .context(context);
            // const path =d3.geoPath().context(context);


            canvas.call(
                d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
            )

            const sphere = { type: 'Sphere' },
                land = topojson.feature(world, world.objects.countries);
            console.log('land', land)

            function render() {
                context.clearRect(0, 0, width, height);
                // context.beginPath(), path(sphere), context.fillStyle = 'gray', context.stroke();
                context.beginPath(), path(land), context.fillStyle = 'blue', context.fill();
                // context.beginPath(), path(sphere),context.fillStyle = 'green',context.strokeStyle="#FF0000",context.stroke();
            }

            let v0, // Mouse position in Cartesian coordinates at start of drag gesture.
                r0, // Projection rotation as Euler angles at start.
                q0; // Projection rotation as versor at start.

            function dragstarted() {
                v0 = versor.cartesian(projection.invert(d3.mouse(this)));
                r0 = projection.rotate();
                q0 = versor(r0);
            }

            function dragged() {
                var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this))),
                    q1 = versor.multiply(q0, versor.delta(v0, v1)),
                    r1 = versor.rotation(q1);
                projection.rotate(r1);
                render();
            }

            render();
        });
    }
}