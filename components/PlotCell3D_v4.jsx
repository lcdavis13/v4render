import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import 'd3-scale';

// Load your points data from the file
import pointsData from '../data/contoursData.json';
//import manifoldData from '../data/v1mag.csv';
// Import the JSON file directly
import functionTableData from '../data/v1mag.json';

// Set the functionTable variable
//var functionTable = functionTableData;

//var functionTable; // Global variable to store the loaded function table

//// Load CSV file
//function loadCSV(url, callback) {
//    var xhr = new XMLHttpRequest();
//    xhr.onreadystatechange = function () {
//        if (xhr.readyState === XMLHttpRequest.DONE) {
//            if (xhr.status === 200) {
//                callback(xhr.responseText);
//            }
//        }
//    };
//    xhr.open("GET", url, true);
//    xhr.send();
//}

//// Parse CSV data and store it in the functionTable variable
//function loadFunctionTable(callback) {
//    loadCSV('../data/v1mag.csv', function (data) {
//        var lines = data.split('\n');
//        var headers = lines[0].split(',');

//        functionTable = lines.slice(1).map(function (line) {
//            var values = line.split(',');
//            var entry = {};
//            headers.forEach(function (header, index) {
//                entry[header] = parseFloat(values[index]);
//            });
//            return entry;
//        });

//        callback();
//    });
//}

//// Linear Interpolation function
//function lerp(x, x0, x1, y0, y1) {
//    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
//}

//// Binary search for the closest phi value
//function binarySearch(arr, target, phiIndex) {
//    var left = 0;
//    var right = arr.length - 1;

//    while (left <= right) {
//        var mid = Math.floor((left + right) / 2);
//        var midPhi = arr[mid].phi;

//        if (midPhi === target) {
//            return mid;
//        } else if (midPhi < target) {
//            left = mid + 1;
//        } else {
//            right = mid - 1;
//        }
//    }

//    // At this point, left points to the first element greater than target
//    // and right points to the last element smaller than target
//    // Return the index of the element with the closest phi value
//    return Math.abs(arr[left].phi - target) < Math.abs(arr[right].phi - target) ? left : right;
//}

//// Function to get r and z values for a given phi using linear interpolation
//function get_rz(phi) {
//    if (!functionTable) {
//        console.error('Function table not loaded. Make sure to import the JSON data before using get_rz.');
//        return null;
//    }

//    // Use binary search to find the closest phi values for interpolation
//    var index = binarySearch(functionTable, phi, 'phi');
//    var prevIndex = Math.max(0, index - 1);
//    var nextIndex = Math.min(index + 1, functionTable.length - 1);

//    // Extract phi, r, and z values for interpolation
//    var prevPhi = functionTable[prevIndex].phi;
//    var nextPhi = functionTable[nextIndex].phi;
//    var prevR = functionTable[prevIndex].r;
//    var nextR = functionTable[nextIndex].r;
//    var prevZ = functionTable[prevIndex].z;
//    var nextZ = functionTable[nextIndex].z;

//    // Perform linear interpolation
//    var interpolatedR = lerp(phi, prevPhi, nextPhi, prevR, nextR);
//    var interpolatedZ = lerp(phi, prevPhi, nextPhi, prevZ, nextZ);

//    return {
//        r: interpolatedR,
//        z: interpolatedZ
//    };
//}

