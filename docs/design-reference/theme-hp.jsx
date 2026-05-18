// Theme: HARRY POTTER — Olivia's page (age 11).
// Hogwarts acceptance letter / daily class schedule aesthetic.
// Aged parchment, deep emerald & burgundy, gold leaf, wax seals.
// Each chore is a "class" on the day's schedule with house points instead
// of regular points.

const HP = {
  parch:    '#EFE0BA',
  parchHi:  '#F7ECCC',
  parchLo:  '#D7BF8C',
  ink:      '#241914',
  inkSoft:  '#5A3F2A',
  inkMute:  '#8C7252',
  gold:     '#A87523',
  goldHi:   '#D9A33C',
  emerald:  '#1F4F3C',
  emeraldHi:'#2D6E54',
  burgundy: '#6F1B26',
  burgundyHi:'#9F2B36',
};

// Crest / coat of arms — keeps the page from feeling generic-parchment-mock
function HPCrest({ size = 96, color = HP.emerald }) {
  return (
    <svg viewBox="0 0 100 110" width={size} height={size * 1.1}>
      <defs>
        <linearGradient id="hpcrest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor="#0D2A20" />
        </linearGradient>
      </defs>
      {/* Shield */}
      <path d="M50 4 L92 14 V52 Q92 86 50 106 Q8 86 8 52 V14 Z"
            fill="url(#hpcrest)" stroke={HP.gold} strokeWidth="2.5" />
      {/* Cross divisions */}
      <line x1="50" y1="10" x2="50" y2="100" stroke={HP.gold} strokeWidth="1" opacity="0.55"/>
      <path d="M14 40 Q50 56 86 40" stroke={HP.gold} strokeWidth="1" fill="none" opacity="0.55"/>
      {/* Symbols — quadrants */}
      <text x="30" y="34" fill={HP.gold} fontFamily="Cinzel, serif" fontWeight="700" fontSize="14" textAnchor="middle">✦</text>
      <text x="70" y="34" fill={HP.gold} fontFamily="Cinzel, serif" fontWeight="700" fontSize="14" textAnchor="middle">⚯</text>
      <text x="30" y="78" fill={HP.gold} fontFamily="Cinzel, serif" fontWeight="700" fontSize="14" textAnchor="middle">⚜</text>
      <text x="70" y="78" fill={HP.gold} fontFamily="Cinzel, serif" fontWeight="700" fontSize="14" textAnchor="middle">✧</text>
      {/* Center medallion with initial */}
      <circle cx="50" cy="55" r="11" fill={HP.parch} stroke={HP.gold} strokeWidth="1.5"/>
      <text x="50" y="60" fill={HP.ink} fontFamily="Cinzel, serif" fontWeight="700" fontSize="14" textAnchor="middle">O</text>
    </svg>
  );
}

// Wax seal — flexible position
function HPWaxSeal({ size = 80, label = 'O', color = HP.burgundy, style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 35% 30%, ${HP.burgundyHi}, ${color} 60%, #3E0E13)`,
      border: `2px solid ${HP.gold}`,
      display: 'grid', placeItems: 'center',
      fontFamily: '"Cinzel", serif', fontWeight: 700,
      fontSize: size * 0.4, color: HP.gold,
      textShadow: '0 1px 2px rgba(0,0,0,.6)',
      boxShadow: `inset 0 -4px 8px rgba(0,0,0,.4), 0 4px 10px rgba(0,0,0,.3)`,
      position: 'relative',
      ...style,
    }}>
      {label}
      {/* drip */}
      <span style={{
        position: 'absolute', bottom: -size * 0.1, left: '38%',
        width: size * 0.24, height: size * 0.18,
        background: `radial-gradient(ellipse at 50% 0%, ${color}, #3E0E13)`,
        borderRadius: '50% 50% 60% 40%',
      }}/>
    </div>
  );
}

function HPTab({ label, sub, active }) {
  return (
    <div style={{
      padding: '12px 22px',
      background: active ? HP.parch : 'transparent',
      borderTop:    `2px solid ${active ? HP.ink : 'transparent'}`,
      borderLeft:   `1px solid ${HP.ink}55`,
      borderRight:  `1px solid ${HP.ink}55`,
      borderRadius: '10px 10px 0 0',
      fontFamily: '"Cinzel", serif', fontWeight: 600,
      fontSize: 16, letterSpacing: '0.16em',
      color: active ? HP.ink : HP.inkMute,
      textTransform: 'uppercase',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      minWidth: 150,
    }}>
      <span>{label}</span>
      {sub && <span style={{
        fontFamily: '"Crimson Pro", serif', fontSize: 11,
        letterSpacing: '0.08em', fontStyle: 'italic', textTransform: 'lowercase',
      }}>{sub}</span>}
    </div>
  );
}

