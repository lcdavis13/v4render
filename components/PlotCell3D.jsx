import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import 'd3-scale';

// Load your points data from the file
import pointsData from '../data/contoursData.json';

function extractContours(data) {
    const contours = [];

    for (const cellName in data) {
        if (data.hasOwnProperty(cellName)) {
            const cell = data[cellName];
            for (const depthKey in cell) {
                if (cell.hasOwnProperty(depthKey)) {
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
                const positions = contour.map(([x, y, depth]) => new THREE.Vector3(x, y, depth));
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
            {Array.from({ length: 10 }).map((_, index) => {
                const radius = (index + 1) * 5;
                const theta = Array.from({ length: 100 }, (_, i) => i * (2 * Math.PI) / 100);
                const positions = theta.map(angle => new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0));

                const geometry = new THREE.BufferGeometry().setFromPoints(positions);
                const material = new THREE.LineBasicMaterial({ color: 0xFFAAAA });

                return (
                    <line key={`ring-${index}`} geometry={geometry} material={material} />
                );
            })}
        </group>
    );
}

function PlotCell3D(props) {
    const contours = extractContours(pointsData);

    // You can use props here, for example:
    useEffect(() => {
        if (props.clickedPoint) {
            console.log("Received clicked point in PlotCell3D:", props.clickedPoint);
        }
    }, [props.clickedPoint]);

    return (
        <Canvas
            camera={{ position: [0, 0, 50], near: 0.1, far: 1000, up: [0, 0, 1] }}
            style={{ height: '100%', width: '100%' }}
        >
            <axesHelper scale={[5, 5, 5]} />
            <ambientLight />
            <ContourLines contours={contours} />
            <ConcentricRings />
            <OrbitControls />
            <directionalLight position={[10, 10, 5]} intensity={1} />
        </Canvas>
    );
}

export default PlotCell3D;
