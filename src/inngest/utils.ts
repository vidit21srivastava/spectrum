import { Connection, Node } from "@/generated/prisma";
import toposort from "toposort";

export const topologicalSort = (
    nodes: Node[],
    connections: Connection[],
): Node[] => {

    // If no connections then return nodes as is, i.e. all independent
    if (connections.length === 0) {
        return nodes;
    }

    // Create edges array for toposort
    const edges: [string, string][] = connections.map((edge) => [
        edge.fromNodeID,
        edge.toNodeID,
    ]);

    // Nodes with no connections as self-edges to endure they're included
    const connectedNodeIDs = new Set<string>();

    for (const edge of connections) {
        connectedNodeIDs.add(edge.fromNodeID);
        connectedNodeIDs.add(edge.toNodeID);
    }

    for (const node of nodes) {
        if (!connectedNodeIDs.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }

    // Perform topological sort

    let sortedNodeIDs: string[] = [];
    try {
        sortedNodeIDs = toposort(edges);
        // Remove duplicates (from self-edges)
        sortedNodeIDs = [...new Set(sortedNodeIDs)];
    } catch (error) {
        if (error instanceof Error && error.message.includes("Cyclic")) {
            throw new Error("Workflow contains a cycle");
        }
        throw error;
    }

    // Map sorted IDs back to node objects
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return sortedNodeIDs.map((id) => nodeMap.get(id)!).filter(Boolean); // Non-Null assertion fixed. {!}
};