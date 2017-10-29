document.addEventListener("DOMContentLoaded", function() {

    assignLayersToEvents()
    cvEvents.sort((a, b) => dateFromSlashy(a.daterange[0]) - dateFromSlashy(b.daterange[0]))



    d3.select('#container').style('background-color', '#f7f7f4')
    d3.selectAll('#info .bio, #hexbin-div').style('display', 'none')
    d3.selectAll('#timeline').style('display', 'unset')
    cvTimeline()
    renderHexbins()
    stickFooterToBottom()

    d3.selectAll('#nav .link').on('click', function() {
        const clickedThing = d3.select(this)

        if (clickedThing.classed('bio')) {
            d3.selectAll('#timeline').style('display', 'none')
            d3.select('#container').style('background-color', 'transparent')
            d3.selectAll('#info .bio, #hexbin-div').style('display', 'unset')
        } else {
            d3.selectAll('#info .bio, #hexbin-div').style('display', 'none')
            d3.select('#container').style('background-color', '#f7f7f4')
            d3.selectAll('#timeline').style('display', 'unset')
        }

    });
});

let resizeTimer;
window.addEventListener("resize", function() {
    renderHexbins()
    stickFooterToBottom()

    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(function() {
        cvTimeline()
    }, 100)
});


function cvTimeline() {

    const remSize = parseFloat(getComputedStyle(d3.select('html').node()).fontSize);

    const parentDiv = d3.select('#timeline')

    parentDiv.selectAll('*').remove()

    const parentWidth = parentDiv.style('width').replace('px', '');
    const parentHeight = parentDiv.style('height').replace('px', '');

    const svg = parentDiv.append('svg')
        .style('position', 'relative')
        .style('height', `${parentHeight}px`)
        .style('width', `${parentWidth}px`)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .style('z-index', 2)

    const sideMargin = parentWidth * 0.05;
    const topMargin = parentHeight * 0.1;
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
            .style('fill', '#303030')
            .style('font-family', 'Aclonica')
            .style('font-size', `${0.5 * remSize}px`)

    xAxisElements.selectAll('path, line')
        .style('shape-rendering', 'crispEdges');

    svg.select('path.domain')
        .style('stroke', '#303030')
        .style('stroke-opacity', 0.1)
        .attr('stroke-width', `${remSize / 10}px`)

    xAxisElements.selectAll('line')
        .style('stroke', '#303030');

    const brush = d3.brushX()
        .extent([[sideMargin, remSize * 1.5], [width, remSize * 2]])
        .on('end', brushed);

    svg.append('g')
        .attr('transform', `translate(${sideMargin},0)`)
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, [
            x(new Date(2017, 0)),
            x(new Date(2018, 0))
        ])

    svg.selectAll('.brush').selectAll('rect')
        
    svg.selectAll('.selection')
        .style('fill', '#303030')
        .style('fill-opacity', 0.1)
    svg.selectAll('rect.handle').remove()
    svg.selectAll('.overlay').attr('pointer-events', 'none')


    const paddingBetweenRows = remSize / 16;
    const tooltip = makeToolTip()

    svg.append('g')
        .attr('class', 'events')
        .selectAll('rect')
        .data(cvEvents)
        .enter().append('rect')
            .attr('transform', `translate(${sideMargin},${topMargin})`)
            .style('fill-opacity', 0.2)
            .attr('width', function(d) {
                return x(dateFromSlashy(d.daterange[1])) - x(dateFromSlashy(d.daterange[0]))
            })
            .attr('height', remSize / 2)
            .attr('x', d => x(dateFromSlashy(d.daterange[0])))
            .attr('y', function(d, i) {
                d.y = d.layerNum * (remSize / 2) + (1 + d.layerNum) * paddingBetweenRows
                return d.y
            })
            .attr("rx", remSize / 4)
            .attr("ry", remSize / 4)
            .style('fill', d => eventColors[d.layerNum])
            .style('stroke', d => eventColors[d.layerNum])

    d3.select('g.events').selectAll('rect')
        .on('mouseover', function(d){
            tooltip.text(d.event)
            moveToolTip(tooltip);
        })
        .on('mouseout', function(d) {
            tooltip.style('display', 'none')
        })

    // TODO: BRUSH ADDS A PARAGRPH OF DETAIL ABOUT THAT YEAR OF MY LIFE
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


} // timeline

const eventColors = [
    '#cc3300',
    '#ff9933',
    '#ffcc00',
    '#9cd615',
    '#0b8e35',
    '#39b2aa',
    '#0066cc',
    '#0000cc',
    '#d6149f'
]

function dateFromSlashy(slashyDate) {
    const slashyArray = slashyDate.split('/')
    return new Date(slashyArray[1], slashyArray[0])
}

function assignLayersToEvents() {
    cvEvents.map(function(e, i) {
        e.layerNum = 0
        e.numConflicts = overlapIndices(e, i).length
        return e
    })

    cvEvents.sort((a, b) => a.numConflicts - b.numConflicts)

    let overlaps = true;
    let maxLayerNum = 0
    while (overlaps) {
        let currentOverlaps = false;
        cvEvents.forEach(function (e, eIndex) {
            const theseOverlaps = overlapIndices(e, eIndex)
            if (theseOverlaps.length !== 0) {
                e.layerNum += 1
                currentOverlaps = true
            }
        })
        overlaps = currentOverlaps;
    }
}

