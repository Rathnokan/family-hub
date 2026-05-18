// V1 · MISSION CONTROL — the interactive prototype.
// Family Hub Command Center reimagined as a tactical ops board for the
// kitchen Echo Show 15. Designed for across-the-room glanceability with
// a "playful but grown-up" mission/spy aesthetic.
//
// Layout (1920 x 1080):
//   ┌─────────────────────────────────────────────────────────────────────┐
//   │ HQ HEADER  · clock · day-of-op · status                             │
//   ├──────────────────────────────────────┬──────────────────────────────┤
//   │ AGENT ROSTER (5 codenamed agents)    │ INTEL ALERTS (approvals)     │
//   ├──────────────────────────────────────┤                              │
//   │ TODAY'S MISSIONS grouped by category │ OPEN OPS (claimable)         │
//   │   · breach alerts (overdue)          │                              │
//   │   · category groups                  │ HQ FOOTER · last sync        │
//   └──────────────────────────────────────┴──────────────────────────────┘

const { useState, useEffect, useRef, useMemo } = React;
const C = window.FH_PALETTE;

// —— Tiny helpers ————————————————————————————————————————————————————————
const fmtClock = (d) => {
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;
};
const fmtDate = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

// Corner-bracket panel — the "tactical" frame used everywhere.
function Bracketed({ children, style, accent = C.gold, label, sub, dense = false, pad = 22 }) {
  return (
    <div style={{
      position: 'relative',
      background: C.panel,
      border: `1px solid ${C.stroke}`,
      borderRadius: 14,
      padding: pad,
      ...style,
    }}>
      {label && (
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: dense ? 10 : 16,
        }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em',
            color: accent, fontWeight: 700,
          }}>// {label}</span>
          {sub && <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.18em',
            color: C.textMute, fontWeight: 500, textTransform: 'uppercase',
          }}>{sub}</span>}
        </div>
      )}
      {/* corner brackets */}
      <Bracket pos="tl" color={accent} />
      <Bracket pos="tr" color={accent} />
      <Bracket pos="bl" color={accent} />
      <Bracket pos="br" color={accent} />
      {children}
    </div>
  );
}
function Bracket({ pos, color }) {
  const size = 14, t = 2;
  const off = -1;
  const s = { position: 'absolute', width: size, height: size, pointerEvents: 'none' };
  if (pos === 'tl') Object.assign(s, { top: off, left: off, borderTop: `${t}px solid ${color}`, borderLeft: `${t}px solid ${color}`, borderTopLeftRadius: 14 });
  if (pos === 'tr') Object.assign(s, { top: off, right: off, borderTop: `${t}px solid ${color}`, borderRight: `${t}px solid ${color}`, borderTopRightRadius: 14 });
  if (pos === 'bl') Object.assign(s, { bottom: off, left: off, borderBottom: `${t}px solid ${color}`, borderLeft: `${t}px solid ${color}`, borderBottomLeftRadius: 14 });
  if (pos === 'br') Object.assign(s, { bottom: off, right: off, borderBottom: `${t}px solid ${color}`, borderRight: `${t}px solid ${color}`, borderBottomRightRadius: 14 });
  return <div style={s} />;
}

