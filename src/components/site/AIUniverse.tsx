import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Line, MeshTransmissionMaterial, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";


const hex = (g: string) => (g.match(/#([0-9a-f]{6})/i)?.[0] ?? "#8f7bff");


/* ---------------- tool definitions for the orbit ---------------- */
type OrbitTool = {
  slug: string;
  name: string;
  mark: string;
  gradient: string;
  price: number;
  radius: number;
  speed: number;
  tilt: number;
  phase: number;
  yaw: number;
};

const orbitTools: OrbitTool[] = [
  { slug: "chatgpt-plus", name: "ChatGPT", mark: "G", gradient: "linear-gradient(135deg,#10a37f,#4ac6a3)", price: 9, radius: 3.1, speed: 0.16, tilt: 0.15, phase: 0, yaw: 0.2 },
  { slug: "lovable", name: "Lovable", mark: "L", gradient: "linear-gradient(135deg,#ff6d5a,#ff9a8b)", price: 12, radius: 3.9, speed: -0.12, tilt: 0.4, phase: 1.1, yaw: -0.3 },
  { slug: "claude-pro", name: "Claude", mark: "✳", gradient: "linear-gradient(135deg,#d97757,#e8a87c)", price: 11, radius: 4.6, speed: 0.1, tilt: -0.25, phase: 2.4, yaw: 0.5 },
  { slug: "cursor-ai", name: "Cursor", mark: "»", gradient: "linear-gradient(135deg,#202124,#5b5f97)", price: 12, radius: 3.4, speed: -0.14, tilt: 0.55, phase: 3.6, yaw: 0.1 },
  { slug: "google-ai-pro", name: "Google AI", mark: "◆", gradient: "linear-gradient(135deg,#4285f4,#9b72cb)", price: 10, radius: 5.2, speed: 0.08, tilt: 0.18, phase: 0.6, yaw: -0.5 },
  { slug: "linkedin-premium", name: "LinkedIn", mark: "in", gradient: "linear-gradient(135deg,#0a66c2,#3d8bd4)", price: 15, radius: 4.2, speed: -0.09, tilt: -0.45, phase: 4.7, yaw: 0.4 },
  { slug: "perplexity-pro", name: "Perplexity", mark: "P", gradient: "linear-gradient(135deg,#20808d,#4bb3bf)", price: 10, radius: 5.6, speed: 0.11, tilt: 0.35, phase: 2.0, yaw: -0.2 },
  { slug: "canva-pro", name: "Canva", mark: "C", gradient: "linear-gradient(135deg,#7d2ae8,#00c4cc)", price: 7, radius: 3.7, speed: 0.13, tilt: -0.2, phase: 5.4, yaw: 0.3 },
  { slug: "notion-ai", name: "Notion AI", mark: "N", gradient: "linear-gradient(135deg,#202124,#8b8d98)", price: 6, radius: 4.9, speed: -0.1, tilt: 0.5, phase: 1.8, yaw: -0.4 },
  { slug: "github-copilot", name: "Copilot", mark: "◉", gradient: "linear-gradient(135deg,#24292e,#6e7681)", price: 6, radius: 5.9, speed: -0.07, tilt: -0.35, phase: 3.1, yaw: 0.15 },
];

/* ---------------- energy particles inside the core ---------------- */
function CoreParticles({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.cbrt(Math.random()) * 1.25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.25;
      ref.current.rotation.x += dt * 0.08;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#c9b8ff"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ---------------- glowing translucent AI core ---------------- */
function AICore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.12;
      ref.current.rotation.z += dt * 0.04;
    }
  });
  return (
    <group>
      {/* inner glow */}
      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial color="#8f7bff" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <CoreParticles />
      {/* glass shell */}
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={1.2}
          roughness={0.05}
          ior={1.35}
          chromaticAberration={0.35}
          distortion={0.35}
          distortionScale={0.4}
          temporalDistortion={0.15}
          color="#e7e2ff"
          background={new THREE.Color("#2a2350")}
        />
      </mesh>
      {/* halo ring */}
      <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
        <torusGeometry args={[2.1, 0.012, 16, 120]} />
        <meshBasicMaterial color="#b9a7ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ---------------- an orbiting 3D glass card ---------------- */
function OrbitCard({
  tool,
  hovered,
  setHovered,
  posOut,
  onSelect,
}: {
  tool: OrbitTool;
  hovered: boolean;
  setHovered: (v: boolean) => void;
  posOut: THREE.Vector3;
  onSelect: (slug: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);
  const color = useMemo(() => hex(tool.gradient), [tool.gradient]);

  useFrame(({ clock }, dt) => {
    if (!group.current) return;
    const t = clock.getElapsedTime() * tool.speed + tool.phase;
    const x = Math.cos(t) * tool.radius;
    const z = Math.sin(t) * tool.radius;
    const y = z * Math.sin(tool.tilt) + Math.sin(t * 1.3) * 0.15;
    const px = x * Math.cos(tool.yaw) - (z * Math.cos(tool.tilt)) * Math.sin(tool.yaw);
    const pz = x * Math.sin(tool.yaw) + (z * Math.cos(tool.tilt)) * Math.cos(tool.yaw);
    group.current.position.set(px, y, pz);
    posOut.set(px, y, pz);
    // smooth hover scale
    const target = hovered ? 1.28 : 1;
    scaleRef.current += (target - scaleRef.current) * Math.min(1, dt * 10);
    group.current.scale.setScalar(scaleRef.current);
  });

  return (
    <group ref={group}>
      <Billboard>
        <group
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(tool.slug);
          }}
        >
          {/* dark premium glass slab with real thickness */}
          <RoundedBox args={[1.28, 0.5, 0.1]} radius={0.08} smoothness={4}>
            <meshPhysicalMaterial
              color="#1c1836"
              transmission={0.55}
              thickness={0.5}
              roughness={0.15}
              metalness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.15}
              ior={1.35}
              transparent
              opacity={0.92}
              emissive={color}
              emissiveIntensity={hovered ? 0.55 : 0.22}
            />
          </RoundedBox>
          {/* colored logo chip */}
          <mesh position={[-0.42, 0, 0.06]}>
            <boxGeometry args={[0.28, 0.28, 0.05]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} roughness={0.3} />
          </mesh>
          <Text position={[-0.42, 0, 0.1]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">
            {tool.mark}
          </Text>
          <Text position={[0.14, 0.08, 0.06]} fontSize={0.13} color="#ffffff" anchorX="center" anchorY="middle" maxWidth={0.8}>
            {tool.name}
          </Text>
          <Text position={[0.14, -0.11, 0.06]} fontSize={0.095} color="#c9b8ff" anchorX="center" anchorY="middle">
            {`$${tool.price}/mo`}
          </Text>

        </group>
      </Billboard>
    </group>
  );
}


/* ---------------- background star / dust field ---------------- */
function Dust({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#a99cff" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ---------------- camera rig: parallax + scroll zoom ---------------- */
function Rig({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const zoom = scrollRef.current; // 0..1
    const baseZ = 9 - zoom * 6.4; // dolly into the core
    const px = pointer.x * (1.6 - zoom);
    const py = pointer.y * (1.2 - zoom);
    target.set(px, py, baseZ);
    camera.position.lerp(target, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ---------------- rotating world (slow camera-around feel) ---------------- */
function World({ onSelect }: { onSelect: (slug: string) => void }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const positions = useMemo(() => orbitTools.map(() => new THREE.Vector3()), []);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
  });

  return (
    <group ref={ref} scale={0.82}>
      <AICore />
      {orbitTools.map((tool, i) => (
        <OrbitCard
          key={tool.slug}
          tool={tool}
          hovered={hovered === i}
          setHovered={(v) => setHovered(v ? i : null)}
          posOut={positions[i]}
          onSelect={onSelect}
        />
      ))}
      {hovered !== null && (
        <Line
          points={[[0, 0, 0], positions[hovered].toArray()]}
          color="#c9b8ff"
          lineWidth={1.4}
          transparent
          opacity={0.7}
        />
      )}
    </group>
  );
}

export function AIUniverse({
  scrollRef,
  onSelect,
}: {
  scrollRef: React.MutableRefObject<number>;
  onSelect: (slug: string) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#241f45", 8, 22]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 6]} intensity={40} color="#b9a7ff" />
      <pointLight position={[-6, -4, 4]} intensity={25} color="#ff9a8b" />
      <Dust />
      <World onSelect={onSelect} />
      <Rig scrollRef={scrollRef} />
    </Canvas>
  );
}
