"use client";
import React, { useState, useEffect } from "react";
import PlotCell2D from "@components/PlotCell2D";
import PlotCell3D from "@components/PlotCell3D";

const VisualizationPage = () => {
    return (
        <section className="w-full flex flex-row justify-between items-start">
            <PlotCell2D depthsToPlot={[1, 2, 3, 4, 5, 6, 7, 8]} numRings={5}/>
            <PlotCell3D depthsToPlot={[1, 2, 3, 4, 5, 6, 7, 8]} numRings={5}/>
            {/*<PlotCell3D depthsToPlot={[1, 2, 3, 4, 5, 6, 7, 8]} numRings={5} style={{ width: '50%', height: '50%' }} />*/}
        </section>
    );
};



export default VisualizationPage;