// —— HEADER ————————————————————————————————————————————————————————————
function HQHeader({ now, missionCount, alertCount }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 28,
      padding: '18px 26px', background: C.ink2,
      borderBottom: `1px solid ${C.stroke}`,
    }}>
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, background: C.gold,
          display: 'grid', placeItems: 'center',
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          color: C.ink, fontSize: 22,
          boxShadow: `0 0 0 4px ${C.ink2}, 0 0 0 5px ${C.gold}`,
        }}>FH</div>
        <div>
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 26, letterSpacing: '-0.01em', lineHeight: 1, color: C.text,
          }}>FAMILY HUB</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: '0.32em', color: C.gold, fontWeight: 700, marginTop: 4,
          }}>OPERATIONS · COMMAND</div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Stats strip */}
      <HQStat label="MISSIONS LIVE" value={missionCount} accent={C.cyan} />
      <HQStat label="INTEL ALERTS" value={alertCount} accent={alertCount > 0 ? C.red : C.green} pulse={alertCount > 0} />
      <HQStat label="OPS DAY" value="217" accent={C.gold} />
      <HQClock now={now} />
    </div>
  );
}
function HQStat({ label, value, accent, pulse }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      borderLeft: `1px solid ${C.stroke}`, paddingLeft: 22, height: 48, justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: '0.24em', color: C.textMute, fontWeight: 600,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
        {pulse && <span style={{
          width: 8, height: 8, borderRadius: 99, background: accent,
          boxShadow: `0 0 0 0 ${accent}`, animation: 'fh-pulse 1.4s infinite',
        }} />}
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
          fontSize: 28, lineHeight: 1, color: accent,
        }}>{value}</div>
      </div>
    </div>
  );
}
function HQClock({ now }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      borderLeft: `1px solid ${C.stroke}`, paddingLeft: 22, height: 48, justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: '0.24em', color: C.textMute, fontWeight: 600,
      }}>{fmtDate(now).toUpperCase()}</div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontWeight: 700,
        fontSize: 26, lineHeight: 1, color: C.text, marginTop: 2,
        fontVariantNumeric: 'tabular-nums',
      }}>{fmtClock(now)}</div>
    </div>
  );
}

// —— AGENT ROSTER ——————————————————————————————————————————————————————
function AgentRoster({ filter, setFilter, agents, missionsByAgent, approvalsByAgent }) {
  return (
    <Bracketed label="AGENT ROSTER" sub={`${agents.length} on duty`} pad={18} dense>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {agents.map(a => (
          <AgentCard
            key={a.id}
            a={a}
            active={filter === a.id}
            anyFilter={!!filter}
            missions={missionsByAgent[a.id] || 0}
            alerts={approvalsByAgent[a.id] || 0}
            onClick={() => setFilter(filter === a.id ? null : a.id)}
          />
        ))}
      </div>
    </Bracketed>
  );
}
function AgentCard({ a, active, anyFilter, missions, alerts, onClick }) {
  const dim = anyFilter && !active;
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      position: 'relative', padding: 14, borderRadius: 11,
      background: active ? `linear-gradient(180deg, ${a.color}22, ${C.panel2})` : C.panel2,
      border: `1px solid ${active ? a.color : C.stroke}`,
      transition: 'all .18s',
      opacity: dim ? 0.4 : 1,
      boxShadow: active ? `0 0 0 1px ${a.color}, 0 0 24px ${a.color}30` : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: a.color, color: C.ink,
          display: 'grid', placeItems: 'center',
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 22, position: 'relative',
        }}>
          {a.name[0]}
          {alerts > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 16, height: 16, borderRadius: 99,
              background: C.red, color: C.text,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700,
              display: 'grid', placeItems: 'center',
              border: `2px solid ${C.panel2}`,
            }}>{alerts}</span>
          )}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            letterSpacing: '0.22em', color: a.color, fontWeight: 700,
          }}>AGT · {a.code}</div>
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
            fontSize: 18, color: C.text, lineHeight: 1.1, marginTop: 2,
          }}>{a.name}</div>
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 12, paddingTop: 10, borderTop: `1px dashed ${C.stroke}`,
      }}>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: C.textDim, fontWeight: 600, letterSpacing: '0.08em',
        }}>{a.balance}<span style={{ color: C.textMute, marginLeft: 4 }}>pts</span></span>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: a.streakDays >= 7 ? C.gold : C.textDim, fontWeight: 700,
        }}>
          <span style={{ fontSize: 13 }}>▲</span>{a.streakDays}d
        </span>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: missions > 0 ? C.cyan : C.textMute, fontWeight: 600, letterSpacing: '0.08em',
        }}>{missions} OPEN</span>
      </div>
    </button>
  );
}

