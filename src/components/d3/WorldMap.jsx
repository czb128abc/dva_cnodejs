import BaseChart from './BaseChart';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import versor from '../../utils/versor';

export default class WorldMap extends BaseChart {
    componentDidMount() {
        this.createCanvas();
        this.createSVG();
    }
    createSVG() {
        const svg  = this.getD3Svg();
        const path = d3.geoPath();

        d3.json('https://d3js.org/us-10m.v1.json').then(us => {
            svg.append('g').attr('class', 'states')
                .selectAll('path')
                .data(topojson.feature(us, us.objects.land).features)
                .enter().append("path")
                .attr("d", path);
            svg.append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; })));
            
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
                land = topojson.feature(world, world.objects.land);
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