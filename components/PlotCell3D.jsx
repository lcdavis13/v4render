import React, { useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';

// Load your points data from the file
import pointsData from '../data/xy_subset_sample.json';

function flattenPointsData(data) {
    const flattenedPoints = [];

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const contours = data[key];
            contours.forEach((contour) => {
                if (contour.contour && Array.isArray(contour.contour)) {
                    contour.contour.forEach((point) => {
                        flattenedPoints.push([point.x, point.y, point.depth]);
                    });
                }
            });
        }
    }

    return flattenedPoints;
}

function Points({ points }) {
    const pointsRef = useRef();

    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.x += 0.005;
            pointsRef.current.rotation.y += 0.005;
        }
    });

    // Extract depths from points
    const depths = points.map((point) => point[2]);

    // Determine unique depths and assign colors
    const uniqueDepths = Array.from(new Set(depths));
    const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, uniqueDepths.length - 1]);

    // Create a BufferGeometry for the points
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));

    // Assign colors based on depths
    const colors = depths.map((depth) => new THREE.Color(colorScale(uniqueDepths.indexOf(depth))).toArray());
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors.flat(), 3));

    // Create a Points object with the BufferGeometry and a PointsMaterial
    const pointsObject = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ size: 2, vertexColors: true })
    );

    return <primitive object={pointsObject} />;
}

function PlotCell3D() {
    const flattenedPoints = flattenPointsData(pointsData);
    console.log(flattenedPoints);

    return (
        <Canvas
            camera={{ position: [0, 0, 20], near: 0.1, far: 1000, up: [0, 0, 1] }}
            style={{ height: '100vh', width: '100vw' }}
        >
            <axesHelper scale={[5, 5, 5]} />
            <ambientLight />
            <Points points={flattenedPoints} />
            <OrbitControls />
            <directionalLight position={[10, 10, 5]} intensity={1} />
        </Canvas>
    );
}

export default PlotCell3D;