// —— MISSION ROW ————————————————————————————————————————————————————————
// Streak bar = segmented dots that fill as days complete. When streakCurrent
// >= streakGoal, the next completion fires a milestone (bonus pts).
function StreakBar({ current, goal, color }) {
  const max = Math.max(goal, 7);
  const segs = Array.from({ length: max }, (_, i) => i < (current % max || (current && current === max ? max : current)));
  // simpler: just show current/goal capped at max
  const dots = Array.from({ length: max }, (_, i) => i < Math.min(current, max));
  const atGoal = current >= goal && current > 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 138 }}>
      <div style={{ display: 'flex', gap: 3, flex: 1 }}>
        {dots.map((on, i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 2,
            background: on ? (atGoal ? C.gold : color) : C.stroke,
            boxShadow: on && atGoal ? `0 0 6px ${C.gold}99` : 'none',
            transition: 'all .25s',
          }} />
        ))}
      </div>
      <span style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: atGoal ? C.gold : C.textDim, fontWeight: 700, letterSpacing: '0.04em',
        minWidth: 26, textAlign: 'right',
      }}>{current}/{goal}</span>
    </div>
  );
}

function MissionRow({ m, agent, completing, onComplete }) {
  const overdue = m.days_delta < 0;
  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center', gap: 18,
      padding: '14px 18px',
      background: completing ? `linear-gradient(90deg, ${agent.color}33, ${C.panel2})` : C.panel2,
      border: `1px solid ${overdue ? C.red + '66' : C.stroke}`,
      borderLeft: `4px solid ${overdue ? C.red : agent.color}`,
      borderRadius: 10,
      transition: 'all .35s cubic-bezier(.2,.7,.3,1)',
      opacity: completing ? 0.5 : 1,
      transform: completing ? 'translateX(8px)' : 'none',
    }}>
      {/* Agent badge */}
      <div style={{
        width: 38, height: 38, borderRadius: 9,
        background: agent.color, color: C.ink,
        display: 'grid', placeItems: 'center',
        fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
        fontSize: 18, flexShrink: 0,
      }}>{agent.name[0]}</div>

      {/* Name + codename */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.22em', color: agent.color, fontWeight: 700,
        }}>{agent.code} · OP-{m.id.toUpperCase()}</div>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
          fontSize: 22, color: C.text, lineHeight: 1.1, marginTop: 3,
        }}>{m.name}</div>
        {m.penalty > 0 && (
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: C.textMute, fontWeight: 600, marginTop: 4, letterSpacing: '0.08em',
          }}>RISK: −{m.penalty}pts IF SKIPPED</div>
        )}
      </div>

      {/* Streak bar */}
      <StreakBar current={m.streakCurrent} goal={m.streakGoal} color={agent.color} />

      {/* Status badge */}
      {overdue ? (
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.16em', color: C.red, fontWeight: 700,
          padding: '5px 10px', borderRadius: 6,
          background: `${C.red}1A`, border: `1px solid ${C.red}55`,
          minWidth: 84, textAlign: 'center',
        }}>BREACH · {Math.abs(m.days_delta)}D</div>
      ) : m.resetSoon ? (
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.14em', color: C.gold, fontWeight: 700,
          padding: '5px 10px', borderRadius: 6,
          background: `${C.gold}1A`, border: `1px solid ${C.gold}55`,
          minWidth: 84, textAlign: 'center',
        }}>RESETS 1D</div>
      ) : m.milestoneSoon ? (
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.14em', color: C.gold, fontWeight: 700,
          padding: '5px 10px', borderRadius: 6,
          background: `${C.gold}1A`, border: `1px solid ${C.gold}55`,
          minWidth: 84, textAlign: 'center',
        }}>★ MILESTONE</div>
      ) : (
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          letterSpacing: '0.14em', color: C.textMute, fontWeight: 600,
          padding: '5px 10px', minWidth: 84, textAlign: 'center',
        }}>ACTIVE</div>
      )}

      {/* Points medal */}
      <div style={{
        display: 'grid', placeItems: 'center',
        width: 58, height: 42,
        background: C.ink2,
        border: `1px solid ${C.stroke}`,
        borderRadius: 8,
        position: 'relative',
      }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 20, color: C.gold, lineHeight: 1,
        }}>+{m.points}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 8,
          color: C.textMute, letterSpacing: '0.18em', marginTop: 2,
        }}>PTS</div>
      </div>

      {/* GO button */}
      <button onClick={() => onComplete(m)} style={{
        all: 'unset', cursor: 'pointer',
        width: 60, height: 60, borderRadius: 14,
        background: agent.color,
        display: 'grid', placeItems: 'center',
        boxShadow: `inset 0 -3px 0 ${C.ink}33, 0 4px 12px ${agent.color}55`,
        transition: 'transform .15s',
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(.92)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 12L10 17L19 7" stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// —— OPEN OPS (claimable) ——————————————————————————————————————————————
function OpenOps({ claimable }) {
  return (
    <Bracketed label="OPEN OPS" sub="unclaimed · first in wins" accent={C.cyan} pad={18} dense>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {claimable.map(c => (
          <div key={c.id} style={{
            position: 'relative',
            padding: '12px 14px', borderRadius: 10,
            background: C.panel2,
            border: `1px dashed ${C.cyan}55`,
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
              letterSpacing: '0.22em', color: C.cyan, fontWeight: 700,
            }}>{c.recurrence === 'multi_claim' ? 'MULTI · OP-' : 'FCFS · OP-'}{c.id.toUpperCase()}</div>
            <div style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
              fontSize: 17, color: C.text, lineHeight: 1.15, marginTop: 4,
            }}>{c.name}</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: C.textMute, marginTop: 4,
            }}>{c.note}</div>
            <div style={{
              position: 'absolute', top: 12, right: 12,
              padding: '4px 8px', borderRadius: 6,
              background: C.cyan, color: C.ink,
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 13,
            }}>+{c.points}</div>
          </div>
        ))}
      </div>
    </Bracketed>
  );
}

