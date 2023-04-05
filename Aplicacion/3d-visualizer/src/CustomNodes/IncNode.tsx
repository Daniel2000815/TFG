import ButtonGroup from "@nextui-org/react/types/button/button-group";
import { useLayoutEffect, useState, useRef, useMemo, memo } from "react";
import { Handle, Position } from "react-flow-renderer";
import { Button } from "@nextui-org/react";

const IncNode = ({ isConnectable, sourcePosition, targetPosition, data, ...props }: any) => {
    const nodeRef: any = useRef();
    const [targetArray, setTargetArray] = useState<any>([])
    const [dimensions, setDimensions] = useState({ width: 20, height: 20 });

    useLayoutEffect(() => {
        if (nodeRef.current) {
            setDimensions({
                width: nodeRef.current.offsetWidth + dimensions.width,
                height: nodeRef.current.offsetHeight + dimensions.height
            });
        }
    }, []);

    const add = (type: string) => {
        if (type === "T" && targetArray.length < 4) {
            let tmp = (targetArray.length + 1)
            setTargetArray([...targetArray, tmp])
        }
    }

    const positionHandle = (index: number) => {
        if (index === 1 || index === 2) {
            return (dimensions.height / 3) * index
        } else if (index === 3) {
            return 0
        } else if (index === 4) {
            return dimensions.height
        }
    }

    const targetHandles = useMemo(
        () =>
            targetArray.map((x: any, i: number) => {
                const handleId = `target-handle-${i + 1}`;
                return (
                    <Handle
                        key={handleId}
                        type="target"
                        position={Position.Left}
                        id={handleId}
                        style={{ top: positionHandle(i + 1) }}
                    />
                );
            }),
        [targetArray]
    );


    return (
        <div ref={nodeRef} >
            {targetHandles}
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    <Button.Group
                        aria-label="vertical outlined button group"
                    >
                        <Button key="targetMore" onClick={() => add("T")}>+</Button>
                    </Button.Group>
                </div>
                <div style={{ flex: 2 }}>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>{data.label}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(IncNode);