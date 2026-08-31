"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type Props = { progressRef: RefObject<number> };

function DollyCamera({ progressRef }: Props) {
  const { camera } = useThree();

  useFrame(() => {
    const p = Math.min(1, progressRef.current);
    const eased = 1 - Math.pow(1 - p, 3);
    camera.position.z = 22 - eased * 20;
    camera.position.y = 0.4 - eased * 0.3;
    camera.rotation.z = eased * 0.15;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function CentralForm() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, d) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += d * 0.35;
    mesh.current.rotation.x += d * 0.18;
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

function Ring({ radius, tilt, thickness, opacity, speed }: {
  radius: number;
  tilt: [number, number, number];
  thickness: number;
  opacity: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * speed;
  });
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, thickness, 24, 220]} />
      <meshBasicMaterial color="#c9a961" transparent opacity={opacity} />
    </mesh>
  );
}

function DustField() {
  const points = useRef<THREE.Points>(null);
  const count = 1600;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, []);

  useFrame((_, d) => {
    if (points.current) points.current.rotation.y += d * 0.025;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e8e1d3"
        size={0.055}
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
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 22], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} color="#e8e1d3" />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#f0e6d2" />
      <directionalLight position={[-3, 2, -3]} intensity={0.6} color="#c9a961" />
      <spotLight position={[0, 5, 3]} intensity={0.55} angle={0.45} penumbra={1} color="#ffd88a" />

      <DollyCamera progressRef={progressRef} />
      <DustField />
      <CentralForm />
      <Ring radius={1.15} tilt={[Math.PI / 2, 0, 0]} thickness={0.02} opacity={0.65} speed={0.4} />
      <Ring radius={1.7} tilt={[Math.PI / 2 - 0.5, 0.35, 0]} thickness={0.015} opacity={0.5} speed={-0.3} />
      <Ring radius={2.3} tilt={[Math.PI / 2 + 0.3, -0.45, 0]} thickness={0.014} opacity={0.35} speed={0.22} />

      <fog attach="fog" args={["#0f0e0c", 8, 26]} />
    </Canvas>
  );
}