// —— INTEL ALERTS (approval queue) ——————————————————————————————————————
function IntelAlerts({ approvals }) {
  if (!approvals.length) return null;
  return (
    <Bracketed label="INTEL ALERTS" sub={`${approvals.length} need approval`} accent={C.red} pad={18} dense>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {approvals.map(a => {
          const agent = window.FH_BY_ID(a.person);
          return (
            <div key={a.id} style={{
              display: 'flex', gap: 12, alignItems: 'center',
              padding: '10px 12px', borderRadius: 10,
              background: `${C.red}10`,
              border: `1px solid ${C.red}44`,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: agent.color, color: C.ink,
                display: 'grid', placeItems: 'center',
                fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 16,
              }}>{agent.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                  letterSpacing: '0.22em', color: agent.color, fontWeight: 700,
                }}>{agent.code}</div>
                <div style={{
                  fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
                  fontSize: 14, color: C.text, lineHeight: 1.2,
                }}>{a.name}</div>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                  color: C.textMute, marginTop: 2,
                }}>+{a.points}pts · {a.when}</div>
              </div>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                letterSpacing: '0.16em', color: C.red, fontWeight: 700,
              }}>REVIEW</span>
            </div>
          );
        })}
      </div>
    </Bracketed>
  );
}

// —— CELEBRATION OVERLAY ———————————————————————————————————————————————
function Celebration({ event, onDone }) {
  useEffect(() => {
    if (!event) return;
    const t = setTimeout(onDone, event.kind === 'milestone' ? 2600 : 1400);
    return () => clearTimeout(t);
  }, [event]);
  if (!event) return null;
  const isMilestone = event.kind === 'milestone';
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      display: 'grid', placeItems: 'center', zIndex: 50,
    }}>
      {/* backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isMilestone
          ? `radial-gradient(circle at center, ${C.gold}33 0%, transparent 60%)`
          : `radial-gradient(circle at ${event.x}px ${event.y}px, ${event.color}22 0%, transparent 30%)`,
        animation: 'fh-fade .5s ease-out',
      }} />
      <div style={{
        textAlign: 'center',
        animation: 'fh-pop .5s cubic-bezier(.2,1.7,.3,1)',
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 14,
          letterSpacing: '0.4em', color: isMilestone ? C.gold : event.color, fontWeight: 700,
        }}>
          {isMilestone ? '★ MILESTONE UNLOCKED ★' : 'MISSION COMPLETE'}
        </div>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: isMilestone ? 92 : 64,
          color: isMilestone ? C.gold : event.color,
          lineHeight: 1, marginTop: 16,
          textShadow: isMilestone ? `0 0 60px ${C.gold}77` : 'none',
        }}>
          +{event.points}<span style={{ fontSize: isMilestone ? 32 : 24, marginLeft: 8, color: C.text }}>pts</span>
        </div>
        {isMilestone && (
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
            fontSize: 22, color: C.text, marginTop: 10,
          }}>{event.agent} · {event.streak}-DAY STREAK</div>
        )}
      </div>
      {/* confetti / particles for milestones */}
      {isMilestone && Array.from({ length: 24 }).map((_, i) => (
        <span key={i} style={{
          position: 'absolute', width: 8, height: 8,
          background: [C.gold, C.cyan, C.green, event.color][i % 4],
          borderRadius: i % 2 ? 99 : 2,
          left: '50%', top: '50%',
          animation: `fh-confetti-${i % 6} 1.6s cubic-bezier(.2,.7,.3,1) forwards`,
        }} />
      ))}
    </div>
  );
}

