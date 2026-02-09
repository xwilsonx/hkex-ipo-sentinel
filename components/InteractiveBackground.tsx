import React, { useEffect, useRef } from 'react';

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let mouseX = width / 2;
    let mouseY = height / 2;
    
    // Create floating orbs - HSBC Colors (Red/Gray/White)
    const orbs = [
      { x: Math.random() * width, y: Math.random() * height, r: 500, color: 'rgba(219, 0, 17, 0.03)', vx: 0.3, vy: 0.1 }, // Brand Red
      { x: Math.random() * width, y: Math.random() * height, r: 600, color: 'rgba(45, 45, 45, 0.02)', vx: -0.2, vy: 0.2 }, // Brand Black/Dark
      { x: Math.random() * width, y: Math.random() * height, r: 400, color: 'rgba(200, 200, 200, 0.05)', vx: 0.2, vy: -0.2 }, // Gray
    ];

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Base Gray background
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, width, height);

      // Draw orbs
      orbs.forEach((orb) => {
        // Natural drift
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Boundary bounce
        if (orb.x < -orb.r || orb.x > width + orb.r) orb.vx *= -1;
        if (orb.y < -orb.r || orb.y > height + orb.r) orb.vy *= -1;

        // Mouse interaction
        const dx = mouseX - orb.x;
        const dy = mouseY - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 1000) {
          orb.x += dx * 0.001;
          orb.y += dy * 0.001;
        }

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        g.addColorStop(0, orb.color);
        g.addColorStop(1, 'rgba(245, 245, 245, 0)');
        
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default InteractiveBackground;