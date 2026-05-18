// Admin Redesign — Family Hub
//
// Mobile-first (414w iPhone Pro size). The HA companion app is the primary
// surface; admin is NOT used on the kitchen Echo Show.
//
// Goals (from the redesign conversation):
//   1. Reduce 5 tabs → 3 sections + Settings sheet
//   2. Landing page = "what needs your attention", NOT a balance roster
//   3. Combine approvals + redemptions into one queue
//   4. Inline edits where possible — modals only for genuinely complex forms
//   5. Search for chores/rewards; person filter
//   6. Dangerous actions (rebuild) isolated from safe ones
//   7. Add-Chore must be obvious — primary CTA on the home screen
//
// Visual: system-app feel. Same FH_PALETTE tokens, but lighter touch — no
// "tactical ops" mono headers, no corner brackets. Cards on a darker bg with
// generous whitespace. This is a control panel, not a theatrical surface.

const AD = {
  // Background fades from panel → ink (subtle vignette)
  bg:        '#0E1622',
  bgHi:      '#141E2E',
  card:      '#1A2538',
  cardHi:    '#202D45',
  cardSoft:  '#1F2A3F',  // even softer for nested cards
  stroke:    '#2A3852',
  strokeHi:  '#3A4B6B',
  text:      '#ECEFF6',
  textDim:   '#A6B3CC',
  textMute:  '#6F7E9C',

  // Action accents — used sparingly
  blue:      '#5B8DEF',
  blueDim:   '#3F6BC2',
  green:     '#58D38A',
  greenDim:  '#3FA66A',
  red:       '#E8553E',
  redDim:    '#B53B26',
  amber:     '#F5C24A',
  amberDim:  '#A67E1F',
  rose:      '#E36DA4',
};

// ---- Shared primitives -------------------------------------------------------

function Card({ children, style = {}, padded = true }) {
  return (
    <div style={{
      background: AD.card,
      border: `1px solid ${AD.stroke}`,
      borderRadius: 14,
      padding: padded ? 16 : 0,
      ...style,
    }}>{children}</div>
  );
}

function SectionLabel({ children, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '0 4px', marginBottom: 8,
    }}>
      <span style={{
        fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 700,
        fontSize: 13, letterSpacing: '0.08em', color: AD.textMute,
        textTransform: 'uppercase',
      }}>{children}</span>
      {action}
    </div>
  );
}

function Avatar({ name, color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color || AD.blue, color: '#0B1320',
      display: 'grid', placeItems: 'center',
      fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
      fontSize: size * 0.42, flexShrink: 0,
    }}>{name[0]}</div>
  );
}

function IconBtn({ children, color, onClick, style = {}, size = 36 }) {
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      width: size, height: size, borderRadius: 9,
      background: color ? `${color}22` : AD.cardHi,
      border: `1px solid ${color ? color + '44' : AD.stroke}`,
      color: color || AD.text,
      display: 'grid', placeItems: 'center',
      fontSize: size * 0.45, fontWeight: 700,
      flexShrink: 0, ...style,
    }}>{children}</button>
  );
}

function Pill({ children, color, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 99,
      background: color ? `${color}1A` : AD.cardHi,
      border: `1px solid ${color ? color + '44' : AD.stroke}`,
      fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600,
      fontSize: 11, color: color || AD.textDim,
      letterSpacing: '0.04em',
      ...style,
    }}>{children}</span>
  );
}

function Toggle({ checked }) {
  return (
    <span style={{
      position: 'relative',
      width: 44, height: 26, borderRadius: 99,
      background: checked ? AD.green : AD.cardHi,
      border: `1px solid ${checked ? AD.green : AD.stroke}`,
      transition: 'all .15s', cursor: 'pointer',
      display: 'inline-block', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 1, left: checked ? 19 : 1,
        width: 22, height: 22, borderRadius: '50%',
        background: '#fff',
        transition: 'left .15s',
        boxShadow: '0 2px 4px rgba(0,0,0,.3)',
      }} />
    </span>
  );
}

// ---- Top app bar -------------------------------------------------------------

function AppBar({ title, subtitle, onSettings, leading }) {
  return (
    <div style={{
      padding: '14px 20px 12px',
      background: AD.bg,
      borderBottom: `1px solid ${AD.stroke}`,
      display: 'flex', alignItems: 'center', gap: 12,
      flexShrink: 0,
    }}>
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 22, color: AD.text, lineHeight: 1, letterSpacing: '-0.01em',
        }}>{title}</div>
        {subtitle && <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
          color: AD.textMute, fontWeight: 500, marginTop: 4,
        }}>{subtitle}</div>}
      </div>
      {onSettings && (
        <IconBtn size={42} style={{ background: 'transparent', border: 'none' }}>
          {/* gear */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </IconBtn>
      )}
    </div>
  );
}

