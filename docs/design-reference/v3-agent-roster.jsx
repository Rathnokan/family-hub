// V3 · AGENT ROSTER — static direction
// Big illustrated agent cards. Each kid gets a hero card themed by their
// color and codename, with their missions tucked underneath. TCG / agent
// dossier vibe. Same dark spy palette as Mission Control but the chrome
// rebalances around character-first composition.

const C3 = window.FH_PALETTE;

function ARSigil({ color, glyph, size = 84 }) {
  // Hexagonal "agency seal" backdrop with the codename glyph in the center.
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'grid', placeItems: 'center',
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute' }}>
        <polygon points="50,4 92,28 92,72 50,96 8,72 8,28" fill={color} stroke={C3.ink} strokeWidth="2" />
        <polygon points="50,12 84,32 84,68 50,88 16,68 16,32" fill="none" stroke={C3.ink} strokeWidth="1" strokeDasharray="2 3" opacity="0.5"/>
      </svg>
      <span style={{
        position: 'relative',
        fontFamily: '"Bricolage Grotesque", sans-serif',
        fontWeight: 800, fontSize: size * 0.42,
        color: C3.ink,
      }}>{glyph}</span>
    </div>
  );
}

function ARHeroCard({ agent, missions }) {
  const overdueCount = missions.filter(m => m.days_delta < 0).length;
  return (
    <div style={{
      position: 'relative',
      background: `linear-gradient(180deg, ${agent.color}22 0%, ${C3.panel} 30%, ${C3.panel2} 100%)`,
      border: `1px solid ${agent.color}55`,
      borderTop: `3px solid ${agent.color}`,
      borderRadius: 14,
      padding: 18,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Watermark sigil */}
      <div style={{
        position: 'absolute', top: -30, right: -30, opacity: 0.08,
        pointerEvents: 'none',
      }}>
        <ARSigil color={agent.color} glyph={agent.sigil} size={200} />
      </div>

      {/* Top — codename strip */}
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: '0.28em', color: agent.color, fontWeight: 700,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>AGT · {agent.code}</span>
        <span style={{ color: C3.textMute }}>ID-{agent.id.toUpperCase()}</span>
      </div>

      {/* Hero — sigil + name */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginTop: 14,
      }}>
        <ARSigil color={agent.color} glyph={agent.sigil} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 36, color: C3.text, lineHeight: 0.95, letterSpacing: '-0.02em',
          }}>{agent.name}</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            color: C3.textDim, fontWeight: 600, letterSpacing: '0.12em',
            marginTop: 6, textTransform: 'uppercase',
          }}>{agent.kind === 'parent' ? 'HANDLER' : 'FIELD AGENT'}</div>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 10, marginTop: 16,
        padding: '12px 0',
        borderTop: `1px dashed ${C3.stroke}`,
        borderBottom: `1px dashed ${C3.stroke}`,
      }}>
        <ARStat label="BALANCE" value={agent.balance} unit="pts" />
        <ARStat label="STREAK"  value={`▲${agent.streakDays}`} unit="days" accent={agent.streakDays >= 7 ? C3.gold : undefined} />
        <ARStat label="OPEN"    value={missions.length} unit="ops" accent={overdueCount ? C3.red : C3.cyan} />
      </div>

      {/* Mission list */}
      <div style={{
        marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8,
        flex: 1, minHeight: 0,
      }}>
        {missions.slice(0, 3).map(m => (
          <ARMissionItem key={m.id} m={m} agent={agent} />
        ))}
        {missions.length > 3 && (
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: C3.textMute, letterSpacing: '0.18em', fontWeight: 600,
            textAlign: 'center', paddingTop: 6,
          }}>+ {missions.length - 3} MORE</div>
        )}
        {missions.length === 0 && (
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
            fontSize: 16, color: C3.green, textAlign: 'center', padding: '18px 0',
          }}>✓ ALL CLEAR</div>
        )}
      </div>
    </div>
  );
}

function ARStat({ label, value, unit, accent }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
        letterSpacing: '0.22em', color: C3.textMute, fontWeight: 700,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, marginTop: 4 }}>
        <span style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 22, color: accent || C3.text, lineHeight: 1,
        }}>{value}</span>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
          color: C3.textMute, fontWeight: 600, letterSpacing: '0.1em',
        }}>{unit}</span>
      </div>
    </div>
  );
}

function ARMissionItem({ m, agent }) {
  const overdue = m.days_delta < 0;
  const dotsTotal = Math.max(m.streakGoal, 7);
  const dots = Array.from({ length: dotsTotal }, (_, i) => i < m.streakCurrent);
  const atGoal = m.streakCurrent >= m.streakGoal;
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 9,
      background: overdue ? `${C3.red}1A` : `${C3.ink2}AA`,
      border: `1px solid ${overdue ? C3.red + '66' : C3.stroke}`,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
            fontSize: 15, color: C3.text, lineHeight: 1.15,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{m.name}</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
            color: overdue ? C3.red : C3.textMute, fontWeight: 600, letterSpacing: '0.16em',
            marginTop: 2,
          }}>{overdue ? `BREACH · ${Math.abs(m.days_delta)}D` : m.category.toUpperCase()}</div>
        </div>
        <span style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 16, color: C3.gold,
        }}>+{m.points}</span>
        <button style={{
          all: 'unset', cursor: 'pointer',
          width: 32, height: 32, borderRadius: 8,
          background: agent.color, display: 'grid', placeItems: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12L10 17L19 7" stroke={C3.ink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {dots.map((on, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 1,
            background: on ? (atGoal ? C3.gold : agent.color) : C3.stroke,
          }} />
        ))}
      </div>
    </div>
  );
}

