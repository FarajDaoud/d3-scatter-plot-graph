import './index.css';
import * as d3 from 'd3';

let req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
req.send();
req.onload = function(){
    let dataset = JSON.parse(req.responseText);
    console.log('dataset[0]: ' + JSON.stringify(dataset[0]));
    console.log('dataset[last]: ' + JSON.stringify(dataset[dataset.length -1]));
    dataset = dataset.map((x) => ({'Time':new Date(2018, 0, 1, 0, x.Time.split(':')[0], x.Time.split(':')[1])
        , 'Place': x.Place
        , 'Seconds': x.Seconds
        , 'Name':x.Name
        , 'Year':x.Year
        , 'Nationality':x.Nationality
        , 'Doping':x.Doping
        , 'Url':x.Url})
        );
    let maxYear = d3.max(dataset.map((x) => x.Year))
    ,minYear = d3.min(dataset.map((x) => x.Year))
    ,maxTime = d3.max(dataset.map((x) => x.Time))
    ,minTime = d3.min(dataset.map((x) => x.Time));
    console.log(`maxYear: ${maxYear} minYear: ${minYear} maxTime: ${maxTime} minTime: ${minTime}`);
    const w = 800
    , h = 600
    ,padding = 60;

    const xScale = d3.scaleLinear()
                    .domain([minYear - 1, maxYear + 1])
                    .range([padding, w - padding]);

    const yScale = d3.scaleTime()
                    .domain([minTime, maxTime])
                    .range([h - padding, padding]);

    const svg = d3.select("#scatterPlotGraph")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    const tooltip = d3.select('#scatterPlotGraph').append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    const legendScale = d3.scaleOrdinal(d3.schemeDark2);

    svg.append("g")
            .attr("transform", `translate(0, ${h - padding})`)
            .attr("id", "x-axis")
            .call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
    svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .attr("id", "y-axis")
            .call(yAxis);
        
    svg.append('text')
        .attr('x', -200)
        .attr('y', 15)
        .attr('transform', 'rotate(-90)')
        .style('font-size', 19)
        .text('Time in Minutes');

    svg.selectAll(".dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr('class', 'dot')
        .attr('cx', (d) => xScale(d.Year))
        .attr('cy', (d) => yScale(d.Time))
        .attr('r', (d) => 5)
        .attr('data-xvalue', (d) => d.Year)
        .attr('data-yvalue', (d) => d.Time)
        .style('fill', (d) => legendScale(d.Doping != ''))
        .style('opacity', .5)
        .on('mouseover', (d) => {
            tooltip.style('opacity', .9)
                .attr('data-year', d.Year)
                .style("left", xScale(d.Year) + 10 + "px")
                .style("top", yScale(d.Time) + "px")
                .style('z-index', 2)
                .html(`${d.Name}: ${d.Nationality} <br>
                Year: ${d.Year}, Time: ${d.Time.getMinutes()}:${d.Time.getSeconds()} <br>
                ${d.Doping}`);
        })
        .on('mouseout', (d) => {
                tooltip.style('opacity', '0')
                .attr('data-year', null)
                .style('z-index', -1)
        });

    var legend = svg.selectAll('#legend')
    .data(legendScale.domain())
    .enter()
    .append('g')
    .attr('id', 'legend')
    .attr('transform', (d, i) => {
        return 'translate(0, ' + (h/2 - i * 25) + ')'
    });

    legend.append('rect')
        .attr('x', w - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', legendScale);
    
    legend.append("text")
        .attr("x", w - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text((d) => d ? "Riders with doping allegations" : "No doping allegations");
    
};