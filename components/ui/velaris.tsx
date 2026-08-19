'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * VELARIS — an animated simplex-noise gradient on a WebGL plane.
 *
 * Two triangles filling the viewport, three layers of 2D simplex noise
 * scrolling against each other, four colours mixed in by `smoothstep`,
 * then a radial vignette and per-pixel film grain. No texture, no
 * geometry, no external library — the whole image is the fragment
 * shader.
 *
 * FOUR THINGS ARE FIXED HERE relative to the source, and the first is
 * not cosmetic:
 *
 *   1. THE EFFECT NO LONGER RE-RUNS ON EVERY PARENT RENDER. The
 *      dependency array listed `colors`, an array. A caller writing the
 *      idiomatic `<Velaris colors={['#fff', ...]} />` passes a NEW array
 *      identity every render, so the effect tore down and rebuilt the
 *      entire WebGL context each time. A browser allows roughly 16 live
 *      contexts and then starts force-losing the oldest, so this ends as
 *      a blank canvas rather than as a slow one. The array is joined
 *      into a string for the comparison.
 *   2. SHADERS REPORT THEIR ERRORS. A compile or link failure produced a
 *      silently black canvas; failures now log and bail.
 *   3. `prefers-reduced-motion` IS HONOURED. This site gates every other
 *      animation on it (see `lib/motion.tsx`), and a perpetual
 *      full-bleed animation is exactly the class of motion the setting
 *      exists for. Reduced motion draws ONE frame and stops — the
 *      gradient is still there, it just holds still.
 *   4. THE CONTEXT IS RELEASED. Program, shaders and buffer are deleted
 *      and `WEBGL_lose_context` is invoked on unmount.
 *
 * The animation also parks itself while the tab is hidden, which costs
 * nothing and stops a background tab burning a GPU.
 */

const vertexShaderGLSL = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderGLSL = `
precision highp float;
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3  u_colors[4];
uniform vec3  u_bg;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / u_resolution.y;
  vec2 p = uv - 0.5;
  p.x *= ratio;

  float t = u_time * 0.1;

  float n1 = snoise(p * 0.4 + vec2(t * 0.2, -t * 0.3));
  float n2 = snoise(p * 0.55 + vec2(-t * 0.15, t * 0.25) + n1 * 0.25);
  float n3 = snoise(p * 0.75 + vec2(t * 0.1, -t * 0.2) + n2 * 0.2);

  vec3 col = u_bg;

  float dist = length(p) * 1.5;
  float vignette = 1.0 - smoothstep(0.3, 1.2, dist);

  col = mix(col, u_colors[0], smoothstep(-0.2, 0.5, n1) * 0.85);
  col = mix(col, u_colors[1], smoothstep(-0.1, 0.6, n2) * 0.7);
  col = mix(col, u_colors[2], smoothstep(-0.3, 0.4, n3) * 0.6);
  col = mix(col, u_colors[3], smoothstep(0.0, 0.7, n1 * n2) * 0.5);

  float glow = smoothstep(0.8, 0.0, dist) * 0.3;
  col += u_colors[1] * glow;

  col = mix(col * 0.2, col, vignette);

  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.1;

  gl_FragColor = vec4(col, 1.0);
}
`;

export interface VelarisProps {
  /** Base colour the noise is mixed over. Six-digit hex. */
  bg?: string;
  /** Up to four hex colours. Fewer are padded by repeating the last. */
  colors?: string[];
  speed?: number;
  /** 0–1. Film grain amplitude. */
  grain?: number;
  /** Any CSS length. Pass `100vh` for a full-screen stage. */
  height?: string;
  className?: string;
  children?: ReactNode;
}

const DEFAULT_COLORS = ['#86efac', '#4ade80', '#059669', '#000000'];

/** Six-digit hex to normalised RGB. Tolerates `#abc` and a missing hash;
 *  anything unparseable resolves to black rather than to `NaN`, which
 *  would blank the whole uniform array. */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [0, 0, 0];
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

const Velaris = ({
  bg = '#000000',
  colors = DEFAULT_COLORS,
  speed = 2.0,
  grain = 0.3,
  height = '100vh',
  className,
  children,
}: VelarisProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* The shader reads a fixed `vec3[4]`. A short array would leave the
     tail uninitialised, so it is padded by repeating the last entry. */
  const palette = [...colors.slice(0, 4)];
  while (palette.length < 4) palette.push(palette[palette.length - 1] ?? '#000000');
  const paletteKey = palette.join(',');

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) {
      console.warn('[Velaris] WebGL unavailable; falling back to the bg colour.');
      return;
    }

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('[Velaris] shader compile failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = compile(gl.VERTEX_SHADER, vertexShaderGLSL);
    const frag = compile(gl.FRAGMENT_SHADER, fragmentShaderGLSL);
    if (!vert || !frag) return;

    /* No null check: this TS lib types `createProgram` as non-nullable,
       and guarding it trips `no-unnecessary-condition`. `createShader`
       above IS nullable and is guarded. */
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[Velaris] program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      res: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      grain: gl.getUniformLocation(program, 'u_grain'),
      colors: gl.getUniformLocation(program, 'u_colors'),
      bg: gl.getUniformLocation(program, 'u_bg'),
    };

    /* Uniforms that never change during the effect's life are set once. */
    const flat = new Float32Array(palette.flatMap(hexToRgb));
    gl.uniform3fv(locs.colors, flat);
    gl.uniform3f(locs.bg, ...hexToRgb(bg));
    gl.uniform1f(locs.grain, grain);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.max(1, Math.floor(container.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(container.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (timeSeconds: number) => {
      gl.uniform2f(locs.res, canvas.width, canvas.height);
      gl.uniform1f(locs.time, timeSeconds);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    /* REDUCED MOTION: one frame, then hold. The composition survives;
       only the movement goes. Resolved BEFORE the observer is created —
       the resize callback closes over it, and reading it from above its
       own declaration is a temporal-dead-zone throw waiting for the
       first resize. */
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      /* A still frame has no rAF loop to repaint it, so the one frame
         has to be redrawn by hand whenever the canvas is re-sized. */
      if (still) draw(0);
    });
    ro.observe(container);

    if (still) {
      draw(0);
      return () => {
        ro.disconnect();
        gl.deleteProgram(program);
        gl.deleteShader(vert);
        gl.deleteShader(frag);
        gl.deleteBuffer(buffer);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    let raf = 0;
    const render = (t: number) => {
      draw(t * 0.001 * speed);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    /* A hidden tab still services rAF in some browsers, and this shader
       is not cheap. Park it. */
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(render);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buffer);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    /* `paletteKey` rather than `palette`: see note 1 on the component. */
  }, [bg, paletteKey, speed, grain]);

  return (
    <div
      ref={containerRef}
      style={{ height, backgroundColor: bg }}
      className={cn('relative w-full overflow-hidden', className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default Velaris;
