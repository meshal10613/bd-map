"use client";

import React, { useState, useMemo } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
    Maximize2,
    Minus,
    Plus,
    MapPin,
    TrendingUp,
    Users,
    Building2,
} from "lucide-react";
import { BD_MAP_DATA } from "@/data/bd-map-paths"; // Ensure this path is correct
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind class merging
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Mock Data Generator to simulate stats per district
// In a real app, you would merge this with your API data
const getDistrictStats = (id) => {
    const random = (id.charCodeAt(0) + id.charCodeAt(id.length - 1)) % 100;
    return {
        population: random * 50000 + 100000,
        shops: random * 150 + 50,
        growth: (random % 20) - 5, // Random growth between -5% and 15%
        densityLevel: random > 80 ? "high" : random > 40 ? "medium" : "low",
    };
};

export const BangladeshMap = () => {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [zoom, setZoom] = useState(1);

    // Merge map paths with mock stats
    const mapData = useMemo(() => {
        return BD_MAP_DATA.map((region) => ({
            ...region,
            stats: getDistrictStats(region.id),
        }));
    }, []);

    const activeRegion = hoveredRegion || selectedRegion;

    // Color Logic (Choropleth Style)
    const getFillColor = (region) => {
        const isSelected = selectedRegion?.id === region.id;
        const isHovered = hoveredRegion?.id === region.id;

        if (isSelected) return "#0f172a"; // Slate-900 (Selected)
        if (isHovered) return "#334155"; // Slate-700 (Hover)

        // Heatmap colors
        switch (region.stats.densityLevel) {
            case "high":
                return "#059669"; // Emerald-600
            case "medium":
                return "#34d399"; // Emerald-400
            case "low":
                return "#a7f3d0"; // Emerald-200
            default:
                return "#e2e8f0"; // Slate-200
        }
    };

    const handleZoom = (direction) => {
        setZoom((prev) => {
            const newZoom = direction === "in" ? prev + 0.2 : prev - 0.2;
            return Math.min(Math.max(newZoom, 1), 2.5); // Clamp between 1x and 2.5x
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans bg-white min-h-screen">
            <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[700px]">
                {/* LEFT: Map Container */}
                <div className="relative flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex items-center justify-center p-4 lg:p-10 group">
                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                        <button
                            onClick={() => handleZoom("in")}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-colors text-slate-600"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleZoom("out")}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-colors text-slate-600"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setZoom(1);
                                setSelectedRegion(null);
                            }}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-colors text-slate-600 tooltip"
                            data-tooltip-content="Reset View"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* The SVG Map */}
                    <div
                        className="w-full max-w-7xl h-full flex items-center justify-center transition-transform duration-500 ease-out"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        <svg
                            viewBox="0 0 437.80637 601.16034"
                            className="w-full h-full max-h-[650px] drop-shadow-lg"
                            style={{ overflow: "visible" }}
                        >
                            <defs>
                                <filter
                                    id="glow"
                                    x="-20%"
                                    y="-20%"
                                    width="140%"
                                    height="140%"
                                >
                                    <feGaussianBlur
                                        stdDeviation="2"
                                        result="blur"
                                    />
                                    <feComposite
                                        in="SourceGraphic"
                                        in2="blur"
                                        operator="over"
                                    />
                                </filter>
                            </defs>
                            <g>
                                {mapData.map((region) => (
                                    <path
                                        key={region.id}
                                        d={region.path}
                                        fill={getFillColor(region)}
                                        stroke="white"
                                        strokeWidth={
                                            selectedRegion?.id === region.id
                                                ? "2"
                                                : "0.8"
                                        }
                                        className={cn(
                                            "transition-all duration-300 ease-out cursor-pointer outline-none",
                                            "hover:brightness-110",
                                        )}
                                        style={{
                                            filter:
                                                activeRegion?.id === region.id
                                                    ? "drop-shadow(0px 4px 6px rgba(0,0,0,0.2))"
                                                    : "none",
                                            transform:
                                                activeRegion?.id === region.id
                                                    ? "scale(1.01) translateY(-1px)"
                                                    : "scale(1)",
                                            transformOrigin: "center",
                                            zIndex:
                                                activeRegion?.id === region.id
                                                    ? 50
                                                    : 1,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedRegion(region);
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredRegion(region)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredRegion(null)
                                        }
                                        data-tooltip-id="map-tooltip"
                                    />
                                ))}
                            </g>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Custom Tooltip */}
            <ReactTooltip
                id="map-tooltip"
                place="top"
                offset={15}
                className="!bg-slate-900/90 !backdrop-blur-md !text-white !opacity-100 !rounded-xl !px-4 !py-3 !shadow-xl !border !border-white/10 z-50 hidden md:block"
                noArrow
            >
                {hoveredRegion && (
                    <div className="text-center">
                        <p className="font-bold text-sm">
                            {hoveredRegion.name}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                            {hoveredRegion.division}
                        </p>
                    </div>
                )}
            </ReactTooltip>
        </div>
    );
};


export default BangladeshMap;
