"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type Props = { scrollRef: RefObject<number> };

function Water({ scrollRef }: Props) {
  const surface = useRef<THREE.ShaderMaterial>(null);
  const rig = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uInk: { value: new THREE.Color("#07110d") },
      uEmerald: { value: new THREE.Color("#1e6b4c") },
      uBrass: { value: new THREE.Color("#c9a961") },
    }),
    []
  );

  useFrame(({ clock, camera }, delta) => {
    smooth.current = THREE.MathUtils.damp(smooth.current, scrollRef.current, 10, delta);
    const progress = smooth.current;
    if (surface.current) {
      surface.current.uniforms.uTime.value = clock.elapsedTime;
      surface.current.uniforms.uScroll.value = progress;
    }
    if (rig.current) {
      rig.current.rotation.z = -0.06 + progress * 0.12;
      rig.current.position.z = 0.8 - progress * 1.1;
      rig.current.scale.setScalar(0.78 + progress * 0.38);
    }
    camera.position.set(0, 2.7 - progress * 1.15, 7.4 - progress * 3.4);
    camera.lookAt(0, -0.65, 0);
  });

  return (
    <group ref={rig} position={[0, -0.8, 0.8]} rotation={[-0.9, 0, -0.06]}>
      <mesh>
        <planeGeometry args={[13, 8, 150, 100]} />
        <shaderMaterial
          ref={surface}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          vertexShader={`
            uniform float uTime;
            uniform float uScroll;
            varying float vWave;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              vec3 p = position;
              float sweep = uScroll * 4.0;
              float a = sin(p.x * 1.35 + uTime * .55 + sweep) * .18;
              float b = cos(p.y * 1.8 - uTime * .42) * .11;
              float c = sin((p.x + p.y) * 2.6 + uTime * .3) * .055;
              p.z += a + b + c;
              vWave = a + b + c;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uInk;
            uniform vec3 uEmerald;
            uniform vec3 uBrass;
            varying float vWave;
            varying vec2 vUv;
            void main() {
              float crest = smoothstep(.02, .28, vWave);
              float line = pow(max(0.0, sin((vUv.x + vUv.y) * 34.0 + vWave * 15.0)), 18.0);
              float edge = smoothstep(.72, .16, distance(vUv, vec2(.5)));
              vec3 water = mix(uInk, uEmerald, crest * .72);
              water = mix(water, uBrass, line * crest * .32);
              gl_FragColor = vec4(water, edge * .72);
            }
          `}
        />
      </mesh>
    </group>
  );
}

export default function FooterWaterScene({ scrollRef }: Props) {
  return (
    <Canvas
      dpr={[1, 1.35]}
      camera={{ position: [0, 2.7, 7.4], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Water scrollRef={scrollRef} />
    </Canvas>
  );
}