// —— MAIN ———————————————————————————————————————————————————————————————
function MissionControl({ interactive = true, width = 1920, height = 1080 }) {
  const [now, setNow] = useState(new Date(2026, 4, 11, 7, 42, 0));
  const [filter, setFilter] = useState(null);  // agent id or null
  const [completedIds, setCompletedIds] = useState(new Set());
  const [flashing, setFlashing] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (!interactive) return;
    const t = setInterval(() => setNow(prev => new Date(prev.getTime() + 60000)), 60000);
    return () => clearInterval(t);
  }, [interactive]);

  const liveMissions = window.FH_MISSIONS.filter(m => !completedIds.has(m.id));
  const filtered = filter ? liveMissions.filter(m => m.assigned === filter) : liveMissions;
  const overdue = filtered.filter(m => m.days_delta < 0);
  const today   = filtered.filter(m => m.days_delta === 0);

  // Group today by category in admin order
  const groups = window.FH_CATEGORIES.map(cat => ({
    cat, items: today.filter(t => t.category === cat),
  })).filter(g => g.items.length);

  const missionsByAgent = liveMissions.reduce((acc, m) => {
    acc[m.assigned] = (acc[m.assigned] || 0) + 1; return acc;
  }, {});
  const approvalsByAgent = window.FH_APPROVALS.reduce((acc, a) => {
    acc[a.person] = (acc[a.person] || 0) + 1; return acc;
  }, {});

  const handleComplete = (m) => {
    if (!interactive) return;
    const agent = window.FH_BY_ID(m.assigned);
    setFlashing(m.id);
    setTimeout(() => {
      setCompletedIds(prev => new Set([...prev, m.id]));
      setFlashing(null);
      // milestone if at streakGoal
      const isMilestone = m.streakCurrent + 1 >= m.streakGoal && m.streakGoal > 1;
      setCelebration({
        kind: isMilestone ? 'milestone' : 'complete',
        points: isMilestone ? m.points + 25 : m.points,
        color: agent.color,
        agent: agent.name,
        streak: m.streakCurrent + 1,
        x: width / 2, y: height / 2,
      });
    }, 320);
  };

  return (
    <div ref={stageRef} style={{
      position: 'relative',
      width, height,
      background: `radial-gradient(ellipse at 20% 0%, ${C.panel} 0%, ${C.ink} 70%)`,
      color: C.text,
      fontFamily: '"Manrope", system-ui, sans-serif',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <FHStyles />
      <HQHeader now={now} missionCount={liveMissions.length} alertCount={window.FH_APPROVALS.length} />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 420px', gap: 18, padding: 20, minHeight: 0 }}>
        {/* LEFT — agents + missions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          <AgentRoster
            filter={filter} setFilter={setFilter}
            agents={window.FH_AGENTS}
            missionsByAgent={missionsByAgent}
            approvalsByAgent={approvalsByAgent}
          />

          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', gap: 14,
            overflow: 'hidden',
          }}>
            {overdue.length > 0 && (
              <div>
                <SectionHeader label="BREACH ALERT" sub={`${overdue.length} mission${overdue.length > 1 ? 's' : ''} past reset`} accent={C.red} pulse />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {overdue.map(m => (
                    <MissionRow key={m.id} m={m} agent={window.FH_BY_ID(m.assigned)}
                      completing={flashing === m.id} onComplete={handleComplete} />
                  ))}
                </div>
              </div>
            )}
            {groups.map(g => (
              <div key={g.cat}>
                <SectionHeader label={g.cat.toUpperCase()} sub={`${g.items.length} active`} accent={C.gold} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {g.items.map(m => (
                    <MissionRow key={m.id} m={m} agent={window.FH_BY_ID(m.assigned)}
                      completing={flashing === m.id} onComplete={handleComplete} />
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <Bracketed label="ALL CLEAR" accent={C.green} pad={32}>
                <div style={{
                  textAlign: 'center', padding: '40px 0',
                  fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
                  fontSize: 36, color: C.green,
                }}>✓ ALL MISSIONS COMPLETE</div>
                <div style={{
                  textAlign: 'center', fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 12, letterSpacing: '0.24em', color: C.textMute,
                }}>HQ STANDING DOWN · NICE WORK</div>
              </Bracketed>
            )}
          </div>
        </div>

        {/* RIGHT — intel + open ops */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0, overflow: 'hidden' }}>
          <IntelAlerts approvals={window.FH_APPROVALS} />
          <OpenOps claimable={window.FH_CLAIMABLE} />

          {/* HQ footer / status strip */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{
              padding: '12px 14px', borderRadius: 10,
              background: C.ink2, border: `1px solid ${C.stroke}`,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: C.textMute, letterSpacing: '0.16em', lineHeight: 1.7,
            }}>
              <div><span style={{ color: C.green }}>●</span> LINK · STABLE</div>
              <div>SYNC · {fmtClock(now)}</div>
              <div>STORE · 6 REWARDS LIVE</div>
              <div>FAMILY · 5 AGENTS · OPS DAY 217</div>
            </div>
          </div>
        </div>
      </div>

      <Celebration event={celebration} onDone={() => setCelebration(null)} />
    </div>
  );
}

