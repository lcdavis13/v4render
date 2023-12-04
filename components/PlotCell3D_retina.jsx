import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import 'd3-scale';

// Load your points data from the file
import pointsData from '../data/contoursData.json';

function extractContours(data, cellNames = [], allowedDepthKeys = []) {
    const contours = [];

    for (const cellName in data) {
        if (data.hasOwnProperty(cellName)) {
            if (cellNames.length > 0 && !cellNames.includes(cellName)) {
                continue;
            }

            const cell = data[cellName];
            for (const depthKey in cell) {
                if (cell.hasOwnProperty(depthKey)) {
                    // Check if allowedDepthKeys is not empty and if the current depthKey is not in the list
                    if (allowedDepthKeys.length > 0 && !allowedDepthKeys.includes(depthKey)) {
                        continue; // Skip this depthKey if it's not in the specified list
                    }

                    const depth = cell[depthKey];

                    depth.forEach((contour) => {
                        if (Array.isArray(contour)) {
                            contours.push(contour.map(({ x, y, depth }) => [x, y, depth]));
                        }
                    });
                }
            }
        }
    }

    return contours;
}


function ConvertEyeAnglesToSphere(points) {
    const position_radians = points.map(([x, y, depth]) => new THREE.Vector2(
        x * Math.PI / 180.0,
        y * Math.PI / 180.0
    ));
    const polar_positions = position_radians.map(([x, y]) => new THREE.Vector2(
        Math.sqrt(x * x + y * y),
        Math.atan2(y, x)
    ));
    const positions = polar_positions.map(([u, w]) => new THREE.Vector3(
        Math.sin(u) * Math.cos(w),
        Math.cos(u),
        -Math.sin(u) * Math.sin(w),
    ));
    return positions
}

function ContourLines({ contours }) {
    const linesRef = useRef();

    useFrame(() => {
        if (linesRef.current) {
            linesRef.current.rotation.x += 0.005;
            linesRef.current.rotation.y += 0.005;
        }
    });

    // Extract depths from contours
    const depths = contours.map((contour) => contour[0][2]);

    // Determine unique depths and assign colors
    const uniqueDepths = Array.from(new Set(depths));
    const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, uniqueDepths.length - 1]);

    return (
        <group>
            {/* Display contours */}
            {contours.map((contour, index) => {
                const positions = ConvertEyeAnglesToSphere(contour)
                const colors = contour.map(([x, y, depth]) => new THREE.Color(colorScale(uniqueDepths.indexOf(depth))));

                const geometry = new THREE.BufferGeometry().setFromPoints(positions);
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors.flatMap(color => color.toArray()), 3));

                const material = new THREE.LineBasicMaterial({ vertexColors: true });

                return (
                    <line key={index} geometry={geometry} material={material} />
                );
            })}
        </group>
    );
}

function ConcentricRings() {
    return (
        <group>
            {Array.from({ length: 12 }).map((_, index) => {
                const radius = (index + 1) * 5;
                const theta = Array.from({ length: 101 }, (_, i) => i * (2 * Math.PI) / 100);
                const eye_angles = theta.map(angle => new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0));
                const positions = ConvertEyeAnglesToSphere(eye_angles)

                const geometry = new THREE.BufferGeometry().setFromPoints(positions);
                const material = new THREE.LineBasicMaterial({ color: 0xFFAAAA });

                return (
                    <line key={`ring-${index}`} geometry={geometry} material={material} />
                );
            })}
        </group>
    );
}

function PlotCell3D_retina(props) {
    // Initialize contours as an empty array
    const [contours, setContours] = useState([]);

    useEffect(() => {
        if (props.clickedPoint) {
            // Update contours only when clickedPoint is set
            console.log("Cell: ", props.clickedPoint.cell);
            const filteredContours = extractContours(pointsData, props.clickedPoint.cell, ["3", "4", "5", "6", "7", "8"]);
            setContours(filteredContours);
        }
    }, [props.clickedPoint]);

    return (
        <Canvas
            camera={{ position: [0, 3, 0], near: 0.1, far: 100,  }}
            style={{ height: '100%', width: '100%' }}
            onCreated={({ gl }) => {
                // Set clear color to desired background color
                gl.setClearColor(new THREE.Color(0xf0f0f0));
            }}
        >


            <axesHelper scale={[2, 2, -2]} />
            <ambientLight />
            <ContourLines contours={contours} />
            <ConcentricRings />
            <OrbitControls />
            <directionalLight position={[10, 10, 5]} intensity={1} />
        </Canvas>
    );
}

export default PlotCell3D_retina;
