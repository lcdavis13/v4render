"use client";
import React, {useState, useEffect} from "react";
import PlotCell2D from "@components/PlotCell2D";
import PlotCell3D from "@components/PlotCell3D";


const VisualizationPage = () => {
    return (
        <section className="w-full flex flex-row justify-between items-stretch overflow-hidden">
            <div className="w-1/2 overflow-hidden"> {/* Add overflow handling */}
                <PlotCell2D depthsToPlot={[8]} numRings={8}/>
            </div>
            <div className="w-1/2 overflow-hidden"> {/* Add overflow handling */}
                <PlotCell3D numRings={5}/>
            </div>
        </section>
    );
};


export default VisualizationPage;
