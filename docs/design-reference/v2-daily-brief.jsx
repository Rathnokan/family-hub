// V2 · THE DAILY BRIEF — static direction
// Newsroom intel aesthetic. Cream paper, deep navy ink, red stamps,
// typewriter mono for the tactical bits. Same content as Mission Control
// but rendered as a morning briefing dossier.

const DB = {
  paper:   '#F2E9D6',
  paperLo: '#E8DDC3',
  paperShade: '#DACFB5',
  ink:     '#1C160C',
  rule:    '#1C160C',
  inkSoft: '#5C4F37',
  red:     '#B5301F',
  redHi:   '#D84231',
  gold:    '#C28A2A',
  green:   '#3F7B4A',
  blue:    '#2F5C8C',
};

function StampLabel({ children, color = DB.red, rotate = -3, size = 10 }) {
  return (
    <span style={{
      display: 'inline-block',
      transform: `rotate(${rotate}deg)`,
      padding: '3px 8px',
      border: `2px solid ${color}`,
      borderRadius: 3,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: size, letterSpacing: '0.18em', fontWeight: 800,
      color, textTransform: 'uppercase',
      background: 'transparent',
    }}>{children}</span>
  );
}

function DBStreakStamps({ current, goal }) {
  const dots = Array.from({ length: Math.max(goal, 7) }, (_, i) => i < current);
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {dots.map((on, i) => (
        <span key={i} style={{
          width: 16, height: 16, borderRadius: 99,
          background: on ? DB.ink : 'transparent',
          border: `1.5px solid ${DB.ink}`,
          display: 'grid', placeItems: 'center',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 700,
          color: DB.paper,
        }}>{on ? '✓' : ''}</span>
      ))}
      <span style={{
        marginLeft: 8, fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11, fontWeight: 700, color: DB.ink,
      }}>{current}/{goal}</span>
    </div>
  );
}

function DBMissionEntry({ m, agent, idx, total }) {
  const overdue = m.days_delta < 0;
  return (
    <div style={{
      padding: '14px 0',
      borderBottom: idx === total - 1 ? 'none' : `1px solid ${DB.paperShade}`,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          fontWeight: 700, color: DB.inkSoft, paddingTop: 6,
          minWidth: 30, textAlign: 'right',
        }}>{String(idx + 1).padStart(2, '0')}.</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              fontWeight: 700, color: agent.color, letterSpacing: '0.18em',
            }}>{agent.code}</span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              fontWeight: 600, color: DB.inkSoft, letterSpacing: '0.12em',
            }}>· {agent.name.toUpperCase()}</span>
            {overdue && <StampLabel rotate={-2}>OVERDUE · {Math.abs(m.days_delta)}D</StampLabel>}
            {m.milestoneSoon && <StampLabel rotate={-2} color={DB.gold}>★ MILESTONE READY</StampLabel>}
          </div>
          <div style={{
            fontFamily: '"Bricolage Grotesque", serif', fontWeight: 700,
            fontSize: 26, color: DB.ink, lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}>{m.name}</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 18,
            marginTop: 10, flexWrap: 'wrap',
          }}>
            <DBStreakStamps current={m.streakCurrent} goal={m.streakGoal} />
            {m.penalty > 0 && (
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                fontWeight: 700, color: DB.red, letterSpacing: '0.1em',
              }}>RISK −{m.penalty}pts</span>
            )}
          </div>
        </div>

        {/* Points medal */}
        <div style={{
          textAlign: 'center',
          padding: '8px 12px',
          border: `2px solid ${DB.ink}`,
          borderRadius: 4,
          minWidth: 68,
          background: idx % 2 ? DB.paperLo : DB.paper,
        }}>
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 22, color: DB.ink, lineHeight: 1,
          }}>+{m.points}</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 8,
            color: DB.inkSoft, letterSpacing: '0.2em', marginTop: 2,
          }}>POINTS</div>
        </div>

        {/* MARK COMPLETE checkbox */}
        <div style={{
          width: 48, height: 48, border: `2.5px solid ${DB.ink}`,
          borderRadius: 4, background: DB.paperLo,
          display: 'grid', placeItems: 'center',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9, fontWeight: 700, color: DB.inkSoft, letterSpacing: '0.1em',
        }}>MARK</div>
      </div>
    </div>
  );
}

