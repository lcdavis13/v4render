"use client";
import React, { useState } from 'react';
import PlotCell2D from '@components/PlotCell2D';
import PlotCell3D from '@components/PlotCell3D';

const VisualizationPage = () => {
    // Define a state to hold the clicked point data
    const [clickedPoint, setClickedPoint] = useState(null);

    // Define a handler to update the clicked point data
    const handlePlotClick = (event) => {
        console.log("Click");
        if (event && event.points && event.points.length > 0) {
            const point = event.points[0];
            const cellName = point.customdata ? point.customdata[0] : 'Unknown';
            console.log(`Clicked point: Cell=${cellName}, X=${point.x}, Y=${point.y}`);
            // Update the clicked point state
            setClickedPoint({ cell: cellName, x: point.x, y: point.y });
        }
    };

    return (
        <section className="w-full flex flex-row justify-between items-stretch overflow-hidden">
            <div className="w-1/2 overflow-hidden">
                <PlotCell2D depthsToPlot={[8]} numRings={8} onPlotClick={handlePlotClick}/>
            </div>
            <div className="w-1/2 overflow-hidden">
                <PlotCell3D numRings={5} clickedPoint={clickedPoint}/>
            </div>
        </section>
    );
};

export default VisualizationPage;
