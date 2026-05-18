// Theme: ENGINEER (Civil) — Jim's page.
// Blueprint drawing sheet aesthetic. Deep cyanotype blue background with a
// fine drafting grid; everything else is white/cream ink. Each chore is
// rendered as a "work order" callout with a drawing number, spec line,
// dimensional callouts, and a stamp-style approval button.

const ENG = {
  paper:    '#0E3A5C',         // deep blueprint blue
  paperHi:  '#155078',
  grid:     '#3C7AA5',
  ink:      '#F2EBD6',         // warm cream "ink"
  inkDim:   '#C9C0A2',
  inkMute:  '#8A8669',
  red:      '#E07A4C',         // redlines / approvals
  amber:    '#E0B84C',
  panel:    '#0B2D48',
};

function EngineerGrid() {
  // Drafting grid — major + minor — built with two layered repeating
  // gradients. Major lines every 80px, minor every 16px.
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(to right,  ${ENG.grid}22 1px, transparent 1px),
        linear-gradient(to bottom, ${ENG.grid}22 1px, transparent 1px),
        linear-gradient(to right,  ${ENG.grid}55 1.5px, transparent 1.5px),
        linear-gradient(to bottom, ${ENG.grid}55 1.5px, transparent 1.5px)
      `,
      backgroundSize: '16px 16px, 16px 16px, 80px 80px, 80px 80px',
    }} />
  );
}

function EngineerTab({ label, active, sub }) {
  return (
    <div style={{
      padding: '10px 18px',
      borderLeft: `1.5px solid ${ENG.ink}`,
      borderTop:  `1.5px solid ${ENG.ink}`,
      borderRight: `1.5px solid ${ENG.ink}`,
      borderRadius: '8px 8px 0 0',
      background: active ? ENG.ink : 'transparent',
      color: active ? ENG.paper : ENG.ink,
      fontFamily: '"JetBrains Mono", monospace', fontSize: 13,
      fontWeight: 700, letterSpacing: '0.18em',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      minWidth: 140,
    }}>
      <span>{label}</span>
      {sub && <span style={{ fontSize: 9, opacity: 0.7, letterSpacing: '0.16em' }}>{sub}</span>}
    </div>
  );
}

function EngineerWorkOrder({ m, idx }) {
  const overdue = m.days_delta < 0;
  const dotsTotal = Math.max(m.streakGoal, 7);
  const dots = Array.from({ length: dotsTotal }, (_, i) => i < m.streakCurrent);
  return (
    <div style={{
      position: 'relative',
      padding: '20px 22px 18px',
      border: `1.5px solid ${ENG.ink}`,
      background: `${ENG.panel}88`,
      borderRadius: 4,
      display: 'flex', gap: 20, alignItems: 'center',
    }}>
      {/* Drawing # tag (top-left corner notch) */}
      <div style={{
        position: 'absolute', top: -1, left: 18,
        transform: 'translateY(-50%)',
        background: ENG.paper, padding: '0 8px',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: ENG.ink, fontWeight: 700, letterSpacing: '0.2em',
      }}>WO-{String(idx + 1).padStart(3, '0')} · {m.category.toUpperCase()}</div>

      {/* Icon as a technical line drawing */}
      <div style={{
        width: 72, height: 72,
        border: `1.5px solid ${ENG.ink}`,
        display: 'grid', placeItems: 'center',
        color: ENG.ink,
        position: 'relative',
        flexShrink: 0,
      }}>
        <ChoreIcon name={m.icon} size={40} strokeWidth={1.5} />
        {/* corner ticks */}
        {['tl','tr','bl','br'].map(p => (
          <span key={p} style={{
            position: 'absolute',
            width: 6, height: 6, borderColor: ENG.ink, borderStyle: 'solid',
            ...(p==='tl' && { top: -1, left: -1, borderWidth: '1.5px 0 0 1.5px' }),
            ...(p==='tr' && { top: -1, right: -1, borderWidth: '1.5px 1.5px 0 0' }),
            ...(p==='bl' && { bottom: -1, left: -1, borderWidth: '0 0 1.5px 1.5px' }),
            ...(p==='br' && { bottom: -1, right: -1, borderWidth: '0 1.5px 1.5px 0' }),
          }} />
        ))}
      </div>

      {/* Title + specs */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", serif', fontWeight: 700,
          fontSize: 26, color: ENG.ink, lineHeight: 1.05,
          letterSpacing: '-0.01em', textTransform: 'uppercase',
        }}>{m.name}</div>

        {/* Dimensional callout — drafting style with arrows */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18, marginTop: 12,
        }}>
          <DimensionLine label={`${m.streakCurrent} of ${m.streakGoal} cycles`} accent={ENG.amber}>
            <div style={{ display: 'flex', gap: 3, flex: 1 }}>
              {dots.map((on, i) => (
                <div key={i} style={{
                  flex: 1, height: 8,
                  background: on ? ENG.ink : 'transparent',
                  border: `1px solid ${ENG.ink}`,
                }} />
              ))}
            </div>
          </DimensionLine>

          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            color: ENG.inkDim, fontWeight: 600, letterSpacing: '0.1em',
          }}>
            {overdue ? <span style={{ color: ENG.red }}>· REDLINE {Math.abs(m.days_delta)}D ·</span>
                     : <span>· SCHEDULED ·</span>}
            {m.penalty > 0 && <span style={{ color: ENG.red, marginLeft: 10 }}>RISK −{m.penalty}pts</span>}
          </div>
        </div>
      </div>

      {/* Points medal — drawing approval stamp */}
      <div style={{
        textAlign: 'center', padding: '10px 14px',
        border: `1.5px solid ${ENG.amber}`,
        color: ENG.amber,
        minWidth: 84,
      }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 30, lineHeight: 1,
        }}>+{m.points}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          letterSpacing: '0.22em', marginTop: 3,
        }}>POINTS</div>
      </div>

      {/* APPROVAL stamp button */}
      <button style={{
        all: 'unset', cursor: 'pointer',
        width: 78, height: 78,
        border: `2.5px solid ${ENG.red}`,
        color: ENG.red,
        display: 'grid', placeItems: 'center',
        transform: 'rotate(-4deg)',
        fontFamily: '"JetBrains Mono", monospace', fontWeight: 800,
        fontSize: 11, letterSpacing: '0.16em', textAlign: 'center',
        position: 'relative',
        background: `${ENG.red}11`,
      }}>
        <div>
          MARK<br />COMPLETE
        </div>
      </button>
    </div>
  );
}

function DimensionLine({ label, children, accent }) {
  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          width: 0, height: 0,
          borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
          borderRight: `6px solid ${ENG.ink}`,
        }} />
        {children}
        <span style={{
          width: 0, height: 0,
          borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
          borderLeft: `6px solid ${ENG.ink}`,
        }} />
      </div>
      <div style={{
        textAlign: 'center', marginTop: 2,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: accent || ENG.inkDim, fontWeight: 700, letterSpacing: '0.18em',
      }}>{label}</div>
    </div>
  );
}

function EngineerTitleBlock({ agent }) {
  return (
    <div style={{
      border: `1.5px solid ${ENG.ink}`,
      color: ENG.ink,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 11, letterSpacing: '0.12em',
      minWidth: 380,
    }}>
      <div style={{
        padding: '6px 10px', borderBottom: `1.5px solid ${ENG.ink}`,
        fontFamily: '"Bricolage Grotesque", serif', fontWeight: 800,
        fontSize: 16, letterSpacing: '0.04em',
      }}>RATHNOKAN HOUSEHOLD · CIVIL DIV.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Cell label="DRAWN BY"  value={agent.name.toUpperCase()} />
        <Cell label="DATE"      value="2026-05-13" />
        <Cell label="SHEET"     value="01 / 04" />
        <Cell label="SCALE"     value="N.T.S." />
        <Cell label="REV"       value="C" />
        <Cell label="STATUS"    value="ISSUED FOR WORK" accent={ENG.amber} />
      </div>
    </div>
  );
}
function Cell({ label, value, accent }) {
  return (
    <div style={{
      padding: '6px 10px', borderRight: `1px solid ${ENG.ink}55`, borderBottom: `1px solid ${ENG.ink}55`,
      fontFamily: '"JetBrains Mono", monospace',
    }}>
      <div style={{ fontSize: 9, color: ENG.inkMute, letterSpacing: '0.22em', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 12, color: accent || ENG.ink, fontWeight: 700, letterSpacing: '0.08em', marginTop: 2 }}>{value}</div>
    </div>
  );
}

function EngineerPage({ width = 1920, height = 1080 }) {
  const agent = window.FH_BY_ID('jim');
  const missions = window.FH_MISSIONS.filter(m => m.assigned === 'jim');
  // Pad missions so the page reads as substantive
  const pad = window.FH_MISSIONS.filter(m => m.assigned !== 'jim').slice(0, 2).map(m => ({ ...m, assigned: 'jim', points: m.points }));
  const all = [...missions, ...pad];

  return (
    <div style={{
      width, height,
      background: ENG.paper, color: ENG.ink,
      fontFamily: '"Manrope", system-ui, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      <EngineerGrid />

      {/* Title border — drawing sheet frame */}
      <div style={{ position: 'absolute', inset: 18, border: `1.5px solid ${ENG.ink}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 28, border: `1px solid ${ENG.ink}66`, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', padding: 50, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Top strip — back button + agent identity */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 24, paddingBottom: 18,
          borderBottom: `1.5px solid ${ENG.ink}`,
        }}>
          <button style={{
            all: 'unset', cursor: 'pointer',
            padding: '8px 14px', border: `1.5px solid ${ENG.ink}`,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.22em', color: ENG.ink,
          }}>← HOME</button>

          <div style={{
            width: 76, height: 76, borderRadius: 0,
            border: `2px solid ${ENG.ink}`,
            display: 'grid', placeItems: 'center',
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 40, color: ENG.ink,
            position: 'relative',
          }}>
            J
            <span style={{
              position: 'absolute', top: -8, right: -8,
              width: 16, height: 16,
              background: ENG.amber,
              border: `1.5px solid ${ENG.ink}`,
              transform: 'rotate(45deg)',
            }} />
          </div>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              letterSpacing: '0.32em', color: ENG.amber, fontWeight: 700,
            }}>P.E. · AGT NIGHT-OWL · DIV. PARENT</div>
            <div style={{
              fontFamily: '"Bricolage Grotesque", serif', fontWeight: 800,
              fontSize: 56, color: ENG.ink, lineHeight: 0.95, letterSpacing: '-0.02em',
              textTransform: 'uppercase', marginTop: 4,
            }}>Jim · Work Orders</div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Headline stats — drafting callouts */}
          <div style={{ display: 'flex', gap: 28 }}>
            <Callout label="BALANCE" value={agent.balance} unit="pts" />
            <Callout label="STREAK"  value={`▲${agent.streakDays}`} unit="days" />
            <Callout label="OPEN W.O."   value={all.length} unit="orders" accent={ENG.amber} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, paddingTop: 18 }}>
          <EngineerTab label="WORK ORDERS"  sub="primary" active />
          <EngineerTab label="REWARDS"      sub="exchange" />
          <EngineerTab label="AS-BUILTS"    sub="history" />
          <EngineerTab label="REPORT"       sub="data" />
        </div>
        <div style={{ height: 1.5, background: ENG.ink, marginBottom: 22 }} />

        {/* Section legend */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: 14, marginBottom: 16,
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
            letterSpacing: '0.32em', color: ENG.amber, fontWeight: 700,
          }}>// SHEET A-101 · ISSUED FOR CONSTRUCTION</div>
          <div style={{
            display: 'flex', gap: 14,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: ENG.inkMute, fontWeight: 600, letterSpacing: '0.18em',
          }}>
            <span>◇ APPROVAL STAMP TO COMPLETE</span>
            <span>· DIMENSIONS IN POINTS</span>
            <span>· DO NOT SCALE</span>
          </div>
        </div>

        {/* Work order list */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', gap: 14,
          overflow: 'hidden', minHeight: 0,
        }}>
          {all.slice(0, 4).map((m, i) => (
            <EngineerWorkOrder key={m.id + i} m={m} idx={i} />
          ))}
        </div>

        {/* Title block bottom-right */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginTop: 16,
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: ENG.inkMute, fontWeight: 600, letterSpacing: '0.24em',
          }}>FILE · /WORK_ORDERS/2026-05-13.dwg · LAST PLOT 07:42 LOCAL</div>
          <EngineerTitleBlock agent={agent} />
        </div>
      </div>
    </div>
  );
}

function Callout({ label, value, unit, accent }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: ENG.inkMute, fontWeight: 700, letterSpacing: '0.24em',
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 6, marginTop: 2 }}>
        <span style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 36, color: accent || ENG.ink, lineHeight: 1,
        }}>{value}</span>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: ENG.inkMute, fontWeight: 600, letterSpacing: '0.16em',
        }}>{unit}</span>
      </div>
    </div>
  );
}

Object.assign(window, { EngineerPage });
