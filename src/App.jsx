import { useEffect, useMemo, useState } from 'react'
import {
  Banknote,
  Boxes,
  ChevronRight,
  Factory,
  Map,
  RadioTower,
  Rocket,
  Shield,
  ShipWheel,
  Swords,
  Timer,
  Wrench,
  Zap,
} from 'lucide-react'
import './App.css'

const STARTING_RESOURCES = {
  credits: 42000,
  ore: 1250,
  intel: 18,
  quantum: 410,
}

const SHIPS = [
  {
    id: 'gladius',
    name: 'Gladius',
    maker: 'Aegis Dynamics',
    role: 'Light Fighter',
    className: 'Interceptor',
    power: 66,
    cargo: 0,
    speed: 92,
    shields: 62,
    crew: 1,
    upkeep: 4,
    cost: { credits: 18000, ore: 200, quantum: 35 },
    trait: 'High evade rating against patrol encounters.',
  },
  {
    id: 'cutlass-black',
    name: 'Cutlass Black',
    maker: 'Drake Interplanetary',
    role: 'Medium Freight',
    className: 'Raider',
    power: 58,
    cargo: 46,
    speed: 70,
    shields: 58,
    crew: 2,
    upkeep: 6,
    cost: { credits: 26000, ore: 340, quantum: 45 },
    trait: 'Flexible cargo and combat platform.',
  },
  {
    id: 'prospector',
    name: 'Prospector',
    maker: 'MISC',
    role: 'Mining',
    className: 'Extractor',
    power: 36,
    cargo: 32,
    speed: 54,
    shields: 44,
    crew: 1,
    upkeep: 5,
    cost: { credits: 24000, ore: 160, quantum: 30 },
    trait: 'Doubles ore yield on industrial sorties.',
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    maker: 'Aegis Dynamics',
    role: 'Stealth Bomber',
    className: 'Strike',
    power: 84,
    cargo: 0,
    speed: 76,
    shields: 52,
    crew: 1,
    upkeep: 9,
    cost: { credits: 46000, ore: 650, quantum: 90 },
    trait: 'Bonus success chance on high-risk strikes.',
  },
  {
    id: 'corsair',
    name: 'Corsair',
    maker: 'Drake Interplanetary',
    role: 'Expedition',
    className: 'Explorer',
    power: 76,
    cargo: 72,
    speed: 58,
    shields: 74,
    crew: 4,
    upkeep: 10,
    cost: { credits: 52000, ore: 760, quantum: 110 },
    trait: 'Reduces quantum cost for deep-system moves.',
  },
  {
    id: 'hammerhead',
    name: 'Hammerhead',
    maker: 'Aegis Dynamics',
    role: 'Heavy Gunship',
    className: 'Capital Escort',
    power: 128,
    cargo: 40,
    speed: 42,
    shields: 112,
    crew: 6,
    upkeep: 18,
    cost: { credits: 112000, ore: 2200, quantum: 260 },
    trait: 'Dominates fleet actions and sector defense.',
  },
]

const INITIAL_FLEET = [
  { uid: 'fs-01', shipId: 'gladius', level: 2, hull: 100, status: 'ready', xp: 40 },
  { uid: 'fs-02', shipId: 'cutlass-black', level: 1, hull: 92, status: 'ready', xp: 12 },
  { uid: 'fs-03', shipId: 'prospector', level: 1, hull: 86, status: 'ready', xp: 20 },
]

