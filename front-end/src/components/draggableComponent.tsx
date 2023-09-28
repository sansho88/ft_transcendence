import React, { useState } from 'react';

const draggableComponent = ({children, className}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    const handleMouseDown = (e) => {
        setDragging(true);
        const offsetX = e.clientX - position.x;
        const offsetY = e.clientY - position.y;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        function handleMouseMove(e) {
            if (dragging) {
                setPosition({
                    x: e.clientX - offsetX,
                    y: e.clientY - offsetY,
                });
            }
        }

        function handleMouseUp() {
            setDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    };

    return (
        <div
            className={className}
            style={{ left: `${position.x}px`, top: `${position.y}px`/*, cursor: "move"*/ }}
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    );
}

export default draggableComponent;