function overlapIndices(d, inputIndex) {
    return cvEvents.filter(function(e, eventIndex) {
        if (eventIndex === inputIndex) {
            return false
        }
        e.index = eventIndex
        return dateFromSlashy(e.daterange[0]) < dateFromSlashy(d.daterange[1]) && dateFromSlashy(d.daterange[0]) < dateFromSlashy(e.daterange[1]) && d.layerNum === e.layerNum
    }).map( (e) => e.index)
}

function makeToolTip() {  
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('font-size', '0.75rem')
        .style('z-index', '1')
        .style('font-family', 'Aclonica')

    tooltip.append('text')
        .text('tooltip')
        .attr('text-anchor', 'middle')
        .style('color', 'black');

    tooltip.style('display', 'none')

    return tooltip;
}

function moveToolTip(tooltip) {
    const svg = d3.select('#timeline').select('svg');
    tooltip.style('display', 'unset');

    const svgDimensions = svg.node().getBoundingClientRect();
    const eventXRelToScroll = d3.event.pageX - window.scrollX;
    const eventYRelToScroll = d3.event.pageY - window.scrollY;

    let tipX = (eventXRelToScroll) + 15;
    let tipY = (eventYRelToScroll) + 15;

    const tooltipDimensions = tooltip.node().getBoundingClientRect();

    tipX = (eventXRelToScroll + tooltipDimensions.width + 10 > svgDimensions.right) ?
        tipX - tooltipDimensions.width - 15 : tipX;

    tipY = (eventYRelToScroll + tooltipDimensions.height + 10 > svgDimensions.bottom) ?
        tipY - tooltipDimensions.height - 15 : tipY;

    tooltip
        .transition()
        .duration(10)
        .style('top', `${tipY}px`)
        .style('left', `${tipX}px`);
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

const cvEvents = [
    {
        'event': 'Private trumpet lesson teacher and freelance musician',
        'daterange': ['06/2005', '06/2016']
    },
    {
        'event': 'Interlochen Arts Academy',
        'daterange': ['8/2006', '5/2007']
    },
    {
        'event': 'Crossing guard at Interlochen summer camp',
        'daterange': ['06/2007', '08/2007']
    },
    {
        'event': 'Utrecht Conservatory',
        'daterange': ['8/2007', '6/2008']
    },
    {
        'event': 'Sweelinck Orkest',
        'daterange': ['12/2007', '06/2008']
    },
    {
        'event': 'Utrecht Blazers Ensemble',
        'daterange': ['01/2008', '06/2008']
    },
    {
        'event': 'Cruise ship show band musician (intermittent)',
        'daterange': ['07/2008', '08/2009']
    },
    {
        'event': 'Oberlin Conservatory',
        'daterange': ['9/2008', '12/2011']
    },
    {
        'event': 'Au Pair in Spain',
        'daterange': ['05/2010', '08/2010']
    },
    {
        'event': 'Summer school teacher',
        'daterange': ['05/2011', '08/2011']
    },
    {
        'event': '4K for Cancer leg leader',
        'daterange': ['02/2012', '08/2012']
    },
    {
        'event': 'Kindergarten co-teacher',
        'daterange': ['10/2012', '03/2013']
    },
    {
        'event': 'Bad Girl Ventures entrepreneurship classes',
        'daterange': ['03/2013', '05/2013']
    },
    {
        'event': 'Bicycle sales associate',
        'daterange': ['03/2013', '09/2013']
    },
    {
        'event': 'Polka band',
        'daterange': ['05/2013', '09/2013']
    },
    {
        'event': 'After school music program coordinater and teacher',
        'daterange': ['09/2013', '05/2014']
    },
    {
        'event': 'Legacy Initiative of Utah volunteer',
        'daterange': ['01/2014', '06/2014']
    },
    {
        'event': 'Special needs tutor',
        'daterange': ['03/2014', '06/2014']
    },
    {
        'event': 'CSU Levin College of Urban Affairs MPA',
        'daterange': ['09/2014', '05/2016']
    },
    {
        'event': 'CSU Nonprofit Management Certificate',
        'daterange': ['09/2014', '12/2015']
    },
    {
        'event': 'CSU brass quintet and El Sistema scholarship',
        'daterange': ['09/2014', '05/2015']
    },
    {
        'event': 'Resource development research intern at United Way',
        'daterange': ['10/2014', '05/2015']
    },
    {
        'event': 'Graduate assistant',
        'daterange': ['01/2015', '06/2016']
    },
    {
        'event': 'Project-based code learning group coordinator',
        'daterange': ['08/2015', '06/2016']
    },
    {
        'event': 'CSU Business Analytics Certificate',
        'daterange': ['09/2015', '05/2016']
    },
    {
        'event': 'Research Assistant, Cleveland Civic Tech and Data Collaborative',
        'daterange': ['11/2015', '06/2016']
    },
    {
        'event': 'Dev Bootcamp',
        'daterange': ['05/2016', '09/2016']
    },
    {
        'event': 'Volunteer for Code Platoon',
        'daterange': ['10/2016', '2/2017']
    },
    {
        'event': 'Developer at 5th Column',
        'daterange': ['01/2017', '10/2017']
    },
    {
        'event': 'Volunteer tech lead at the Difference Engine',
        'daterange': ['09/2017', '10/2017']
    },
]
