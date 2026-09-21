import { useState, useEffect, useRef, useCallback } from 'react';
import { planets, Planet } from './data/planets';

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive scaling
  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const minDim = Math.min(w, h - 160);
      setScale(Math.min(1, minDim / 960));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      setTime(prev => prev + delta * 0.001 * speed);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const getPlanetPosition = (planet: Planet, currentTime: number) => {
    const angle = currentTime * planet.speed * 0.5;
    const x = Math.cos(angle) * planet.orbitRadius;
    const y = Math.sin(angle) * planet.orbitRadius * 0.45; // Elliptical perspective
    return { x, y };
  };

  const formatDistance = (distance: number) => {
    return `${distance} млн км`;
  };

  const formatPeriod = (period: number) => {
    if (period < 365) return `${period} дней`;
    const years = (period / 365.25).toFixed(1);
    return `${years} лет (${period.toLocaleString()} дней)`;
  };

  // Generate static stars
  const stars = useRef(
    Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      w: Math.random() * 2.5 + 0.5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 3,
    }))
  ).current;

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative select-none">
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.w}px`,
              height: `${star.w}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-4 pb-2">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
          ☀️ Интерактивная Солнечная система
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">Нажмите на планету для получения информации</p>
      </header>

      {/* Solar System Visualization */}
      <div className="relative flex items-center justify-center" style={{ height: 'calc(100vh - 160px)' }}>
        <div
          ref={containerRef}
          className="relative transition-transform duration-300"
          style={{
            width: '960px',
            height: '960px',
            transform: `scale(${scale})`
          }}
        >
          {/* Sun */}
          <div
            className="absolute rounded-full z-10 cursor-pointer hover:scale-110 transition-transform"
            style={{
              width: '56px',
              height: '56px',
              background: 'radial-gradient(circle, #ffffff 0%, #fff700 20%, #ff8c00 60%, #ff4500 100%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 40px 15px rgba(255, 165, 0, 0.5), 0 0 80px 30px rgba(255, 165, 0, 0.25), 0 0 120px 50px rgba(255, 100, 0, 0.1)'
            }}
          >
            <div className="absolute inset-[-10px] rounded-full animate-pulse" style={{
              background: 'radial-gradient(circle, rgba(255,200,0,0.2) 0%, transparent 70%)',
            }} />
          </div>

          {/* Orbits */}
          {planets.map((planet) => (
            <div
              key={`orbit-${planet.id}`}
              className="absolute rounded-full"
              style={{
                width: `${planet.orbitRadius * 2}px`,
                height: `${planet.orbitRadius * 2 * 0.45}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: `1px solid ${selectedPlanet?.id === planet.id ? planet.color + '55' : 'rgba(100, 116, 139, 0.25)'}`,
                transition: 'border-color 0.3s'
              }}
            />
          ))}

          {/* Planets */}
          {planets.map((planet) => {
            const pos = getPlanetPosition(planet, time);
            const isSelected = selectedPlanet?.id === planet.id;
            const isHovered = hoveredPlanet === planet.id;
            const isBehindSun = pos.y > 0; // Simple depth sorting

            return (
              <div
                key={planet.id}
                className="absolute cursor-pointer transition-all duration-150"
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${isHovered || isSelected ? 1.5 : 1})`,
                  zIndex: isBehindSun ? 5 : 25,
                }}
                onClick={() => setSelectedPlanet(planet)}
                onMouseEnter={() => setHoveredPlanet(planet.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <div
                  className="w-full h-full rounded-full relative"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${planet.color}ff, ${planet.color}99, ${planet.color}55)`,
                    boxShadow: isSelected
                      ? `0 0 12px 4px ${planet.color}aa, 0 0 25px 8px ${planet.color}44`
                      : isHovered
                        ? `0 0 8px 3px ${planet.color}88`
                        : `0 0 4px 1px ${planet.color}44`
                  }}
                >
                  {/* Saturn rings */}
                  {planet.id === 'saturn' && (
                    <div
                      className="absolute"
                      style={{
                        width: `${planet.size * 2}px`,
                        height: `${planet.size * 0.6}px`,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotateX(70deg)',
                        border: `2px solid rgba(210, 180, 140, 0.6)`,
                        borderRadius: '50%',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(210, 180, 140, 0.2) 30%, rgba(210, 180, 140, 0.3) 50%, rgba(210, 180, 140, 0.2) 70%, transparent 100%)'
                      }}
                    />
                  )}
                </div>
                {/* Planet label */}
                {(isHovered || isSelected) && (
                  <div
                    className="absolute text-xs text-white whitespace-nowrap font-semibold pointer-events-none px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
                    style={{
                      top: `-${planet.size + 12}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {planet.nameRu}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50 py-3 px-4 z-30">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3 md:gap-5">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/30 font-medium text-sm"
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                <span className="hidden sm:inline">Пауза</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                <span className="hidden sm:inline">Старт</span>
              </>
            )}
          </button>

          {/* Speed control */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs md:text-sm">Скорость:</span>
            <div className="flex gap-1">
              {[0.25, 0.5, 1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    speed === s
                      ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30'
                      : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div className="fixed top-16 right-3 md:right-6 w-72 md:w-80 z-30 animate-slideIn">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/60 shadow-2xl overflow-hidden">
            {/* Color accent bar */}
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${selectedPlanet.color}, transparent)` }} />
            
            <div className="p-5">
              {/* Close button */}
              <button
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-700/80 hover:bg-gray-600 transition-colors text-gray-300 text-sm"
              >
                ✕
              </button>

              {/* Planet header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex-shrink-0"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}, ${selectedPlanet.color}88, ${selectedPlanet.color}44)`,
                    boxShadow: `0 0 20px 5px ${selectedPlanet.color}33`
                  }}
                />
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedPlanet.nameRu}</h2>
                  <p className="text-gray-400 text-sm">{selectedPlanet.name}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 leading-relaxed border-l-2 pl-3" style={{ borderColor: selectedPlanet.color + '66' }}>
                {selectedPlanet.description}
              </p>

              {/* Stats */}
              <div className="space-y-0">
                <InfoRow icon="🌐" label="Диаметр" value={`${selectedPlanet.diameter.toLocaleString()} км`} />
                <InfoRow icon="☀️" label="Расстояние" value={formatDistance(selectedPlanet.distanceFromSun)} />
                <InfoRow icon="🔄" label="Орбит. период" value={formatPeriod(selectedPlanet.orbitalPeriod)} />
                <InfoRow icon="🌀" label="Вращение" value={`${selectedPlanet.rotationPeriod} ч`} />
                <InfoRow icon="🌙" label="Спутники" value={`${selectedPlanet.moons}`} isLast />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Planet quick select sidebar */}
      <div className="fixed top-16 left-3 md:left-6 z-30">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-700/50 p-2.5">
          <p className="text-[10px] text-gray-500 mb-1.5 text-center uppercase tracking-wider">Планеты</p>
          <div className="flex flex-col gap-0.5">
            {planets.map((planet) => (
              <button
                key={planet.id}
                onClick={() => setSelectedPlanet(planet)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs md:text-sm transition-all ${
                  selectedPlanet?.id === planet.id
                    ? 'bg-gray-700/80 text-white shadow-inner'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: planet.color, boxShadow: `0 0 4px ${planet.color}66` }}
                />
                <span className="whitespace-nowrap">{planet.nameRu}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, isLast }: { icon: string; label: string; value: string; isLast?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2.5 ${!isLast ? 'border-b border-gray-700/40' : ''}`}>
      <span className="text-gray-400 text-sm flex items-center gap-1.5">
        <span>{icon}</span>
        <span>{label}</span>
      </span>
      <span className="font-medium text-sm text-white">{value}</span>
    </div>
  );
}

export default App;
