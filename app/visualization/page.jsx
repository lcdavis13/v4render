"use client";
import React, { useState, useEffect } from "react";
import * as THREE from 'three';
import data from '../../data/xy_subset_sample.json';
import data_old from '../../data/xy_subset_sample_old.json';
import PlotCell2D from "@components/PlotCell2D";
import PlotCell3D from "@components/PlotCell3D";

const VisualizationPage = () => {
    const [contours, setContours] = useState([]);

    useEffect(() => {
        setContours(data_old);
    }, []);

    return (
        // <section className="w-full flex-center flex-col">
        //     <PlotCell2D depthsToPlot={[1, 2, 3]} numRings={5} />
        //     <PlotCell3D depthsToPlot={[1, 2, 3]} numRings={5} />
        // </section>

        <section className="w-full flex flex-row">
            <div className="flex-1">
                <PlotCell2D depthsToPlot={[1, 2, 3]} numRings={5} />
            </div>
            <div className="flex-1">
                <PlotCell3D depthsToPlot={[1, 2, 3]} numRings={5} />
            </div>
        </section>

);
};



export default VisualizationPage;
