// Admin Redesign — Desktop (1440x900).
//
// Power-user console for the family hub. Persistent sidebar, master-detail
// panes, inline editors. Designed for the parent doing backend work on a PC.
// The mobile admin (admin-*.jsx) is what the OTHER parent uses on their
// phone for quick approvals/redemptions.
//
// Shared tokens: window.AD_TOKENS (defined in admin-today.jsx).

const AdSidebar = ({ active, alertCount }) => {
  const AD = window.AD_TOKENS;
  const items = [
    { id: 'today',   label: 'Today',    icon: '◐', badge: alertCount > 0 ? alertCount : null },
    { id: 'family',  label: 'Family',   icon: '◍' },
    { id: 'tasks',   label: 'Tasks',    icon: '◉' },
    { id: 'history', label: 'History',  icon: '◑' },
  ];
  const settingsItems = [
    { id: 'settings', label: 'Settings', icon: '◎' },
    { id: 'maint',    label: 'Maintenance', icon: '◌' },
  ];

  return (
    <div style={{
      width: 232, flexShrink: 0,
      background: AD.bg,
      borderRight: `1px solid ${AD.stroke}`,
      display: 'flex', flexDirection: 'column',
      padding: '18px 14px',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 18px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: AD.amber,
          display: 'grid', placeItems: 'center',
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          color: AD.bg, fontSize: 14,
        }}>FH</div>
        <div>
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 14, color: AD.text, lineHeight: 1,
          }}>Family Hub</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
            color: AD.textMute, fontWeight: 600, letterSpacing: '0.18em', marginTop: 2,
          }}>v0.6.0 · ADMIN</div>
        </div>
      </div>

      {/* Search shortcut */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 8,
        background: AD.card, border: `1px solid ${AD.stroke}`,
        marginBottom: 14,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={AD.textMute} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <span style={{
          flex: 1,
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
          color: AD.textMute, fontWeight: 500,
        }}>Search…</span>
        <kbd style={{
          padding: '1px 6px', borderRadius: 4,
          background: AD.cardHi, border: `1px solid ${AD.stroke}`,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: AD.textDim, fontWeight: 600,
        }}>⌘K</kbd>
      </div>

      {/* Main nav */}
      <SidebarSection items={items} active={active} />

      <div style={{
        margin: '12px 8px', height: 1, background: AD.stroke,
      }} />

      <SidebarSection items={settingsItems} active={active} muted />

      <div style={{ flex: 1 }} />

      {/* Bottom — family selector / account */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px', borderRadius: 8,
        background: AD.card, border: `1px solid ${AD.stroke}`,
      }}>
        <Avatar name="J" color={window.FH_BY_ID('jim').color} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
            color: AD.text, fontWeight: 600,
          }}>Rathnokan</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: AD.textMute, letterSpacing: '0.08em', marginTop: 1,
          }}>jim@home · admin</div>
        </div>
        <span style={{ color: AD.textMute, fontSize: 14 }}>⋯</span>
      </div>
    </div>
  );
};

function SidebarSection({ items, active, muted }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {items.map(item => {
        const isActive = item.id === active;
        return (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 7,
            background: isActive ? `${AD.blue}1A` : 'transparent',
            color: isActive ? AD.text : (muted ? AD.textMute : AD.textDim),
            cursor: 'pointer',
            position: 'relative',
          }}>
            {isActive && <span style={{
              position: 'absolute', left: -14, top: 6, bottom: 6, width: 3,
              background: AD.blue, borderRadius: '0 2px 2px 0',
            }} />}
            <span style={{
              width: 18, height: 18, display: 'grid', placeItems: 'center',
              fontSize: 14, color: isActive ? AD.blue : AD.textMute,
            }}>{item.icon}</span>
            <span style={{
              flex: 1,
              fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
              fontWeight: isActive ? 700 : 600,
            }}>{item.label}</span>
            {item.badge && (
              <span style={{
                minWidth: 18, height: 18, borderRadius: 99,
                background: AD.red, color: AD.text,
                padding: '0 5px',
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700,
                display: 'grid', placeItems: 'center',
              }}>{item.badge}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AdTopBar({ title, breadcrumb, actions }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      height: 56, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 24px',
      borderBottom: `1px solid ${AD.stroke}`,
      background: AD.bg,
    }}>
      <div style={{ flex: 1 }}>
        {breadcrumb && (
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: AD.textMute, fontWeight: 600, letterSpacing: '0.18em',
            marginBottom: 2,
          }}>{breadcrumb}</div>
        )}
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 19, color: AD.text, lineHeight: 1, letterSpacing: '-0.01em',
        }}>{title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {actions}
      </div>
    </div>
  );
}

// =============================================================================
// DESKTOP · TODAY — Dashboard
// =============================================================================

