import React, { useState } from 'react';

export default function RightClick() {
  const [menuPosition, setMenuPosition] = useState({ x: '0px', y: '0px' });
  const [showMenu, setShowMenu] = useState(false);

  const handleRightClick = (event) => {
    event.preventDefault();
    setMenuPosition({
      x: `${event.pageX}px`,
      y: `${event.pageY}px`
    });
    setShowMenu(true);

    // Cacher le menu si l'utilisateur clique ailleurs
    document.addEventListener(
      'click',
      () => {
        setShowMenu(false);
      },
      { once: true }
    );
  };

  return (
    <div className="h-screen" onContextMenu={handleRightClick}>
      {showMenu && (
        <div
          className="absolute bg-white border border-gray-300"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          <button className="block px-4 py-2">Menu 1</button>
          <button className="block px-4 py-2">Menu 2</button>
          <button className="block px-4 py-2">Menu 3</button>
          <button className="block px-4 py-2">Menu 4</button>
        </div>
      )}
      <div>RIGHT CLICK SUR MOI</div>
    </div>
  );
}
