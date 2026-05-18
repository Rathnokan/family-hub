// Theme: DINOSAURS — Spencer's page (age 12).
// Paleo field-journal aesthetic. Kraft / canvas paper with sepia stains and
// faded watermarks; typewriter labels, hand-drawn dinosaur silhouette
// margin art, expedition stamps, fossil-bone accents. Each chore is a
// "specimen logged" entry with a footprint-trail streak.

const DN = {
  paper:    '#E8DAB7',
  paperHi:  '#EFE3C1',
  paperLo:  '#C8B689',
  ink:      '#2B1F0E',
  inkSoft:  '#5B4528',
  inkMute:  '#8A7349',
  olive:    '#5C6B3A',
  oliveHi:  '#7A8B49',
  amber:    '#B57A2A',
  amberHi:  '#D89A36',
  rust:     '#A1402A',
};

// Decorative dinosaur silhouette — kept as one path so it reads as
// "field guide illustration" without looking like clip art.
function DNTRex({ width = 200, color = DN.inkSoft, style = {} }) {
  return (
    <svg viewBox="0 0 240 140" width={width} height={width * 140 / 240} style={style}>
      <path d="M210 78 q-2-14-15-18 l-32-7 q-4-1-4-5 v-9 q0-6-6-8 q-9-3-17-3 l-18 1 q-4 0-6 3 l-10 12 q-2 2-5 2 h-15 q-10 0-16 8 l-12 16 q-2 3 0 6 l4 6 q1 2 4 2 h7 l-1 4 q-1 4 2 7 l8 8 q3 3 7 3 h14 v18 q0 4 4 4 h8 q4 0 4-4 v-14 h22 v14 q0 4 4 4 h8 q4 0 4-4 v-22 q24-2 36-12 q12-10 14-22 Z M186 62 q-3 0-3-3 t3-3 t3 3 t-3 3 Z M64 100 q-2 0-2 2 t2 2 t2-2 t-2-2 Z"
        fill={color} opacity="0.18" />
    </svg>
  );
}

// Footprint glyph for streak
function DNFoot({ filled, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <ellipse cx="12" cy="15" rx="6" ry="6" fill={filled ? DN.ink : 'none'} stroke={DN.ink} strokeWidth="1.5" opacity={filled ? 1 : 0.35}/>
      <ellipse cx="6"  cy="6"  rx="2" ry="2.5" fill={filled ? DN.ink : 'none'} stroke={DN.ink} strokeWidth="1.5" opacity={filled ? 1 : 0.35}/>
      <ellipse cx="12" cy="4"  rx="2" ry="2.5" fill={filled ? DN.ink : 'none'} stroke={DN.ink} strokeWidth="1.5" opacity={filled ? 1 : 0.35}/>
      <ellipse cx="18" cy="6"  rx="2" ry="2.5" fill={filled ? DN.ink : 'none'} stroke={DN.ink} strokeWidth="1.5" opacity={filled ? 1 : 0.35}/>
    </svg>
  );
}

// Expedition stamp
function DNStamp({ label, color = DN.rust, rotate = -4, size = 11 }) {
  return (
    <span style={{
      display: 'inline-block', transform: `rotate(${rotate}deg)`,
      padding: '4px 10px',
      border: `2px double ${color}`,
      fontFamily: '"JetBrains Mono", monospace', fontSize: size,
      fontWeight: 800, letterSpacing: '0.22em',
      color, textTransform: 'uppercase',
    }}>{label}</span>
  );
}

function DNTab({ label, sub, active }) {
  return (
    <div style={{
      padding: '10px 18px',
      background: active ? DN.ink : 'transparent',
      color: active ? DN.paperHi : DN.ink,
      border: `1.5px solid ${DN.ink}`,
      borderBottom: active ? `1.5px solid ${DN.ink}` : 'none',
      fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
      fontWeight: 700, letterSpacing: '0.22em',
      textTransform: 'uppercase',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      minWidth: 140,
    }}>
      <span>{label}</span>
      {sub && <span style={{
        fontSize: 9, opacity: 0.7, fontWeight: 600, letterSpacing: '0.18em',
        textTransform: 'lowercase', fontStyle: 'italic',
      }}>{sub}</span>}
    </div>
  );
}

