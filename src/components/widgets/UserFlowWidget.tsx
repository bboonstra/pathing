import React, { useState, useEffect, useMemo } from "react";
import { WidgetProps, EventData } from "@/types/widgets";
import BaseWidget from "./BaseWidget";
import widgetRegistry from "@/utils/widgetRegistry";
import ReactFlow, { Background, ReactFlowProvider, Position } from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

const proOptions = { hideAttribution: true };

// Register widget definition
widgetRegistry.register({
    type: "userFlow",
    name: "User Flow",
    description: "Track how users navigate sequentially between selected pages",
    icon: "flow",
    constraints: {
        minWidth: 3,
        maxWidth: 4,
        minHeight: 2,
        maxHeight: 4,
        defaultWidth: 3,
        defaultHeight: 2,
    },
    configFields: [
        // Note: We use a custom settings UI for this widget, so these are minimal
        {
            key: "flowPages",
            type: "string", // Custom handling for array of pages
            label: "Flow Pages",
            description: "Pages to analyze sequential user flow between",
        },
    ],
});

interface FlowStep {
    from: string;
    to: string;
    count: number;
    percentage: number;

    /* NEW: the two most–frequent alternate next pages */
    alternatives: {
        page: string;
        count: number;
        percentage: number;
    }[];
}

interface FlowNode {
    page: string;
    totalVisits: number;
    index: number;
}

