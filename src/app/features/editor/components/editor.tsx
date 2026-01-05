"use client";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "../../workflows/hooks/use-workflows";
import { useState, useCallback } from 'react';
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
    type Connection,
    Controls,
    MiniMap,
    Background,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-coponents";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";

export const EditorLoading = () => {
    return <LoadingView message="Loading..." />;
};

export const EditorError = () => {
    return <ErrorView message="Error loading editor." />;
};


export const Editor = ({ workflowID }: { workflowID: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowID);

    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <div className="size-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeComponents}
                onInit={setEditor}
                fitView
                snapGrid={[10, 10]}
                snapToGrid
            >
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>
                <Panel position="bottom-center">
                    <div className="text-center text-sm font-medium text-muted-foreground">
                        Shift + Drag to select multiple nodes.
                    </div>
                </Panel>
                <Background />
            </ReactFlow>
        </div>
    )
}