function DNSpecimen({ m, num }) {
  const overdue = m.days_delta < 0;
  return (
    <div style={{
      position: 'relative',
      display: 'flex', gap: 18, alignItems: 'center',
      padding: '14px 16px 14px 18px',
      borderLeft: `4px solid ${DN.amber}`,
      background: `${DN.paperHi}aa`,
      border: `1.5px solid ${DN.ink}`,
      borderLeftWidth: 4,
    }}>
      {/* Specimen number tag */}
      <div style={{
        position: 'absolute', top: -10, left: 12,
        padding: '0 8px', background: DN.paperHi,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        fontWeight: 800, color: DN.ink, letterSpacing: '0.22em',
      }}>SP-{String(num).padStart(3, '0')} · {m.category.toUpperCase()}</div>

      {/* Icon — fossil card */}
      <div style={{
        width: 76, height: 76, flexShrink: 0,
        border: `1.5px solid ${DN.ink}`,
        background: DN.paper,
        display: 'grid', placeItems: 'center',
        color: DN.ink, position: 'relative',
      }}>
        <ChoreIcon name={m.icon} size={44} strokeWidth={1.8} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Bree Serif", serif', fontWeight: 400,
          fontSize: 28, color: DN.ink, lineHeight: 1.05,
          letterSpacing: '-0.005em',
        }}>{m.name}</div>

        {/* Field notes line */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginTop: 10,
        }}>
          {/* Footprint trail */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {Array.from({ length: 7 }, (_, i) => (
              <DNFoot key={i} filled={i < m.streakCurrent} size={20} />
            ))}
          </div>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            color: DN.inkSoft, fontWeight: 600, letterSpacing: '0.16em',
          }}>TRAIL · {m.streakCurrent}/{m.streakGoal} DAYS</span>
          {overdue && <DNStamp label="overdue" rotate={-6} />}
          {m.penalty > 0 && (
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: DN.rust, fontWeight: 700, letterSpacing: '0.14em',
            }}>· RISK −{m.penalty}PTS</span>
          )}
        </div>
      </div>

      {/* Points stamp */}
      <div style={{
        textAlign: 'center', minWidth: 76,
        padding: '8px 12px',
        border: `1.5px solid ${DN.ink}`,
        background: `${DN.amberHi}44`,
      }}>
        <div style={{
          fontFamily: '"Bree Serif", serif', fontWeight: 400,
          fontSize: 28, color: DN.ink, lineHeight: 1,
        }}>+{m.points}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          color: DN.inkSoft, letterSpacing: '0.22em', marginTop: 2, fontWeight: 800,
        }}>POINTS</div>
      </div>

      {/* Log specimen button */}
      <button style={{
        all: 'unset', cursor: 'pointer',
        padding: '12px 18px',
        background: DN.ink, color: DN.paperHi,
        fontFamily: '"JetBrains Mono", monospace', fontWeight: 800,
        fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase',
        border: `2px solid ${DN.ink}`,
        boxShadow: `3px 3px 0 ${DN.amber}`,
      }}>
        ✓ Log Specimen
      </button>
    </div>
  );
}

