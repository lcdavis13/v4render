import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import {interpolateViridis} from 'd3-scale-chromatic';
import data from '../data/contoursData.json';

function organizeContoursByDepth(contoursData) {
    const contoursByDepth = {};

    // Iterate over each cell (e.g., "GAJ.XY")
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
                // Modify each contour point to include the cell name (groupKey)
                const labeledContours = contoursInDepth.map(contour =>
                    contour.map(point => ({...point, cellName: groupKey}))
                );
                // Push all the labeled contours into the organized structure by depth
                contoursByDepth[depthKey].push(...labeledContours);
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

function plotContourCenters(contoursByDepth, depthsToPlot, clickedPoint) {
    const centersAggregated = {};

    // Iterate only over specified depths
    depthsToPlot.forEach(depth => {
        if (contoursByDepth[depth]) {
            contoursByDepth[depth].forEach(pointArray => {
                pointArray.forEach(point => {
                    const key = `${depth}_${point.cellName}`;
                    if (!centersAggregated[key]) {
                        centersAggregated[key] = {sumX: 0, sumY: 0, count: 0};
                    }
                    centersAggregated[key].sumX += point.x;
                    centersAggregated[key].sumY += point.y;
                    centersAggregated[key].count++;
                });
            });
        }
    });

    const defaultCellName = "RBI.XY"; // Replace with the desired cellName

    // Calculate average centers and create scatter plot traces
    const centerTraces = Object.keys(centersAggregated).map(key => {
        const {sumX, sumY, count} = centersAggregated[key];
        const centerX = sumX / count;
        const centerY = sumY / count;
        const cellName = key.split('_')[1]; // Extract cellName from the key

        const isClickedPoint = clickedPoint && clickedPoint.x === centerX && clickedPoint.y === centerY;
        const color = isClickedPoint ? 'green' : 'blue';
        const symbol = isClickedPoint ? 'star' : 'circle';
        const size = isClickedPoint ? 15 : 5;
        const opacity = isClickedPoint ? 1 : 0.5;

        return {
            x: [centerX],
            y: [centerY],
            type: 'scatter',
            mode: 'markers',
            marker: {size: size, color: color, symbol: symbol, opacity: opacity},
            name: `Center for ${cellName}`,
            customdata: [[cellName]] // Include cellName in customdata
        };
    });

    return centerTraces; // Return traces for all centers
}

function addTargetRings(numRings, traces) {
    const radmult = 5;
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

function PlotCell2D({ depthsToPlot = [], numRings = 0, onPlotClick, clickedPoint }) {
    const [contoursByDepth, setContoursByDepth] = useState({});

    useEffect(() => {
        // Combine all contours from different keys into a single array
        // const allContours = Object.values(data).flat();
        const organizedData = organizeContoursByDepth(data);
        setContoursByDepth(organizedData);
    }, []);

    let traces = [];
    // let combinedTraces = {};

    // Generate traces for contours and contour centers
    if (Object.keys(contoursByDepth).length > 0) {
        // const centersTraces = plotContourCenters(contoursByDepth, depthsToPlot, plotColor); // Modify to use plotColor
        const centersTraces = plotContourCenters(contoursByDepth, depthsToPlot, clickedPoint); // Pass clickedPoint
        traces.push(...centersTraces);

        addTargetRings(numRings, traces);
        console.log("traces after addTargetRings:", traces); // Debugging console log
    }

    const layout = {
        // title: 'V4 Receptive Field Centers: 2D',
        xaxis: {
            title: 'X',
            range: [-25, 12],
            autorange: false
        },
        yaxis: {
            title: 'Y',
            range: [-45, 20],
            autorange: false
        },
        legend: {
            title: 'Legend',
            items: depthsToPlot.map(depth => `Depth ${depth}`)
        },
        plot_bgcolor: '#fff',
        paper_bgcolor: '#fff',
        showlegend: false
    };

    return (
        <Plot
            style={{height: '40vh', width: '45vw', bgcolor: '#f0f0f0'}}
            data={traces}
            layout={layout}
            onClick={(event) => onPlotClick(event)}
        />
    );
}


export default PlotCell2D;