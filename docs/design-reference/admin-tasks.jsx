// Admin Redesign — Tasks screen (combined Chores + Rewards).
// Pill toggle at top, search box, person filter, drag-to-reorder list with
// inline edits for the most common changes (points, category, penalty toggle).
// FAB to add a new chore/reward.

function TasksScreen({ mode = 'chores' }) {
  const AD = window.AD_TOKENS;

  return (
    <PhoneShell>
      <AppBar title="Tasks" subtitle={mode === 'chores' ? '12 chores · 4 categories' : '6 rewards in store'} onSettings />

      {/* Pill toggle: Chores | Rewards */}
      <div style={{
        padding: '14px 16px 12px',
        background: AD.bg,
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', gap: 0,
          background: AD.card,
          border: `1px solid ${AD.stroke}`,
          borderRadius: 99,
          padding: 3,
        }}>
          <PillToggleOpt label="Chores"  count={12} active={mode === 'chores'} />
          <PillToggleOpt label="Rewards" count={6}  active={mode === 'rewards'} />
        </div>

        {/* Search */}
        <div style={{
          marginTop: 10,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px',
          background: AD.card,
          border: `1px solid ${AD.stroke}`,
          borderRadius: 11,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={AD.textMute} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder={mode === 'chores' ? 'Search chores…' : 'Search rewards…'} style={{
            all: 'unset', flex: 1,
            fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 14,
            color: AD.text,
          }} />
        </div>

        {/* Person filter chips (chores only) */}
        {mode === 'chores' && (
          <div style={{
            display: 'flex', gap: 6, marginTop: 10,
            overflowX: 'auto',
          }}>
            <FilterChip label="All" active />
            {window.FH_AGENTS.map(a => (
              <FilterChip key={a.id} label={a.name} color={a.color} />
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div style={{
        flex: 1, overflow: 'auto',
        padding: '4px 16px 90px',
        position: 'relative',
      }}>
        {mode === 'chores' ? <ChoresList /> : <RewardsList />}
      </div>

      {/* FAB */}
      <button style={{
        all: 'unset', cursor: 'pointer',
        position: 'absolute', right: 24, bottom: 96,
        width: 60, height: 60, borderRadius: '50%',
        background: AD.blue,
        boxShadow: `0 6px 20px ${AD.blue}66, 0 0 0 4px ${AD.bg}`,
        display: 'grid', placeItems: 'center',
        color: '#fff', fontSize: 28, fontWeight: 700,
        fontFamily: '"Manrope", system-ui, sans-serif',
      }}>+</button>

      <TabBar active="tasks" />
    </PhoneShell>
  );
}

function PillToggleOpt({ label, count, active }) {
  const AD = window.AD_TOKENS;
  return (
    <button style={{
      all: 'unset', cursor: 'pointer',
      flex: 1,
      padding: '10px 16px', borderRadius: 99,
      background: active ? AD.blue : 'transparent',
      color: active ? '#fff' : AD.textDim,
      textAlign: 'center',
      fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
      fontSize: 15,
      transition: 'all .15s',
    }}>{label} <span style={{
      fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700,
      opacity: 0.75, marginLeft: 4,
    }}>{count}</span></button>
  );
}

function FilterChip({ label, color, active }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '7px 12px', borderRadius: 99,
      background: active ? AD.card : 'transparent',
      border: `1px solid ${active ? AD.strokeHi : AD.stroke}`,
      fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600,
      fontSize: 12, color: active ? AD.text : AD.textMute,
      flexShrink: 0, whiteSpace: 'nowrap',
      cursor: 'pointer',
    }}>
      {color && <span style={{
        width: 8, height: 8, borderRadius: '50%', background: color,
      }} />}
      {label}
    </div>
  );
}

// ---- Chores list -------------------------------------------------------------

function ChoresList() {
  const AD = window.AD_TOKENS;
  // Group chores by category in admin order
  const byCategory = window.FH_CATEGORIES.map(cat => ({
    cat,
    chores: window.FH_MISSIONS.filter(m => m.category === cat).slice(0, 4),
  })).filter(g => g.chores.length);

  return (
    <React.Fragment>
      {byCategory.map(group => (
        <div key={group.cat} style={{ marginTop: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 4px', marginBottom: 8,
          }}>
            <span style={{
              fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 700,
              fontSize: 12, letterSpacing: '0.08em', color: AD.textMute,
              textTransform: 'uppercase',
            }}>{group.cat} <span style={{ color: AD.textMute, marginLeft: 4 }}>· {group.chores.length}</span></span>
            <span style={{
              fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
              color: AD.textMute, fontWeight: 500,
            }}>⠿ drag</span>
          </div>
          <Card padded={false}>
            {group.chores.map((m, i) => (
              <ChoreRow key={m.id} m={m} last={i === group.chores.length - 1} />
            ))}
          </Card>
        </div>
      ))}
    </React.Fragment>
  );
}

function ChoreRow({ m, last }) {
  const AD = window.AD_TOKENS;
  const agent = window.FH_BY_ID(m.assigned);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      borderBottom: last ? 'none' : `1px solid ${AD.stroke}`,
    }}>
      <span style={{
        color: AD.textMute, cursor: 'grab', fontSize: 16, flexShrink: 0,
      }}>⠿</span>

      {/* Icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 9,
        background: `${agent.color}22`,
        border: `1px solid ${agent.color}44`,
        color: agent.color,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <ChoreIcon name={m.icon} size={22} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
          fontSize: 15, color: AD.text, lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{m.name}</div>
        <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
          color: AD.textMute, fontWeight: 500, marginTop: 3,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {/* Assignee mini-avatar */}
          <span style={{
            width: 14, height: 14, borderRadius: '50%',
            background: agent.color, display: 'inline-block',
          }} />
          {agent.name} · Daily
          {m.penalty > 0 && <span style={{ color: AD.red }}>· −{m.penalty}pts</span>}
        </div>
      </div>

      <span style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 13,
        color: AD.amber, fontWeight: 700,
      }}>{m.points}pts</span>

      <button style={{
        all: 'unset', cursor: 'pointer',
        width: 28, height: 28, color: AD.textMute,
        display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 700,
      }}>›</button>
    </div>
  );
}

// ---- Rewards list ------------------------------------------------------------

function RewardsList() {
  const AD = window.AD_TOKENS;
  return (
    <div style={{ marginTop: 16 }}>
      <Card padded={false}>
        {window.FH_STORE.map((r, i) => {
          const last = i === window.FH_STORE.length - 1;
          const rarityColor = {
            common:    AD.textDim,
            rare:      AD.blue,
            epic:      AD.rose,
            legendary: AD.amber,
          }[r.rarity];
          return (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              borderBottom: last ? 'none' : `1px solid ${AD.stroke}`,
            }}>
              <span style={{
                color: AD.textMute, cursor: 'grab', fontSize: 16, flexShrink: 0,
              }}>⠿</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
                  fontSize: 15, color: AD.text, lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{r.name}</div>
                <div style={{
                  fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
                  color: AD.textMute, fontWeight: 500, marginTop: 3,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Pill color={rarityColor} style={{ fontSize: 9, padding: '1px 6px' }}>
                    {r.rarity.toUpperCase()}
                  </Pill>
                  · All kids · ${(r.cost/10).toFixed(2)}
                </div>
              </div>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 13,
                color: AD.amber, fontWeight: 700,
              }}>{r.cost}pts</span>
              <button style={{
                all: 'unset', cursor: 'pointer',
                width: 28, height: 28, color: AD.textMute,
                display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 700,
              }}>›</button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

Object.assign(window, { TasksScreen });
