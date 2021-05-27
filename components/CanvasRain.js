import { useState, useEffect, useRef } from 'react';

export const CanvasRain = ({ fullScreen, ...props }) => {
    const canvasRef = useRef();
    const [mousePos, setMousePos] = useState({x: 0, y:0});
    const mousePosRef = useRef();
    mousePosRef.current = mousePos;
    const [hasStarted, setHasStarted] = useState(false);

    const updateMousePosition = (event) => {
        setMousePos({ x: event.clientX, y: event.clientY });
    }
    useEffect(() => {
        window.addEventListener('mousemove', updateMousePosition);
    }, []);

    let ctx, w, h, particles = [];

    function draw () {
        ctx.clearRect(0, 0, w, h);
        for (let c = 0; c < particles.length; c++) {
            const p = particles[c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
        }
        move();
    }

    function move () {
        for (let b = 0; b < particles.length; b++) {
            const p = particles[b];
            // repel from mouse positions
            const m = mousePosRef.current;
            const dx = p.x - m.x;
            const dy = p.y - m.y;
            const direction = dx > 0 ? 1 : -1;
            const delta = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            // Modify positions
            p.x += p.xs + direction / delta * 1000;
            p.y += p.ys;
            if (p.x > w || p.y > h) {
                p.x = Math.random() * w;
                p.y = -20;
            }
        }
    }

    if (!hasStarted && canvasRef.current && canvasRef.current.getContext) {
        const canvas = canvasRef.current;
        if (fullScreen) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        ctx = canvas.getContext('2d');
        w = canvas.width;
        h = canvas.height;
        ctx.strokeStyle = 'rgba(174,194,224,0.5)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        const init = [];
        const maxParts = 1000;
        for (let a = 0; a < maxParts; a++) {
            init.push({
                x: Math.random() * w,
                y: Math.random() * h,
                l: Math.random() * 1,
                xs: -4 + Math.random() * 4 + 2,
                ys: Math.random() * 10 + 10
            })
        }

        for (let b = 0; b < maxParts; b++) {
            particles[b] = init[b];
        }

        setInterval(() => {draw()}, 30);
        setHasStarted(true);
    }

    return (
        <canvas ref={canvasRef} {...props} >
        </canvas>
    )
}