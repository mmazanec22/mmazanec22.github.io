/*
TODO:
    re-hexbin on resize?

*/



document.addEventListener("DOMContentLoaded", function() {

    d3.select('#info .cv').style('display', 'none')

    d3.selectAll('#nav .link').on('click', function() {

        const clickedThing = d3.select(this)

        if (clickedThing.classed('bio')) {
            d3.select('#info .cv').style('display', 'none')
            d3.select('#info .bio').style('display', 'unset')
        } else {
            d3.select('#info .cv').style('display', 'unset')
            d3.select('#info .bio').style('display', 'none')
        }

    });

    const timeToRun = 3000;
    const hexRadius = 20;
    const svg = d3.select('svg');
    const svgDiv = d3.select('#hexbin-div');
    const width = svg.style('width').replace('px', '');
    const height = svg.style('height').replace('px', '');
    const numRandomPoints = 2000; // Total number of random points.
    const replacePerFrame = 15; // Number of points to replace per frame.
    const color = d3.scaleSequential(d3.interpolateLab('#f7f7f4', '#0a8282'))
        .domain([0, 3]);

    const delta = 0.001;
    let i = 1;

    let rx = d3.randomNormal(width / 10, width / 2);
    let ry = d3.randomNormal(height / 2, height);
    let points = d3.range(numRandomPoints).map(function() { return [rx(), ry()]; });

    var hexbin = d3.hexbin()
        .radius(hexRadius)
        .extent([[0, 0], [width, height]]);

    var hexagon = svg.selectAll('path')
        .data(hexbin(points))
        .enter().append('path')
            .attr('d', hexbin.hexagon(hexRadius))
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .attr('fill', function(d) { return color(d.length); });

    const t = d3.timer(function(elapsed) {

        rx = d3.randomNormal( (width / 2) * (elapsed * delta), (width / i));
        ry = d3.randomNormal(height / 2 * (elapsed * delta), height);
  
        for (let j = 1; j < replacePerFrame; j++, i = (i + 4) % numRandomPoints) {
            points[i][0] = rx();
            points[i][1] = ry();
        }

        hexagon = hexagon
            .data(hexbin(points), function(d) { return d.x + ',' + d.y; });

        hexagon.exit().remove();

        hexagon = hexagon.enter().append('path')
            .attr('d', hexbin.hexagon(hexRadius))
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .merge(hexagon)
                .attr('stroke', function(d) { return color(d.length); })
                .attr('fill', function(d) { return color(d.length); })
                .attr('fill-opacity', 0.3)
                .attr('stroke-opacity', 0.4)
                .attr('opacity', 0.6 / (elapsed / timeToRun))

        if (elapsed > timeToRun) {
            t.stop();
            // hexagon
            //     .transition()
            //     .duration(2000)
            //     .style('opacity', 0.5)
        }

    }); // end timer funtion

});
