// Admin Desktop — Tasks (chore management — the main power-user surface).
//
// Split view: chore table on the left, inline editor panel on the right when
// a row is selected. This is where the parent will spend the most time
// configuring chores (recurrence, points, penalty thresholds, streak
// milestones, reminder times, icons, assignees).
//
// Key power-user moves:
//   - Inline edit of every common field WITHOUT opening a modal
//   - Multi-select with bulk actions (assign multiple chores to a person,
//     change category in bulk, delete bulk)
//   - Sortable columns (sort by points, category, assignee, last completed)
//   - Keyboard nav implied (focus rings + shortcut hints)

function AdTasksDesktop() {
  const AD = window.AD_TOKENS;
  const selectedId = 't4'; // Olivia · Feed the cat — most interesting row to show selected

  return (
    <div style={{
      width: 1440, height: 900,
      background: AD.bg, color: AD.text,
      fontFamily: '"Manrope", system-ui, sans-serif',
      display: 'flex', overflow: 'hidden',
    }}>
      <AdSidebar active="tasks" alertCount={window.FH_APPROVALS.length} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdTopBar
          breadcrumb="TASKS · CHORES"
          title="Chores"
          actions={
            <React.Fragment>
              <DeskBtn>Bulk edit</DeskBtn>
              <DeskBtn>Manage categories</DeskBtn>
              <DeskBtn primary>+ New chore</DeskBtn>
            </React.Fragment>
          } />

        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* LEFT — Chore table */}
          <div style={{
            flex: 1, minWidth: 0,
            display: 'flex', flexDirection: 'column',
            borderRight: `1px solid ${AD.stroke}`,
          }}>
            {/* Filters bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px',
              borderBottom: `1px solid ${AD.stroke}`,
              flexShrink: 0,
            }}>
              {/* Pill toggle */}
              <div style={{
                display: 'flex', gap: 0,
                background: AD.card, border: `1px solid ${AD.stroke}`,
                borderRadius: 8, padding: 3,
              }}>
                <DeskTabPill label="Chores"  count={12} active />
                <DeskTabPill label="Rewards" count={6} />
              </div>

              {/* Search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 12px', borderRadius: 8,
                background: AD.card, border: `1px solid ${AD.stroke}`,
                width: 240,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={AD.textMute} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <span style={{
                  fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
                  color: AD.textMute, flex: 1,
                }}>Search chores…</span>
                <kbd style={{
                  padding: '1px 5px', borderRadius: 3,
                  background: AD.cardHi, border: `1px solid ${AD.stroke}`,
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                  color: AD.textDim, fontWeight: 600,
                }}>/</kbd>
              </div>

              {/* Person filter dropdown */}
              <DeskFilter label="Person" value="All" />
              <DeskFilter label="Category" value="All" />
              <DeskFilter label="Recurrence" value="Any" />

              <span style={{ flex: 1 }} />

              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                color: AD.textMute, fontWeight: 600, letterSpacing: '0.08em',
              }}>12 chores · 1 selected</span>
            </div>

            {/* Table */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              <table style={{
                width: '100%', borderCollapse: 'collapse',
                fontFamily: '"Manrope", system-ui, sans-serif',
              }}>
                <thead style={{ position: 'sticky', top: 0, background: AD.bg, zIndex: 1 }}>
                  <tr>
                    <ChoreTH width={32}></ChoreTH>
                    <ChoreTH>Chore</ChoreTH>
                    <ChoreTH width={120}>Assignee</ChoreTH>
                    <ChoreTH width={130}>Category</ChoreTH>
                    <ChoreTH width={110}>Recurrence</ChoreTH>
                    <ChoreTH width={80} align="right">Points</ChoreTH>
                    <ChoreTH width={90} align="right">Streak</ChoreTH>
                    <ChoreTH width={70} align="right">Status</ChoreTH>
                    <ChoreTH width={40}></ChoreTH>
                  </tr>
                </thead>
                <tbody>
                  {window.FH_MISSIONS.map(m => {
                    const agent     = window.FH_BY_ID(m.assigned);
                    const isSelected = m.id === selectedId;
                    return (
                      <ChoreTR key={m.id} m={m} agent={agent} selected={isSelected} />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom bar */}
            <div style={{
              padding: '10px 20px',
              borderTop: `1px solid ${AD.stroke}`,
              background: AD.bg,
              display: 'flex', alignItems: 'center', gap: 12,
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                color: AD.textMute, fontWeight: 600, letterSpacing: '0.08em',
              }}>SHORTCUTS</span>
              <DeskShortcut k="N" label="new" />
              <DeskShortcut k="↑↓" label="navigate" />
              <DeskShortcut k="↵" label="edit" />
              <DeskShortcut k="⌘D" label="duplicate" />
              <DeskShortcut k="⌫" label="delete" />
              <span style={{ flex: 1 }} />
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                color: AD.textMute, fontWeight: 600,
              }}>Sorted by category · admin order</span>
            </div>
          </div>

          {/* RIGHT — Inline editor for selected chore */}
          <ChoreEditor m={window.FH_MISSIONS.find(x => x.id === selectedId)} />
        </div>
      </div>
    </div>
  );
}

