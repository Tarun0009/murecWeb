"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, type ReactElement, type RefObject } from "react";
import * as THREE from "three";
import { variants, type SceneVariant, type SceneCamera } from "./variants";

type Props = { variant: SceneVariant; scrollRef: RefObject<number> };

function DollyCamera({ scrollRef, camera: cfg }: { scrollRef: RefObject<number>; camera: SceneCamera }) {
  const { camera } = useThree();

  useFrame(() => {
    const s = scrollRef.current;
    const steppedPhase = cfg.focusSteps ? s * (cfg.focusSteps - 1) : 0;
    const steppedFocus = cfg.focusSteps
      ? Math.pow(0.5 + 0.5 * Math.cos(steppedPhase * Math.PI * 2), 1.5)
      : 0;
    const dollyMix = cfg.oneWayDolly
      ? THREE.MathUtils.smoothstep(s, 0.02, 0.92)
      : cfg.focusSteps
        ? steppedFocus
        : Math.pow(Math.max(0, Math.sin(Math.PI * s)), 0.72);
    const z = cfg.far - (cfg.far - cfg.near) * dollyMix;
    const theta = (s - 0.5) * cfg.orbit * (0.8 + dollyMix * 0.45);
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    camera.position.set(
      Math.sin(theta) * z,
      Math.sin(s * Math.PI) * (0.55 + dollyMix * 0.38),
      Math.cos(theta) * z
    );
    perspectiveCamera.fov = THREE.MathUtils.lerp(48, 36, dollyMix);
    perspectiveCamera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
    camera.rotation.z = (s - 0.5) * -0.035 * dollyMix;
  });

  return null;
}

function SceneRig({
  sourceScroll,
  camera,
  Mesh,
}: {
  sourceScroll: RefObject<number>;
  camera: SceneCamera;
  Mesh: (props: { scrollRef: { current: number } }) => ReactElement;
}) {
  const smoothScroll = useRef(sourceScroll.current);

  useFrame((_, delta) => {
    smoothScroll.current = THREE.MathUtils.damp(
      smoothScroll.current,
      sourceScroll.current,
      15,
      delta
    );
  }, -1);

  return (
    <>
      <DollyCamera scrollRef={smoothScroll} camera={camera} />
      <Mesh scrollRef={smoothScroll} />
    </>
  );
}

export default function SceneCanvas({ variant, scrollRef }: Props) {
  const { camera: cameraCfg, Mesh } = variants[variant];

  return (
    <Canvas
      dpr={[1, 1.35]}
      camera={{ position: [0, 0, cameraCfg.far], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} color="#e8e1d3" />
      <directionalLight position={[5, 5, 5]} intensity={0.9} color="#f0e6d2" />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#c9a961" />

      <SceneRig sourceScroll={scrollRef} camera={cameraCfg} Mesh={Mesh} />

      <fog attach="fog" args={["#0f0e0c", cameraCfg.near, cameraCfg.far * 1.6]} />
    </Canvas>
  );
}
