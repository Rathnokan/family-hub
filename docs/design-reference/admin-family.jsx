// Admin Redesign — Family screen.
// Per-person cards. Tap-to-expand reveals theme picker, child_mode,
// penalty pause, allowance editor — all the v0.6.0 person fields, inline.

function FamilyPersonCard({ agent, expanded }) {
  const AD = window.AD_TOKENS;
  const themeMeta = window.FH_THEME_META[agent.themeKey];
  const isKid = agent.kind === 'kid';
  const streakCount = window.FH_MISSIONS.filter(m => m.assigned === agent.id && m.streakCurrent >= 2).length;
  const allowance = { jackson: 25, olivia: 40, spencer: 50, shannon: 50, jim: 0 }[agent.id];
  const penaltyPaused = false;

  return (
    <Card padded={false} style={{
      borderTop: `2px solid ${agent.color}`,
      overflow: 'hidden',
    }}>
      {/* Collapsed row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px',
      }}>
        <Avatar name={agent.name} color={agent.color} size={50} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 20, color: AD.text, lineHeight: 1,
            }}>{agent.name}</span>
            <Pill style={{ fontSize: 10 }}>{isKid ? 'KID' : 'PARENT'}</Pill>
            {!isKid && <Pill color={AD.amber} style={{ fontSize: 10 }}>HANDLER</Pill>}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
            <span style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 28, color: AD.text, lineHeight: 1,
            }}>{agent.balance}</span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
              color: AD.textMute, fontWeight: 700, letterSpacing: '0.18em',
            }}>PTS</span>
            <span style={{
              fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
              color: AD.textDim, fontWeight: 500,
            }}>· ${(agent.balance / 10).toFixed(2)}</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 6,
          }}>
            {allowance > 0 && (
              <Pill color={AD.green} style={{ fontSize: 10 }}>+{allowance}/wk</Pill>
            )}
            {streakCount > 0 && (
              <Pill color={AD.amber} style={{ fontSize: 10 }}>🔥 {streakCount} streaks</Pill>
            )}
            {penaltyPaused && (
              <Pill color={AD.amber} style={{ fontSize: 10 }}>⏸ PAUSED</Pill>
            )}
          </div>
        </div>

        {/* Inline quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <IconBtn color={AD.green} size={34}>+</IconBtn>
          <IconBtn color={AD.red}   size={34}>−</IconBtn>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{
          padding: '0 16px 16px',
          borderTop: `1px solid ${AD.stroke}`,
          background: AD.cardSoft,
        }}>
          {/* Theme + codename */}
          <SettingRow label="Theme" value={
            <ThemeSelector current={agent.themeKey} />
          } />

          <SettingRow label="Codename"  value={agent.code} editable />
          <SettingRow label="Color"     value={
            <span style={{
              width: 28, height: 28, borderRadius: '50%',
              background: agent.color, border: `2px solid ${AD.stroke}`,
              display: 'inline-block',
            }} />
          } editable />

          {isKid && (
            <React.Fragment>
              <SettingRow label="Child mode" subtitle="Big icons, simple labels" value={
                <Toggle checked={agent.childMode} />
              } />
              <SettingRow label="Penalties & streaks" subtitle={penaltyPaused ? 'Paused — won\'t break streaks' : 'Active'} value={
                <Toggle checked={!penaltyPaused} />
              } />
              <SettingRow label="Allowance" subtitle={allowance > 0 ? `+${allowance}pts weekly` : 'None set'} value={
                <span style={{ color: AD.blue, fontWeight: 600 }}>Edit</span>
              } />
            </React.Fragment>
          )}

          <SettingRow label="Notify target" subtitle="HA notification service" value={
            <span style={{ color: AD.blue, fontWeight: 600 }}>Set</span>
          } />

          {/* Streak detail */}
          {isKid && streakCount > 0 && (
            <div style={{
              marginTop: 12, padding: 12,
              background: AD.card, border: `1px solid ${AD.stroke}`, borderRadius: 10,
            }}>
              <div style={{
                fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
                color: AD.textMute, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', marginBottom: 8,
              }}>🔥 Active streaks</div>
              {window.FH_MISSIONS.filter(m => m.assigned === agent.id && m.streakCurrent >= 2).slice(0, 4).map(m => (
                <div key={m.id} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                  fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
                }}>
                  <span style={{ color: AD.text }}>{m.name}</span>
                  <span style={{ color: AD.amber, fontWeight: 700 }}>{m.streakCurrent} days</span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom row of secondary actions */}
          <div style={{
            display: 'flex', gap: 8, marginTop: 14,
          }}>
            <button style={{
              flex: 1, all: 'unset', cursor: 'pointer',
              padding: '10px 14px', borderRadius: 9,
              background: AD.cardHi, border: `1px solid ${AD.stroke}`,
              fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600,
              fontSize: 13, color: AD.text, textAlign: 'center',
            }}>View their page →</button>
            <button style={{
              all: 'unset', cursor: 'pointer',
              padding: '10px 14px', borderRadius: 9,
              background: `${AD.red}1A`, border: `1px solid ${AD.red}44`,
              fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600,
              fontSize: 13, color: AD.red, textAlign: 'center',
            }}>Remove</button>
          </div>
        </div>
      )}
    </Card>
  );
}

function SettingRow({ label, subtitle, value, editable }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0',
      borderBottom: `1px solid ${AD.stroke}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 14,
          color: AD.text, fontWeight: 600,
        }}>{label}</div>
        {subtitle && <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
          color: AD.textMute, fontWeight: 500, marginTop: 2,
        }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {typeof value === 'string' ? (
          <span style={{
            fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 14,
            color: AD.textDim, fontWeight: 500,
          }}>{value}</span>
        ) : value}
        {editable && <span style={{ color: AD.textMute, fontSize: 16 }}>›</span>}
      </div>
    </div>
  );
}

function ThemeSelector({ current }) {
  const AD = window.AD_TOKENS;
  const themes = ['classic', 'engineer', 'baker', 'dinos', 'hp', 'dbz'];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {themes.map(t => {
        const meta = window.FH_THEME_META[t];
        const active = t === current;
        return (
          <div key={t} style={{
            width: 30, height: 30, borderRadius: 8,
            background: meta.tint,
            border: `2px solid ${active ? AD.blue : AD.stroke}`,
            display: 'grid', placeItems: 'center',
            color: ['baker','hp','dinos'].includes(t) ? '#3A1F12' : AD.text,
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 14,
          }}>{meta.sigil}</div>
        );
      })}
    </div>
  );
}

function FamilyScreen() {
  const AD = window.AD_TOKENS;
  // Show Olivia expanded — that's the most informative state to mock
  const expandedId = 'olivia';

  return (
    <PhoneShell>
      <AppBar title="Family" subtitle="5 members · 3 kids" onSettings />

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 90px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {window.FH_AGENTS.map(a => (
            <FamilyPersonCard key={a.id} agent={a} expanded={a.id === expandedId} />
          ))}
        </div>

        <button style={{
          all: 'unset', cursor: 'pointer',
          marginTop: 14, padding: '14px',
          width: '100%', boxSizing: 'border-box',
          background: 'transparent',
          border: `2px dashed ${AD.stroke}`,
          borderRadius: 14,
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
          fontSize: 15, color: AD.textDim, textAlign: 'center',
        }}>+ Add person</button>
      </div>

      <TabBar active="family" />
    </PhoneShell>
  );
}

Object.assign(window, { FamilyScreen, FamilyPersonCard });