function ChoreTH({ children, width, align }) {
  const AD = window.AD_TOKENS;
  return (
    <th style={{
      padding: '10px 12px',
      borderBottom: `1px solid ${AD.stroke}`,
      fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
      color: AD.textMute, fontWeight: 700, letterSpacing: '0.18em',
      textAlign: align || 'left',
      textTransform: 'uppercase',
      width: width || 'auto',
      whiteSpace: 'nowrap',
    }}>{children}</th>
  );
}

function ChoreTR({ m, agent, selected }) {
  const AD = window.AD_TOKENS;
  const td = {
    padding: '10px 12px',
    fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
    color: AD.text, borderBottom: `1px solid ${AD.stroke}`,
    verticalAlign: 'middle',
  };
  return (
    <tr style={{
      background: selected ? `${AD.blue}14` : 'transparent',
      cursor: 'pointer',
    }}>
      <td style={td}>
        <span style={{ color: AD.textMute, fontSize: 14 }}>⠿</span>
      </td>
      <td style={td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: `${agent.color}22`,
            border: `1px solid ${agent.color}44`,
            color: agent.color,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <ChoreIcon name={m.icon} size={16} strokeWidth={2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{m.name}</div>
            {m.days_delta < 0 && (
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                color: AD.red, fontWeight: 700, letterSpacing: '0.1em',
              }}>BREACH · {Math.abs(m.days_delta)}D</span>
            )}
          </div>
        </div>
      </td>
      <td style={td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 18, height: 18, borderRadius: '50%',
            background: agent.color, color: '#0B1320',
            display: 'grid', placeItems: 'center',
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 9,
          }}>{agent.name[0]}</span>
          <span style={{ fontWeight: 500 }}>{agent.name}</span>
        </div>
      </td>
      <td style={td}>
        <span style={{
          padding: '2px 8px', borderRadius: 99,
          background: AD.cardHi, border: `1px solid ${AD.stroke}`,
          fontSize: 11, fontWeight: 600, color: AD.textDim,
        }}>{m.category}</span>
      </td>
      <td style={td}>
        <span style={{ color: AD.textDim, fontSize: 12, fontWeight: 500 }}>Daily</span>
      </td>
      <td style={{ ...td, textAlign: 'right' }}>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 13,
          color: AD.amber, fontWeight: 700,
        }}>{m.points}</span>
      </td>
      <td style={{ ...td, textAlign: 'right' }}>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
          color: m.streakCurrent >= 5 ? AD.amber : AD.textDim, fontWeight: 700,
        }}>{m.streakCurrent}/{m.streakGoal}</span>
      </td>
      <td style={{ ...td, textAlign: 'right' }}>
        {m.days_delta < 0 ? (
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: AD.red,
            display: 'inline-block',
          }} />
        ) : m.milestoneSoon ? (
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: AD.amber,
            display: 'inline-block',
          }} />
        ) : (
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: AD.green,
            display: 'inline-block',
          }} />
        )}
      </td>
      <td style={td}>
        <span style={{ color: AD.textMute, fontSize: 16, fontWeight: 700 }}>⋯</span>
      </td>
    </tr>
  );
}

function DeskTabPill({ label, count, active }) {
  const AD = window.AD_TOKENS;
  return (
    <button style={{
      all: 'unset', cursor: 'pointer',
      padding: '6px 14px', borderRadius: 6,
      background: active ? AD.blue : 'transparent',
      color: active ? '#fff' : AD.textDim,
      fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600, fontSize: 12,
    }}>{label} <span style={{
      fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700,
      opacity: 0.75, marginLeft: 3,
    }}>{count}</span></button>
  );
}

function DeskFilter({ label, value }) {
  const AD = window.AD_TOKENS;
  return (
    <button style={{
      all: 'unset', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '7px 12px', borderRadius: 8,
      background: AD.card, border: `1px solid ${AD.stroke}`,
    }}>
      <span style={{ fontSize: 11, color: AD.textMute, fontWeight: 600 }}>{label}:</span>
      <span style={{ fontSize: 12, color: AD.text, fontWeight: 600 }}>{value}</span>
      <span style={{ fontSize: 9, color: AD.textMute }}>▼</span>
    </button>
  );
}

