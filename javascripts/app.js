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
    cvTimeline()
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
        'event': 'Kindergarten co-teacher',
        'daterange': ['10/2012', '03/2013']
    },
    {
        'event': 'Sold bicycles',
        'daterange': ['03/2013', '09/2013']
    },
    {
        'event': 'After school music program coordinater and teacher',
        'daterange': ['09/2013', '05/2014']
    },
    {
        'event': 'CSU LCUA MPA',
        'daterange': ['09/2014', '05/2016']
    },
    {
        'event': 'Dev Bootcamp',
        'daterange': ['05/2016', '09/2016']
    },
    {
        'event': 'Developer at 5th Column',
        'daterange': ['01/2017', '10/2017']
    },
    {
        'event': 'future',
        'daterange': ['01/2018', '01/2018']
    }
]

function dateFromSlashy(slashyDate) {
    const slashyArray = slashyDate.split('/')
    return new Date(slashyArray[1], slashyArray[0])
}

function cvTimeline() {

    const remSize = parseFloat(getComputedStyle(d3.select('html').node()).fontSize);

    const parentDiv = d3.select('#timeline')
    const parentWidth = parentDiv.style('width').replace('px', '');
    const parentHeight = parentDiv.style('height').replace('px', '');

    const svg = parentDiv.append('svg')
        .style('position', 'relative')
        .style('height', `${parentHeight}px`)
        .style('width', `${parentWidth}px`)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .style('z-index', 2)

    const sideMargin = parentWidth * 0.05;
    const topMargin = parentHeight * 0.5;
    const width = parentWidth - sideMargin * 2
    const height = parentHeight - topMargin

    const dateDomain = [
        dateFromSlashy(cvEvents[0].daterange[0]),
        dateFromSlashy(cvEvents[cvEvents.length - 1].daterange[1]),
    ]

    const x = d3.scaleTime()
        .domain(dateDomain)
        .range([sideMargin, width])

    const xAxis = d3.axisTop()
        .scale(x)
        .ticks(d3.timeYear, 1)
        .tickFormat(d => `${new Date(d).toLocaleDateString('en-US', {year: 'numeric'})}`);

    const xAxisElements = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(${sideMargin},${topMargin})`)
        .call(xAxis);

    xAxisElements.selectAll('.tick')
        .attr('transform', d => `translate(${0 + x(d)}, 0)`)
        .selectAll('text')
        .style('font-size', `${0.7 * remSize}px`)


    xAxisElements.selectAll('path, line')
        .style('shape-rendering', 'crispEdges');

    svg.select('path.domain')
        .style('fill', 'none')
        .style('stroke', 'navy')
        .style('stroke-opacity', 0.1)
        .attr('stroke-width', `${remSize / 10}px`)

    xAxisElements.selectAll('line')
        .style('stroke', '#787882');

    const brush = d3.brushX()
        .extent([[sideMargin, 0 - height / 2], [width, height * 2]])
        .on('end', brushed);

    svg.append('g')
        .attr('transform', `translate(${sideMargin},${topMargin + height/4})`)
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, [
            x(new Date(2017, 0)),
            x(new Date(2018, 0))
        ])

    svg.selectAll('.brush').selectAll('rect')
        .style('height', `${height/2}px`)
        
    svg.selectAll('.selection').style('fill', '#00ccc5')
    svg.selectAll('rect.handle').remove()
    svg.selectAll('.overlay').attr('pointer-events', 'none')

    function brushed() {
        let d0;
        let d1;
        if (!d3.event.sourceEvent || !d3.event.selection) {
            d1 = [new Date(2017, 1), new Date(2018, 1)]
            d0 = d1
            return
        } else {
            d0 = d3.event.selection.map(x.invert);
            d1 = d0.map(d3.timeYear.round);
        }

        if (d1[0] >= d1[1]) {
            d1[0] = d3.timeYear.floor(d0[0]);
            d1[1] = d3.timeYear.offset(d1[0]);
        }

        d3.select(this).transition().call(d3.event.target.move, d1.map(x));
        }
}

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
    const svg = d3.select('#hexbin-div').select('svg');
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