const UserFlowWidget: React.FC<WidgetProps> = ({
    config,
    domainId,
    events,
    isLoading,
    onSettingsChange,
}) => {
    const [flowData, setFlowData] = useState<FlowStep[]>([]);
    const [nodeData, setNodeData] = useState<FlowNode[]>([]);

    // React Flow state
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // Colors
    const colors = useMemo(
        () => ({
            node: {
                bg: "linear-gradient(to right, #1e40af, #3b82f6)",
                text: "#ffffff",
            },
            flow: {
                direct: "linear-gradient(to right, #3b82f6, #6b7280)",
                other: "#6b7280",
                left: "#f87171",
            },
        }),
        []
    );

    useEffect(() => {
        if (isLoading || !events.length) return;

        // Get the configured flow pages
        const pages = (config.settings.flowPages as string[]) || [];

        // Only proceed if we have at least 2 pages defined
        if (pages.length < 2) return;

        // Group events by session
        const sessionEvents: Record<string, EventData[]> = {};
        events.forEach((event) => {
            const sessionId = (event.payload?.session_id ||
                event.payload?.user_id ||
                `${event.payload?.ip}-${new Date(
                    event.created_at
                ).toDateString()}`) as string;

            if (!sessionId) return;

            if (!sessionEvents[sessionId]) {
                sessionEvents[sessionId] = [];
            }

            sessionEvents[sessionId].push(event);
        });

        // Build sequential-flow tallies
        const flows: Record<
            string,
            {
                count: number; // reached configured "to" page
                total: number; // total visits that started at "from"
                otherCounts: Record<string, number>; // counts for each alternate page
            }
        > = {};
        const nodes: Record<string, { totalVisits: number; index: number }> =
            {};

        // Initialize sequential page combinations with 0
        for (let i = 0; i < pages.length - 1; i++) {
            const from = pages[i];
            const to = pages[i + 1];
            const key = `${from} → ${to}`;
            flows[key] = { count: 0, total: 0, otherCounts: {} };

            // Initialize node data
            if (!nodes[from]) {
                nodes[from] = { totalVisits: 0, index: i };
            }
            if (!nodes[to]) {
                nodes[to] = { totalVisits: 0, index: i + 1 };
            }
        }

        // Analyze each session for sequential flow between pages
        Object.values(sessionEvents).forEach((sessionEvts) => {
            // Sort events by timestamp
            sessionEvts.sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            );

            // Get paths from this session
            const visitedPaths = sessionEvts
                .filter((e) => e.payload?.path)
                .map((e) => e.payload?.path as string);

            // Skip if there aren't enough page visits
            if (visitedPaths.length < 2) return;

            // Track each sequential conversion
            for (let i = 0; i < pages.length - 1; i++) {
                const from = pages[i];
                const to = pages[i + 1];
                const flowKey = `${from} → ${to}`;

                // Count each visit to the "from" page for calculating totals

                // Look for sequential visits of "from" followed by "to"
                for (let j = 0; j < visitedPaths.length - 1; j++) {
                    if (visitedPaths[j] === from) {
                        flows[flowKey].total++;
                        nodes[from].totalVisits++;

                        const nextPage = visitedPaths[j + 1]; // immediate next page
                        if (nextPage === to) {
                            flows[flowKey].count++;
                        } else {
                            flows[flowKey].otherCounts[nextPage] =
                                (flows[flowKey].otherCounts[nextPage] || 0) + 1;
                        }
                    }
                }
            }
        });

        // Convert tallies to an array with percentages
        const flowDataArray = Object.entries(flows)
            .map(([path, data]) => {
                const [from, to] = path.split(" → ");

                // Top-2 alternate pages
                const alternatives = Object.entries(data.otherCounts)
                    .sort((a, b) => b[1] - a[1]) // most frequent first
                    .slice(0, 2)
                    .map(([page, count]) => ({
                        page,
                        count,
                        percentage: data.total ? (count / data.total) * 100 : 0,
                    }));

                return {
                    from,
                    to,
                    count: data.count,
                    percentage: data.total
                        ? (data.count / data.total) * 100
                        : 0,
                    alternatives,
                };
            })
            // Maintain the order of steps as defined in the pages array
            .sort((a, b) => {
                const fromIndexA = pages.indexOf(a.from);
                const fromIndexB = pages.indexOf(b.from);
                return fromIndexA - fromIndexB;
            });

        const nodeDataArray = Object.entries(nodes)
            .map(([page, data]) => ({
                page,
                totalVisits: data.totalVisits,
                index: data.index,
            }))
            .sort((a, b) => a.index - b.index);

        setFlowData(flowDataArray);
        setNodeData(nodeDataArray);
    }, [events, isLoading, config.settings.flowPages]);

    // Build React Flow nodes and edges when data updates
    useEffect(() => {
        if (!nodeData.length) {
            setNodes([]);
            setEdges([]);
            return;
        }

        const X_NODE_SPACING = 230; // main column spacing
        const Y_POS_MAIN = 100;
        const Y_POS_OTHER = Y_POS_MAIN + 120; // Y of the first alt-node row
        const MAIN_NODE_WIDTH = 140;
        const OTHER_NODE_WIDTH = 90;
        const ALT_VERTICAL_SPACING = 100; // vertical gap between alt nodes

        const newNodes: Node[] = nodeData.map((node) => ({
            id: node.page,
            position: { x: node.index * X_NODE_SPACING, y: Y_POS_MAIN },
            data: {
                label: (
                    <div className="flex flex-col items-center justify-center text-xs font-medium">
                        <span>{node.page}</span>
                        <span className="text-[10px] opacity-70">
                            {node.totalVisits} visits
                        </span>
                    </div>
                ),
            },
            style: {
                width: MAIN_NODE_WIDTH,
                borderRadius: 20,
                padding: 6,
                background: colors.node.bg,
                color: colors.node.text,
                border: "none",
                textAlign: "center",
                fontSize: 12,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        }));

        const newEdges: Edge[] = [];
        const otherNodeStyle: React.CSSProperties = {
            width: OTHER_NODE_WIDTH,
            background: "#ffffff",
            color: colors.flow.other,
            border: `1px solid ${colors.flow.other}`,
            borderRadius: 8,
            padding: "5px",
            textAlign: "center" as React.CSSProperties["textAlign"],
            fontSize: 11,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        };

        const nodePositions: Record<
            string,
            { x: number; y: number; index: number }
        > = {};
        nodeData.forEach((n) => {
            nodePositions[n.page] = {
                x: n.index * X_NODE_SPACING,
                y: Y_POS_MAIN,
                index: n.index,
            };
        });

        // Use a solid color for direct flow edges (first color from gradient if applicable)
        const directFlowColor =
            typeof colors.flow.direct === "string" &&
            colors.flow.direct.startsWith("linear-gradient")
                ? "#3b82f6" // Default to blue-600 or extract from gradient
                : colors.flow.direct;

        flowData.forEach((flow) => {
            const fromNodePos = nodePositions[flow.from];
            const toNodePos = nodePositions[flow.to];

            if (!fromNodePos || !toNodePos) {
                console.warn(
                    `Skipping flow step due to missing node data: ${flow.from} -> ${flow.to}`
                );
                return;
            }

            // Direct flow edge to the next page node
            if (flow.percentage > 0) {
                newEdges.push({
                    id: `edge-${flow.from}-to-${flow.to}-direct`,
                    source: flow.from,
                    target: flow.to,
                    label: `${flow.percentage.toFixed(1)}%`,
                    type: "smoothstep",
                    animated: true,
                    style: {
                        stroke: directFlowColor as string,
                        strokeWidth: 3,
                    },
                    labelStyle: {
                        fill: "#374151", // Dark gray text for label
                        fontWeight: "600",
                        fontSize: 10,
                    },
                    labelBgStyle: {
                        fill: "#ffffff", // White background for label
                        fillOpacity: 0.85,
                        stroke: "#e5e7eb", // Light gray border for label bg
                        strokeWidth: 0.5,
                    },
                    labelBgPadding: [4, 3],
                    labelBgBorderRadius: 4,
                });
            }

            /* === 2.  Up to two alternate-page nodes / edges === */
            flow.alternatives.forEach((alt, idx) => {
                const altNodeId = `alt-node-${flow.from}-${flow.to}-${idx}`;
                // horizontally centre the tab under the target page's column
                const altX =
                    toNodePos.x + (MAIN_NODE_WIDTH - OTHER_NODE_WIDTH) / 2;
                // stack them evenly beneath the main flow
                const altY = Y_POS_OTHER + idx * ALT_VERTICAL_SPACING;

                // Create the alternate node
                newNodes.push({
                    id: altNodeId,
                    position: { x: altX, y: altY },
                    data: {
                        label: (
                            <div className="flex flex-col items-center">
                                <span className="text-xs">{alt.page}</span>
                                <span className="text-[10px] opacity-70">
                                    {alt.count} visits
                                </span>
                            </div>
                        ),
                    },
                    style: otherNodeStyle,
                    targetPosition: Position.Left,
                });

                // Edge from "from" page to this alternate node
                newEdges.push({
                    id: `edge-${flow.from}-to-${altNodeId}`,
                    source: flow.from,
                    target: altNodeId,
                    type: "smoothstep",
                    label: `${alt.percentage.toFixed(1)}%`,
                    animated: false,
                    style: {
                        stroke: colors.flow.other,
                        strokeWidth: 1.5,
                        strokeDasharray: "5 3",
                    },
                    labelStyle: {
                        fill: colors.flow.other,
                        fontSize: 10,
                        fontWeight: 600,
                    },
                    labelBgStyle: { fill: "#ffffff", fillOpacity: 0.85 },
                    labelBgPadding: [4, 3],
                    labelBgBorderRadius: 4,
                });
            });
        });

        setNodes(newNodes);
        setEdges(newEdges);
    }, [
        nodeData,
        flowData,
        colors, // Main dependency for colors
    ]);

    // Handle widget configuration
    const handleSettingsChange = (pages: string[]) => {
        onSettingsChange(config.id, {
            ...config.settings,
            flowPages: pages,
        });
    };

    // Custom settings component for this widget
    const renderSettings = () => {
        const pages = (config.settings.flowPages as string[]) || [];
        const allPaths = new Set<string>();

        // Collect all unique paths from events
        events.forEach((event) => {
            const path = event.payload?.path;
            if (path && typeof path === "string") {
                allPaths.add(path);
            }
        });

        const pathOptions = Array.from(allPaths);

        // Allow selecting up to 4 pages
        return (
            <div className="p-4 space-y-4">
                <h3 className="text-sm font-medium">Configure User Flow</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    Select pages in sequence to track user flow between them
                </p>

                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="space-y-1">
                        <label className="text-xs font-medium">
                            Page {index + 1}
                        </label>
                        <select
                            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                            value={pages[index] || ""}
                            onChange={(e) => {
                                const newPages = [...pages];
                                newPages[index] = e.target.value;
                                // Filter out empty values
                                handleSettingsChange(newPages.filter(Boolean));
                            }}
                        >
                            <option value="">Select a page</option>
                            {pathOptions.map((path) => (
                                <option key={path} value={path}>
                                    {path}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <BaseWidget
            config={config}
            domainId={domainId}
            events={events}
            isLoading={isLoading}
            onSettingsChange={onSettingsChange}
            customSettings={renderSettings()}
        >
            <div className="p-4 h-full flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-pulse text-gray-400">
                            Loading flow data...
                        </div>
                    </div>
                ) : nodes.length > 0 ? (
                    <div className="flex-1 flex flex-col h-full">
                        <div
                            className="flex-1 relative rounded-xl overflow-hidden shadow"
                            style={{ minHeight: "250px", minWidth: "800px" }}
                        >
                            <ReactFlowProvider>
                                <ReactFlow
                                    proOptions={proOptions}
                                    nodes={nodes}
                                    edges={edges}
                                    fitView
                                    className="bg-white dark:bg-gray-900"
                                    style={{ width: "100%", height: "100%" }}
                                    panOnDrag={false}
                                    zoomOnScroll={false}
                                    zoomOnPinch={false}
                                    zoomOnDoubleClick={false}
                                    nodesConnectable={false}
                                >
                                    <Background
                                        gap={24}
                                        color="rgba(70,80,110,0.1)"
                                    />
                                </ReactFlow>
                            </ReactFlowProvider>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                        <svg
                            className="h-12 w-12 mb-2 text-gray-300 dark:text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 17l4-4m0 0l4-4m-4 4H3m18 0h-6"
                            />
                        </svg>
                        {config.settings.flowPages &&
                        (config.settings.flowPages as string[]).length >= 2 ? (
                            <p>No flow data available between selected pages</p>
                        ) : (
                            <p>
                                Please select at least 2 pages in widget
                                settings
                            </p>
                        )}
                    </div>
                )}
            </div>
        </BaseWidget>
    );
};

export default UserFlowWidget;
