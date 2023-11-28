"use client";
import React, { useState, useEffect } from "react";
// import data from '../../data/xy_subset_sample.json';
import contoursData from '../../data/contoursData.json'
import PlotCell2D from "@components/PlotCell2D";

const VisualizationPage = () => {
    const [contours, setContours] = useState([]);

    useEffect(() => {
        console.log(typeof contoursData["GAJ.XY"])
        // setContours(contoursData["GAJ.XY"].slice(1,3));
    }, []);

    return (
        <section className="w-full flex-center flex-col">
            <PlotCell2D depthsToPlot={[1, 2, 3]} numRings={5} />
        </section>
    );
};

export default VisualizationPage;
