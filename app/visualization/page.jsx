"use client";
import { useState } from "react";
import rfsData from "rfs.json";
import PlotCell2D from "@components/PlotCell2D";

// WRITE YOUR JS CODE HERE

const Visualization = () => {
  const [data, setData] = useState(rfsData);

  return (
    <section className="w-full flex-center flex-col">
      {/* WRITE YOUR JSX CODE HERE TO SHOW ON THE SCREEN */}
      <PlotCell2D />
    </section>
  );
};

export default Visualization;