function DBAgentBadge({ agent }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '10px 14px', minWidth: 110,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: DB.paper,
        border: `3px solid ${agent.color}`,
        display: 'grid', placeItems: 'center',
        fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
        fontSize: 28, color: DB.ink,
        boxShadow: `inset 0 0 0 1px ${DB.ink}33`,
      }}>{agent.name[0]}</div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
        fontWeight: 700, color: agent.color, letterSpacing: '0.2em',
      }}>{agent.code}</div>
      <div style={{
        fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
        fontSize: 14, color: DB.ink,
      }}>{agent.name}</div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: DB.inkSoft, letterSpacing: '0.08em', marginTop: -2,
      }}>{agent.balance}pts · ▲{agent.streakDays}d</div>
    </div>
  );
}

function DailyBrief({ width = 1920, height = 1080 }) {
  const missions = window.FH_MISSIONS;
  const overdue  = missions.filter(m => m.days_delta < 0);
  const today    = missions.filter(m => m.days_delta === 0);
  const byCat    = window.FH_CATEGORIES.map(cat => ({
    cat, items: today.filter(t => t.category === cat),
  })).filter(g => g.items.length);

  return (
    <div style={{
      width, height,
      background: DB.paper,
      backgroundImage: `
        repeating-linear-gradient(0deg, ${DB.paperShade}22 0, ${DB.paperShade}22 1px, transparent 1px, transparent 36px),
        radial-gradient(circle at 8% 10%, ${DB.paperLo}88, transparent 50%),
        radial-gradient(circle at 92% 88%, ${DB.paperLo}88, transparent 50%)
      `,
      color: DB.ink,
      fontFamily: '"Manrope", system-ui, sans-serif',
      padding: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top rule + masthead */}
      <div style={{
        padding: '24px 50px 18px',
        borderBottom: `4px double ${DB.ink}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', marginBottom: 6,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.22em', fontWeight: 700, color: DB.inkSoft,
        }}>
          <span>VOL. V · ISSUE 217</span>
          <span>★ FAMILY HUB ★</span>
          <span>MON · MAY 11 · 2026</span>
        </div>
        <div style={{
          fontFamily: '"Bricolage Grotesque", serif', fontWeight: 800,
          fontSize: 92, letterSpacing: '-0.02em', color: DB.ink,
          textAlign: 'center', lineHeight: 0.95, marginTop: 4,
        }}>The Daily Brief</div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', marginTop: 8,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.18em', fontWeight: 700, color: DB.red,
        }}>
          <span>CLASSIFIED — KITCHEN EYES ONLY</span>
          <span>{missions.length} MISSIONS · {window.FH_APPROVALS.length} ALERTS</span>
          <span>WEATHER: 64°F · LIGHT BREEZE</span>
        </div>
      </div>

      {/* Agents banner */}
      <div style={{
        padding: '14px 50px',
        borderBottom: `1px solid ${DB.ink}`,
        background: DB.paperLo,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", serif', fontWeight: 800,
          fontSize: 14, letterSpacing: '0.32em', color: DB.ink,
          writingMode: 'horizontal-tb', textAlign: 'left',
        }}>AGENTS<br />ON DUTY</div>
        {window.FH_AGENTS.map(a => <DBAgentBadge key={a.id} agent={a} />)}
      </div>

      {/* Body — 2 columns */}
      <div style={{
        padding: '24px 50px',
        display: 'grid', gridTemplateColumns: '1fr 380px',
        gap: 36, height: height - 280,
      }}>
        {/* Left column — missions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
          {overdue.length > 0 && (
            <div>
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 4,
                borderBottom: `2px solid ${DB.red}`, paddingBottom: 4,
              }}>
                <span style={{
                  fontFamily: '"Bricolage Grotesque", serif', fontWeight: 800,
                  fontSize: 28, color: DB.red, letterSpacing: '-0.01em',
                }}>Breach Report</span>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                  color: DB.inkSoft, fontWeight: 700, letterSpacing: '0.18em',
                }}>· {overdue.length} item</span>
              </div>
              {overdue.map((m, i) => (
                <DBMissionEntry key={m.id} m={m} agent={window.FH_BY_ID(m.assigned)} idx={i} total={overdue.length} />
              ))}
            </div>
          )}

          {byCat.map((g, gi) => (
            <div key={g.cat}>
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 4,
                borderBottom: `2px solid ${DB.ink}`, paddingBottom: 4,
              }}>
                <span style={{
                  fontFamily: '"Bricolage Grotesque", serif', fontWeight: 800,
                  fontSize: 28, color: DB.ink, letterSpacing: '-0.01em',
                }}>{g.cat} Detail</span>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                  color: DB.inkSoft, fontWeight: 700, letterSpacing: '0.18em',
                }}>· {g.items.length} active</span>
              </div>
              {g.items.map((m, i) => (
                <DBMissionEntry key={m.id} m={m} agent={window.FH_BY_ID(m.assigned)} idx={i} total={g.items.length} />
              ))}
            </div>
          ))}
        </div>

        {/* Right column — intel + opportunities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{
            border: `2px solid ${DB.ink}`,
            padding: '14px 16px',
            background: DB.paperLo,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -14, left: 14,
              padding: '2px 12px', background: DB.red, color: DB.paper,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              fontWeight: 800, letterSpacing: '0.2em',
            }}>INTEL · PENDING APPROVAL</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
              {window.FH_APPROVALS.map(a => {
                const ag = window.FH_BY_ID(a.person);
                return (
                  <div key={a.id} style={{
                    display: 'flex', gap: 10, alignItems: 'center',
                    paddingBottom: 8, borderBottom: `1px dashed ${DB.paperShade}`,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      border: `2px solid ${ag.color}`,
                      background: DB.paper,
                      display: 'grid', placeItems: 'center',
                      fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
                      fontSize: 14, color: DB.ink,
                    }}>{ag.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: '"Bricolage Grotesque", serif', fontWeight: 700,
                        fontSize: 15, color: DB.ink,
                      }}>{a.name}</div>
                      <div style={{
                        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                        color: DB.inkSoft, letterSpacing: '0.08em',
                      }}>{ag.code} · +{a.points}pts · {a.when}</div>
                    </div>
                    <StampLabel rotate={4}>REVIEW</StampLabel>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            border: `2px solid ${DB.ink}`,
            padding: '14px 16px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -14, left: 14,
              padding: '2px 12px', background: DB.ink, color: DB.paper,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              fontWeight: 800, letterSpacing: '0.2em',
            }}>OPEN OPS · UNCLAIMED</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
              {window.FH_CLAIMABLE.map(c => (
                <div key={c.id} style={{
                  paddingBottom: 10, borderBottom: `1px dashed ${DB.paperShade}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                    <div style={{
                      fontFamily: '"Bricolage Grotesque", serif', fontWeight: 700,
                      fontSize: 17, color: DB.ink, lineHeight: 1.1,
                    }}>{c.name}</div>
                    <div style={{
                      fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
                      fontSize: 20, color: DB.red,
                    }}>+{c.points}</div>
                  </div>
                  <div style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                    color: DB.inkSoft, letterSpacing: '0.1em', marginTop: 4,
                  }}>{c.recurrence === 'multi_claim' ? 'MULTI-CLAIM · SPLIT' : 'FIRST IN WINS'} · {c.note.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: 'auto',
            textAlign: 'center',
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: DB.inkSoft, letterSpacing: '0.24em', fontWeight: 700,
          }}>— FILED BY HQ · 07:42 LOCAL —</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DailyBrief });