const SYSTEMS = [
  {
    id: 'stanton',
    name: 'Stanton',
    control: 'UEE Commercial Zone',
    threat: 2,
    x: 38,
    y: 52,
    slots: ['Security', 'Trade', 'Industrial'],
    missions: [
      {
        id: 'hurston-patrol',
        title: 'Hurston Security Sweep',
        type: 'Combat',
        required: 46,
        duration: 18,
        reward: { credits: 7600, intel: 2 },
        risk: 12,
        text: 'Clear a skimmer cell outside an industrial exclusion zone.',
      },
      {
        id: 'arc-cargo',
        title: 'ArcCorp Priority Haul',
        type: 'Cargo',
        required: 38,
        duration: 15,
        reward: { credits: 5400, quantum: 28 },
        risk: 8,
        text: 'Move bonded components through high-traffic lanes.',
      },
    ],
  },
  {
    id: 'pyro',
    name: 'Pyro',
    control: 'Contested Frontier',
    threat: 5,
    x: 66,
    y: 27,
    slots: ['Raid', 'Recon', 'Salvage'],
    missions: [
      {
        id: 'pyro-relay',
        title: 'Relay Station Raid',
        type: 'Strike',
        required: 82,
        duration: 28,
        reward: { credits: 13800, intel: 6, quantum: 40 },
        risk: 32,
        text: 'Disable a pirate relay before it tags your convoy routes.',
      },
      {
        id: 'pyro-cache',
        title: 'Derelict Cache Survey',
        type: 'Recon',
        required: 54,
        duration: 24,
        reward: { credits: 6200, ore: 420, intel: 3 },
        risk: 22,
        text: 'Scan a derelict field while avoiding opportunistic raiders.',
      },
    ],
  },
  {
    id: 'terra',
    name: 'Terra',
    control: 'Core World Hub',
    threat: 1,
    x: 79,
    y: 67,
    slots: ['Diplomacy', 'Market', 'Escort'],
    missions: [
      {
        id: 'terra-escort',
        title: 'Senate Delegation Escort',
        type: 'Escort',
        required: 64,
        duration: 22,
        reward: { credits: 9200, intel: 4 },
        risk: 10,
        text: 'Escort a diplomatic courier under strict weapons protocols.',
      },
      {
        id: 'terra-market',
        title: 'Exchange Data Run',
        type: 'Trade',
        required: 42,
        duration: 14,
        reward: { credits: 6800, intel: 5 },
        risk: 5,
        text: 'Carry sealed market telemetry to a private orbital desk.',
      },
    ],
  },
  {
    id: 'nyx',
    name: 'Nyx',
    control: 'Free Settlement Belt',
    threat: 3,
    x: 22,
    y: 24,
    slots: ['Mining', 'Smuggling', 'Defense'],
    missions: [
      {
        id: 'nyx-mining',
        title: 'Levski Ore Contract',
        type: 'Mining',
        required: 40,
        duration: 20,
        reward: { credits: 4200, ore: 680 },
        risk: 14,
        text: 'Extract refined ore from a contested asteroid claim.',
      },
      {
        id: 'nyx-defense',
        title: 'Settlement Defense Grid',
        type: 'Defense',
        required: 70,
        duration: 26,
        reward: { credits: 10500, ore: 250, intel: 2 },
        risk: 20,
        text: 'Hold position while civilian shields cycle back online.',
      },
    ],
  },
]

const TABS = ['Command', 'Fleet', 'Shipyard', 'Operations']