function DeskShortcut({ k, label }) {
  const AD = window.AD_TOKENS;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <kbd style={{
        padding: '1px 6px', borderRadius: 3,
        background: AD.card, border: `1px solid ${AD.stroke}`,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
        color: AD.textDim, fontWeight: 600,
      }}>{k}</kbd>
      <span style={{
        fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
        color: AD.textMute, fontWeight: 500,
      }}>{label}</span>
    </span>
  );
}

// =============================================================================
// CHORE EDITOR — the big right pane.
// Every v0.5.0 / v0.6.0 chore field is inline-editable here. NO modals.
// =============================================================================

function ChoreEditor({ m }) {
  const AD = window.AD_TOKENS;
  const agent = window.FH_BY_ID(m.assigned);

  return (
    <div style={{
      width: 480, flexShrink: 0,
      background: AD.bg,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Editor header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${AD.stroke}`,
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: AD.textMute, fontWeight: 700, letterSpacing: '0.18em',
        }}>EDIT CHORE</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 6,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 9,
            background: `${agent.color}22`,
            border: `1px solid ${agent.color}44`,
            color: agent.color,
            display: 'grid', placeItems: 'center',
          }}>
            <ChoreIcon name={m.icon} size={22} strokeWidth={2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 18, color: AD.text, lineHeight: 1.1,
            }}>{m.name}</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              color: AD.textMute, letterSpacing: '0.1em', marginTop: 3,
            }}>chore_id · ch_4f3a · created 2026-04-22</div>
          </div>
          <DeskBtn small>⋯</DeskBtn>
        </div>
      </div>

      {/* Tabs inside editor */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: `1px solid ${AD.stroke}`,
        padding: '0 20px',
        flexShrink: 0,
      }}>
        <EditorTab label="Details"   active />
        <EditorTab label="Schedule" />
        <EditorTab label="Streak" />
        <EditorTab label="Reminders" />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px 20px' }}>
        {/* Name */}
        <EditField label="NAME">
          <input defaultValue={m.name} style={{
            all: 'unset', width: '100%',
            padding: '8px 12px', borderRadius: 7,
            background: AD.card, border: `1px solid ${AD.stroke}`,
            fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600,
            fontSize: 14, color: AD.text,
            boxSizing: 'border-box',
          }} />
        </EditField>

        {/* Description */}
        <EditField label="DESCRIPTION" hint="Shown when kid taps the ? icon">
          <textarea
            defaultValue="Fill her bowl with the food in the small bag on top of the fridge. Top up water too."
            style={{
              all: 'unset', width: '100%',
              padding: '8px 12px', borderRadius: 7,
              background: AD.card, border: `1px solid ${AD.stroke}`,
              fontFamily: '"Manrope", system-ui, sans-serif',
              fontSize: 13, color: AD.text, fontWeight: 500,
              minHeight: 56, lineHeight: 1.4, boxSizing: 'border-box',
              resize: 'vertical',
            }}/>
        </EditField>

        {/* Icon picker — 8 visible + more */}
        <EditField label="ICON" hint="Shown on Mission Control and themed kid pages">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6,
            padding: 10, borderRadius: 8,
            background: AD.card, border: `1px solid ${AD.stroke}`,
          }}>
            {['cat','dog','dishes','bed','tooth','book','piano','plant','broom','vacuum','trash','plate','snack','bread','pencil','wipe'].map((k, i) => (
              <button key={k} style={{
                all: 'unset', cursor: 'pointer',
                aspectRatio: '1', borderRadius: 6,
                background: k === m.icon ? `${AD.blue}22` : AD.cardHi,
                border: `1px solid ${k === m.icon ? AD.blue : AD.stroke}`,
                display: 'grid', placeItems: 'center',
                color: k === m.icon ? AD.blue : AD.textDim,
              }}>
                <ChoreIcon name={k} size={16} strokeWidth={2} />
              </button>
            ))}
          </div>
        </EditField>

        {/* 2-col fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <EditField label="ASSIGNEE">
            <DeskSelect>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar name={agent.name} color={agent.color} size={18} />
                <span style={{ fontWeight: 600 }}>{agent.name}</span>
              </div>
            </DeskSelect>
          </EditField>

          <EditField label="CATEGORY">
            <DeskSelect>{m.category}</DeskSelect>
          </EditField>

          <EditField label="POINTS">
            <input defaultValue={m.points} type="number" style={{
              all: 'unset', width: '100%', textAlign: 'center',
              padding: '8px 12px', borderRadius: 7,
              background: AD.card, border: `1px solid ${AD.stroke}`,
              fontFamily: '"JetBrains Mono", monospace', fontWeight: 700,
              fontSize: 14, color: AD.amber,
              boxSizing: 'border-box',
            }} />
          </EditField>

          <EditField label="RECURRENCE">
            <DeskSelect>Daily</DeskSelect>
          </EditField>
        </div>

        {/* Toggles */}
        <div style={{
          marginTop: 16,
          padding: '12px 14px', borderRadius: 8,
          background: AD.card, border: `1px solid ${AD.stroke}`,
        }}>
          <EditToggle label="Requires approval" hint="Parent reviews before points are awarded" checked={false} />
          <EditToggle label="Penalty if skipped" hint={`Skipping deducts −${m.penalty}pts at reset`} checked={m.penalty > 0} />
          <EditToggle label="Streak milestones" hint="Every 7 completions = +20pts bonus" checked={true} />
          <EditToggle label="Time reminder" hint="Push at 7:00 PM if still pending" checked={false} last />
        </div>

        {/* Penalty config — inline expander */}
        <EditField label="PENALTY CONFIG">
          <div style={{
            padding: '12px 14px', borderRadius: 8,
            background: AD.card, border: `1px solid ${AD.stroke}`,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 11, color: AD.textMute, fontWeight: 600, marginBottom: 4 }}>Points lost</div>
              <input defaultValue={m.penalty} type="number" style={{
                all: 'unset', width: '100%', textAlign: 'center',
                padding: '6px 10px', borderRadius: 6,
                background: AD.cardHi, border: `1px solid ${AD.stroke}`,
                fontFamily: '"JetBrains Mono", monospace', fontWeight: 700,
                fontSize: 13, color: AD.red, boxSizing: 'border-box',
              }}/>
            </div>
            <div>
              <div style={{ fontSize: 11, color: AD.textMute, fontWeight: 600, marginBottom: 4 }}>Daily after</div>
              <input defaultValue="2" type="number" style={{
                all: 'unset', width: '100%', textAlign: 'center',
                padding: '6px 10px', borderRadius: 6,
                background: AD.cardHi, border: `1px solid ${AD.stroke}`,
                fontFamily: '"JetBrains Mono", monospace', fontWeight: 700,
                fontSize: 13, color: AD.text, boxSizing: 'border-box',
              }}/>
            </div>
          </div>
        </EditField>

        {/* Danger zone */}
        <div style={{
          marginTop: 18, padding: '12px 14px', borderRadius: 8,
          background: 'transparent', border: `1px solid ${AD.red}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12, color: AD.red, fontWeight: 700 }}>Delete chore</div>
            <div style={{ fontSize: 11, color: AD.textMute, fontWeight: 500, marginTop: 2 }}>
              Removes the chore and its active instances. History is kept.
            </div>
          </div>
          <DeskBtn small danger>Delete</DeskBtn>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: `1px solid ${AD.stroke}`,
        background: AD.bg,
        display: 'flex', alignItems: 'center', gap: 10,
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: AD.green, fontWeight: 700, letterSpacing: '0.16em',
        }}>● SAVED</span>
        <span style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
          color: AD.textMute, fontWeight: 500,
        }}>Auto-save · last edit just now</span>
        <span style={{ flex: 1 }} />
        <DeskBtn small>Duplicate</DeskBtn>
        <DeskBtn small>Close</DeskBtn>
      </div>
    </div>
  );
}

