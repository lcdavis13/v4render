"use client";
import React, { useState, useEffect } from "react";
import * as THREE from 'three';
import contoursData from '../../data/contoursData.json';
import PlotCell2D from "@components/PlotCell2D";
// import PlotCell3D from "@components/PlotCell3D";

const VisualizationPage = () => {
    const [contours, setContours] = useState([]);

    useEffect(() => {
        setContours({
            "1": contoursData["GAJ.XY"]["1"].splice(1,3)
            // "2": contoursData["GAJ.XY"]["2"]
        });
        console.log("help");
    }, []);

    return (
        <section className="w-full flex-center flex-col">
            <PlotCell2D depthsToPlot={[1, 2, 3]} numRings={5} />
            {/*<PlotCell3D depthsToPlot={[1, 2, 3]} numRings={5} />*/}
        </section>
    );
};



export default VisualizationPage;
