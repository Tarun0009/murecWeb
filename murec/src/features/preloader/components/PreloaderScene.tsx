"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type Props = { progressRef: RefObject<number> };

function DollyCamera({ progressRef }: Props) {
  const { camera } = useThree();

  useFrame(() => {
    const p = Math.min(1, progressRef.current);
    const travel = p * p * p * (p * (p * 6 - 15) + 10);
    const settle = Math.sin(p * Math.PI) * (1 - p) * 0.55;
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    camera.position.set(
      Math.sin(p * Math.PI * 1.15) * 0.85 * (1 - p),
      1.7 - travel * 1.55 + settle,
      THREE.MathUtils.lerp(30, 4.25, travel)
    );
    perspectiveCamera.fov = THREE.MathUtils.lerp(54, 39, travel);
    perspectiveCamera.updateProjectionMatrix();
    camera.up.set(Math.sin(travel * Math.PI) * 0.12, 1, 0);
    camera.lookAt(0, -0.05 + travel * 0.05, 0);
  });

  return null;
}

function CentralForm({ progressRef }: Props) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!mesh.current) return;
    const p = Math.min(1, progressRef.current);
    const reveal = 1 - Math.pow(1 - Math.min(1, p / 0.42), 3);
    mesh.current.scale.setScalar(0.18 + reveal * 0.82);
    mesh.current.rotation.y = p * Math.PI * 3.4;
    mesh.current.rotation.x = -0.7 + p * Math.PI * 1.35;
    mesh.current.position.z = -3.5 + reveal * 3.5;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[0.55, 2]} />
      <meshStandardMaterial
        color="#d4b675"
        metalness={0.95}
        roughness={0.22}
        emissive="#3a2810"
        emissiveIntensity={0.45}
      />
    </mesh>
  );
}

function Ring({ progressRef, radius, tilt, thickness, opacity, speed, delay = 0 }: Props & {
  radius: number;
  tilt: [number, number, number];
  thickness: number;
  opacity: number;
  speed: number;
  delay?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const local = THREE.MathUtils.clamp((progressRef.current - delay) / (1 - delay), 0, 1);
    const reveal = 1 - Math.pow(1 - local, 3);
    ref.current.scale.setScalar(0.15 + reveal * 0.85);
    ref.current.rotation.z = local * Math.PI * 2.2 * speed;
    ref.current.position.z = -5 + reveal * 5;
  });
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, thickness, 24, 220]} />
      <meshBasicMaterial color="#c9a961" transparent opacity={opacity} />
    </mesh>
  );
}

function DustField({ progressRef }: Props) {
  const points = useRef<THREE.Points>(null);
  const { size } = useThree();
  const count = size.width < 768 ? 700 : 1400;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!points.current) return;
    const p = Math.min(1, progressRef.current);
    points.current.rotation.y = p * 0.7;
    points.current.rotation.x = -0.08 + p * 0.18;
    points.current.position.z = p * 8;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e8e1d3"
        size={size.width < 768 ? 0.07 : 0.055}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

export default function PreloaderScene({ progressRef }: Props) {
  return (
    <Canvas
      dpr={[1, 1.35]}
      camera={{ position: [0, 1.7, 30], fov: 54 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} color="#e8e1d3" />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#f0e6d2" />
      <directionalLight position={[-3, 2, -3]} intensity={0.6} color="#c9a961" />
      <spotLight position={[0, 5, 3]} intensity={0.55} angle={0.45} penumbra={1} color="#ffd88a" />

      <DollyCamera progressRef={progressRef} />
      <DustField progressRef={progressRef} />
      <CentralForm progressRef={progressRef} />
      <Ring progressRef={progressRef} radius={1.15} tilt={[Math.PI / 2, 0, 0]} thickness={0.02} opacity={0.65} speed={1.15} />
      <Ring progressRef={progressRef} radius={1.7} tilt={[Math.PI / 2 - 0.5, 0.35, 0]} thickness={0.015} opacity={0.5} speed={-0.8} delay={0.06} />
      <Ring progressRef={progressRef} radius={2.3} tilt={[Math.PI / 2 + 0.3, -0.45, 0]} thickness={0.014} opacity={0.35} speed={0.55} delay={0.12} />

      <fog attach="fog" args={["#0f0e0c", 7, 32]} />
    </Canvas>
  );
}
