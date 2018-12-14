import './index.css';
import * as d3 from 'd3';

let req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
req.send();
req.onload = function(){
    let dataset = JSON.parse(req.responseText);
    console.log('dataset[0]: ' + JSON.stringify(dataset[0]));
    console.log('dataset[last]: ' + JSON.stringify(dataset[dataset.length -1]));
    let maxYear = d3.max(dataset.map((x) => x.Year))
    ,minYear = d3.min(dataset.map((x) => x.Year))
    ,maxTime = d3.max(dataset.map((x) => x.Time))
    ,minTime = d3.min(dataset.map((x) => x.Time));
    console.log(`maxYear: ${maxYear} minYear: ${minYear} maxTime: ${maxTime} minTime: ${minTime}`);

    const w = 800
    , h = 500
    ,padding = 20;

    const xScale = d3.scaleLinear()
                        .domain([minYear, maxYear])
                        .range([padding, w - padding]);

    const yScale = d3.scaleTime()
                    .domain([minTime, maxTime])
                    .range([h - padding, padding]);

    const svg = d3.select("#scatterPlotGraph")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg.append("g")
            .attr("transform", `translate(0, ${h - padding})`)
            .attr("id", "x-axis")
            .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .attr("id", "y-axis")
            .call(yAxis);
};