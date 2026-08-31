"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type Props = { scrollRef: RefObject<number> };

function Water({ scrollRef }: Props) {
  const surface = useRef<THREE.ShaderMaterial>(null);
  const rig = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const { size } = useThree();
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
      rig.current.rotation.z = -0.11 + progress * 0.22;
      rig.current.position.y = -1 + progress * 0.34;
      rig.current.position.z = 1.8 - progress * 2.25;
      rig.current.scale.setScalar(0.58 + progress * 0.78);
    }
    const nearPosition = size.width < 768 ? 3.8 : 3.05;
    camera.position.set(
      Math.sin(progress * 0.42) * 0.5,
      3.2 - progress * 1.75,
      9.2 - progress * (9.2 - nearPosition)
    );
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
              float strength = .72 + uScroll * .72;
              float a = sin(p.x * 1.35 + uTime * .62 + sweep) * .22 * strength;
              float b = cos(p.y * 1.8 - uTime * .48) * .14 * strength;
              float c = sin((p.x + p.y) * 2.6 + uTime * .34) * .075 * strength;
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
              float crest = smoothstep(-.01, .25, vWave);
              float line = pow(max(0.0, sin((vUv.x + vUv.y) * 36.0 + vWave * 17.0)), 14.0);
              float edge = smoothstep(.72, .16, distance(vUv, vec2(.5)));
              vec3 water = mix(uInk, uEmerald, crest * .9);
              water = mix(water, uBrass, line * crest * .48);
              gl_FragColor = vec4(water, edge * .9);
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
      camera={{ position: [0, 3.2, 9.2], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Water scrollRef={scrollRef} />
    </Canvas>
  );
}
