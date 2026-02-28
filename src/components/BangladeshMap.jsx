"use client";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";

// Path to your GeoJSON file (can be a URL or local path)
const GEO_URL = "/bgd_admin2.geojson"; //* Bangladesh district map
// const GEO_URL = "/bgd_admin1.geojson"; //* Bangladesh state map
// const GEO_URL = "/bgd_admin0.geojson"; //* Bangladesh map

export default function BangladeshMap() {
    const [content, setContent] = useState("");

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 rounded-xl">
            <h1 className="text-2xl font-bold mb-4">Bangladesh District Map</h1>

            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg border border-gray-200">
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 3000,
                        center: [90.35, 23.95], // Centering on Bangladesh
                    }}
                >
                    <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                console.log(geo);

                                return (
                                    <path
                                        key={geo.id}
                                        d={geo.svgPath}
                                        // fill={getFillColor(geo)}
                                        fill="#4ade80"
                                        stroke="#ffffff"
                                        strokeWidth="1.5"
                                        className="transition-all duration-300 ease-out cursor-pointer hover:filter hover:brightness-110"
                                        // style={{
                                        //     transform:
                                        //         hoveredRegion?.id === geo.id
                                        //             ? "scale(1.01)"
                                        //             : "scale(1)",
                                        //     transformOrigin: "center",
                                        //     zIndex:
                                        //         hoveredRegion?.id === geo.id
                                        //             ? 50
                                        //             : 1,
                                        // }}
                                        // onMouseEnter={() =>
                                        //     setHoveredRegion(geo)
                                        // }
                                        // onMouseLeave={() =>
                                        //     setHoveredRegion(null)
                                        // }
                                        data-tooltip-id="map-tooltip"
                                    />
                                );

                                // return (
                                //     <Geography
                                //         key={geo.rsmKey}
                                //         geography={geo}
                                //         data-tooltip-id="districts-tooltip"
                                //         data-tooltip-content={
                                //             geo.properties.adm2_name
                                //         } // Adjust based on your JSON keys
                                //         onMouseEnter={() =>
                                //             setContent(geo.properties.adm2_name)
                                //         }
                                //         onMouseLeave={() => setContent("")}
                                //         className="fill-green-600 stroke-white stroke-[0.5] outline-none transition-all duration-200 cursor-pointer"
                                //     />
                                // );
                            })
                        }
                    </Geographies>
                </ComposableMap>
            </div>

            <Tooltip id="districts-tooltip" />

            <p className="mt-4 text-lg font-semibold text-gray-700">
                Selected District:{" "}
                <span className="text-blue-600">{content || "None"}</span>
            </p>
        </div>
    );
}
