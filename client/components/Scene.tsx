import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { MathUtils, Vector3 } from "three";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

type Gateway = {
  label: string;
  color: string;
  route: string;
  angle: number; // radians
};

const gateways: Gateway[] = [
  {
    label: "NEXUS",
    color: "#a855f7",
    route: "/dashboard/nexus",
    angle: MathUtils.degToRad(-50),
  },
  {
    label: "GAMEFORGE",
    color: "#22c55e",
    route: "/gameforge",
    angle: MathUtils.degToRad(-20),
  },
  {
    label: "FOUNDATION",
    color: "#ef4444",
    route: "/foundation",
    angle: MathUtils.degToRad(0),
  },
  {
    label: "LABS",
    color: "#eab308",
    route: "/dashboard/labs",
    angle: MathUtils.degToRad(20),
  },
  {
    label: "CORP",
    color: "#3b82f6",
    route: "/corp",
    angle: MathUtils.degToRad(50),
  },
];

function CoreCube() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.45;
    ref.current.rotation.y += delta * 0.65;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.4, 1.4, 1.4]} />
      <meshStandardMaterial
        emissive="#38bdf8"
        emissiveIntensity={1.5}
        color="#0ea5e9"
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
}

function GatewayMesh({
  gateway,
  onHover,
  onClick,
  isActive,
}: {
  gateway: Gateway;
  onHover: (label: string | null) => void;
  onClick: (gw: Gateway) => void;
  isActive: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);

  const position = useMemo(() => {
    const radius = 6;
    return new Vector3(
      Math.cos(gateway.angle) * radius,
      1.5,
      Math.sin(gateway.angle) * radius,
    );
  }, [gateway.angle]);

  useFrame((_, delta) => {
    if (ref.current) {
      const targetScale = isActive ? 1.22 : 1;
      ref.current.scale.lerp(
        new Vector3(targetScale, targetScale, targetScale),
        6 * delta,
      );
    }
    if (glow.current) {
      glow.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={() => onHover(gateway.label)}
        onPointerOut={() => onHover(null)}
        onClick={() => onClick(gateway)}
      >
        <torusKnotGeometry args={[0.5, 0.15, 120, 16]} />
        <meshStandardMaterial
          color={gateway.color}
          emissive={gateway.color}
          emissiveIntensity={isActive ? 2.4 : 1.2}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      <mesh ref={glow} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.2, 64]} />
        <meshBasicMaterial
          color={gateway.color}
          opacity={0.35}
          transparent
          side={2}
        />
      </mesh>

      <Text
        position={[0, 1.5, 0]}
        fontSize={0.6}
        color={gateway.color}
        anchorX="center"
        anchorY="middle"
        outlineColor="#0f172a"
        outlineWidth={0.01}
      >
        {gateway.label}
      </Text>
    </group>
  );
}

function CameraRig({ target }: { target: Gateway | null }) {
  const { camera } = useThree();
  const desired = useRef(new Vector3(0, 3, 12));

  useFrame((_, delta) => {
    if (target) {
      const radius = 3.2;
      desired.current.set(
        Math.cos(target.angle) * radius,
        2.5,
        Math.sin(target.angle) * radius,
      );
      camera.lookAt(
        Math.cos(target.angle) * 6,
        1.5,
        Math.sin(target.angle) * 6,
      );
    } else {
      desired.current.set(0, 3, 12);
      camera.lookAt(0, 0, 0);
    }
    camera.position.lerp(desired.current, 3 * delta);
  });
  return null;
}

function SceneContent() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<Gateway | null>(null);
  const navigate = useNavigate();

  const handleClick = (gw: Gateway) => {
    setSelected(gw);
    setTimeout(() => navigate(gw.route), 550);
  };

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 15, 60]} />
      <hemisphereLight
        intensity={0.35}
        color="#4f46e5"
        groundColor="#0f172a"
      />
      <spotLight
        position={[5, 12, 5]}
        intensity={1.5}
        angle={0.4}
        penumbra={0.7}
      />
      <pointLight position={[-6, 6, -6]} intensity={1.2} color="#22d3ee" />

      <Grid
        args={[100, 100]}
        sectionSize={2}
        sectionThickness={0.2}
        sectionColor="#0ea5e9"
        cellSize={0.5}
        cellThickness={0.1}
        cellColor="#1e293b"
        fadeDistance={30}
        fadeStrength={3}
        position={[0, -1, 0]}
        infiniteGrid
      />

      <CoreCube />

      {gateways.map((gw) => (
        <GatewayMesh
          key={gw.label}
          gateway={gw}
          onHover={setHovered}
          onClick={handleClick}
          isActive={hovered === gw.label || selected?.label === gw.label}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3}
        enableDamping
        dampingFactor={0.08}
      />

      <CameraRig target={selected} />
    </>
  );
}

function FallbackUI() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        color: "#e5e7eb",
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: 40 }}
      >
        <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em" }}>
          AeThex OS
        </h1>
        <p style={{ fontSize: 16, opacity: 0.7, letterSpacing: "0.1em" }}>
          Select Your Realm
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          maxWidth: 900,
          width: "100%",
        }}
      >
        {gateways.map((gw, i) => (
          <motion.div
            key={gw.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              to={gw.route}
              style={{
                display: "block",
                padding: "24px 20px",
                borderRadius: 16,
                border: `2px solid ${gw.color}40`,
                background: `${gw.color}10`,
                textDecoration: "none",
                color: "#e5e7eb",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = gw.color;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 8px 30px ${gw.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${gw.color}40`;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: gw.color,
                }}
              >
                {gw.label}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{ marginTop: 40 }}
      >
        <Link
          to="/login"
          style={{
            padding: "12px 24px",
            borderRadius: 10,
            border: "1px solid #38bdf8",
            background: "rgba(14, 165, 233, 0.12)",
            color: "#e0f2fe",
            fontWeight: 600,
            textDecoration: "none",
            backdropFilter: "blur(6px)",
          }}
        >
          Connect Passport
        </Link>
      </motion.div>
    </div>
  );
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export default function Scene() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  if (webglSupported === null) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#030712" }} />
    );
  }

  if (!webglSupported || webglError) {
    return <FallbackUI />;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#030712",
      }}
    >
      {/* HUD Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 16,
          left: 20,
          color: "#e5e7eb",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.08em",
          fontSize: 14,
          zIndex: 10,
          userSelect: "none",
        }}
      >
        AeThex OS v5.0
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        style={{
          position: "absolute",
          top: 12,
          right: 20,
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid #38bdf8",
          background: "rgba(14, 165, 233, 0.12)",
          color: "#e0f2fe",
          fontWeight: 600,
          fontFamily: "Inter, sans-serif",
          cursor: "pointer",
          zIndex: 10,
          backdropFilter: "blur(6px)",
        }}
        onClick={() => alert("Connect Passport")}
      >
        Connect Passport
      </motion.button>

      <Canvas
        shadows
        camera={{ position: [0, 3, 12], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", () => {
            setWebglError(true);
          });
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

