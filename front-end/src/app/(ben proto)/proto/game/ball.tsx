// 'use client'

import React, { useState, useEffect, useRef } from 'react';

function Ball() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 0.025, y: 0.01 });
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (!containerRef.current) {
        // The container is not rendered yet, skip this frame
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Get container dimensions
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      setPosition((prev) => ({
        x: prev.x + velocity.x,
        y: prev.y + velocity.y,
      }));

      // Check if the ball hits the container border, if so, change the direction of the velocity
      if (position.x < 0 || position.x > containerWidth - 10) {
        setVelocity((prev) => ({ ...prev, x: -prev.x }));
      }
      if (position.y < 0 || position.y > containerHeight - 10) {
        setVelocity((prev) => ({ ...prev, y: -prev.y }));
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [position, velocity]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',  // Change these values according to your needs
        height: '100%', // Change these values according to your needs
      }}
    >
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'red',
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      ></div>
    </div>
  );
}

export default Ball;


// import React, { useState, useEffect } from 'react';

// function Ball() {
//   const [position, setPosition] = useState({ x: 50, y: 50 });
//   const [velocity, setVelocity] = useState({ x: 0.0005, y: 0.0000 });

// 	useEffect(() => {
//     let animationFrameId;

//     const animate = () => {
//       setPosition((prev) => ({
//         x: prev.x + velocity.x,
//         y: prev.y + velocity.y,
//       }));

//       // Si la balle atteint le bord de la boîte, changez la direction de la vélocité
//       if (position.x < 0 || position.x > 100) {
//         setVelocity((prev) => ({ ...prev, x: -prev.x }));
//       }
//       if (position.y < 0 || position.y > 100) {
//         setVelocity((prev) => ({ ...prev, y: -prev.y }));
//       }

//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, [position, velocity]);


//   return (
//     <div
//       style={{
//         width: '1rem',
//         height: '1rem',
//         borderRadius: '5%',
//         backgroundColor: 'red',
//         position: 'absolute',
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//       }}
//     ></div>
//   );
// }

// export default Ball;