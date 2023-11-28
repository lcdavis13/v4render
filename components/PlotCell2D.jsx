import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import {interpolateViridis} from 'd3-scale-chromatic';
import contoursData from '../data/xy_subset_sample_old.json';


function organizeContoursByDepth(contoursData) {
    const contoursByDepth = {};

    contoursData.forEach(group => {
        if (group.contour && Array.isArray(group.contour)) {
            group.contour.forEach(point => {
                const depth = point.depth;
                if (!contoursByDepth[depth]) {
                    contoursByDepth[depth] = [];
                }
                contoursByDepth[depth].push(point);
            });
        } else {
            console.log('Contour is not an array or does not exist:', group.contour);
        }
    });

    console.log('Contours organized by depth:', contoursByDepth);
    return contoursByDepth;
}

function PlotContoursWithDepths({contoursByDepth, depthsToPlot}) {
    const traces = [];
    depthsToPlot.forEach((depth, index) => {
        const color = interpolateViridis(index / depthsToPlot.length);
        const contourObjects = contoursByDepth[depth] || [];
        contourObjects.forEach((contourObject, contourIndex) => {
            if (typeof contourObject === 'object' && contourObject.hasOwnProperty('x') && contourObject.hasOwnProperty('y') && contourObject.hasOwnProperty('depth')) {
                traces.push({
                    x: contourObject.x,
                    y: contourObject.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: {color},
                    name: `Depth ${depth} - Contour ${contourIndex + 1}`
                });
                //traces.push({
                //    x: -contourObject.x,
                //    y: contourObject.y,
                //    type: 'scatter',
                //    mode: 'lines',
                //    line: {color},
                //    showlegend: false
                //});
            } else {
                console.log(`Contour object at depth ${depth} - Contour ${contourIndex + 1} is not a valid object.`);
            }
        });
    });
    console.log("PlotContoursWithDepths done");
    return traces; // Return the array of trace objects directly
}

function PlotContourCenters({contoursByDepth, depthsToPlot}) {
    const traces = [];
    depthsToPlot.forEach((depth, index) => {
        const color = interpolateViridis(index / depthsToPlot.length);
        const contourObjects = contoursByDepth[depth] || [];
        contourObjects.forEach((contourObject, contourIndex) => {
            if (typeof contourObject === 'object' && contourObject.hasOwnProperty('x') && contourObject.hasOwnProperty('y') && contourObject.hasOwnProperty('depth')) {
                const centerX = contourObject.x;
                const centerY = contourObject.y;
                traces.push({
                    x: [centerX],
                    y: [centerY],
                    type: 'scatter',
                    mode: 'markers',
                    marker: {color},
                    name: `Center Depth ${depth} - Contour ${contourIndex + 1}`
                });
                //traces.push({
                //    x: [-centerX],
                //    y: [centerY],
                //    type: 'scatter',
                //    mode: 'markers',
                //    marker: {color},
                //    showlegend: false
                //});
            } else {
                console.log(`Contour object at depth ${depth} - Contour ${contourIndex + 1} is not a valid object.`);
            }
        });
    });
    console.log("PlotContourCenters done");
    return traces; // Return the array of trace objects directly
}


function addTargetRings(numRings, traces) {
    const radmult = 2;
    const theta = Array.from({length: 100}, (_, i) => i * (2 * Math.PI) / 100);

    for (let i = 1; i <= numRings; i++) {
        const x = theta.map(angle => i * Math.cos(angle) * radmult);
        const y = theta.map(angle => i * Math.sin(angle) * radmult);

        traces.push({
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines',
            line: {color: 'pink', dash: 'dash', width: 1.5},
            hoverinfo: 'none',
            showlegend: false
        });
    }
}

function PlotCell2D({ depthsToPlot = [], numRings = 0 }) {
    const [contoursByDepth, setContoursByDepth] = useState({});

    useEffect(() => {
        // Combine all contours from different keys into a single array
        const allContours = Object.values(contoursData).flat();
        console.log("allContours:", allContours); // Debugging console log
        const organizedData = organizeContoursByDepth(allContours);
        console.log("organizedData:", organizedData); // Debugging console log
        setContoursByDepth(organizedData);
    }, []);

    // Initialize traces as an empty array
    let traces = [];

    // Generate traces for contours and contour centers
    if (Object.keys(contoursByDepth).length > 0) {
        const contoursTraces = PlotContoursWithDepths({ contoursByDepth, depthsToPlot });
        console.log("contoursTraces:", contoursTraces); // Debugging console log

        const centersTraces = PlotContourCenters({ contoursByDepth, depthsToPlot });
        console.log("centersTraces:", centersTraces); // Debugging console log

        // Ensure that both contoursTraces and centersTraces are arrays
        if (Array.isArray(contoursTraces) && Array.isArray(centersTraces)) {
            traces = [...contoursTraces, ...centersTraces];
        } else {
            console.error("contoursTraces or centersTraces is not an array.");
        }

        addTargetRings(numRings, traces);
        console.log("traces after addTargetRings:", traces); // Debugging console log
    }

    // Define the layout for the plot
    const layout = {
        title: 'V4 Receptive Fields',
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        legend: {
            title: 'Legend',
            items: depthsToPlot.map(depth => `Depth ${depth}`)
        },
        showlegend: true
    };

    return <Plot data={traces} layout={layout}/>;
}


export default PlotCell2D;