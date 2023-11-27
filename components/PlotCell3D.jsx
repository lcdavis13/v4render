import React, { useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import 'd3-scale';

// Load your points data from the file
import pointsData from '../data/xy_subset_sample.json';

function extractContours(data) {
    const contours = [];

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const contourGroup = data[key];
            contourGroup.forEach((contour) => {
                if (contour.contour && Array.isArray(contour.contour)) {
                    contours.push(contour.contour.map(({ x, y, depth }) => [x, y, depth]));
                }
            });
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

function PlotCell3D() {
    const contours = extractContours(pointsData);

    return (
        <Canvas
            camera={{ position: [0, 0, 20], near: 0.1, far: 1000, up: [0, 0, 1] }}
            style={{ height: '100vh', width: '100vw' }}
        >
            <axesHelper scale={[5, 5, 5]} />
            <ambientLight />
            <ContourLines contours={contours} />
            <OrbitControls />
            <directionalLight position={[10, 10, 5]} intensity={1} />
        </Canvas>
    );
}

export default PlotCell3D;
