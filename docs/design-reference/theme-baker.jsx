// THEME: BAKER — Shannon's page.
//
// MIRRORS src/card/themes/baker.js (v0.6.0 Session 5 shipped).
//
// Visual reality vs. original mock:
//   - 3 tabs: Today's Prep / Pantry / Recipe Book  (subs: CHORES / STORE / HISTORY)
//   - Stat strip: prep balance / weekly pts / today's prep / next reward
//   - Button copy: "Bake it ✓" (kept from original — confirmed)
//   - Chore items are "tickets" with step numbers (1, 2, 3...) — step-number
//     circle is the lead element, not a proofing badge
//   - Streak shows as proof dots (small filled circles)
//   - "🔥 N" badge inline when streak ≥ 2

const BK = {
  bg:    '#F2E5CC',
  panel: '#FBF3E2',
  ink:   '#3A1F12',
  mute:  '#8B5A3A',
  terra: '#8B3A2A',   // terracotta accent
  red:   '#A02828',
  green: '#3A6A28',
};

function BakerTab({ label, sub, active }) {
  return (
    <div style={{
      padding: '12px 22px',
      borderTop:    active ? `2px solid ${BK.terra}` : `2px solid transparent`,
      borderBottom: active ? `2px solid ${BK.ink}`   : `1px solid ${BK.mute}55`,
      fontFamily: '"DM Serif Display", serif', fontWeight: 400,
      color: active ? BK.ink : BK.mute,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      minWidth: 160,
    }}>
      <span style={{ fontSize: 22, letterSpacing: '0.02em', lineHeight: 1.1 }}>{label}</span>
      {sub && <span style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
        letterSpacing: '0.22em', color: BK.mute, fontWeight: 600, marginTop: 2,
      }}>{sub}</span>}
    </div>
  );
}

