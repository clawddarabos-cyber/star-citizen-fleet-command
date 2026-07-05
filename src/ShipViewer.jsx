import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'

const ROLE_COLORS = {
  Interceptor: ['#67e8f9', '#0f766e'],
  Raider: ['#fca5a5', '#7f1d1d'],
  Extractor: ['#fde68a', '#92400e'],
  Strike: ['#c4b5fd', '#4c1d95'],
  Explorer: ['#93c5fd', '#1d4ed8'],
  'Capital Escort': ['#f9a8d4', '#9d174d'],
}

export function ShipViewer({ ship, level = 1, hull = 100 }) {
  return (
    <Canvas camera={{ position: [0, 1.6, 5.2], fov: 42 }} dpr={[1, 1.75]} gl={{ preserveDrawingBuffer: true }}>
      <color attach="background" args={['#08111a']} />
      <fog attach="fog" args={['#08111a', 6, 12]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <pointLight position={[-4, -1, 2]} intensity={1.2} color="#5eead4" />
      <StarField />
      <ShipMesh ship={ship} level={level} hull={hull} />
    </Canvas>
  )
}

function ShipMesh({ ship, level, hull }) {
  const group = useRef(null)
  const [primary, secondary] = ROLE_COLORS[ship?.className] ?? ['#e5e7eb', '#334155']
  const damage = Math.max(0.25, hull / 100)

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.42
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.55) * 0.08
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08
  })

  return (
    <group ref={group} scale={1 + level * 0.035} rotation={[0.1, -0.6, 0]}>
      <ShipBody ship={ship} primary={primary} secondary={secondary} damage={damage} />
      <EngineGlow ship={ship} />
    </group>
  )
}

function ShipBody({ ship, primary, secondary, damage }) {
  const role = ship?.className
  if (role === 'Raider') return <Freighter primary={primary} secondary={secondary} damage={damage} />
  if (role === 'Extractor') return <Miner primary={primary} secondary={secondary} damage={damage} />
  if (role === 'Strike') return <Bomber primary={primary} secondary={secondary} damage={damage} />
  if (role === 'Explorer') return <Explorer primary={primary} secondary={secondary} damage={damage} />
  if (role === 'Capital Escort') return <Gunship primary={primary} secondary={secondary} damage={damage} />
  return <Fighter primary={primary} secondary={secondary} damage={damage} />
}

function Fighter({ primary, secondary, damage }) {
  return (
    <>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.34, 2.2, 6]} />
        <meshStandardMaterial color={primary} metalness={0.55} roughness={0.26} />
      </mesh>
      <Wing position={[0, -0.06, 0.55]} rotation={[0, 0.2, -0.12]} color={secondary} damage={damage} />
      <Wing position={[0, -0.06, -0.55]} rotation={[0, -0.2, 0.12]} color={secondary} damage={damage} />
      <Box position={[-0.9, 0, 0]} scale={[0.45, 0.2, 0.34]} color={secondary} />
    </>
  )
}

function Freighter({ primary, secondary, damage }) {
  return (
    <>
      <Box position={[0, 0, 0]} scale={[1.9, 0.5, 0.58]} color={primary} />
      <Box position={[0.1, -0.46, 0]} scale={[1.2, 0.24, 0.46]} color={secondary} />
      <Box position={[-0.1, 0.16, 0.86]} scale={[1.35, 0.22, 0.18]} color={secondary} />
      <Box position={[-0.1, 0.16, -0.86]} scale={[1.35, 0.22, 0.18]} color={secondary} />
      <Wing position={[0.65, -0.04, 0.68]} rotation={[0, -0.12, -0.04]} color={primary} damage={damage} />
      <Wing position={[0.65, -0.04, -0.68]} rotation={[0, 0.12, 0.04]} color={primary} damage={damage} />
    </>
  )
}

function Miner({ primary, secondary, damage }) {
  return (
    <>
      <Box position={[-0.1, 0, 0]} scale={[1.35, 0.48, 0.48]} color={primary} />
      <mesh position={[1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 0.86, 8]} />
        <meshStandardMaterial color="#fef08a" metalness={0.35} roughness={0.42} emissive="#713f12" emissiveIntensity={0.2} />
      </mesh>
      <Box position={[-0.65, -0.42, 0.58]} scale={[0.72, 0.16, 0.18]} color={secondary} />
      <Box position={[-0.65, -0.42, -0.58]} scale={[0.72, 0.16, 0.18]} color={secondary} />
      <Wing position={[0.2, -0.04, 0.72]} rotation={[0, -0.18, -0.1]} color={secondary} damage={damage} />
      <Wing position={[0.2, -0.04, -0.72]} rotation={[0, 0.18, 0.1]} color={secondary} damage={damage} />
    </>
  )
}