function HPSpell({ m, period }) {
  const overdue = m.days_delta < 0;
  return (
    <div style={{
      position: 'relative',
      padding: '16px 20px',
      display: 'flex', gap: 18, alignItems: 'center',
      borderBottom: `1px dashed ${HP.inkMute}`,
    }}>
      {/* Period (class period number) */}
      <div style={{
        width: 56, textAlign: 'center', flexShrink: 0,
      }}>
        <div style={{
          fontFamily: '"Cinzel", serif', fontSize: 11,
          color: HP.inkMute, letterSpacing: '0.18em', fontWeight: 700,
        }}>PERIOD</div>
        <div style={{
          fontFamily: '"Cinzel", serif', fontSize: 42,
          color: HP.ink, fontWeight: 700, lineHeight: 1,
        }}>{period}</div>
      </div>

      {/* Wax seal as the icon container */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 78, height: 78, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${HP.emeraldHi}, ${HP.emerald} 60%, #0B2A20)`,
          border: `2.5px solid ${HP.gold}`,
          display: 'grid', placeItems: 'center',
          color: HP.gold,
          boxShadow: `inset 0 -4px 8px rgba(0,0,0,.4), 0 3px 8px rgba(0,0,0,.25)`,
        }}>
          <ChoreIcon name={m.icon} size={42} strokeWidth={1.8} />
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Cinzel", serif', fontWeight: 600,
          fontSize: 12, color: HP.burgundy, letterSpacing: '0.2em',
        }}>{m.category.toUpperCase()} · {m.streakGoal}-DAY ROTATION</div>
        <div style={{
          fontFamily: '"Cinzel", serif', fontWeight: 600,
          fontSize: 30, color: HP.ink, lineHeight: 1.05, marginTop: 4,
          letterSpacing: '0.01em',
        }}>{m.name}</div>

        {/* House-point streak — gold stars */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 10,
        }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} style={{
                fontSize: 18, color: i < m.streakCurrent ? HP.gold : HP.parchLo,
                filter: i < m.streakCurrent ? `drop-shadow(0 0 3px ${HP.goldHi})` : 'none',
              }}>★</span>
            ))}
          </div>
          <span style={{
            fontFamily: '"Crimson Pro", serif', fontStyle: 'italic',
            fontSize: 15, color: HP.inkSoft,
          }}>· perfect attendance: {m.streakCurrent} of {m.streakGoal}</span>
          {overdue && (
            <span style={{
              fontFamily: '"Cinzel", serif', fontWeight: 700,
              fontSize: 12, color: HP.burgundy, letterSpacing: '0.16em',
              marginLeft: 8,
            }}>· DETENTION RISK</span>
          )}
        </div>
      </div>

      {/* House points medallion */}
      <div style={{
        textAlign: 'center', minWidth: 100,
        padding: '10px 14px',
        background: `linear-gradient(180deg, ${HP.parchHi}, ${HP.parchLo})`,
        border: `2px solid ${HP.gold}`,
        borderRadius: 10,
      }}>
        <div style={{
          fontFamily: '"Cinzel", serif', fontSize: 11,
          color: HP.inkSoft, letterSpacing: '0.2em', fontWeight: 700,
        }}>HOUSE PTS</div>
        <div style={{
          fontFamily: '"Cinzel", serif', fontSize: 30,
          color: HP.emerald, fontWeight: 700, lineHeight: 1, marginTop: 2,
        }}>+{m.points}</div>
      </div>

      {/* "Cast" button */}
      <button style={{
        all: 'unset', cursor: 'pointer',
        padding: '12px 22px',
        background: HP.ink, color: HP.parchHi,
        border: `2px solid ${HP.gold}`,
        borderRadius: 4,
        fontFamily: '"Cinzel", serif', fontWeight: 600,
        fontSize: 18, letterSpacing: '0.18em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        Mark Done
      </button>
    </div>
  );
}

