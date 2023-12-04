"use client";
import React, {useState} from 'react';
import PlotCell2D from '@components/PlotCell2D';
import PlotCell3D_v4 from '@components/PlotCell3D_v4';
import PlotCell3D_retina from '@components/PlotCell3D_retina';

const VisualizationPage = () => {
    const [clickedPoint, setClickedPoint] = useState(null);

    const handlePlotClick = (event) => {
        if (event && event.points && event.points.length > 0) {
            const point = event.points[0];
            // Extract the cell name from customdata
            const cellName = point.customdata ? point.customdata[0] : 'Unknown';
            console.log(`Clicked point: Cell=${cellName}, X=${point.x}, Y=${point.y}`);
            // Store the entire point object along with the extracted cell name
            setClickedPoint({ cell: cellName, x: point.x, y: point.y });
        }
    };

    return (
        <>
            <section className="w-full flex flex-row justify-between items-stretch overflow-hidden">
                <div className="w-1/3 overflow-hidden">
                    <PlotCell2D depthsToPlot={[8]} numRings={12} onPlotClick={handlePlotClick} clickedPoint={clickedPoint}/>
                </div>
                <div className="w-1/3 overflow-hidden">
                    <PlotCell3D_retina numRings={5} clickedPoint={clickedPoint}/>
                </div>
                <div className="w-1/3 overflow-hidden">
                    <PlotCell3D_v4 numRings={5} clickedPoint={clickedPoint} />
                </div>
            </section>
            <div className="general-description"> {/* Add a larger text box for general description */}
                <p>
                    Imagine your brain has a special part called V1 that takes pictures of what you see and makes
                    a map out of them. Now, there's another part called V4 that uses this map to understand and react
                    to these pictures. This study found that V4 uses the V1 map in a very organized way, like using
                    a pattern to look at different parts of the picture. It's like having a special magnifying glass
                    that shows you the same amount of detail no matter where you look on the map. The researchers
                    figured this out by doing cool experiments with monkeys, watching how their V4 reacts to different
                    things they see.
                    <br/>
                    <br/>
                    [Citation]: Motter BC. Central V4 receptive fields are scaled by the V1 cortical magnification and correspond to a constant-sized sampling of the V1 surface. Journal of Neuroscience. 2009 May 6;29(18):5749-57.
                </p>
            </div>
        </>
    );
};

export default VisualizationPage;
