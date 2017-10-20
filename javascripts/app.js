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
    renderHexbins()
    stickFooterToBottom()
});

window.addEventListener("resize", function() {
    renderHexbins()
    stickFooterToBottom()
});

const cvEvents = [
    {
        'event': 'Interlochen Arts Academy',
        'daterange': ['8/2006', '5/2007']
    },
    {
        'event': 'Utrecht Conservatory',
        'daterange': ['8/2007', '6/2008']
    },
    {
        'event': 'Oberlin Conservatory',
        'daterange': ['9/2008', '12/2011']
    },
    {

    }

]

function stickFooterToBottom() {
    document.body.style.height = "100%";
    document.body.style.width = "100%";

    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;
    var bodyHeight = document.body.offsetHeight;
    var bodyWidth = document.body.offsetWidth;
    var footerDiv = document.getElementById("footer");
    var footerHeight = footerDiv.offsetHeight;

    if(winHeight > bodyHeight)
    {
        footerDiv.style.position = "absolute";
        footerDiv.style.bottom = "0px";
        document.body.style.height = winHeight + "px";
        footerDiv.style.width = bodyWidth + "px";

    } 
    else {
        footerDiv.style.position = "static";
        footerDiv.style.width = bodyWidth + "px";
    }
}

function renderHexbins() {
    const svg = d3.select('svg');
    const parentDiv = d3.select('#hexbin-div');
    const width = svg.style('width').replace('px', '');
    const height = svg.style('height').replace('px', '');
    let minRadius = 40;
    let maxRadius = 70;

    d3.selectAll('.hexGroup').remove()

    const options = {
        group1: '#00ccc5',
        group2: '#f98423',
        group3: '#fed762',
    };


    const dataset = [];

    let numPoints = (width * height) / 100
    numPoints = width > 2000 ? numPoints * 3 : numPoints
    numPoints = width > 1400 ? numPoints * 2 : numPoints
    if (width < 450) {
        minRadius = minRadius * 0.75
        maxRadius = maxRadius  * 0.75
    }

    for (let i = 0; i < numPoints; i++) {
        if (i % 300 === 0) {
            dataset.push({
                group1: [getRandomInt(0, width), getRandomInt(0, height)],
                group2: [getRandomInt(0, width), getRandomInt(0, height)],
                group3: [getRandomInt(0, width), getRandomInt(0, height)],
            });
        } else {
            dataset.push({
                group3: [getRandomInt(0, width), getRandomInt(0, height)],
            });
        }
    }

    const keys = Object.keys(dataset[0]);


    const hexbin = hackedBin(keys)
        .radius(maxRadius);

    const hexData = hexbin(dataset);

    const radius = d3.scaleLinear()
        .domain([0, hexData.length / 2])
        .range([minRadius, maxRadius]);

    const hexGroup = svg.append('g')
        .attr('class', 'hexgroup')

    hexGroup.selectAll('path')
        .data(hexData)
        .enter().append('path')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .attr('d', (d) => {
                const thisRadius = radius(d.length);
                return hexbin.hexagon(thisRadius);
            })
            .attr('fill', d => options[d.key])
            .attr('stroke', d => options[d.key])
            .attr('stroke-opacity', 0.4)
            .attr('fill-opacity', 0.025) 
}

function getRandomInt(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function hackedBin(keys) {
    let self = this;

    var d3_hexbinAngles = d3.range(0, 2 * Math.PI, Math.PI / 3),
    d3_hexbinX = function(d) { return d[0]; },
    d3_hexbinY = function(d) { return d[1]; };

    var width = 1,
        height = 1,
        r,
        x = d3_hexbinX,
        y = d3_hexbinY,
        dx,
        dy;

    function hexbin(points) {
    // for each point, loop through and do this with both the source and dest (checking for existence first)

        var binsById = {};

        points.forEach(function(point, i) {

            keys.forEach(function(key) {

                const pointSvgCoords = point[key]
                if (!pointSvgCoords) { return; }

                var py = y.call(hexbin, pointSvgCoords, i) / dy, pj = Math.round(py),
                    px = x.call(hexbin, pointSvgCoords, i) / dx - (pj & 1 ? .5 : 0), pi = Math.round(px),
                    py1 = py - pj;

                if (Math.abs(py1) * 3 > 1) {
                    var px1 = px - pi,
                        pi2 = pi + (px < pi ? -1 : 1) / 2,
                        pj2 = pj + (py < pj ? -1 : 1),
                        px2 = px - pi2,
                        py2 = py - pj2;
                    if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) pi = pi2 + (pj & 1 ? 1 : -1) / 2, pj = pj2;
                }

                var id = pi + "-" + pj + "-" + key;
                var bin = binsById[id];

                if (bin) {
                    bin.id = id;
                    bin.push(point)
                } else {
                    bin = binsById[id] = [point];
                    bin.id = id;
                    bin.key = key
                    bin.i = pi;
                    bin.j = pj;
                    bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx;
                    bin.y = pj * dy;
                }
            })

        });

        return d3.values(binsById);
    }

    function hexagon(radius) {
        var x0 = 0, y0 = 0;
        return d3_hexbinAngles.map(function(angle) {
            var x1 = Math.sin(angle) * radius,
                y1 = -Math.cos(angle) * radius,
                dx = x1 - x0,
                dy = y1 - y0;
                x0 = x1, y0 = y1;
            return [dx, dy];
        });
    }

    hexbin.x = function(_) {
        if (!arguments.length) return x;
        x = _;
        return hexbin;
    };

    hexbin.y = function(_) {
        if (!arguments.length) return y;
        y = _;
        return hexbin;
    };

    hexbin.hexagon = function(radius) {
        if (arguments.length < 1) radius = r;
        return "m" + hexagon(radius).join("l") + "z";
    };

    hexbin.centers = function() {
        var centers = [];
        for (var y = 0, odd = false, j = 0; y < height + r; y += dy, odd = !odd, ++j) {
            for (var x = odd ? dx / 2 : 0, i = 0; x < width + dx / 2; x += dx, ++i) {
                var center = [x, y];
                center.i = i;
                center.j = j;
                centers.push(center);
            }
        }
        return centers;
    };

    hexbin.mesh = function() {
        var fragment = hexagon(r).slice(0, 4).join("l");
        return hexbin.centers().map(function(p) { return "M" + p + "m" + fragment; }).join("");
    };

    hexbin.size = function(_) {
        if (!arguments.length) return [width, height];
        width = +_[0], height = +_[1];
        return hexbin;
    };

    hexbin.radius = function(_) {
        if (!arguments.length) return r;
        r = +_;
        dx = r * 2 * Math.sin(Math.PI / 3);
        dy = r * 1.5;
        return hexbin;
    };

    return hexbin.radius(1);
}