function BakerRankBar({ weeklyPts, dropThr, gainThr, rankName }) {
  const barMax  = Math.max(gainThr, 1);
  const fillPct = Math.min(100, Math.round(weeklyPts / barMax * 100));
  const dropPct = Math.min(99, Math.round(dropThr / barMax * 100));
  let fill, status;
  if      (weeklyPts >= gainThr)  { fill = BK.terra; status = `${weeklyPts}pts · +1 rank`; }
  else if (weeklyPts < dropThr)   { fill = BK.red;   status = `${weeklyPts}pts · −1 rank`; }
  else                            { fill = '#E0B84C'; status = `${weeklyPts}pts · holds`; }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 18,
      padding: '10px 16px', margin: '0 0 12px',
      border: `1.5px solid ${BK.ink}`,
      background: `${BK.panel}cc`,
    }}>
      <span style={{
        fontFamily: '"DM Serif Display", serif', fontWeight: 400,
        fontSize: 20, color: BK.terra, minWidth: 180,
      }}>{rankName}</span>
      <div style={{
        flex: 1, position: 'relative', height: 12,
        background: `${BK.ink}11`, border: `1px solid ${BK.ink}44`,
        overflow: 'visible',
      }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fillPct}%`, background: fill }} />
        <div style={{ position: 'absolute', left: `${dropPct}%`, top: -4, bottom: -4, width: 2, background: BK.red, opacity: 0.7 }} />
      </div>
      <span style={{
        fontFamily: '"Caveat", cursive', fontSize: 18,
        color: BK.mute, fontWeight: 600, minWidth: 140, textAlign: 'right',
      }}>{status}</span>
    </div>
  );
}

function BakerTicket({ m, step }) {
  const overdue = m.days_delta < 0;
  return (
    <div style={{
      position: 'relative',
      paddingBottom: 14, marginBottom: 14,
      borderBottom: `1px dashed ${BK.mute}`,
      display: 'flex', gap: 16, alignItems: 'center',
    }}>
      {/* Step number circle */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        border: `2px solid ${overdue ? BK.red : BK.ink}`,
        background: BK.panel,
        display: 'grid', placeItems: 'center',
        flexShrink: 0, position: 'relative',
      }}>
        <span style={{
          fontFamily: '"DM Serif Display", serif',
          fontSize: 26, color: overdue ? BK.red : BK.ink, lineHeight: 1,
        }}>{step}</span>
      </div>

      {/* Icon — small tile */}
      <div style={{
        width: 44, height: 44, borderRadius: 6,
        border: `1.5px solid ${BK.ink}`,
        background: BK.panel,
        display: 'grid', placeItems: 'center',
        color: overdue ? BK.red : BK.terra,
        flexShrink: 0,
      }}>
        <ChoreIcon name={m.icon} size={26} strokeWidth={1.6} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"DM Serif Display", serif',
          fontSize: 26, color: BK.ink, lineHeight: 1.05,
        }}>{m.name}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <span style={{
            fontFamily: '"Caveat", cursive', fontSize: 17,
            color: overdue ? BK.red : BK.mute, fontWeight: 600,
          }}>{overdue ? `Overdue ${Math.abs(m.days_delta)}d${m.penalty ? ` · −${m.penalty}pts` : ''}` : 'On the board'}</span>
          {m.streakCurrent >= 2 && (
            <span style={{
              padding: '2px 8px', borderRadius: 99,
              background: `${BK.terra}22`,
              fontFamily: '"Caveat", cursive', fontSize: 16,
              color: BK.terra, fontWeight: 700,
            }}>🔥 {m.streakCurrent}</span>
          )}
        </div>

        {/* Proof dots — streak indicator */}
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              border: `1.5px solid ${BK.ink}`,
              background: i < m.streakCurrent ? BK.terra : 'transparent',
            }} />
          ))}
        </div>
      </div>

      {/* Points stamp */}
      <div style={{
        textAlign: 'center',
        transform: 'rotate(3deg)',
        padding: '6px 12px',
        border: `2px solid ${BK.terra}`,
        color: BK.terra, minWidth: 70,
      }}>
        <div style={{
          fontFamily: '"DM Serif Display", serif', fontSize: 26, lineHeight: 1,
        }}>+{m.points}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 8,
          fontWeight: 800, letterSpacing: '0.2em', marginTop: 2,
        }}>POINTS</div>
      </div>

      {/* Bake it ✓ button */}
      <button style={{
        all: 'unset', cursor: 'pointer',
        padding: '14px 22px',
        background: BK.ink, color: BK.bg,
        borderRadius: 99,
        fontFamily: '"DM Serif Display", serif', fontSize: 18,
        boxShadow: `0 3px 0 ${BK.terra}`,
        whiteSpace: 'nowrap',
      }}>Bake it ✓</button>
    </div>
  );
}

function BakerStat({ label, value }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 14px',
    }}>
      <span style={{
        fontFamily: '"Caveat", cursive', fontSize: 17,
        color: BK.mute, fontWeight: 600,
      }}>{label}</span>
      <span style={{
        fontFamily: '"DM Serif Display", serif', fontSize: 26,
        color: BK.ink, lineHeight: 1, marginTop: 4,
      }}>{value}</span>
    </div>
  );
}

function BakerPage({ width = 1920, height = 1080 }) {
  const agent    = window.FH_BY_ID('shannon');
  const own      = window.FH_MISSIONS.filter(m => m.assigned === 'shannon');
  const pad      = window.FH_MISSIONS.filter(m => m.assigned !== 'shannon').slice(0, 2);
  const all      = [...own, ...pad];
  const ranks    = window.FH_RANKS.baker;
  const rank     = ranks[ranks.length - 1]; // parents = max rank
  const thr      = window.FH_RANK_THRESHOLDS;
  const nextItem = window.FH_STORE.find(i => i.cost > agent.balance) || window.FH_STORE[0];

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: '"Manrope", system-ui, sans-serif',
      color: BK.ink, background: BK.bg,
      backgroundImage: `
        radial-gradient(circle at 10% 12%, #D9C49Baa, transparent 35%),
        radial-gradient(circle at 88% 88%, #D9C49Baa, transparent 38%),
        repeating-radial-gradient(circle at 30% 60%, #D9C49B22 0, #D9C49B22 1.5px, transparent 1.5px, transparent 6px)
      `,
    }}>
      <div style={{ position: 'absolute', inset: 28, border: `2px solid ${BK.ink}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 36, border: `1px solid ${BK.ink}55`, pointerEvents: 'none' }} />

      <div style={{
        position: 'relative', padding: 48, height: '100%',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Title block */}
        <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: `2px solid ${BK.ink}` }}>
          <div style={{
            fontFamily: '"Caveat", cursive', fontSize: 24, color: BK.terra,
            fontWeight: 600, lineHeight: 1,
          }}>~ Mon · 13 May ~</div>
          <div style={{
            fontFamily: '"DM Serif Display", serif', fontSize: 78,
            color: BK.ink, lineHeight: 0.95, letterSpacing: '-0.01em',
            marginTop: 2,
          }}>Shannon's Kitchen</div>
          <div style={{
            fontFamily: '"Caveat", cursive', fontSize: 20, color: BK.mute,
            fontWeight: 600, marginTop: 4,
          }}>~ today's recipe · serves the whole family ~</div>
        </div>

        {/* Stat strip */}
        <div style={{
          display: 'flex', justifyContent: 'space-around',
          paddingTop: 12, paddingBottom: 12,
          borderBottom: `1px dashed ${BK.mute}`,
        }}>
          <BakerStat label="prep balance" value={`${agent.balance}pts`} />
          <BakerStat label="weekly pts"   value={`${agent.weeklyPts}pts`} />
          <BakerStat label="today's prep" value={`${all.length} items`} />
          <BakerStat label="next reward"  value={nextItem.name} />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 2, justifyContent: 'center', marginTop: 14,
        }}>
          <BakerTab label="Today's Prep" sub="CHORES"  active />
          <BakerTab label="Pantry"       sub="STORE" />
          <BakerTab label="Recipe Book"  sub="HISTORY" />
        </div>

        {/* Body */}
        <div style={{
          flex: 1, marginTop: 16, minHeight: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          <BakerRankBar
            weeklyPts={agent.weeklyPts}
            dropThr={thr.drop} gainThr={thr.gain}
            rankName={rank.name} />

          <div style={{
            fontFamily: '"DM Serif Display", serif', fontSize: 28,
            color: BK.ink, marginBottom: 12,
            display: 'flex', alignItems: 'baseline', gap: 16,
          }}>
            <span>Today's Prep</span>
            <span style={{ flex: 1, height: 1, background: BK.mute }} />
            <span style={{
              fontFamily: '"Caveat", cursive', fontSize: 20,
              color: BK.terra, fontWeight: 600,
            }}>{all.length} steps</span>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            {all.slice(0, 4).map((m, i) => (
              <BakerTicket key={m.id + i} m={m} step={i + 1} />
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 12,
          fontFamily: '"Caveat", cursive', fontSize: 17, color: BK.mute,
        }}>
          <span>— Family Hub · est. 2026 —</span>
          <span>{rank.name}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BakerPage });