// ---- Bottom tab bar ----------------------------------------------------------

function TabBar({ active }) {
  const tabs = [
    { id: 'today',  label: 'Today',  icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M3.5 7l1.5 1.5M20.5 7L19 8.5M2 13h4M18 13h4M5 19.5C5 16 8 13 12 13s7 3 7 6.5z"/>
      </svg>
    )},
    { id: 'family', label: 'Family', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-3-3.87M9 7a4 4 0 1 1 8 0 4 4 0 0 1-8 0zM3 21v-2a4 4 0 0 1 3-3.87M3 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"/>
      </svg>
    )},
    { id: 'tasks',  label: 'Tasks',  icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    )},
  ];
  return (
    <div style={{
      display: 'flex',
      background: AD.bgHi,
      borderTop: `1px solid ${AD.stroke}`,
      padding: '8px 0 14px',
      flexShrink: 0,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <div key={t.id} style={{
            flex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: isActive ? AD.blue : AD.textMute,
            padding: '6px 0',
          }}>
            <span style={{ width: 24, height: 24, display: 'block' }}>{t.icon}</span>
            <span style={{
              fontFamily: '"Manrope", system-ui, sans-serif',
              fontSize: 11, fontWeight: isActive ? 700 : 600,
              letterSpacing: '0.04em',
            }}>{t.label}</span>
            {isActive && <span style={{
              width: 28, height: 3, borderRadius: 99, background: AD.blue,
              marginTop: -1,
            }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ---- Phone frame -------------------------------------------------------------

function PhoneShell({ children }) {
  return (
    <div style={{
      width: 414, height: 896,
      background: AD.bg,
      color: AD.text,
      fontFamily: '"Manrope", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: 48,
      border: `8px solid #0a0d14`,
      boxShadow: `inset 0 0 0 1px ${AD.stroke}`,
      position: 'relative',
    }}>
      {/* iOS-style status bar */}
      <div style={{
        height: 44, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
        fontFamily: '"Manrope", system-ui, sans-serif',
        fontSize: 14, fontWeight: 600, color: AD.text,
        flexShrink: 0, background: AD.bg,
      }}>
        <span>9:41</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>●●●●</span>
          <span style={{ fontSize: 11, marginLeft: 4 }}>5G</span>
          <span style={{
            width: 22, height: 11, border: `1.5px solid ${AD.text}`,
            borderRadius: 3, position: 'relative', marginLeft: 4,
          }}>
            <span style={{
              position: 'absolute', inset: 1, right: 2, background: AD.text,
            }} />
          </span>
        </span>
      </div>
      {children}
    </div>
  );
}

// =============================================================================
// SCREEN 1 — TODAY (default landing)
// =============================================================================

function TodayScreen() {
  const approvals = window.FH_APPROVALS;
  const redemptions = [
    { id: 'r1', person: 'olivia',  name: '30 min Screen Time', points: 80,  when: '8m ago' },
    { id: 'r2', person: 'spencer', name: 'Stay Up +1 Hour',    points: 250, when: '22m ago' },
  ];
  // Combine + sort by age. In real life these'd come from approval_queue +
  // redemption_queue with their timestamps.
  const queue = [
    ...approvals.map(a    => ({ ...a, kind: 'approval'   })),
    ...redemptions.map(r  => ({ ...r, kind: 'redemption' })),
  ];

  const recentActivity = [
    { id: 'a1', person: 'spencer', what: 'completed Walk the dog',  pts: +15, when: '7m'  },
    { id: 'a2', person: 'olivia',  what: 'hit 7-day streak · Feed the cat', pts: +25, when: '34m', milestone: true },
    { id: 'a3', person: 'jackson', what: 'completed Make bed',      pts: +5,  when: '1h'  },
    { id: 'a4', person: 'shannon', what: 'allowance received',      pts: +50, when: '2h', kind: 'allowance' },
  ];

  return (
    <PhoneShell>
      <AppBar title="Family Hub" subtitle="Rathnokan Household" onSettings />

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 90px' }}>
        {/* Action queue */}
        <SectionLabel
          action={
            <span style={{ color: AD.amber, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700 }}>
              {queue.length} waiting
            </span>
          }>Needs Your Attention</SectionLabel>

        {queue.length > 0 ? (
          <Card padded={false} style={{ marginBottom: 24 }}>
            {queue.map((q, i) => {
              const agent = window.FH_BY_ID(q.person);
              const last = i === queue.length - 1;
              return (
                <div key={q.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  borderBottom: last ? 'none' : `1px solid ${AD.stroke}`,
                }}>
                  <Avatar name={agent.name} color={agent.color} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <Pill color={q.kind === 'approval' ? AD.amber : AD.rose} style={{ fontSize: 10 }}>
                        {q.kind === 'approval' ? 'CHORE' : 'REWARD'}
                      </Pill>
                    </div>
                    <div style={{
                      fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
                      fontSize: 16, color: AD.text, lineHeight: 1.2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{q.name}</div>
                    <div style={{
                      fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
                      color: AD.textMute, fontWeight: 500, marginTop: 2,
                    }}>
                      {agent.name} · {q.kind === 'approval' ? `+${q.points}pts` : `−${q.points}pts`} · {q.when}
                    </div>
                  </div>
                  <IconBtn color={AD.green} size={40}>✓</IconBtn>
                  <IconBtn color={AD.red} size={40}>✕</IconBtn>
                </div>
              );
            })}
          </Card>
        ) : (
          <Card style={{ textAlign: 'center', padding: '32px 16px', marginBottom: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
            <div style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
              fontSize: 18, color: AD.text,
            }}>All caught up</div>
            <div style={{
              fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
              color: AD.textMute, fontWeight: 500, marginTop: 4,
            }}>No approvals or rewards waiting.</div>
          </Card>
        )}

        {/* Quick Add — the THREE common adds, no hidden jargon */}
        <SectionLabel>Quick Add</SectionLabel>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
          marginBottom: 24,
        }}>
          <QuickAddTile
            label="Chore"
            sub="recurring"
            color={AD.blue}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2 0 3.5.7 5 2M21 3v6h-6"/>
              </svg>
            }
          />
          <QuickAddTile
            label="Task"
            sub="one-time"
            color={AD.green}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            }
          />
          <QuickAddTile
            label="Reward"
            sub="for store"
            color={AD.rose}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            }
          />
        </div>

        {/* Status banner if anything's off */}
        <PenaltyBanner paused={false} />

        {/* Recent activity */}
        <SectionLabel
          action={<a style={{
            fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
            color: AD.blue, fontWeight: 600, textDecoration: 'none',
          }}>See all →</a>}>Recent activity</SectionLabel>

        <Card padded={false} style={{ marginBottom: 16 }}>
          {recentActivity.map((a, i) => {
            const agent = window.FH_BY_ID(a.person);
            const last  = i === recentActivity.length - 1;
            return (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                borderBottom: last ? 'none' : `1px solid ${AD.stroke}`,
              }}>
                <Avatar name={agent.name} color={agent.color} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 14,
                    color: AD.text, fontWeight: 500, lineHeight: 1.3,
                  }}>
                    <span style={{ fontWeight: 700 }}>{agent.name}</span> {a.what}
                  </div>
                  {a.milestone && (
                    <Pill color={AD.amber} style={{ marginTop: 4, fontSize: 10 }}>★ MILESTONE</Pill>
                  )}
                </div>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 13,
                  fontWeight: 700,
                  color: a.pts > 0 ? AD.green : AD.red,
                }}>{a.pts > 0 ? '+' : ''}{a.pts}</span>
                <span style={{
                  fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
                  color: AD.textMute, fontWeight: 600, minWidth: 30, textAlign: 'right',
                }}>{a.when}</span>
              </div>
            );
          })}
        </Card>
      </div>

      <TabBar active="today" />
    </PhoneShell>
  );
}

