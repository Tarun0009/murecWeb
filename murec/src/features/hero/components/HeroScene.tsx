"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type PointerState = { x: number; y: number; active: boolean };
type Props = {
  scrollRef: RefObject<number>;
  pointerRef: RefObject<PointerState>;
};

type OrbitProps = {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  orbSize: number;
  orbColor: string;
  ringOpacity: number;
};

function Orbit({ radius, tilt, speed, orbSize, orbColor, ringOpacity }: OrbitProps) {
  const orb = useRef<THREE.Mesh>(null);
  const startAngle = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    if (!orb.current) return;
    const a = startAngle.current + clock.elapsedTime * speed;
    orb.current.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 16, 160]} />
        <meshBasicMaterial color="#c9a961" transparent opacity={ringOpacity} />
      </mesh>
      <mesh ref={orb}>
        <sphereGeometry args={[orbSize, 32, 32]} />
        <meshStandardMaterial
          color={orbColor}
          metalness={0.95}
          roughness={0.18}
          emissive={orbColor}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function Particles({ scrollRef, pointerRef }: Props) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const count = 3200;

  const { positions, scales, phases } = useMemo(() => {
    const positionArray = new Float32Array(count * 3);
    const scaleArray = new Float32Array(count);
    const phaseArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 4.6;
      const vertical = (Math.random() - 0.5) * 6.4;
      positionArray[i * 3] = Math.cos(angle) * radius + Math.sin(vertical * 1.2) * 0.55;
      positionArray[i * 3 + 1] = vertical;
      positionArray[i * 3 + 2] = Math.sin(angle) * radius * 0.72;
      scaleArray[i] = 0.55 + Math.random() * 1.35;
      phaseArray[i] = Math.random() * Math.PI * 2;
    }
    return { positions: positionArray, scales: scaleArray, phases: phaseArray };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!points.current || !material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uScroll.value = scrollRef.current;
    const pointer = pointerRef.current;
    const influence = pointer.active ? 1 : 0;
    const easing = 1 - Math.exp(-delta * 4.5);
    const baseX = size.width < 768 ? 0 : 1.55;
    points.current.position.x = THREE.MathUtils.lerp(
      points.current.position.x,
      baseX + pointer.x * 0.32 * influence,
      easing
    );
    points.current.position.y = THREE.MathUtils.lerp(
      points.current.position.y,
      pointer.y * 0.24 * influence,
      easing
    );
    points.current.rotation.y = THREE.MathUtils.lerp(
      points.current.rotation.y,
      scrollRef.current * -0.42 + pointer.x * 0.13 * influence,
      easing
    );
    points.current.rotation.x = THREE.MathUtils.lerp(
      points.current.rotation.x,
      -0.08 + scrollRef.current * 0.16 - pointer.y * 0.1 * influence,
      easing
    );
  });

  return (
    <points ref={points} position={[1.45, 0, -0.5]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uColor: { value: new THREE.Color("#63e68f") },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          uniform float uScroll;
          attribute float aScale;
          attribute float aPhase;
          varying float vGlow;

          void main() {
            vec3 p = position;
            float time = uTime * 0.42 + aPhase;
            float waveA = sin(p.y * 1.35 + time) * 0.34;
            float waveB = cos(p.x * 0.72 - time * 0.8) * 0.24;
            float pulse = sin(length(p.xz) * 1.5 - uTime * 0.65) * 0.16;
            p.x += waveA + uScroll * 0.65;
            p.z += waveB + pulse;
            p.y += sin(p.x * 0.8 + time * 0.55) * 0.16;

            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = aScale * (16.0 / max(1.0, -mvPosition.z));
            vGlow = 0.55 + 0.45 * sin(aPhase + uTime * 0.7);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vGlow;

          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float core = smoothstep(0.5, 0.08, distanceToCenter);
            float halo = smoothstep(0.5, 0.0, distanceToCenter) * 0.45;
            float alpha = (core + halo) * vGlow;
            if (alpha < 0.025) discard;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
}

function OrbitalSystem({ scrollRef, pointerRef }: Props) {
  const g = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const responsiveScale = Math.min(0.78, viewport.width / 5.8);
  const responsiveX = viewport.width < 6 ? 0 : Math.min(1.7, viewport.width / 2 - 2.4 * responsiveScale - 0.38);

  useFrame(({ camera, size }, delta) => {
    if (!g.current) return;
    const s = Math.min(scrollRef.current, 1);
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const visibleHeight =
      2 * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2) * camera.position.z;
    const visibleWidth = visibleHeight * (size.width / size.height);
    const isSmallScreen = size.width < 768;
    const safeScale = isSmallScreen
      ? Math.min(0.72, visibleWidth / 5.6)
      : Math.min(0.78, visibleWidth / 5.8);
    const safeX = isSmallScreen
      ? 0
      : Math.max(0, Math.min(1.7, visibleWidth / 2 - 2.4 * safeScale - 0.38));

    g.current.scale.setScalar(safeScale);
    const pointer = pointerRef.current;
    const influence = pointer.active ? 1 : 0;
    const easing = 1 - Math.exp(-delta * 3.8);
    g.current.position.x = THREE.MathUtils.lerp(g.current.position.x, safeX + pointer.x * 0.16 * influence, easing);
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, -0.05 + pointer.y * 0.12 * influence, easing);
    g.current.rotation.y += delta * 0.14;
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -0.25 - s * 0.3 - pointer.y * 0.08 * influence, easing);
  });

  return (
    <group
      ref={g}
      position={[responsiveX, -0.05, 0]}
      scale={responsiveScale}
    >
      <mesh>
        <sphereGeometry args={[0.42, 64, 64]} />
        <meshStandardMaterial
          color="#d4b675"
          metalness={0.9}
          roughness={0.3}
          emissive="#3a2810"
          emissiveIntensity={0.35}
        />
      </mesh>

      <Orbit radius={1.35} tilt={[Math.PI / 2, 0, 0]} speed={0.55} orbSize={0.11} orbColor="#c9a961" ringOpacity={0.6} />
      <Orbit
        radius={1.85}
        tilt={[Math.PI / 2 - 0.55, 0.4, 0]}
        speed={0.38}
        orbSize={0.09}
        orbColor="#e8e1d3"
        ringOpacity={0.45}
      />
      <Orbit
        radius={2.4}
        tilt={[Math.PI / 2 + 0.3, -0.45, 0]}
        speed={0.28}
        orbSize={0.13}
        orbColor="#c9a961"
        ringOpacity={0.35}
      />
    </group>
  );
}

function DollyCamera({ scrollRef }: Pick<Props, "scrollRef">) {
  const { camera } = useThree();

  useFrame(() => {
    const s = scrollRef.current;
    camera.position.z = 5.6 - s * 1.55;
    camera.position.y = 0.8 + s * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene({ scrollRef, pointerRef }: Props) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.8, 5.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.28} color="#e8e1d3" />
      <directionalLight position={[3, 4, 5]} intensity={1.3} color="#f0e6d2" />
      <directionalLight position={[-3, 2, -3]} intensity={0.6} color="#c9a961" />
      <spotLight position={[0, 5, 3]} intensity={0.5} angle={0.4} penumbra={1} color="#ffd88a" />

      <DollyCamera scrollRef={scrollRef} />
      <Particles scrollRef={scrollRef} pointerRef={pointerRef} />
      <OrbitalSystem scrollRef={scrollRef} pointerRef={pointerRef} />
    </Canvas>
  );
}