function binarySearch(arr, target, key) {
    let low = 0;
    let high = arr.length - 1;

    // Handle the case where target is less than the minimum phi value
    if (target < arr[0][key]) {
        return 0;
    }

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midValue = arr[mid][key];

        if (midValue === target) {
            return mid; // Exact match found
        } else if (midValue < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    // If the target is not found, return the index of the closest smaller value
    return high;
}


function interpolate(phi) {
    // Use binary search to find the closest phi value
    const closestIndex = binarySearch(functionTableData, phi, 'phi');

    // Get the two closest phi values
    const phi1 = functionTableData[closestIndex].phi;
    const r1 = functionTableData[closestIndex].r;
    const z1 = functionTableData[closestIndex].z;

    let phi2, r2, z2;

    // Check if closestIndex + 1 is a valid index
    if (closestIndex + 1 < functionTableData.length) {
        phi2 = functionTableData[closestIndex + 1].phi;
        r2 = functionTableData[closestIndex + 1].r;
        z2 = functionTableData[closestIndex + 1].z;
    } else {
        // If closestIndex + 1 is out of bounds, set phi2, r2, z2 to the last available values
        phi2 = functionTableData[closestIndex].phi;
        r2 = functionTableData[closestIndex].r;
        z2 = functionTableData[closestIndex].z;
    }

    // Perform linear interpolation
    const weight1 = (phi2 - phi) / (phi2 - phi1);
    const weight2 = (phi - phi1) / (phi2 - phi1);

    const interpolated_r = (r1 * weight1) + (r2 * weight2);
    const interpolated_z = (z1 * weight1) + (z2 * weight2);

    return { r: interpolated_r, z: interpolated_z };
}


// Function to get r and z for a given phi
function get_rz(phi) {
    return interpolate(phi);
}



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


function ConvertEyeAnglesToV4(points) {
    const position_radians = points.map(([x, y, depth]) => new THREE.Vector2(
        x * Math.PI / 180.0,
        y * Math.PI / 180.0
    ));
    const polar_positions = position_radians.map(([x, y]) => new THREE.Vector2(
        Math.sqrt(x * x + y * y),
        Math.atan2(y, x)
    ));
    const pos_ThetaRZ = polar_positions.map(([phi, theta]) => new THREE.Vector3(
        theta,
        get_rz(phi).r,
        get_rz(phi).z,
    ));
    const positions = pos_ThetaRZ.map(([theta, r, z]) => new THREE.Vector3(
        r*Math.cos(theta),
        -z,
        -r*Math.sin(theta),
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
                const positions = ConvertEyeAnglesToV4(contour)
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
                const theta = Array.from({ length: 100 + 1 }, (_, i) => i * (2 * Math.PI) / 100);
                const eye_angles = theta.map(angle => new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0));
                const positions = ConvertEyeAnglesToV4(eye_angles)

                const geometry = new THREE.BufferGeometry().setFromPoints(positions);
                const material = new THREE.LineBasicMaterial({ color: 0xFFAAAA });

                return (
                    <line key={`ring-${index}`} geometry={geometry} material={material} />
                );
            })}
        </group>
    );
}


function Wireframe() {
    return (
        <group>
            {functionTableData.map((data, index) => {
                // Skip entries that are not multiples of SampleSteps
                const SampleSteps = 10; // Set the desired number of sample steps
                if (index % SampleSteps !== 0) {
                    return null;
                }

                const radius = data.r;
                const z = data.z;
                const theta = Array.from({ length: 100 + 1 }, (_, i) => i * (2 * Math.PI) / 100);
                const positions = theta.map(angle => new THREE.Vector3(radius * Math.cos(angle), -z, -radius * Math.sin(angle)));

                const geometry = new THREE.BufferGeometry().setFromPoints(positions);
                const material = new THREE.LineBasicMaterial({ color: 0xAAAAAA });

                return (
                    <line key={`ring-${index}`} geometry={geometry} material={material} />
                );
            })}
        </group>
    );
}



function PlotCell3D_v4(props) {
    const [contours, setContours] = useState([]);

    //// Load function table when the component is mounted
    //useEffect(() => {
    //    loadFunctionTable(() => {
    //        console.log("Function table loaded.");
    //    });
    //}, []); // Empty dependency array ensures that it's only called once when the component is mounted

    useEffect(() => {
        if (props.clickedPoint) {
            console.log("Cell: ", props.clickedPoint.cell);
            const filteredContours = extractContours(pointsData, props.clickedPoint.cell, ["3", "4", "5", "6", "7", "8"]);
            setContours(filteredContours);
        }
    }, [props.clickedPoint]);

    return (
        <Canvas
            camera={{ position: [0, 100, 0], near: 0.1, far: 1000 }}
            style={{ height: '100%', width: '100%' }}
            onCreated={({ gl }) => {
                gl.setClearColor(new THREE.Color(0xf0f0f0));
            }}
        >
            <axesHelper scale={[50, 50, -50]} />
            <ambientLight />
            <Wireframe />
            <ConcentricRings />
            <ContourLines contours={contours} />
            <OrbitControls />
            <directionalLight position={[10, 10, 5]} intensity={1} />
        </Canvas>
    );
}



export default PlotCell3D_v4;
