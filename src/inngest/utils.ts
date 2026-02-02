import { Connection, Node } from "@/generated/prisma";
import { NonRetriableError } from "inngest";
import toposort from "toposort";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

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
            throw new NonRetriableError("Workflow contains a cycle");//could be Error --> revisit
        }
        throw error;
    }

    // Map sorted IDs back to node objects
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return sortedNodeIDs.map((id) => nodeMap.get(id)!).filter(Boolean); // Non-Null assertion fixed. {!}
};

// Only edge case is cycle. 

export const sendWorkflowExecution = async (data: {
    workflowID: string;
    [key: string]: any; // to check
}) => {

    return inngest.send({
        name: "workflows/execute.workflow",
        data,
        id: createId(),
    })
};