function App() {
  const [resources, setResources] = useState(STARTING_RESOURCES)
  const [fleet, setFleet] = useState(INITIAL_FLEET)
  const [selectedSystemId, setSelectedSystemId] = useState('stanton')
  const [selectedShipUid, setSelectedShipUid] = useState('fs-01')
  const [activeTab, setActiveTab] = useState('Command')
  const [operations, setOperations] = useState([])
  const [log, setLog] = useState([
    'Command channel open. Stanton routes are green.',
    'Nyx ore brokers posted fresh contracts.',
  ])

  const selectedSystem = SYSTEMS.find((system) => system.id === selectedSystemId) ?? SYSTEMS[0]
  const readyFleet = useMemo(() => fleet.filter((ship) => ship.status === 'ready'), [fleet])
  const selectedFleetShip = fleet.find((ship) => ship.uid === selectedShipUid) ?? readyFleet[0] ?? fleet[0]
  const selectedShip = hydrateShip(selectedFleetShip)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setOperations((current) =>
        current.map((op) => ({
          ...op,
          remaining: Math.max(0, op.remaining - 1),
        })),
      )
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  const totals = useMemo(() => {
    return fleet.reduce(
      (acc, entry) => {
        const ship = hydrateShip(entry)
        acc.power += ship.power + entry.level * 6
        acc.cargo += ship.cargo
        acc.shields += ship.shields
        return acc
      },
      { power: 0, cargo: 0, shields: 0 },
    )
  }, [fleet])

  function addLog(message) {
    setLog((current) => [message, ...current].slice(0, 6))
  }

  function startMission(mission) {
    if (!selectedFleetShip || selectedFleetShip.status !== 'ready') {
      addLog('No ready ship selected for deployment.')
      return
    }

    const ship = hydrateShip(selectedFleetShip)
    const missionPower = ship.power + selectedFleetShip.level * 8 + Math.round(ship.shields / 6)
    const quantumCost = selectedSystem.threat * 8 + Math.max(4, Math.round(mission.duration / 4))

    if (resources.quantum < quantumCost) {
      addLog('Insufficient quantum fuel for that assignment.')
      return
    }

    setResources((current) => ({ ...current, quantum: current.quantum - quantumCost }))
    setFleet((current) =>
      current.map((entry) =>
        entry.uid === selectedFleetShip.uid ? { ...entry, status: 'deployed' } : entry,
      ),
    )
    setOperations((current) => [
      {
        id: `${mission.id}-${Date.now()}`,
        mission,
        system: selectedSystem.name,
        threat: selectedSystem.threat,
        shipUid: selectedFleetShip.uid,
        shipName: ship.name,
        remaining: mission.duration,
        total: mission.duration,
        power: missionPower,
      },
      ...current,
    ])
    addLog(`${ship.name} deployed to ${mission.title}.`)
  }

  function completeOperation(operation) {
    const successScore = operation.power - operation.mission.required
    const cleanWin = successScore >= operation.mission.risk
    const hullDamage = cleanWin ? operation.threat * 2 : operation.mission.risk
    const xpGain = cleanWin ? 22 : 12
    const reward = cleanWin
      ? operation.mission.reward
      : scaleReward(operation.mission.reward, 0.55)

    setResources((current) => ({
      credits: current.credits + (reward.credits ?? 0),
      ore: current.ore + (reward.ore ?? 0),
      intel: current.intel + (reward.intel ?? 0),
      quantum: current.quantum + (reward.quantum ?? 0),
    }))
    setFleet((current) =>
      current.map((entry) => {
        if (entry.uid !== operation.shipUid) return entry
        const nextXp = entry.xp + xpGain
        const levelUp = nextXp >= 100
        return {
          ...entry,
          status: 'ready',
          hull: Math.max(22, entry.hull - hullDamage),
          level: levelUp ? entry.level + 1 : entry.level,
          xp: levelUp ? nextXp - 100 : nextXp,
        }
      }),
    )
    setOperations((current) => current.filter((item) => item.id !== operation.id))
    addLog(
      cleanWin
        ? `${operation.shipName} completed ${operation.mission.title}.`
        : `${operation.shipName} returned damaged from ${operation.mission.title}.`,
    )
  }

  function repairShip(uid) {
    const target = fleet.find((entry) => entry.uid === uid)
    if (!target || target.hull >= 100) return
    const cost = Math.ceil((100 - target.hull) * 85)
    if (resources.credits < cost) {
      addLog('Repair order rejected: not enough credits.')
      return
    }
    setResources((current) => ({ ...current, credits: current.credits - cost }))
    setFleet((current) => current.map((entry) => (entry.uid === uid ? { ...entry, hull: 100 } : entry)))
    addLog('Repair crews restored a ship to full hull integrity.')
  }

  function buyShip(ship) {
    if (!canAfford(resources, ship.cost)) {
      addLog(`Shipyard cannot authorize ${ship.name}; resources short.`)
      return
    }
    setResources((current) => payCost(current, ship.cost))
    const uid = `fs-${Date.now()}`
    setFleet((current) => [
      ...current,
      { uid, shipId: ship.id, level: 1, hull: 100, status: 'ready', xp: 0 },
    ])
    setSelectedShipUid(uid)
    addLog(`${ship.name} commissioned into your fleet.`)
  }

  return (
    <main className="game-shell">
      <aside className="command-rail">
        <div className="brand-lockup">
          <div className="brand-icon"><Rocket size={24} /></div>
          <div>
            <strong>Frontier Command</strong>
            <span>Stanton strategic net</span>
          </div>
        </div>

        <nav className="tab-list" aria-label="Command sections">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={tab === activeTab ? 'tab-button active' : 'tab-button'}
              onClick={() => setActiveTab(tab)}
            >
              {tabIcon(tab)}
              {tab}
            </button>
          ))}
        </nav>

        <section className="resource-panel" aria-label="Resources">
          <Resource icon={<Banknote size={17} />} label="Credits" value={format(resources.credits)} />
          <Resource icon={<Boxes size={17} />} label="Ore" value={format(resources.ore)} />
          <Resource icon={<RadioTower size={17} />} label="Intel" value={resources.intel} />
          <Resource icon={<Zap size={17} />} label="Quantum" value={resources.quantum} />
        </section>
      </aside>

      <section className="main-stage">
        <header className="stage-header">
          <div>
            <span className="eyebrow">Persistent strategy prototype</span>
            <h1>Fleet operations across the frontier</h1>
          </div>
          <div className="fleet-score">
            <span>Fleet rating</span>
            <strong>{totals.power}</strong>
          </div>
        </header>

        <section className="stellar-map" aria-label="System map">
          <div className="map-grid">
            {SYSTEMS.map((system) => (
              <button
                key={system.id}
                className={system.id === selectedSystemId ? 'system-node active' : 'system-node'}
                style={{ left: `${system.x}%`, top: `${system.y}%` }}
                onClick={() => setSelectedSystemId(system.id)}
              >
                <span className="node-core" />
                <strong>{system.name}</strong>
                <em>Threat {system.threat}</em>
              </button>
            ))}
          </div>
          <div className="system-card">
            <span>{selectedSystem.control}</span>
            <h2>{selectedSystem.name}</h2>
            <div className="slot-row">
              {selectedSystem.slots.map((slot) => <small key={slot}>{slot}</small>)}
            </div>
          </div>
        </section>

        <section className="mission-grid">
          {selectedSystem.missions.map((mission) => (
            <article className="mission-card" key={mission.id}>
              <div className="mission-topline">
                <span>{mission.type}</span>
                <strong>{mission.duration}s</strong>
              </div>
              <h3>{mission.title}</h3>
              <p>{mission.text}</p>
              <div className="mission-stats">
                <Metric icon={<Swords size={16} />} label="Power" value={mission.required} />
                <Metric icon={<Shield size={16} />} label="Risk" value={`${mission.risk}%`} />
                <Metric icon={<Banknote size={16} />} label="Reward" value={formatReward(mission.reward)} />
              </div>
              <button className="primary-action" onClick={() => startMission(mission)}>
                Deploy {selectedShip?.name ?? 'ship'}
                <ChevronRight size={17} />
              </button>
            </article>
          ))}
        </section>
      </section>

      <aside className="right-panels">
        <section className="panel">
          <div className="panel-heading">
            <span>Selected ship</span>
            <h2>{selectedShip?.name}</h2>
          </div>
          <div className="ship-list">
            {fleet.map((entry) => {
              const ship = hydrateShip(entry)
              return (
                <button
                  key={entry.uid}
                  className={entry.uid === selectedShipUid ? 'ship-row active' : 'ship-row'}
                  onClick={() => setSelectedShipUid(entry.uid)}
                >
                  <span className="ship-mark">{ship.name.slice(0, 2)}</span>
                  <span>
                    <strong>{ship.name}</strong>
                    <small>{entry.status} · L{entry.level} · Hull {entry.hull}%</small>
                  </span>
                </button>
              )
            })}
          </div>
          {selectedShip && (
            <div className="ship-detail">
              <p>{selectedShip.trait}</p>
              <div className="bars">
                <Bar label="Power" value={selectedShip.power + selectedFleetShip.level * 8} max={150} />
                <Bar label="Cargo" value={selectedShip.cargo} max={120} />
                <Bar label="Speed" value={selectedShip.speed} max={120} />
              </div>
              <button className="secondary-action" onClick={() => repairShip(selectedFleetShip.uid)}>
                <Wrench size={16} />
                Repair selected
              </button>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <span>Active operations</span>
            <h2>{operations.length} deployed</h2>
          </div>
          <div className="operation-list">
            {operations.length === 0 ? (
              <p className="empty-state">No ships are deployed. Pick a system contract to start the loop.</p>
            ) : (
              operations.map((operation) => (
                <article className="operation-row" key={operation.id}>
                  <div>
                    <strong>{operation.mission.title}</strong>
                    <small>{operation.shipName} · {operation.system}</small>
                  </div>
                  <div className="timer-line">
                    <span style={{ width: `${100 - (operation.remaining / operation.total) * 100}%` }} />
                  </div>
                  {operation.remaining > 0 ? (
                    <small className="time-left">{operation.remaining}s remaining</small>
                  ) : (
                    <button className="claim-button" onClick={() => completeOperation(operation)}>
                      Claim
                    </button>
                  )}
                </article>
              ))
            )}
          </div>
        </section>

        <section className="panel shipyard-panel">
          <div className="panel-heading">
            <span>Shipyard</span>
            <h2>Commission hulls</h2>
          </div>
          <div className="yard-list">
            {SHIPS.slice(3).map((ship) => (
              <article className="yard-row" key={ship.id}>
                <div>
                  <strong>{ship.name}</strong>
                  <small>{ship.maker} · {ship.role}</small>
                </div>
                <button
                  className="mini-buy"
                  disabled={!canAfford(resources, ship.cost)}
                  onClick={() => buyShip(ship)}
                >
                  Buy
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="panel log-panel">
          <div className="panel-heading">
            <span>Comms</span>
            <h2>Recent events</h2>
          </div>
          <ul>
            {log.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </aside>
    </main>
  )
}

function hydrateShip(entry) {
  if (!entry) return null
  return SHIPS.find((ship) => ship.id === entry.shipId) ?? SHIPS[0]
}

function Resource({ icon, label, value }) {
  return (
    <div className="resource">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Bar({ label, value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="bar-row">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="bar-track"><span style={{ width: `${pct}%` }} /></div>
    </div>
  )
}

function tabIcon(tab) {
  const props = { size: 18 }
  if (tab === 'Fleet') return <ShipWheel {...props} />
  if (tab === 'Shipyard') return <Factory {...props} />
  if (tab === 'Operations') return <Timer {...props} />
  return <Map {...props} />
}

function format(number) {
  return new Intl.NumberFormat('en-US').format(number)
}

function formatReward(reward) {
  if (reward.credits) return `${Math.round(reward.credits / 100) / 10}k cr`
  if (reward.ore) return `${reward.ore} ore`
  return `${reward.intel ?? 0} intel`
}

function scaleReward(reward, factor) {
  return Object.fromEntries(
    Object.entries(reward).map(([key, value]) => [key, Math.floor(value * factor)]),
  )
}

function canAfford(resources, cost) {
  return Object.entries(cost).every(([key, value]) => resources[key] >= value)
}

function payCost(resources, cost) {
  return Object.fromEntries(
    Object.entries(resources).map(([key, value]) => [key, value - (cost[key] ?? 0)]),
  )
}

export default App
