const eventColors = [
    '#cc3300',
    '#ff9933',
    '#ffcc00',
    '#9cd615',
    '#0b8e35',
    '#39b2aa',
    '#0066cc',
    '#0000cc',
    '#d6149f',
]


// music: red
// music teaching: orange
// teaching: yellow
// childcare/teaching: light green
// bicycle: dark green

const eventTypeColorCode = {
    tech: '#cc3300',
    civicTech: '#ff9933',
    civic: '#ffcc00',
    teaching: '#9cd615',
    musicTeaching: '#0b8e35',
    music: '#39b2aa',
    bicycle: '#0066cc',
    thing: '#0000cc',
    otherThing: '#d6149f',
}

const cvEvents = [
    {
        event: 'Private trumpet lesson teacher and freelance musician',
        daterange: ['06/2005', '06/2016'],
        type: 'musicTeaching'
    },
    {
        event: 'Interlochen Arts Academy',
        daterange: ['8/2006', '5/2007'],
        type: 'music'
    },
    // {
    //     event: 'Crossing guard at Interlochen Arts Camp',
    //     daterange: ['06/2007', '08/2007']
    // },
    {
        event: 'Utrecht Conservatory',
        daterange: ['8/2007', '6/2008'],
        type: 'music'
    },
    {
        event: 'Sweelinck Orkest',
        daterange: ['12/2007', '06/2008'],
        type: 'music'
    },
    {
        event: 'Utrecht Blazers Ensemble',
        daterange: ['01/2008', '06/2008'],
        type: 'music'
    },
    {
        event: 'Cruise ship show band musician (intermittent)',
        daterange: ['07/2008', '08/2009'],
        type: 'music'
    },
    {
        event: 'Oberlin Conservatory',
        daterange: ['9/2008', '12/2011'],
        type: 'music'
    },
    {
        event: 'Bicycle down California coast',
        daterange: ['12/2009', '01/2010'],
        type: 'bicycle'
    },
    {
        event: 'Au Pair in Spain',
        daterange: ['05/2010', '08/2010'],
        type: 'teaching'
    },
    {
        event: 'Head cook in dining cooperative',
        daterange: ['09/2010', '05/2011'],
        type: 'civic'
    },
    {
        event: 'Head mechanic in bicycle cooperative',
        daterange: ['01/2011', '05/2011'],
        type: 'bicycle'
    },
    {
        event: 'Summer school teacher',
        daterange: ['05/2011', '08/2011'],
        type: 'teaching'
    },
    {
        event: '4K for Cancer cross-country bicycle trip leg leader',
        daterange: ['02/2012', '08/2012'],
        type: 'bicycle'
    },
    {
        event: 'Kindergarten co-teacher',
        daterange: ['10/2012', '03/2013'],
        type: 'teaching'
    },
    {
        event: 'Bad Girl Ventures entrepreneurship classes',
        daterange: ['03/2013', '05/2013'],
        type: 'civic'
    },
    {
        event: 'Bicycle sales associate',
        daterange: ['03/2013', '09/2013'],
        type: 'bicycle'
    },
    {
        event: 'Polka band',
        daterange: ['05/2013', '09/2013'],
        type: 'music'
    },
    {
        event: 'After school music program coordinater and teacher',
        daterange: ['09/2013', '05/2014'],
        type: 'musicTeaching'
    },
    {
        event: 'Legacy Initiative of Utah volunteer',
        daterange: ['01/2014', '06/2014'],
        type: 'civic'
    },
    {
        event: 'Special needs tutor',
        daterange: ['03/2014', '06/2014'],
        type: 'teaching'
    },
    {
        event: 'CSU Levin College of Urban Affairs MPA',
        daterange: ['09/2014', '05/2016'],
        type: 'civic'
    },
    {
        event: 'CSU Nonprofit Management Certificate',
        daterange: ['09/2014', '12/2015'],
        type: 'civic'
    },
    {
        event: 'CSU brass quintet and El Sistema scholarship',
        daterange: ['09/2014', '05/2015'],
        type: 'musicTeaching'
    },
    {
        event: 'Resource development research intern at United Way',
        daterange: ['10/2014', '05/2015'],
        type: 'civic'
    },
    {
        event: 'Graduate assistant',
        daterange: ['01/2015', '06/2016'],
        type: 'civic'
    },
    {
        event: 'Project-based code learning group coordinator',
        daterange: ['08/2015', '06/2016'],
        type: 'civicTech'
    },
    {
        event: 'CSU Business Analytics Certificate',
        daterange: ['09/2015', '05/2016'],
        type: 'tech'
    },
    {
        event: 'Research Assistant, Cleveland Civic Tech and Data Collaborative',
        daterange: ['11/2015', '06/2016'],
        type: 'civicTech'
    },
    {
        event: 'Dev Bootcamp',
        daterange: ['05/2016', '09/2016'],
        type: 'tech'
    },
    {
        event: 'Volunteer for Code Platoon',
        daterange: ['10/2016', '2/2017'],
        type: 'civicTech'
    },
    {
        event: 'Developer at 5th Column',
        daterange: ['01/2017', '12/2017'],
        type: 'tech'
    },
    {
        event: 'Volunteer tech lead at the Difference Engine',
        daterange: ['09/2017', '11/2017'],
        type: 'civicTech'
    },
    {
        event: 'Digital Services Developer for Asheville City Government',
        daterange: ['01/2018', '02/2018'],
        type: 'civicTech'
    }
]
