"use client";
import React, { useState, useEffect } from "react";
import data from '../../data/xy_subset_sample.json'; // Adjust the path as needed
import PlotCell2D from "@components/PlotCell2D";

const VisualizationPage = () => {
    const [contours, setContours] = useState([]);

    useEffect(() => {
        setContours(data);
    }, []);

    return (
        <section className="w-full flex-center flex-col">
            <PlotCell2D depthsToPlot={[1, 2, 3]} numRings={5} />
        </section>
    );
};

export default VisualizationPage;