function SectionHeader({ label, sub, accent, pulse }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      marginBottom: 10, paddingLeft: 4,
    }}>
      {pulse && <span style={{
        width: 10, height: 10, borderRadius: 99, background: accent,
        animation: 'fh-pulse 1.2s infinite',
      }} />}
      <span style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
        letterSpacing: '0.32em', color: accent, fontWeight: 700,
      }}>// {label}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.stroke}, transparent)` }} />
      {sub && <span style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        letterSpacing: '0.18em', color: C.textMute, fontWeight: 600,
      }}>{sub}</span>}
    </div>
  );
}

function FHStyles() {
  return (
    <style>{`
      @keyframes fh-pulse {
        0% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
        70% { box-shadow: 0 0 0 12px transparent; opacity: .4; }
        100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
      }
      @keyframes fh-pop {
        0% { transform: scale(.6); opacity: 0; }
        60% { transform: scale(1.08); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes fh-fade {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      ${[0,1,2,3,4,5].map(i => `
        @keyframes fh-confetti-${i} {
          0% { transform: translate(0,0) scale(.6) rotate(0); opacity: 1; }
          100% { transform: translate(${Math.cos(i*1.05)*420}px, ${Math.sin(i*1.05)*340 - 80}px) scale(1) rotate(${(i%2?1:-1)*540}deg); opacity: 0; }
        }
      `).join('\n')}
    `}</style>
  );
}

Object.assign(window, { MissionControl });