function AgentRosterView({ width = 1920, height = 1080 }) {
  const missionsByAgent = window.FH_AGENTS.reduce((acc, a) => {
    acc[a.id] = window.FH_MISSIONS.filter(m => m.assigned === a.id);
    return acc;
  }, {});

  return (
    <div style={{
      width, height,
      background: `
        radial-gradient(ellipse at 50% -10%, ${C3.panel2}, ${C3.ink} 65%),
        ${C3.ink}
      `,
      backgroundColor: C3.ink,
      color: C3.text,
      fontFamily: '"Manrope", system-ui, sans-serif',
      padding: '24px 28px',
      display: 'flex', flexDirection: 'column', gap: 18,
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        paddingBottom: 16, borderBottom: `1px solid ${C3.stroke}`,
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: 11, background: C3.gold,
          display: 'grid', placeItems: 'center',
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          color: C3.ink, fontSize: 24,
        }}>FH</div>
        <div>
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 34, letterSpacing: '-0.02em', lineHeight: 1, color: C3.text,
          }}>AGENT ROSTER</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: '0.32em', color: C3.gold, fontWeight: 700, marginTop: 5,
          }}>OPS DAY 217 · MON · MAY 11 · 07:42 AM</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', gap: 14,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.2em', color: C3.textDim, fontWeight: 600,
        }}>
          <span><span style={{ color: C3.cyan, fontWeight: 800, fontSize: 18, fontFamily: '"Bricolage Grotesque", sans-serif' }}>{window.FH_MISSIONS.length}</span>  LIVE</span>
          <span><span style={{ color: C3.red, fontWeight: 800, fontSize: 18, fontFamily: '"Bricolage Grotesque", sans-serif' }}>{window.FH_APPROVALS.length}</span>  ALERTS</span>
          <span><span style={{ color: C3.gold, fontWeight: 800, fontSize: 18, fontFamily: '"Bricolage Grotesque", sans-serif' }}>{window.FH_CLAIMABLE.length}</span>  OPEN</span>
        </div>
      </div>

      {/* Hero cards grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 16,
        minHeight: 0,
      }}>
        {window.FH_AGENTS.map(a => (
          <ARHeroCard key={a.id} agent={a} missions={missionsByAgent[a.id]} />
        ))}
      </div>

      {/* Bottom strip — open ops + intel alerts */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        <div style={{
          background: C3.panel,
          border: `1px solid ${C3.stroke}`,
          borderRadius: 12, padding: 14,
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: '0.28em', color: C3.cyan, fontWeight: 700, marginBottom: 10,
          }}>// OPEN OPS · UNCLAIMED</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {window.FH_CLAIMABLE.map(c => (
              <div key={c.id} style={{
                padding: '10px 12px', borderRadius: 8,
                background: C3.ink2, border: `1px dashed ${C3.cyan}55`,
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                    color: C3.cyan, fontWeight: 700, letterSpacing: '0.2em',
                  }}>{c.recurrence === 'multi_claim' ? 'MULTI' : 'FCFS'}</span>
                  <span style={{
                    fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
                    fontSize: 17, color: C3.gold,
                  }}>+{c.points}</span>
                </div>
                <div style={{
                  fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
                  fontSize: 14, color: C3.text, lineHeight: 1.15, marginTop: 4,
                }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: C3.panel,
          border: `1px solid ${C3.red}44`,
          borderRadius: 12, padding: 14,
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: '0.28em', color: C3.red, fontWeight: 700, marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 99, background: C3.red,
            }} />
            // INTEL ALERTS · NEEDS APPROVAL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {window.FH_APPROVALS.map(a => {
              const ag = window.FH_BY_ID(a.person);
              return (
                <div key={a.id} style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  padding: '8px 10px', borderRadius: 8,
                  background: `${C3.red}12`, border: `1px solid ${C3.red}33`,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: ag.color, color: C3.ink,
                    display: 'grid', placeItems: 'center',
                    fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 14,
                  }}>{ag.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
                      fontSize: 14, color: C3.text,
                    }}>{a.name}</div>
                    <div style={{
                      fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                      color: C3.textMute, letterSpacing: '0.16em',
                    }}>{ag.code} · +{a.points}PTS · {a.when.toUpperCase()}</div>
                  </div>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                    letterSpacing: '0.16em', color: C3.red, fontWeight: 700,
                  }}>REVIEW →</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AgentRosterView });
