"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useMediaQuery } from "@/hooks/use-media-query";
import { pseudoRandom } from "@/lib/utils";

const DEEP = "#02121d";
const MID = "#0a3a44";
const SHALLOW = "#3fd8c4";

const SurfaceMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorDeep: new THREE.Color(MID),
    uColorShallow: new THREE.Color(SHALLOW),
  },
  /* glsl */ `
    uniform float uTime;
    varying float vElevation;
    varying vec2 vUv;

    float wave(vec2 pos, float freq, float amp, float speed, vec2 dir, float t) {
      return sin(dot(pos, dir) * freq + t * speed) * amp;
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float elevation = 0.0;
      elevation += wave(pos.xy, 1.1, 0.22, 0.55, normalize(vec2(1.0, 0.35)), uTime);
      elevation += wave(pos.xy, 2.0, 0.12, 0.9, normalize(vec2(-0.55, 1.0)), uTime);
      elevation += wave(pos.xy, 3.6, 0.06, 1.4, normalize(vec2(0.3, -1.0)), uTime);
      pos.z += elevation;
      vElevation = elevation;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  /* glsl */ `
    uniform vec3 uColorDeep;
    uniform vec3 uColorShallow;
    uniform float uTime;
    varying float vElevation;
    varying vec2 vUv;

    void main() {
      float mixStrength = smoothstep(-0.2, 0.28, vElevation);
      vec3 color = mix(uColorDeep, uColorShallow, mixStrength);

      float caustic = sin(vUv.x * 22.0 + uTime * 0.5) * sin(vUv.y * 22.0 - uTime * 0.4);
      caustic = smoothstep(0.65, 1.0, caustic) * 0.4;
      color += caustic * uColorShallow;

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ SurfaceMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    surfaceMaterial: ThreeElement<typeof SurfaceMaterial>;
  }
}

function OceanSurface() {
  const materialRef = useRef<InstanceType<typeof SurfaceMaterial>>(null);

  useFrame((_, delta) => {
    if (materialRef.current) materialRef.current.uTime += delta;
  });

  return (
    <mesh position={[0, 3.6, -2]} rotation={[Math.PI / 2, 0, 0.15]}>
      <planeGeometry args={[26, 26, 128, 128]} />
      <surfaceMaterial ref={materialRef} side={THREE.DoubleSide} />
    </mesh>
  );
}

function LightShafts() {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, "rgba(255,255,255,0.55)");
    gradient.addColorStop(0.6, "rgba(160,235,225,0.12)");
    gradient.addColorStop(1, "rgba(160,235,225,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(state.clock.elapsedTime * 0.15 + i) * 0.08;
    });
  });

  if (!texture) return null;

  const shafts = [
    { x: -2.4, z: -1.5, scale: 1.6, rot: -0.12 },
    { x: -0.4, z: -2.2, scale: 2.1, rot: 0.05 },
    { x: 2.1, z: -1.2, scale: 1.4, rot: 0.15 },
  ];

  return (
    <group ref={groupRef}>
      {shafts.map((s, i) => (
        <mesh key={i} position={[s.x, 0.5, s.z]} rotation={[0, 0, s.rot]}>
          <planeGeometry args={[1.4 * s.scale, 6 * s.scale]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Pearl() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.06;
    ref.current.rotation.y += delta * 0.1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.1}>
      <mesh ref={ref} position={[0, 0, -1.2]} scale={1.2}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshTransmissionMaterial
          thickness={0.55}
          roughness={0.06}
          transmission={1}
          ior={1.33}
          chromaticAberration={0.05}
          anisotropy={0.25}
          backside
          color="#dffaf3"
        />
      </mesh>
    </Float>
  );
}

function Bubbles({ count = 46 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (pseudoRandom(i * 7 + 1) - 0.5) * 9,
        z: (pseudoRandom(i * 7 + 2) - 0.5) * 5 - 1,
        y0: pseudoRandom(i * 7 + 3) * -6,
        speed: 0.35 + pseudoRandom(i * 7 + 4) * 0.5,
        wobble: 0.3 + pseudoRandom(i * 7 + 5) * 0.6,
        scale: 0.03 + pseudoRandom(i * 7 + 6) * 0.07,
        phase: pseudoRandom(i * 7 + 7) * Math.PI * 2,
      })),
    [count]
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const y = ((s.y0 + t * s.speed) % 7) - 3.2;
      const x = s.x + Math.sin(t * 0.6 + s.phase) * s.wobble * 0.3;
      dummy.position.set(x, y, s.z);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshPhysicalMaterial
        color="#eafffa"
        roughness={0.1}
        transmission={0.9}
        thickness={0.4}
        ior={1.2}
        emissive="#4fe0c4"
        emissiveIntensity={0.15}
      />
    </instancedMesh>
  );
}

function Rig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    // three.js scene-graph objects are mutated imperatively inside useFrame,
    // outside of React's render — this is the standard r3f pattern.
    // eslint-disable-next-line react-hooks/immutability
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.025;
    camera.position.y += (0.2 + pointer.y * 0.25 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene() {
  const reducedFX = useMediaQuery("(max-width: 768px), (pointer: coarse)");

  return (
    <Canvas
      dpr={reducedFX ? [1, 1] : [1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 6], fov: 42 }}
    >
      <color attach="background" args={[DEEP]} />
      <fogExp2 attach="fog" args={[DEEP, 0.055]} />
      <ambientLight intensity={0.5} color="#bff2ea" />
      <directionalLight position={[2, 6, 3]} intensity={1.1} color="#d8fff5" />
      <Suspense fallback={null}>
        <OceanSurface />
        <LightShafts />
        <Pearl />
        <Bubbles count={reducedFX ? 20 : 46} />
        <Environment preset="studio" />
        <EffectComposer multisampling={0} enabled={!reducedFX}>
          <Bloom intensity={0.65} luminanceThreshold={0.25} mipmapBlur />
          <Vignette eskil={false} offset={0.15} darkness={0.85} />
        </EffectComposer>
      </Suspense>
      <Rig />
    </Canvas>
  );
}
