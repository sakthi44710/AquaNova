import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import './VantaBackground.css';

const VantaBackground = ({ darkMode, children }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  // Memoize the color configuration
  const getColors = useCallback(() => ({
    color: darkMode ? 0x3b82f6 : 0x2563eb,               // Professional blue
    backgroundColor: darkMode ? 0x0f172a : 0xf8fafc,    // Slate dark / light background
  }), [darkMode]);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const colors = getColors();
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: false,  // Disable to prevent blocking interactions
          touchControls: false,  // Disable to prevent blocking interactions
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: colors.color,
          backgroundColor: colors.backgroundColor,
          points: 10.0,
          maxDistance: 20.0,
          spacing: 18.0,
          showDots: true,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update colors when dark mode changes
  useEffect(() => {
    if (vantaEffect) {
      const colors = getColors();
      vantaEffect.setOptions({
        color: colors.color,
        backgroundColor: colors.backgroundColor,
      });
    }
  }, [darkMode, vantaEffect, getColors]);

  return (
    <>
      {/* Vanta background layer - completely separate */}
      <div ref={vantaRef} className="vanta-background-layer" />
      {/* Content layer - on top */}
      <div className="vanta-content-layer">
        {children}
      </div>
    </>
  );
};

export default VantaBackground;