function DNPage({ width = 1920, height = 1080 }) {
  const agent = window.FH_BY_ID('spencer');
  const own = window.FH_MISSIONS.filter(m => m.assigned === 'spencer');

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: '"Manrope", system-ui, sans-serif',
      color: DN.ink, background: DN.paper,
      backgroundImage: `
        radial-gradient(ellipse at 8% 88%,  ${DN.paperLo}99, transparent 38%),
        radial-gradient(ellipse at 92% 12%, ${DN.paperLo}99, transparent 36%),
        radial-gradient(circle at 30% 70%, ${DN.rust}22, transparent 20%),
        radial-gradient(circle at 70% 30%, ${DN.olive}22, transparent 18%),
        repeating-linear-gradient(95deg, ${DN.paperLo}10 0 1px, transparent 1px 7px)
      `,
    }}>
      {/* "Tape" at corners */}
      {['tl','tr','bl','br'].map(p => (
        <div key={p} style={{
          position: 'absolute', width: 120, height: 28,
          background: `${DN.amberHi}88`,
          border: `1px solid ${DN.amber}aa`,
          ...(p==='tl' && { top: 22, left: -32, transform: 'rotate(-22deg)' }),
          ...(p==='tr' && { top: 22, right: -32, transform: 'rotate(22deg)' }),
          ...(p==='bl' && { bottom: 22, left: -32, transform: 'rotate(22deg)' }),
          ...(p==='br' && { bottom: 22, right: -32, transform: 'rotate(-22deg)' }),
          pointerEvents: 'none',
        }} />
      ))}

      {/* Watermark T-Rex bottom-right */}
      <DNTRex width={620} style={{ position: 'absolute', bottom: -60, right: -80 }} />
      <DNTRex width={420} style={{ position: 'absolute', top: 200, left: -60, transform: 'scaleX(-1)' }} />

      <div style={{
        position: 'relative', padding: '40px 52px', height: '100%',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 26,
          paddingBottom: 16,
          borderBottom: `2px solid ${DN.ink}`,
        }}>
          <button style={{
            all: 'unset', cursor: 'pointer',
            padding: '8px 14px',
            border: `2px solid ${DN.ink}`,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
            color: DN.ink, fontWeight: 700, letterSpacing: '0.22em',
            background: DN.paperHi,
          }}>← BASE CAMP</button>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
              color: DN.rust, fontWeight: 700, letterSpacing: '0.32em',
            }}>FIELD AGENT · CODENAME T-REX · DIV. PALEO</div>
            <div style={{
              fontFamily: '"Bree Serif", serif', fontWeight: 400,
              fontSize: 90, color: DN.ink, lineHeight: 0.95,
              letterSpacing: '-0.02em', marginTop: 6,
            }}>Spencer's Field Log</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
              color: DN.inkSoft, fontWeight: 600, letterSpacing: '0.18em', marginTop: 6,
            }}>EXPEDITION LOG · DAY 217 · MON 13 MAY 2026 · 07:42 LOCAL</div>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
          }}>
            <DNStamp label="approved by HQ" color={DN.rust} rotate={3} size={11} />
            <DNStamp label="CLASSIFIED" color={DN.olive} rotate={-3} size={11} />
          </div>
        </div>

        {/* Stats banner */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14, paddingTop: 14, paddingBottom: 14,
          borderBottom: `1.5px dashed ${DN.inkMute}`,
        }}>
          <DNStat label="FOSSILS BANKED"  value={agent.balance} unit="pts" />
          <DNStat label="TRAIL STREAK"    value={`▲${agent.streakDays}`} unit="days" accent={DN.amber} />
          <DNStat label="SPECIMENS TODAY" value={own.length} unit="logs" accent={DN.olive} />
          <DNStat label="NEXT BIG DIG"    value="Aquarium" unit="1,200pts" accent={DN.rust} />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: -1, marginTop: 18,
        }}>
          <DNTab label="Field Log" sub="today's specimens" active />
          <DNTab label="Trading Post" sub="rewards" />
          <DNTab label="Catalogue" sub="history" />
          <DNTab label="Site Map" sub="data" />
        </div>

        {/* Body — two columns: specimen list + side panel */}
        <div style={{
          flex: 1, minHeight: 0, marginTop: 0,
          display: 'grid', gridTemplateColumns: '1fr 360px', gap: 22,
          border: `1.5px solid ${DN.ink}`, borderTop: `1.5px solid ${DN.ink}`,
          padding: 18,
          background: `${DN.paperHi}99`,
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 14,
              borderBottom: `1px dashed ${DN.inkMute}`, paddingBottom: 8,
            }}>
              <span style={{
                fontFamily: '"Bree Serif", serif', fontWeight: 400, fontSize: 28,
                color: DN.ink,
              }}>Today's Specimens</span>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                color: DN.inkSoft, fontWeight: 700, letterSpacing: '0.2em',
              }}>· {own.length} TO LOG</span>
            </div>
            {own.slice(0, 4).map((m, i) => (
              <DNSpecimen key={m.id} m={m} num={i + 1} />
            ))}
          </div>

          {/* Side — Field notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <DNNotebook title="Field Notes" subtitle="07:42 · obs.">
              <p style={{
                fontFamily: '"Special Elite", monospace', fontSize: 15,
                color: DN.ink, lineHeight: 1.4, margin: 0,
              }}>Trash detail · breach overnight. Specimen requires recovery before raccoons compromise the site. Recommend immediate action.</p>
              <p style={{
                fontFamily: '"Special Elite", monospace', fontSize: 15,
                color: DN.inkSoft, lineHeight: 1.4, margin: '10px 0 0', fontStyle: 'italic',
              }}>— S. Rathnokan, field lead</p>
            </DNNotebook>

            <DNNotebook title="Trail to Aquarium" subtitle="next major reward">
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                fontWeight: 700, color: DN.inkSoft, letterSpacing: '0.16em',
              }}>
                <span>FOSSILS BANKED</span>
                <span style={{ color: DN.ink }}>{agent.balance} / 1,200</span>
              </div>
              <div style={{
                marginTop: 8, height: 10, background: DN.paperLo,
                border: `1.5px solid ${DN.ink}`,
              }}>
                <div style={{
                  width: `${agent.balance / 1200 * 100}%`, height: '100%',
                  background: `repeating-linear-gradient(45deg, ${DN.amber} 0 6px, ${DN.amberHi} 6px 12px)`,
                }} />
              </div>
              <div style={{
                marginTop: 10, display: 'flex', justifyContent: 'space-between',
              }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <DNFoot key={i} filled={i < Math.floor(agent.balance / 240)} size={22} />
                ))}
              </div>
            </DNNotebook>

            <DNNotebook title="Family unlocks ahead">
              <ul style={{
                margin: 0, padding: 0, listStyle: 'none',
                fontFamily: '"Special Elite", monospace', fontSize: 14,
                color: DN.ink, lineHeight: 1.65,
              }}>
                <li>— Movie Night · 150pts (banked)</li>
                <li>— Pizza Friday · 300pts (family)</li>
                <li>— Stay-up +1 hr · 250pts (weekend)</li>
                <li>— Aquarium · 1,200pts (BIG)</li>
              </ul>
            </DNNotebook>
          </div>
        </div>
      </div>
    </div>
  );
}

function DNStat({ label, value, unit, accent }) {
  return (
    <div style={{
      padding: '8px 14px',
      borderRight: `1px dashed ${DN.inkMute}`,
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: DN.inkMute, letterSpacing: '0.24em', fontWeight: 700,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
        <span style={{
          fontFamily: '"Bree Serif", serif', fontWeight: 400,
          fontSize: 30, color: accent || DN.ink, lineHeight: 1,
        }}>{value}</span>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: DN.inkSoft, fontWeight: 600, letterSpacing: '0.16em',
        }}>{unit}</span>
      </div>
    </div>
  );
}

function DNNotebook({ title, subtitle, children }) {
  return (
    <div style={{
      background: DN.paper,
      border: `1.5px solid ${DN.ink}`,
      padding: 14, position: 'relative',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        paddingBottom: 6, borderBottom: `1px dashed ${DN.inkMute}`, marginBottom: 10,
      }}>
        <span style={{
          fontFamily: '"Bree Serif", serif', fontWeight: 400, fontSize: 19,
          color: DN.ink,
        }}>{title}</span>
        {subtitle && <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          color: DN.inkMute, fontWeight: 700, letterSpacing: '0.22em',
        }}>{subtitle.toUpperCase()}</span>}
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { DNPage });