function HPPage({ width = 1920, height = 1080 }) {
  const agent = window.FH_BY_ID('olivia');
  const own = window.FH_MISSIONS.filter(m => m.assigned === 'olivia');

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: '"Manrope", system-ui, sans-serif',
      color: HP.ink,
      background: HP.parch,
      backgroundImage: `
        radial-gradient(ellipse at 12% 8%,  ${HP.parchLo}88, transparent 40%),
        radial-gradient(ellipse at 88% 92%, ${HP.parchLo}88, transparent 40%),
        radial-gradient(ellipse at 70% 20%, ${HP.parchHi}77, transparent 30%),
        repeating-radial-gradient(circle at 35% 60%, ${HP.parchLo}18 0, ${HP.parchLo}18 1px, transparent 1px, transparent 4px)
      `,
    }}>
      {/* Dark leather frame */}
      <div style={{
        position: 'absolute', inset: 0,
        boxShadow: `inset 0 0 0 22px ${HP.ink}, inset 0 0 0 24px ${HP.gold}, inset 0 0 0 30px ${HP.ink}`,
        pointerEvents: 'none',
      }} />
      {/* corner flourishes */}
      {['tl','tr','bl','br'].map(p => (
        <div key={p} style={{
          position: 'absolute',
          width: 60, height: 60,
          ...(p==='tl' && { top: 30, left: 30 }),
          ...(p==='tr' && { top: 30, right: 30, transform: 'scaleX(-1)' }),
          ...(p==='bl' && { bottom: 30, left: 30, transform: 'scaleY(-1)' }),
          ...(p==='br' && { bottom: 30, right: 30, transform: 'scale(-1,-1)' }),
          color: HP.gold,
          fontFamily: '"Cinzel", serif', fontSize: 70,
          opacity: 0.7, lineHeight: 0.7,
        }}>❦</div>
      ))}

      <div style={{
        position: 'relative', padding: '50px 56px', height: '100%',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header — letterhead */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 28,
          paddingBottom: 22, borderBottom: `2px double ${HP.ink}`,
        }}>
          <HPCrest size={92} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              fontFamily: '"Cinzel", serif', fontWeight: 600,
              fontSize: 14, color: HP.burgundy, letterSpacing: '0.4em',
            }}>STUDENT · CODENAME SNITCH · YEAR THREE</div>
            <div style={{
              fontFamily: '"Cinzel", serif', fontWeight: 700,
              fontSize: 88, color: HP.ink, lineHeight: 0.95,
              letterSpacing: '0.04em', marginTop: 6,
            }}>OLIVIA</div>
            <div style={{
              fontFamily: '"Crimson Pro", serif', fontStyle: 'italic',
              fontSize: 22, color: HP.inkSoft, marginTop: 4,
            }}>~ Daily Class Schedule · the 13th of May ~</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <HPWaxSeal size={84} label="O" />
            <button style={{
              all: 'unset', cursor: 'pointer',
              padding: '6px 14px', border: `1.5px solid ${HP.ink}`,
              fontFamily: '"Cinzel", serif', fontSize: 12,
              color: HP.ink, letterSpacing: '0.2em', fontWeight: 600,
            }}>← Common Room</button>
          </div>
        </div>

        {/* Stats banner */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: 14, paddingBottom: 14,
          borderBottom: `1px solid ${HP.inkMute}`,
        }}>
          <HPStat label="HOUSE POINTS"     value={agent.balance} accent={HP.emerald} />
          <HPStat label="ATTENDANCE STREAK" value={`${agent.streakDays} days`} accent={HP.gold} />
          <HPStat label="TODAY'S CLASSES"   value={own.length} accent={HP.burgundy} />
          <HPStat label="NEXT EXAM"        value="Pizza Friday · 300pts" />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 0, justifyContent: 'center',
          marginTop: 18, marginBottom: -1, position: 'relative', zIndex: 1,
        }}>
          <HPTab label="Classes"     sub="today's schedule" active />
          <HPTab label="Honeydukes"  sub="reward shop" />
          <HPTab label="Pensieve"    sub="memory · history" />
          <HPTab label="Marks"       sub="data" />
        </div>

        {/* Body parchment panel */}
        <div style={{
          flex: 1, minHeight: 0,
          background: `${HP.parchHi}aa`,
          border: `1.5px solid ${HP.ink}`,
          padding: '12px 18px',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          position: 'relative',
        }}>
          {/* Top illuminated line */}
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 14,
            paddingBottom: 10, marginBottom: 6,
            borderBottom: `1px solid ${HP.ink}`,
          }}>
            <span style={{
              fontFamily: '"Cinzel", serif', fontWeight: 700,
              fontSize: 26, color: HP.ink, letterSpacing: '0.04em',
            }}>Today's Spellwork</span>
            <span style={{ flex: 1 }} />
            <span style={{
              fontFamily: '"Crimson Pro", serif', fontStyle: 'italic',
              fontSize: 16, color: HP.inkSoft,
            }}>signed, Prof. Shannon — Head of House</span>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            {own.map((m, i) => (
              <HPSpell key={m.id} m={m} period={i + 1} />
            ))}
          </div>
        </div>

        {/* Footer line */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: 14,
          fontFamily: '"Crimson Pro", serif', fontStyle: 'italic',
          fontSize: 14, color: HP.inkMute,
        }}>
          <span>By owl, this 13th day of May · Ops Year 2026</span>
          <span>· Mischief Managed ·</span>
          <span>Family Hub · Hogwarts Annex</span>
        </div>
      </div>
    </div>
  );
}

function HPStat({ label, value, accent }) {
  return (
    <div>
      <div style={{
        fontFamily: '"Cinzel", serif', fontSize: 11,
        color: HP.inkMute, letterSpacing: '0.24em', fontWeight: 700,
      }}>{label}</div>
      <div style={{
        fontFamily: '"Cinzel", serif', fontWeight: 700,
        fontSize: 26, color: accent || HP.ink, lineHeight: 1, marginTop: 4,
      }}>{value}</div>
    </div>
  );
}

Object.assign(window, { HPPage });