function QuickAddTile({ label, sub, color, icon }) {
  return (
    <button style={{
      all: 'unset', cursor: 'pointer',
      padding: '14px 8px 12px',
      background: AD.card,
      border: `1px solid ${AD.stroke}`,
      borderRadius: 14,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      textAlign: 'center',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `${color}1A`,
        border: `1px solid ${color}44`,
        color: color,
        display: 'grid', placeItems: 'center',
      }}>
        <span style={{ width: 20, height: 20, display: 'block' }}>{icon}</span>
      </div>
      <div>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
          fontSize: 15, color: AD.text, lineHeight: 1,
        }}>+ {label}</div>
        <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 10,
          color: AD.textMute, fontWeight: 600, letterSpacing: '0.06em',
          marginTop: 2, textTransform: 'uppercase',
        }}>{sub}</div>
      </div>
    </button>
  );
}

function PenaltyBanner({ paused }) {
  if (!paused) return null;
  return (
    <Card style={{
      borderLeft: `4px solid ${AD.amber}`,
      marginBottom: 24,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ fontSize: 22 }}>⏸</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
          fontSize: 14, color: AD.text,
        }}>Penalties & streaks paused</div>
        <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
          color: AD.textMute, fontWeight: 500, marginTop: 2,
        }}>Skips won't break streaks or deduct points.</div>
      </div>
      <Toggle checked={false} />
    </Card>
  );
}

Object.assign(window, {
  TodayScreen, PhoneShell, AppBar, TabBar, Card, SectionLabel, Avatar,
  IconBtn, Pill, Toggle, AD_TOKENS: AD,
});
