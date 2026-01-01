"use client";

import React, { type ReactNode } from "react";
import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { BaseNode } from "@/components/react-flow-ui/base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: () => void;
};

export function PlaceholderNode({ children, onClick }: PlaceholderNodeProps) {
  // const id = useNodeId();
  // const { setNodes, setEdges } = useReactFlow();

  // const handleClick = useCallback(() => {
  //   if (!id) return;

  //   setEdges((edges) =>
  //     edges.map((edge) =>
  //       edge.target === id ? { ...edge, animated: false } : edge,
  //     ),
  //   );

  //   setNodes((nodes) => {
  //     const updatedNodes = nodes.map((node) => {
  //       if (node.id === id) {
  //         // Customize this function to update the node's data as needed.
  //         // For example, you can change the label or other properties of the node.
  //         return {
  //           ...node,
  //           data: { ...node.data, label: "Node" },
  //           type: "default",
  //         };
  //       }
  //       return node;
  //     });
  //     return updatedNodes;
  //   });
  // }, [id, setEdges, setNodes]);

  return (
    <BaseNode
      className="bg-card w-auto h-auto border-dashed border-gray-400 p-4 text-center text-gray-400 shadow-none cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      {children}
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}
