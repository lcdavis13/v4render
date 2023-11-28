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

function ConvertEyeAnglesToSphere(points) {
    const position_radians = points.map(([x, y, depth]) => new THREE.Vector2(x * Math.PI / 180.0, y * Math.PI / 180.0));
    const polar_positions = position_radians.map(([x, y]) => new THREE.Vector2(Math.sqrt(x * x + y * y), Math.atan2(y, x)));
    const positions = polar_positions.map(([u, w]) => new THREE.Vector3(Math.sin(u) * Math.sin(w), Math.sin(u) * Math.cos(w), Math.cos(u)));
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
                const theta = Array.from({ length: 100 }, (_, i) => i * (2 * Math.PI) / 100);
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

function PlotCell3D() {
    const contours = extractContours(pointsData);

    return (
        <Canvas
            camera={{ position: [0, 0, 3], near: 0.1, far: 10, up: [0, 0, 1] }}
            style={{ height: '100vh', width: '100vw' }}
        >
            <axesHelper scale={[2, 2, 2]} />
            <ambientLight />
            <ContourLines contours={contours} />
            <ConcentricRings />
            <OrbitControls />
            <directionalLight position={[10, 10, 5]} intensity={1} />
        </Canvas>
    );
}

export default PlotCell3D;