function AdTodayDesktop() {
  const AD = window.AD_TOKENS;
  const approvals   = window.FH_APPROVALS;
  const redemptions = [
    { id: 'r1', person: 'olivia',  name: '30 min Screen Time', points: 80, when: '8m ago' },
    { id: 'r2', person: 'spencer', name: 'Stay Up +1 Hour',    points: 250, when: '22m ago' },
  ];
  const queue = [
    ...approvals.map(a => ({ ...a, kind: 'approval' })),
    ...redemptions.map(r => ({ ...r, kind: 'redemption' })),
  ];

  const recentActivity = [
    { person: 'spencer', what: 'completed Walk the dog', pts: +15, when: '7m' },
    { person: 'olivia',  what: 'hit 7-day streak · Feed the cat', pts: +25, when: '34m', milestone: true },
    { person: 'jackson', what: 'completed Make bed', pts: +5, when: '1h' },
    { person: 'shannon', what: 'allowance received', pts: +50, when: '2h', allowance: true },
    { person: 'jim',     what: 'completed Water the plants', pts: +5, when: '3h' },
    { person: 'spencer', what: 'requested Vacuum living room', pts: 0, when: '4h', pending: true },
    { person: 'olivia',  what: 'completed Empty the dishwasher', pts: +15, when: '5h' },
    { person: 'jackson', what: 'skipped Tidy bedroom', pts: -5, when: '1d', skipped: true },
  ];

  return (
    <div style={{
      width: 1440, height: 900,
      background: AD.bg, color: AD.text,
      fontFamily: '"Manrope", system-ui, sans-serif',
      display: 'flex', overflow: 'hidden',
    }}>
      <AdSidebar active="today" alertCount={queue.length} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdTopBar
          breadcrumb="OVERVIEW"
          title="Today"
          actions={
            <React.Fragment>
              <DeskBtn>Export backup</DeskBtn>
              <DeskBtn primary>+ Add chore</DeskBtn>
            </React.Fragment>
          } />

        <div style={{
          flex: 1, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 20,
          overflow: 'auto',
        }}>
          {/* Stat row — 4 cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          }}>
            <DeskStatCard label="NEEDS APPROVAL"   value={approvals.length} accent={AD.amber} trend="+2 vs yesterday" />
            <DeskStatCard label="REDEMPTIONS PENDING" value={redemptions.length} accent={AD.rose} trend="0 vs yesterday" />
            <DeskStatCard label="ACTIVE CHORES"    value="12" accent={AD.blue}   trend="11 due today" />
            <DeskStatCard label="POINTS THIS WEEK" value="385" accent={AD.green} trend="↑ 12% vs last wk" />
          </div>

          {/* Main 3-column grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: 16,
            flex: 1, minHeight: 0,
          }}>
            {/* Col 1 — Action queue */}
            <DeskPanel
              title="Needs your attention"
              sub={`${queue.length} items`}
              accent={AD.amber}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {queue.map((q, i) => {
                  const agent = window.FH_BY_ID(q.person);
                  const last  = i === queue.length - 1;
                  return (
                    <div key={q.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 0',
                      borderBottom: last ? 'none' : `1px solid ${AD.stroke}`,
                    }}>
                      <Avatar name={agent.name} color={agent.color} size={32} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Pill color={q.kind === 'approval' ? AD.amber : AD.rose} style={{ fontSize: 9, padding: '1px 6px' }}>
                            {q.kind === 'approval' ? 'CHORE' : 'REWARD'}
                          </Pill>
                          <span style={{
                            fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
                            color: AD.textMute, fontWeight: 500,
                          }}>{q.when}</span>
                        </div>
                        <div style={{
                          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
                          fontSize: 14, color: AD.text, lineHeight: 1.3, marginTop: 3,
                        }}>{q.name}</div>
                        <div style={{
                          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
                          color: AD.textMute, fontWeight: 500, marginTop: 1,
                        }}>{agent.name} · {q.kind === 'approval' ? '+' : '−'}{q.points}pts</div>
                      </div>
                      <DeskBtn small success>✓</DeskBtn>
                      <DeskBtn small danger>✕</DeskBtn>
                    </div>
                  );
                })}
              </div>
            </DeskPanel>

            {/* Col 2 — Recent activity */}
            <DeskPanel
              title="Recent activity"
              sub="last 24 hours"
              footer={<span style={{ color: AD.blue, fontWeight: 600, fontSize: 12 }}>View full history →</span>}>
              <div>
                {recentActivity.map((a, i) => {
                  const agent = window.FH_BY_ID(a.person);
                  const last  = i === recentActivity.length - 1;
                  const ptColor = a.pts > 0 ? AD.green : (a.pts < 0 ? AD.red : AD.textMute);
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 0',
                      borderBottom: last ? 'none' : `1px solid ${AD.stroke}`,
                    }}>
                      <Avatar name={agent.name} color={agent.color} size={24} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
                          color: AD.text, fontWeight: 500, lineHeight: 1.3,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          <span style={{ fontWeight: 700 }}>{agent.name}</span> {a.what}
                          {a.milestone && <span style={{
                            marginLeft: 6, fontSize: 10, color: AD.amber, fontWeight: 700, letterSpacing: '0.06em',
                          }}>★ MILESTONE</span>}
                        </div>
                      </div>
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                        color: ptColor, fontWeight: 700, minWidth: 36, textAlign: 'right',
                      }}>{a.pts > 0 ? '+' : ''}{a.pts !== 0 ? a.pts : '—'}</span>
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                        color: AD.textMute, fontWeight: 600, minWidth: 24, textAlign: 'right',
                      }}>{a.when}</span>
                    </div>
                  );
                })}
              </div>
            </DeskPanel>

            {/* Col 3 — Family at-a-glance + System status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <DeskPanel title="Family" sub={`${window.FH_AGENTS.length} active`} dense>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {window.FH_AGENTS.map((a, i) => {
                    const last = i === window.FH_AGENTS.length - 1;
                    const openCount = window.FH_MISSIONS.filter(m => m.assigned === a.id).length;
                    return (
                      <div key={a.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 0',
                        borderBottom: last ? 'none' : `1px solid ${AD.stroke}`,
                      }}>
                        <Avatar name={a.name} color={a.color} size={26} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
                            color: AD.text, fontWeight: 700,
                          }}>{a.name}</div>
                        </div>
                        <span style={{
                          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                          color: AD.text, fontWeight: 700,
                        }}>{a.balance}</span>
                        <span style={{
                          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                          color: openCount > 0 ? AD.blue : AD.textMute, fontWeight: 600,
                          minWidth: 30, textAlign: 'right',
                        }}>{openCount} open</span>
                      </div>
                    );
                  })}
                </div>
              </DeskPanel>

              <DeskPanel title="System" dense>
                <SystemRow label="Penalties & streaks" value="Active" valueColor={AD.green} dot />
                <SystemRow label="Live deployment"     value="v0.6.0 · S6" />
                <SystemRow label="Last daily tick"     value="07:00 today" />
                <SystemRow label="Data file"           value="142 KB" />
                <SystemRow label="History entries"     value="187 / 30d" />
              </DeskPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Desktop reusables -------------------------------------------------------

function DeskPanel({ title, sub, accent, footer, dense, children }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      background: AD.card,
      border: `1px solid ${AD.stroke}`,
      borderRadius: 12,
      padding: dense ? '14px 16px' : '16px 18px',
      display: 'flex', flexDirection: 'column',
      minHeight: 0, minWidth: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        paddingBottom: 12, marginBottom: 4,
        borderBottom: `1px solid ${AD.stroke}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {accent && <span style={{
            width: 6, height: 14, borderRadius: 2, background: accent,
          }} />}
          <span style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
            fontSize: 14, color: AD.text, letterSpacing: '-0.005em',
          }}>{title}</span>
        </div>
        {sub && <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: AD.textMute, fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>{sub}</span>}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {children}
      </div>
      {footer && (
        <div style={{
          paddingTop: 10, marginTop: 8,
          borderTop: `1px solid ${AD.stroke}`,
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
        }}>{footer}</div>
      )}
    </div>
  );
}

function DeskStatCard({ label, value, accent, trend }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      background: AD.card,
      border: `1px solid ${AD.stroke}`,
      borderRadius: 12,
      padding: '14px 16px',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: AD.textMute, fontWeight: 700, letterSpacing: '0.18em',
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
        <span style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 32, color: accent, lineHeight: 1,
        }}>{value}</span>
      </div>
      <div style={{
        fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
        color: AD.textMute, fontWeight: 500, marginTop: 6,
      }}>{trend}</div>
    </div>
  );
}

function DeskBtn({ children, primary, success, danger, small }) {
  const AD = window.AD_TOKENS;
  let bg = AD.card, brd = AD.stroke, fg = AD.text;
  if (primary) { bg = AD.blue;  brd = AD.blue;  fg = '#fff'; }
  if (success) { bg = `${AD.green}1A`; brd = `${AD.green}44`; fg = AD.green; }
  if (danger)  { bg = `${AD.red}1A`;   brd = `${AD.red}44`;   fg = AD.red; }
  return (
    <button style={{
      all: 'unset', cursor: 'pointer',
      padding: small ? '5px 10px' : '7px 14px',
      borderRadius: 7,
      background: bg, border: `1px solid ${brd}`, color: fg,
      fontFamily: '"Manrope", system-ui, sans-serif',
      fontWeight: 600, fontSize: small ? 12 : 13,
      whiteSpace: 'nowrap', textAlign: 'center',
      minWidth: small ? 28 : 'auto',
    }}>{children}</button>
  );
}

function SystemRow({ label, value, valueColor, dot }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 0',
    }}>
      <span style={{
        fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
        color: AD.textDim, fontWeight: 500,
      }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {dot && <span style={{
          width: 8, height: 8, borderRadius: '50%', background: valueColor || AD.green,
          boxShadow: `0 0 8px ${valueColor || AD.green}88`,
        }} />}
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          color: valueColor || AD.text, fontWeight: 700,
        }}>{value}</span>
      </span>
    </div>
  );
}

Object.assign(window, {
  AdTodayDesktop,
  // Shared desktop primitives
  AdSidebar, AdTopBar, DeskPanel, DeskStatCard, DeskBtn, SystemRow, SidebarSection,
});