function Bomber({ primary, secondary, damage }) {
  return (
    <>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.5, 2.5, 5]} />
        <meshStandardMaterial color={primary} metalness={0.7} roughness={0.24} />
      </mesh>
      <Wing position={[-0.1, -0.08, 0.82]} rotation={[0, 0.32, -0.18]} color={secondary} damage={damage} />
      <Wing position={[-0.1, -0.08, -0.82]} rotation={[0, -0.32, 0.18]} color={secondary} damage={damage} />
      <Box position={[-0.72, -0.18, 0.36]} scale={[0.9, 0.16, 0.14]} color="#0f172a" />
      <Box position={[-0.72, -0.18, -0.36]} scale={[0.9, 0.16, 0.14]} color="#0f172a" />
    </>
  )
}

function Explorer({ primary, secondary, damage }) {
  return (
    <>
      <Box position={[0, 0, 0]} scale={[1.85, 0.42, 0.52]} color={primary} />
      <mesh position={[0.95, 0.08, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.33, 0.82, 7]} />
        <meshStandardMaterial color="#dbeafe" metalness={0.4} roughness={0.3} />
      </mesh>
      <Wing position={[0.05, -0.04, 0.9]} rotation={[0, -0.1, -0.04]} color={secondary} damage={damage} />
      <Wing position={[0.05, -0.04, -0.9]} rotation={[0, 0.1, 0.04]} color={secondary} damage={damage} />
      <Box position={[-0.92, 0.2, 0]} scale={[0.42, 0.28, 0.74]} color={secondary} />
    </>
  )
}

function Gunship({ primary, secondary, damage }) {
  return (
    <>
      <Box position={[0, 0, 0]} scale={[2.45, 0.58, 0.72]} color={primary} />
      <Box position={[0.28, 0.42, 0]} scale={[1.15, 0.22, 0.46]} color={secondary} />
      <Box position={[-0.35, -0.42, 0.78]} scale={[1.4, 0.22, 0.2]} color={secondary} />
      <Box position={[-0.35, -0.42, -0.78]} scale={[1.4, 0.22, 0.2]} color={secondary} />
      <Turret position={[0.55, 0.66, 0.32]} />
      <Turret position={[0.55, 0.66, -0.32]} />
      <Wing position={[0.4, -0.06, 1.05]} rotation={[0, -0.12, -0.05]} color={primary} damage={damage} />
      <Wing position={[0.4, -0.06, -1.05]} rotation={[0, 0.12, 0.05]} color={primary} damage={damage} />
    </>
  )
}

function Wing({ position, rotation, color, damage }) {
  return (
    <mesh position={position} rotation={rotation} scale={[1.08 * damage, 0.08, 0.46]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} metalness={0.48} roughness={0.34} />
    </mesh>
  )
}

function Box({ position, scale, color }) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.32} />
    </mesh>
  )
}

function Turret({ position }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.12, 12, 8]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.62} roughness={0.2} />
      </mesh>
      <Box position={[0.18, 0.02, 0]} scale={[0.42, 0.05, 0.05]} color="#e5e7eb" />
    </group>
  )
}

function EngineGlow({ ship }) {
  const count = ship?.className === 'Capital Escort' ? 4 : 2
  const zs = count === 4 ? [-0.42, -0.14, 0.14, 0.42] : [-0.25, 0.25]
  return (
    <>
      {zs.map((z) => (
        <mesh key={z} position={[-1.28, 0, z]} rotation={[0, Math.PI / 2, 0]}>
          <coneGeometry args={[0.12, 0.4, 16]} />
          <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.25} transparent opacity={0.78} />
        </mesh>
      ))}
    </>
  )
}

function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 90 }, (_, index) => {
      const spread = 8
      return {
        key: index,
        position: [
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * 4,
          -2 - Math.random() * 5,
        ],
        scale: 0.01 + Math.random() * 0.02,
      }
    })
  }, [])

  return (
    <group>
      {stars.map((star) => (
        <mesh key={star.key} position={star.position} scale={star.scale}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#dbeafe" />
        </mesh>
      ))}
    </group>
  )
}
