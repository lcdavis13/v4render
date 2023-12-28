"use client";
import React, {useState} from 'react';
import PlotCell2D from '@components/PlotCell2D';
import PlotCell3D_v4 from '@components/PlotCell3D_v4';
import PlotCell3D_retina from '@components/PlotCell3D_retina';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBrain } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
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
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: 'auto', paddingBottom: '1rem', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', borderBottomLeftRadius: '10px' }}>
                        <PlotCell3D_retina numRings={5} clickedPoint={clickedPoint} />

                        <div style={{ position: 'absolute', bottom: '-2rem', width: '100%', background: '#f0f0f0', padding: '1rem', borderBottomRightRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <FontAwesomeIcon icon={faEye} style={{ fontSize: '2rem', marginLeft: '0.5rem' }} />
                            </div>
                            <header style={{ fontWeight: 'bold', marginBottom: '0.5rem', flex: '1', textAlign: 'center' }}>V4 Receptive Field in Retina Space</header>
                            <div>
                                <FontAwesomeIcon icon={faEye} style={{ fontSize: '2rem', marginLeft: '0.5rem' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ borderLeft: '0px dotted #000', height: '100 hv', margin: '0 1rem', background: '#f0f0f0' }}></div>

                    <div style={{ position: 'relative', borderBottomRightRadius: '10px' }}>
                        <PlotCell3D_v4 numRings={5} clickedPoint={clickedPoint} />
                        <div style={{ position: 'absolute', bottom: '-2rem', width: '100%', background: '#f0f0f0', padding: '1rem', borderBottomRightRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <FontAwesomeIcon icon={faBrain} style={{ fontSize: '2rem'}} />
                            </div>
                            <header style={{ fontWeight: 'bold', marginBottom: '0.5rem', flex: 1, textAlign: 'center' }}>V4 Receptive Field in V1 Space</header>
                            <div>
                                <FontAwesomeIcon icon={faBrain} style={{ fontSize: '2rem'}} />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'flex-start', backgroundColor: '#f0f0f0', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '1rem' }}>
                    <div style={{ width: '50%', boxSizing: 'border-box' }}>
                        <PlotCell2D depthsToPlot={[8]} numRings={12} onPlotClick={handlePlotClick} clickedPoint={clickedPoint} />
                    </div>
                    <div style={{ borderLeft: '2px solid #ddd', margin: '0 1rem' }}></div>
                    <div style={{ width: '50%', boxSizing: 'border-box' }}>
                        <header style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>V4 Receptive Field Centers in 2D</header>
                        <hr style={{ margin: '0.5rem 0' }} />
                        <p>
                            By clicking on cells (represented as points) in 2D, you can see the places that they react to (Receptive Fields) in 3D!
                            <br /><br />
                            When viewed on the eyeball, the V4 Receptive Fields are inconsistent and irregular.
                            <br /><br />
                            But when viewed on the V1 space, they are circular and consistent!
                        </p>
                    </div>
                </div>
            </section>

            <div className="general-description">
                <header style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>The Story</header>
                <hr style={{ margin: '0.5rem 0' }}/>
                <p style={{ marginTop: '0.5rem' }}>
                    Imagine your brain has a special part called V1 that takes pictures of what you see and makes
                    a map out of them. Now, there's another part called V4 that uses this map to understand and react
                    to these pictures. This study found that V4 uses the V1 map in a very organized way, like using
                    a pattern to look at different parts of the picture. It's like having a special magnifying glass
                    that shows you the same amount of detail no matter where you look on the map. The researchers
                    figured this out by testing how the v4 of monkeys reacts to different
                    things they see.
                    <br/>
                    <br/>
                    [Citation]: Motter BC. Central V4 receptive fields are scaled by the V1 cortical magnification and correspond to a constant-sized sampling of the V1 surface. Journal of Neuroscience. 2009 May 6;29(18):5749-57.
                </p>
            </div>
        </>
    );

};

export default Home;
