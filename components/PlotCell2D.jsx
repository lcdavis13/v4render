import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import rfsData from "rfs.json";

function readContoursFromJson(jsonData) {
  const contours = [];
  jsonData.forEach(cellData => {
    Object.values(cellData).forEach(contoursData => {
      Object.values(contoursData).forEach(contourData => {
        if ("point" in contourData) {
          contours.push(contourData["point"]);
        }
      });
    });
  });
  return contours;
}

function organizeContoursByDepth(contours) {
  const contoursByDepth = {};
  contours.forEach(contour => {
    const depth = parseFloat(contour[2]);
    if (!contoursByDepth[depth]) {
      contoursByDepth[depth] = [];
    }
    contoursByDepth[depth].push(contour);
  });
  return contoursByDepth;
}

function generateNivoData(contoursByDepth, depthsToPlot) {
  return depthsToPlot.map((depth, index) => {
    const contoursAtDepth = contoursByDepth[depth] || [];
    const dataPoints = contoursAtDepth.map(contour => ({ x: contour[0], y: contour[1] }));

    return {
      id: `Depth ${depth}`,
      data: dataPoints,
    };
  });
}

function addTargetRings(numRings) {
  const radmult = 2;
  const theta = new Array(100).fill().map((_, i) => (i / 100) * 2 * Math.PI);

  const circles = [];

  for (let i = 1; i <= numRings; i++) {
    const x = theta.map(angle => i * Math.cos(angle) * radmult);
    const y = theta.map(angle => i * Math.sin(angle) * radmult);

    circles.push(
      <circle
        key={`circle-${i}`}
        cx={x[0]}
        cy={y[0]}
        r={1.5}
        fill="none"
        stroke="pink"
        strokeWidth={1.5}
        strokeDasharray="5"
      />
    );
  }

  return circles;
}

function PlotCell2D() {
  const depthsToPlot = [3.0, 4.0, 5.0, 6.0, 7.0, 8.0];

  const contours = readContoursFromJson(rfsData);
  const contoursByDepth = organizeContoursByDepth(contours);
  const nivoData = generateNivoData(contoursByDepth, depthsToPlot);
  const circles = addTargetRings(10);

  const chartProps = {
    data: nivoData,
    margin: { top: 50, right: 110, bottom: 50, left: 60 },
    xScale: { type: 'linear' },
    yScale: { type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false },
    axisTop: null,
    axisRight: null,
    axisBottom: null,
    axisLeft: null,
    enableGridX: false,
    enableGridY: false,
    colors: 'nivo',
    pointSize: 10,
    pointColor: { from: 'color', modifiers: [] },
    pointBorderWidth: 2,
    pointBorderColor: { from: 'serieColor' },
    pointLabelYOffset: -12,
    useMesh: true,
    legends: [
      {
        anchor: 'top-right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1,
            },
          },
        ],
      },
    ],
  };

  return (
    <div>
      <svg width={500} height={500}>
        {circles}
      </svg>
      <ResponsiveLine {...chartProps} />
    </div>
  );
}

export default PlotCell2D;
