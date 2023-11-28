import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import {interpolateViridis} from 'd3-scale-chromatic';
import data from '../data/subset_contours_data.json';


function organizeContoursByDepth(contoursData) {
    const contoursByDepth = {};

    // Iterate over the groups (e.g., "GAJ.XY")
    Object.keys(contoursData).forEach(groupKey => {
        const groupData = contoursData[groupKey];

        // Iterate over the depths within each group (e.g., "1", "2")
        Object.keys(groupData).forEach(depthKey => {
            const contoursInDepth = groupData[depthKey];

            // Ensure that contoursInDepth is an array
            if (Array.isArray(contoursInDepth)) {
                // Initialize the depth array if it doesn't exist
                if (!contoursByDepth[depthKey]) {
                    contoursByDepth[depthKey] = [];
                }

                // Push all the contours in the current depth into the organized structure
                contoursByDepth[depthKey].push(...contoursInDepth);
            } else {
                console.log(`Contours in depth ${depthKey} in group ${groupKey} is not an array.`);
            }
        });
    });

    console.log('Contours organized by depth:', contoursByDepth);
    return contoursByDepth;
}

function PlotContoursWithDepths({contoursByDepth, depthsToPlot}) {
    const traces = [];
    depthsToPlot.forEach((depth, index) => {
        const color = interpolateViridis(index / depthsToPlot.length);
        const contourObjects = contoursByDepth[depth] || [];
        contourObjects.forEach((contourArray, contourIndex) => {
            // Check if contourArray is an array
            if (Array.isArray(contourArray)) {
                // Extract x and y arrays from the contourArray
                const xValues = contourArray.map(point => point.x);
                const yValues = contourArray.map(point => point.y);

                // Add line trace for each contour array
                traces.push({
                    x: xValues,
                    y: yValues,
                    type: 'scatter',
                    mode: 'lines',
                    line: {color},
                    name: `Depth ${depth} - Contour ${contourIndex + 1}`
                });

                // Add mirrored line trace for each contour array
                traces.push({
                    x: xValues.map(x => -x),
                    y: yValues,
                    type: 'scatter',
                    mode: 'lines',
                    line: {color},
                    showlegend: false
                });
            } else {
                console.log(`Contour array at depth ${depth} - Contour ${contourIndex + 1} is not an array.`);
            }
        });
    });
    console.log("PlotContoursWithDepths done");
    return traces;
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
                traces.push({
                    x: [-centerX],
                    y: [centerY],
                    type: 'scatter',
                    mode: 'markers',
                    marker: {color},
                    showlegend: false
                });
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

function PlotCell2D({depthsToPlot = [], numRings = 0}) {
    const [contoursByDepth, setContoursByDepth] = useState({});
    // const [contoursData, setContoursData] = useState([]);

    useEffect(() => {
        // setContoursData(data);
        // Combine all contours from different keys into a single array
        const allContours = Object.values(data).flat();
        console.log("allContours:", allContours); // Debugging console log
        const organizedData = organizeContoursByDepth(allContours);
        console.log("organizedData:", organizedData); // Debugging console log
        setContoursByDepth(organizedData);
    }, []);

    // Initialize traces as an empty array
    let traces = [];

    // Generate traces for contours and contour centers
    if (Object.keys(contoursByDepth).length > 0) {
        const contoursTraces = PlotContoursWithDepths({contoursByDepth, depthsToPlot});
        console.log("contoursTraces:", contoursTraces); // Debugging console log

        const centersTraces = PlotContourCenters({contoursByDepth, depthsToPlot});
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
        xaxis: {title: 'X'},
        yaxis: {title: 'Y'},
        legend: {
            title: 'Legend',
            items: depthsToPlot.map(depth => `Depth ${depth}`)
        },
        showlegend: true
    };

    return <Plot data={traces} layout={layout}/>;
}


export default PlotCell2D;