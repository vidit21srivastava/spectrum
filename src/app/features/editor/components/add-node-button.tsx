"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { NodeSelector } from "@/components/node-selector";

export const AddNodeButton = memo(() => {

    const [selectorOpen, setSelecorOpen] = useState(false);

    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelecorOpen}>
            <Button
                size="icon"
                variant="outline"
                className="bg-background border-primary "
            >
                <PlusIcon className="text-primary " />
            </Button>
        </NodeSelector>

    );
});

AddNodeButton.displayName = "AddNodeButton";