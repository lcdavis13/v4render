"use client";
import { useState } from "react";
import rfsData from "rfs.json";

// WRITE YOUR JS CODE HERE

const Visualization = () => {
  const [data, setData] = useState(rfsData);

  return (
    <section className="w-full flex-center flex-col">
      {/* WRITE YOUR JSX CODE HERE TO SHOW ON THE SCREEN */}
    </section>
  );
};

export default Visualization;
