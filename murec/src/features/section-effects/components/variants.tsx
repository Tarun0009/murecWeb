"use client";

import { useMemo, useRef, type ReactElement } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export type SceneCamera = {
  far: number;
  near: number;
  orbit: number;
  focusSteps?: number;
  oneWayDolly?: boolean;
};

export type SceneVariant =
  | "legacy"
  | "principles"
  | "collection"
  | "philosophy"
  | "associations"
  | "partners"
  | "contact";

function LegacyMesh({ scrollRef }: { scrollRef: { current: number } }) {
  const g = useRef<THREE.Group>(null);
  const { size } = useThree();
  const frames = useMemo(() => Array.from({ length: 22 }), []);
  const curve = useMemo(() => {
    const points = Array.from({ length: 34 }, (_, index) => {
      const y = (index - 16.5) * 0.24;
      return new THREE.Vector3(
        Math.sin(index * 0.5) * 0.72,
        y,
        Math.cos(index * 0.5) * 0.34
      );
    });
    return new THREE.CatmullRomCurve3(points);
  }, []);
  const dust = useMemo(() => {
    const positions = new Float32Array(520 * 3);
    for (let index = 0; index < 520; index++) {
      positions[index * 3] = (Math.random() - 0.5) * 10;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 5 - 0.8;
    }
    return positions;
  }, []);

  useFrame(() => {
    if (!g.current) return;
    const s = scrollRef.current;
    const isSmallScreen = size.width < 768;
    g.current.rotation.y = -s * Math.PI * 1.35;
    g.current.rotation.z = -s * 0.24;
    g.current.position.x = isSmallScreen ? 0.5 : 1.65;
    g.current.position.y = -0.85 + s * 1.7;
    g.current.position.z = isSmallScreen ? 0.45 - s * 0.35 : 0;
    g.current.scale.setScalar(isSmallScreen ? 0.68 : 1);
  });

  return (
    <group ref={g} position={[1.65, -0.85, 0]} rotation={[0.08, 0, 0]}>
      <points position={[-1.2, 0.5, -1.4]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#d8c28d"
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </points>

      <mesh position={[0, 0, -1.25]} scale={[3.8, 5.4, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial
          color="#6f5827"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh>
        <tubeGeometry args={[curve, 180, 0.34, 10, false]} />
        <meshPhysicalMaterial
          color="#17140f"
          metalness={0.78}
          roughness={0.24}
          clearcoat={1}
          clearcoatRoughness={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {frames.map((_, index) => {
        const t = index / (frames.length - 1);
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        const angle = Math.atan2(tangent.y, tangent.x) - Math.PI / 2;

        return (
          <group key={index} position={point} rotation={[0, 0, angle]}>
            <mesh position={[0, 0, 0.35]}>
              <boxGeometry args={[0.46, 0.23, 0.025]} />
              <meshStandardMaterial
                color={index % 3 === 0 ? "#c9a961" : "#5f5234"}
                metalness={0.72}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[-0.29, 0, 0.36]}>
              <boxGeometry args={[0.055, 0.075, 0.03]} />
              <meshBasicMaterial color="#e8e1d3" transparent opacity={0.62} />
            </mesh>
            <mesh position={[0.29, 0, 0.36]}>
              <boxGeometry args={[0.055, 0.075, 0.03]} />
              <meshBasicMaterial color="#e8e1d3" transparent opacity={0.62} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function PrinciplesMesh() {
  const g = useRef<THREE.Group>(null);
  const water = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBrass: { value: new THREE.Color("#c9a961") },
      uInk: { value: new THREE.Color("#15130f") },
    }),
    []
  );

  useFrame(({ clock }, d) => {
    if (!g.current) return;
    g.current.rotation.y += d * 0.055;
    if (water.current) water.current.uniforms.uTime.value = clock.elapsedTime * 1.55;
  });

  return (
    <group ref={g} position={[0, -0.65, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <planeGeometry args={[11, 8, 120, 90]} />
        <shaderMaterial
          ref={water}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          vertexShader={`
            uniform float uTime;
            varying float vWave;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              vec3 p = position;
              float a = sin(p.x * 1.35 + uTime * .7) * .11;
              float b = cos(p.y * 1.8 - uTime * .55) * .075;
              float c = sin((p.x + p.y) * 2.4 + uTime * .4) * .035;
              p.z += a + b + c;
              vWave = a + b + c;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uBrass;
            uniform vec3 uInk;
            varying float vWave;
            varying vec2 vUv;
            void main() {
              float edge = smoothstep(0.0, .55, distance(vUv, vec2(.5)));
              float shimmer = smoothstep(-.02, .18, vWave);
              vec3 color = mix(uInk, uBrass, shimmer * .58);
              gl_FragColor = vec4(color, (1.0 - edge * .72) * .58);
            }
          `}
        />
      </mesh>

      <mesh position={[-2.15, 0.25, 0]} rotation={[0.15, 0, -0.08]}>
        <tetrahedronGeometry args={[0.72, 0]} />
        <meshPhysicalMaterial color="#c9a961" metalness={0.92} roughness={0.16} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.05, 0.45]} rotation={[0, 0.25, 0]}>
        <octahedronGeometry args={[0.88, 0]} />
        <meshPhysicalMaterial color="#e8e1d3" metalness={0.72} roughness={0.2} clearcoat={1} />
      </mesh>
      <mesh position={[2.15, 0.32, -0.15]} rotation={[0.1, 0, 0.12]}>
        <dodecahedronGeometry args={[0.68, 0]} />
        <meshPhysicalMaterial color="#c9a961" metalness={0.92} roughness={0.16} clearcoat={1} />
      </mesh>
    </group>
  );
}

function CollectionMesh({ scrollRef }: { scrollRef: { current: number } }) {
  const g = useRef<THREE.Group>(null);
  const towers = useRef<THREE.Mesh[]>([]);
  const { viewport } = useThree();
  const cols = useMemo(
    () => [-2.4, -1.2, 0, 1.2, 2.4].map((x, index) => ({
      x,
      height: 3.4 - Math.abs(index - 2) * 0.4,
    })),
    []
  );

  useFrame(({ clock }) => {
    if (!g.current) return;
    const s = THREE.MathUtils.clamp(scrollRef.current, 0, 1);
    const dolly = THREE.MathUtils.smoothstep(s, 0.02, 0.9);
    const responsiveScale = Math.min(1, viewport.width / 6.4);

    g.current.rotation.y = -0.62 + dolly * 1.18 + Math.sin(clock.elapsedTime * 0.28) * 0.035;
    g.current.rotation.x = 0.14 - dolly * 0.2;
    g.current.position.x = viewport.width > 6 ? 1.35 : 0;
    g.current.position.y = -1.6 + dolly * 0.34;
    g.current.position.z = 2.25 - dolly * 2.55;
    g.current.scale.setScalar(responsiveScale * (0.62 + dolly * 0.58));

    towers.current.forEach((tower, index) => {
      const reveal = THREE.MathUtils.smoothstep(s, 0.04 + index * 0.075, 0.38 + index * 0.075);
      const height = cols[index].height;
      tower.scale.y = 0.04 + reveal * 0.96;
      tower.position.y = (height * tower.scale.y) / 2;
      const material = tower.material as THREE.MeshStandardMaterial;
      material.opacity = 0.12 + reveal * 0.58;
    });
  });

  return (
    <group ref={g} position={[0, -1.55, 0.65]}>
      <gridHelper args={[7, 14, "#c9a961", "#5f5234"]} position={[0, 0, 0]} />
      {cols.map(({ x, height }, index) => (
        <mesh
          key={x}
          ref={(element) => {
            if (element) towers.current[index] = element;
          }}
          position={[x, 0, 0]}
          scale={[1, 0.04, 1]}
        >
          <boxGeometry args={[0.52, height, 0.52]} />
          <meshStandardMaterial color="#c9a961" wireframe transparent opacity={0.12} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <torusGeometry args={[2.9, 0.012, 12, 160]} />
        <meshBasicMaterial color="#e8e1d3" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function PhilosophyMesh() {
  const m = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (!m.current) return;
    m.current.rotation.x += d * 0.32;
    m.current.rotation.y += d * 0.42;
  });
  return (
    <mesh ref={m}>
      <torusKnotGeometry args={[1.1, 0.28, 180, 32]} />
      <meshStandardMaterial color="#c9a961" metalness={0.9} roughness={0.25} />
    </mesh>
  );
}

const associationLogos = [
  { src: "/associations/bajaj.webp", width: 1.55, height: 0.66 },
  { src: "/associations/design-forum-international.webp", width: 1.55, height: 0.42 },
  { src: "/associations/bobby-mukherji-architects.webp", width: 1.65, height: 0.43 },
  { src: "/associations/red-brick-international.webp", width: 1.55, height: 0.5 },
  { src: "/associations/tq.webp", width: 1.4, height: 0.81 },
] as const;

function AssociationsMesh({ scrollRef }: { scrollRef: { current: number } }) {
  const group = useRef<THREE.Group>(null);
  const textures = useTexture(associationLogos.map((logo) => logo.src));
  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  });

  useFrame(() => {
    if (!group.current) return;
    const progress = scrollRef.current;
    group.current.position.z = progress * (associationLogos.length - 1) * 3.4;
    group.current.rotation.y = -0.06 + Math.sin(progress * Math.PI * 2) * 0.045;
  });

  return (
    <group ref={group} position={[1.25, 0, 0]}>
      <mesh position={[0, -1.15, -6.8]}>
        <boxGeometry args={[0.025, 0.025, 14.4]} />
        <meshBasicMaterial color="#c9a961" transparent opacity={0.32} />
      </mesh>

      {associationLogos.map((logo, index) => {
        const xOffset = Math.sin(index * 1.4) * 0.5;
        const yOffset = Math.cos(index * 1.2) * 0.22;
        return (
          <group
            key={logo.src}
            position={[xOffset, yOffset, -index * 3.4]}
            rotation={[0, index % 2 === 0 ? -0.055 : 0.055, index % 2 === 0 ? -0.018 : 0.018]}
          >
            <mesh>
              <boxGeometry args={[2.45, 1.55, 0.16]} />
              <meshPhysicalMaterial
                color="#e9e2d6"
                transparent
                opacity={0.94}
                metalness={0.2}
                roughness={0.12}
                transmission={0.07}
                clearcoat={1}
                clearcoatRoughness={0.06}
              />
            </mesh>
            <mesh position={[0, 0, -0.091]}>
              <boxGeometry args={[2.54, 1.64, 0.025]} />
              <meshBasicMaterial color="#c9a961" transparent opacity={0.68} />
            </mesh>
            <mesh position={[0, 0, 0.14]} scale={1.12} renderOrder={10}>
              <planeGeometry args={[logo.width, logo.height]} />
              <meshBasicMaterial
                map={textures[index]}
                transparent
                alphaTest={0.01}
                toneMapped={false}
                depthWrite={false}
                depthTest={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            <pointLight position={[0, 0, 0.8]} intensity={0.42} distance={3.2} color="#d7b86f" />
          </group>
        );
      })}
    </group>
  );
}

function PartnersMesh() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (g.current) g.current.rotation.y += d * 0.48;
  });
  return (
    <group ref={g}>
      <mesh position={[-1.6, 0, 0]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color="#e8e1d3" metalness={0.5} roughness={0.5} wireframe />
      </mesh>
      <mesh position={[1.6, 0, 0]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color="#c9a961" metalness={0.85} roughness={0.25} wireframe />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.006, 12, 128]} />
        <meshBasicMaterial color="#c9a961" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function ContactMesh() {
  const p = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array | null>(null);
  if (!positions.current) {
    const arr = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    positions.current = arr;
  }
  useFrame((_, d) => {
    if (p.current) p.current.rotation.y += d * 0.085;
  });
  return (
    <points ref={p}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e8e1d3" size={0.035} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

export const variants: Record<
  SceneVariant,
  { camera: SceneCamera; Mesh: (props: { scrollRef: { current: number } }) => ReactElement }
> = {
  legacy: { camera: { far: 11, near: 3.25, orbit: 0.72 }, Mesh: LegacyMesh },
  principles: { camera: { far: 10.5, near: 3.1, orbit: 0.82 }, Mesh: PrinciplesMesh },
  collection: { camera: { far: 13.5, near: 3.15, orbit: 0.92, oneWayDolly: true }, Mesh: CollectionMesh },
  philosophy: { camera: { far: 9.5, near: 2.85, orbit: 0.92 }, Mesh: PhilosophyMesh },
  associations: { camera: { far: 10.8, near: 3.25, orbit: 0.5, focusSteps: 5 }, Mesh: AssociationsMesh },
  partners: { camera: { far: 10.5, near: 3.1, orbit: 1.02 }, Mesh: PartnersMesh },
  contact: { camera: { far: 9.5, near: 2.9, orbit: 0.72 }, Mesh: ContactMesh },
};
