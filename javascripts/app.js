$(document).ready(function(){

    d3.selectAll('#nav .link').on('click', function() {
        d3.select(this).style('color', 'red')
    });



    const hexRadius = 30;
    const hexPadding = 0.5;
    const svg = d3.select('svg');
    const svgDiv = d3.select('#hexbin-div');
    const width = svg.style('width').replace('px', '');
    const height = svg.style('height').replace('px', '');
    const numRandomPoints = 2000; // Total number of random points.
    const replacePerFrame = 20; // Number of points to replace per frame.
    const color = d3.scaleSequential(d3.interpolateLab('#f7f7f4', '#0a8282'))
        .domain([0, 5]);

    const delta = 0.002;
    let i = 0;

    let rx = d3.randomNormal(width / 2, width);
    let ry = d3.randomNormal(height / 2, height);
    let points = d3.range(numRandomPoints).map(function() { return [rx(), ry()]; });

    var hexbin = d3.hexbin()
        .radius(hexRadius)
        .extent([[0, 0], [width, height]]);

    var hexagon = svg.selectAll('path')
        .data(hexbin(points))
        .enter().append('path')
            .attr('d', hexbin.hexagon(hexRadius - hexPadding))
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .attr('fill', function(d) { return color(d.length); });

    d3.timer(function(elapsed) {
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
            .attr('d', hexbin.hexagon(hexRadius - hexPadding))
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .merge(hexagon)
                .attr('fill', function(d) { return color(d.length); });

    }); // end timer funtion

}) // end all javascript