function EditorTab({ label, active }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      padding: '10px 14px',
      borderBottom: active ? `2px solid ${AD.blue}` : '2px solid transparent',
      fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: active ? 700 : 600,
      fontSize: 12, color: active ? AD.text : AD.textMute,
      cursor: 'pointer', marginBottom: -1,
    }}>{label}</div>
  );
}

function EditField({ label, hint, children }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        marginBottom: 5,
      }}>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: AD.textMute, fontWeight: 700, letterSpacing: '0.18em',
        }}>{label}</span>
        {hint && <span style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
          color: AD.textMute, fontWeight: 500, fontStyle: 'italic',
        }}>· {hint}</span>}
      </div>
      {children}
    </div>
  );
}

function DeskSelect({ children }) {
  const AD = window.AD_TOKENS;
  return (
    <button style={{
      all: 'unset', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 8,
      width: '100%',
      padding: '8px 12px', borderRadius: 7,
      background: AD.card, border: `1px solid ${AD.stroke}`,
      fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
      color: AD.text, boxSizing: 'border-box',
    }}>
      <span style={{ flex: 1 }}>{children}</span>
      <span style={{ color: AD.textMute, fontSize: 10 }}>▼</span>
    </button>
  );
}

function EditToggle({ label, hint, checked, last }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 0',
      borderBottom: last ? 'none' : `1px solid ${AD.stroke}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
          color: AD.text, fontWeight: 600,
        }}>{label}</div>
        {hint && <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
          color: AD.textMute, fontWeight: 500, marginTop: 1,
        }}>{hint}</div>}
      </div>
      <Toggle checked={checked} />
    </div>
  );
}

Object.assign(window, { AdTasksDesktop });
