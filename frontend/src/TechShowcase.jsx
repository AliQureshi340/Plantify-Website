import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const TechShowcase = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  // Custom CSS variables style
  const customCSSVars = {
    '--tw-border-spacing-x': '0',
    '--tw-border-spacing-y': '0',
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
    '--tw-pan-x': '',
    '--tw-pan-y': '',
    '--tw-pinch-zoom': '',
    '--tw-scroll-snap-strictness': 'proximity',
    '--tw-gradient-from-position': '',
    '--tw-gradient-via-position': '',
    '--tw-gradient-to-position': '',
    '--tw-ordinal': '',
    '--tw-slashed-zero': '',
    '--tw-numeric-figure': '',
    '--tw-numeric-spacing': '',
    '--tw-numeric-fraction': '',
    '--tw-ring-inset': '',
    '--tw-ring-offset-width': '0px',
    '--tw-ring-offset-color': '#fff',
    '--tw-ring-color': 'rgba(59, 130, 246, .5)',
    '--tw-ring-offset-shadow': '0 0 #0000',
    '--tw-ring-shadow': '0 0 #0000',
    '--tw-shadow': '0 0 #0000',
    '--tw-shadow-colored': '0 0 #0000',
    '--tw-blur': '',
    '--tw-brightness': '',
    '--tw-contrast': '',
    '--tw-grayscale': '',
    '--tw-hue-rotate': '',
    '--tw-invert': '',
    '--tw-saturate': '',
    '--tw-sepia': '',
    '--tw-drop-shadow': '',
    '--tw-backdrop-blur': '',
    '--tw-backdrop-brightness': '',
    '--tw-backdrop-contrast': '',
    '--tw-backdrop-grayscale': '',
    '--tw-backdrop-hue-rotate': '',
    '--tw-backdrop-invert': '',
    '--tw-backdrop-opacity': '',
    '--tw-backdrop-saturate': '',
    '--tw-backdrop-sepia': '',
    '--tw-contain-size': '',
    '--tw-contain-layout': '',
    '--tw-contain-paint': '',
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const techIcons = [
    { emoji: '⚛️', name: 'React', delay: 0 },
    { emoji: '🔥', name: 'Firebase', delay: 0.1 },
    { emoji: '🎯', name: 'TypeScript', delay: 0.2 },
    { emoji: '🚀', name: 'Node.js', delay: 0.15 },
    { emoji: '💎', name: 'Ruby', delay: 0.25 },
    { emoji: '🌟', name: 'JavaScript', delay: 0.05 },
    { emoji: '🐍', name: 'Python', delay: 0.3 },
    { emoji: '☁️', name: 'Cloud', delay: 0.12 },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tech Stack</h2>
      <div
        ref={containerRef}
        className="relative bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg shadow-md p-8 h-80 overflow-hidden cursor-none"
        style={customCSSVars}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 h-full">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="bg-white rounded-full w-2 h-2"></div>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10 text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Interactive Tech Showcase
          </h3>
          <p className="text-gray-300">
            Move your cursor around to see the magic!
          </p>
        </div>

        {/* Custom cursor when hovering */}
        {isHovering && (
          <motion.div
            className="absolute w-4 h-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full pointer-events-none z-20"
            animate={{
              x: mousePosition.x - 8,
              y: mousePosition.y - 8,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 400,
            }}
          />
        )}

        {/* Floating tech icons */}
        {isHovering && techIcons.map((icon, index) => (
          <motion.div
            key={index}
            className="absolute text-3xl pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePosition.x + Math.cos((Date.now() * 0.003) + (index * Math.PI / 4)) * (80 + index * 15),
              y: mousePosition.y + Math.sin((Date.now() * 0.003) + (index * Math.PI / 4)) * (80 + index * 15),
              rotate: (Date.now() * 0.002 + index) * 57.3,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              delay: icon.delay,
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            style={{
              transform: `translate(-50%, -50%)`,
            }}
          >
            <div className="relative group">
              <span className="block transform hover:scale-110 transition-transform filter drop-shadow-lg">
                {icon.emoji}
              </span>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {icon.name}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Trailing particles */}
        {isHovering && Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400 rounded-full pointer-events-none z-5"
            animate={{
              x: mousePosition.x + (Math.random() - 0.5) * 60,
              y: mousePosition.y + (Math.random() - 0.5) * 60,
              opacity: [0, 1, 0],
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              delay: i * 0.02,
              opacity: { duration: 1, repeat: Infinity },
            }}
          />
        ))}

        {/* Static tech stack when not hovering */}
        {!isHovering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-4 gap-8 text-4xl">
              {techIcons.slice(0, 8).map((icon, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0.7 }}
                  whileHover={{ scale: 1.2, opacity: 1 }}
                >
                  <div>{icon.emoji}</div>
                  <div className="text-xs text-gray-300 mt-2">{icon.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechShowcase;