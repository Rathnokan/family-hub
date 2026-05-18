// Theme: DRAGON BALL Z — Jackson's page (age 7, pre-reader).
// Critical design constraint: Jackson can't read. So icons are huge, text is
// minimized, the affordance to complete a task is enormous and unambiguous.
// Visual energy = ki / power-up — saturated sky → orange gradient, speed
// lines radiating, halftone manga dots, energy auras, bright pop.

const DBZ = {
  sky:      '#3FAAD9',
  skyHi:    '#7BD3F2',
  skyLo:    '#1E6A98',
  orange:   '#FF6A1A',
  orangeHi: '#FFB229',
  orangeLo: '#C9431B',
  yellow:   '#FFE03A',
  red:      '#E63319',
  navy:     '#0F1E2E',
  white:    '#FFFFFF',
  inkSoft:  '#1A2B3D',
};

function DBZSky() {
  return (
    <React.Fragment>
      {/* Sky gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${DBZ.sky} 0%, ${DBZ.skyHi} 45%, ${DBZ.orangeHi} 75%, ${DBZ.orange} 100%)`,
      }} />
      {/* Speed lines streaking from upper-right */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="dbzbeam" cx="80%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#dbzbeam)" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 15 + 30) * Math.PI / 180;
          const x1 = 1600 + Math.cos(a) * 100, y1 = 200 + Math.sin(a) * 100;
          const x2 = 1600 + Math.cos(a) * 1800, y2 = 200 + Math.sin(a) * 1800;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={DBZ.white} strokeWidth={i % 3 ? 1 : 2} strokeOpacity={i % 3 ? 0.15 : 0.28}/>;
        })}
      </svg>
      {/* Halftone dots — bottom-left + top-right */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(${DBZ.navy}66 1.5px, transparent 1.5px)`,
        backgroundSize: '14px 14px',
        maskImage: 'radial-gradient(circle at 0% 100%, black, transparent 55%), radial-gradient(circle at 100% 0%, black, transparent 50%)',
        WebkitMaskImage: 'radial-gradient(circle at 0% 100%, black, transparent 55%), radial-gradient(circle at 100% 0%, black, transparent 50%)',
        maskComposite: 'add', WebkitMaskComposite: 'source-over',
      }} />
    </React.Fragment>
  );
}

function DBZPowerLevel({ level }) {
  return (
    <div style={{
      position: 'relative',
      padding: '14px 22px',
      background: DBZ.navy,
      border: `4px solid ${DBZ.yellow}`,
      borderRadius: 14,
      boxShadow: `0 6px 0 ${DBZ.orangeLo}, 0 0 40px ${DBZ.yellow}88`,
    }}>
      <div style={{
        fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
        fontSize: 13, letterSpacing: '0.32em', color: DBZ.yellow,
      }}>POWER LEVEL</div>
      <div style={{
        fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
        fontSize: 56, color: DBZ.white, lineHeight: 1, marginTop: 2,
        fontVariantNumeric: 'tabular-nums',
        textShadow: `0 0 20px ${DBZ.yellow}`,
      }}>{level.toLocaleString()}</div>
      <div style={{
        marginTop: 10, height: 14,
        background: DBZ.inkSoft, borderRadius: 99,
        border: `2px solid ${DBZ.white}`,
        overflow: 'hidden',
      }}>
        <div style={{
          width: '72%', height: '100%',
          background: `linear-gradient(90deg, ${DBZ.orange}, ${DBZ.yellow})`,
          boxShadow: `0 0 12px ${DBZ.yellow}`,
        }} />
      </div>
    </div>
  );
}

function DBZTrainingCard({ m, big }) {
  // Big variant for Jackson's primary "missing" card — the one we want him
  // looking at first thing in the morning.
  const overdue = m.days_delta < 0;
  return (
    <div style={{
      position: 'relative',
      padding: big ? 24 : 20,
      background: DBZ.white,
      border: `4px solid ${DBZ.navy}`,
      borderRadius: 18,
      boxShadow: `0 6px 0 ${DBZ.navy}, 0 12px 24px rgba(0,0,0,.18)`,
      display: 'flex', alignItems: 'center', gap: big ? 22 : 16,
      overflow: 'hidden',
    }}>
      {/* Energy aura behind icon */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          position: 'absolute', inset: -10,
          background: `radial-gradient(circle, ${DBZ.yellow}aa, transparent 70%)`,
          filter: 'blur(8px)',
        }} />
        <div style={{
          position: 'relative',
          width: big ? 110 : 88, height: big ? 110 : 88, borderRadius: 18,
          background: `linear-gradient(135deg, ${DBZ.orange}, ${DBZ.orangeHi})`,
          border: `4px solid ${DBZ.navy}`,
          display: 'grid', placeItems: 'center',
          color: DBZ.white,
        }}>
          <ChoreIcon name={m.icon} size={big ? 64 : 50} strokeWidth={2.5} />
        </div>
      </div>

      {/* Label — short, all caps, huge */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: big ? 46 : 34, color: DBZ.navy, lineHeight: 0.95,
          letterSpacing: '-0.01em', textTransform: 'uppercase',
        }}>{m.name}</div>
        {/* Streak hearts as power crystals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }}>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} style={{
              fontSize: big ? 26 : 22,
              filter: i < m.streakCurrent ? `drop-shadow(0 0 4px ${DBZ.yellow})` : 'grayscale(1)',
              opacity: i < m.streakCurrent ? 1 : 0.25,
            }}>⚡</span>
          ))}
          {overdue && (
            <span style={{
              marginLeft: 10, padding: '4px 10px',
              background: DBZ.red, color: DBZ.white,
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 14, letterSpacing: '0.16em', borderRadius: 6,
              transform: 'rotate(-3deg)',
            }}>HURRY!</span>
          )}
        </div>
      </div>

      {/* Power-up amount */}
      <div style={{
        transform: 'rotate(-6deg)',
        padding: '10px 16px',
        background: DBZ.yellow,
        border: `4px solid ${DBZ.navy}`,
        borderRadius: 12,
        textAlign: 'center',
        boxShadow: `0 4px 0 ${DBZ.navy}`,
      }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: big ? 36 : 28, color: DBZ.navy, lineHeight: 1,
        }}>+{m.points}</div>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 11, color: DBZ.navy, letterSpacing: '0.2em',
        }}>POWER</div>
      </div>

      {/* BIG POWER-UP button */}
      <button style={{
        all: 'unset', cursor: 'pointer',
        padding: big ? '22px 26px' : '18px 22px',
        background: `linear-gradient(180deg, ${DBZ.orange}, ${DBZ.orangeLo})`,
        color: DBZ.white,
        border: `4px solid ${DBZ.navy}`,
        borderRadius: 14,
        fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
        fontSize: big ? 32 : 26, letterSpacing: '0.04em',
        boxShadow: `0 6px 0 ${DBZ.navy}, 0 0 30px ${DBZ.orange}aa`,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: big ? 36 : 30 }}>⚡</span> GO!
      </button>
    </div>
  );
}

function DBZTab({ label, icon, active }) {
  return (
    <button style={{
      all: 'unset', cursor: 'pointer',
      padding: '14px 26px',
      background: active ? DBZ.yellow : `${DBZ.white}cc`,
      color: DBZ.navy,
      border: `4px solid ${DBZ.navy}`,
      borderRadius: 99,
      fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
      fontSize: 20, letterSpacing: '0.06em',
      textTransform: 'uppercase',
      boxShadow: active ? `0 4px 0 ${DBZ.navy}` : 'none',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ fontSize: 24 }}>{icon}</span> {label}
    </button>
  );
}

function DBZPage({ width = 1920, height = 1080 }) {
  const agent = window.FH_BY_ID('jackson');
  const own = window.FH_MISSIONS.filter(m => m.assigned === 'jackson');

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: '"Manrope", system-ui, sans-serif',
    }}>
      <DBZSky />

      <div style={{
        position: 'relative', padding: 40, height: '100%',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 30, marginBottom: 24,
        }}>
          <button style={{
            all: 'unset', cursor: 'pointer',
            width: 84, height: 84, borderRadius: 22,
            background: DBZ.white,
            border: `4px solid ${DBZ.navy}`,
            display: 'grid', placeItems: 'center',
            boxShadow: `0 6px 0 ${DBZ.navy}`,
            fontSize: 44, color: DBZ.navy, fontWeight: 800,
          }}>←</button>

          {/* Avatar — energy aura */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: -16,
              background: `radial-gradient(circle, ${DBZ.yellow}cc, transparent 70%)`,
              filter: 'blur(12px)',
              animation: 'dbz-pulse 1.5s ease-in-out infinite',
            }} />
            <div style={{
              position: 'relative',
              width: 116, height: 116, borderRadius: '50%',
              background: `linear-gradient(135deg, ${DBZ.orange}, ${DBZ.yellow})`,
              border: `5px solid ${DBZ.navy}`,
              display: 'grid', placeItems: 'center',
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 70, color: DBZ.white,
              textShadow: `3px 3px 0 ${DBZ.navy}`,
            }}>J</div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 18, letterSpacing: '0.3em', color: DBZ.yellow,
              textShadow: `2px 2px 0 ${DBZ.navy}`,
            }}>SAIYAN TRAINEE · CODENAME KAMEHA</div>
            <div style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 110, color: DBZ.white, lineHeight: 0.9,
              letterSpacing: '-0.03em',
              textShadow: `5px 5px 0 ${DBZ.navy}, 10px 10px 0 ${DBZ.orangeLo}aa`,
              textTransform: 'uppercase',
            }}>JACKSON</div>
          </div>

          <DBZPowerLevel level={agent.balance * 60 + 9000} />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 22,
          paddingLeft: 4,
        }}>
          <DBZTab label="TRAIN" icon="💪" active />
          <DBZTab label="SHOP"  icon="💎" />
          <DBZTab label="WINS"  icon="🏆" />
          <DBZTab label="STATS" icon="📊" />
        </div>

        {/* Today's training */}
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 36, color: DBZ.white, marginBottom: 14,
          textShadow: `3px 3px 0 ${DBZ.navy}`,
          letterSpacing: '0.04em',
          display: 'flex', alignItems: 'baseline', gap: 16,
        }}>
          <span>TODAY'S TRAINING</span>
          <span style={{
            fontSize: 18, letterSpacing: '0.32em', color: DBZ.yellow,
            textShadow: `2px 2px 0 ${DBZ.navy}`,
          }}>{own.length} MISSIONS</span>
          <div style={{ flex: 1 }} />
          <span style={{
            fontSize: 18, letterSpacing: '0.18em', color: DBZ.white,
            textShadow: `2px 2px 0 ${DBZ.navy}`,
          }}>STREAK <span style={{ color: DBZ.yellow }}>▲ {agent.streakDays} DAYS</span></span>
        </div>

        {/* Cards — featured first, then smaller rows */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', gap: 14,
          overflow: 'hidden', minHeight: 0,
        }}>
          {own.length > 0 && <DBZTrainingCard m={own[0]} big />}
          {own.slice(1, 4).map(m => (
            <DBZTrainingCard key={m.id} m={m} />
          ))}
        </div>

        {/* Bottom progress / next reward bar */}
        <div style={{
          marginTop: 14,
          padding: '14px 22px',
          background: DBZ.navy,
          border: `4px solid ${DBZ.yellow}`,
          borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <span style={{ fontSize: 36 }}>🍕</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 12, color: DBZ.yellow, letterSpacing: '0.3em',
            }}>NEXT BIG UNLOCK</div>
            <div style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 28, color: DBZ.white, lineHeight: 1, marginTop: 2,
              letterSpacing: '0.02em', textTransform: 'uppercase',
            }}>PIZZA FRIDAY · 300 POWER</div>
          </div>
          <div style={{
            flex: 2, height: 24, background: DBZ.inkSoft,
            border: `3px solid ${DBZ.white}`, borderRadius: 99, overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              width: '52%', height: '100%',
              background: `linear-gradient(90deg, ${DBZ.orange}, ${DBZ.yellow})`,
              boxShadow: `0 0 14px ${DBZ.yellow}`,
            }} />
            <span style={{
              position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 14, color: DBZ.white, letterSpacing: '0.2em',
            }}>156 / 300</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dbz-pulse {
          0%, 100% { opacity: .8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { DBZPage });
