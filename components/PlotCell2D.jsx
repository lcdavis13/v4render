import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import {interpolateViridis} from 'd3-scale-chromatic';
// import data from '../data/subset_contours_data.json';
import data from '../data/contoursData.json';


function organizeContoursByDepth(contoursData) {
    const contoursByDepth = {};

    // Iterate over each cell
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

function plotContoursWithDepths({contoursByDepth, depthsToPlot}) {
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
                    name: `Depth ${depth} - Contour ${contourIndex + 1}`,
                    showlegend: false
                });
            } else {
                console.log(`Contour array at depth ${depth} - Contour ${contourIndex + 1} is not an array.`);
            }
        });
    });
    console.log("PlotContoursWithDepths done", traces);
    return traces;
}

//avg of every point of depth 8
function plotContourCenters(contoursByDepth, depthsToPlot) {
    if (!Array.isArray(depthsToPlot)) {
        console.error('Invalid input: depthsToPlot is not an array', depthsToPlot);
        return {};
    }

    const centers = {};
    depthsToPlot.forEach(depth => {
        const contoursAtDepth = contoursByDepth[depth] || [];
        centers[depth] = contoursAtDepth.map(contour => {
            let sumX = 0, sumY = 0;
            contour.forEach(point => {
                sumX += point.x;
                sumY += point.y;
            });
            const centerX = sumX / contour.length;
            const centerY = sumY / contour.length;

            return {centerX, centerY};
        });
    });
    console.log('Contour centers by depth:', centers);
    return centers;
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

    useEffect(() => {
        // Combine all contours from different keys into a single array
        const allContours = Object.values(data).flat();
        // console.log("allContours:", allContours); // Debugging console log
        const organizedData = organizeContoursByDepth(allContours);
        // console.log("organizedData:", organizedData); // Debugging console log
        setContoursByDepth(organizedData);
    }, []);

    // Initialize traces as an empty array
    let traces = [];
    let combinedTraces = {};

    // Generate traces for contours and contour centers
    if (Object.keys(contoursByDepth).length > 0) {
        // const contoursTraces = plotContoursWithDepths({contoursByDepth, depthsToPlot});
        const centersTraces = plotContourCenters(contoursByDepth, depthsToPlot);
        depthsToPlot.forEach(depth => {
            combinedTraces[depth] = [];
            // if (contoursTraces[depth]) {
            //     combinedTraces[depth].push(contoursTraces[depth]);
            // }
            if (centersTraces[depth]) {
                combinedTraces[depth].push(...centersTraces[depth]);
            }
            // console.log(`Combined Traces for Depth ${depth}:`, combinedTraces[depth]);
            console.log(`Center traces for Depth ${depth}`, centersTraces[depth])
        });

        // Combine all traces into a single array for plotting
        traces = Object.values(combinedTraces).flat();
        addTargetRings(numRings, traces);
        console.log("traces after addTargetRings:", traces); // Debugging console log

    }

    // Define the layout for the plot
    const layout = {
        // title: 'V4 Receptive Fields',
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