// Admin Desktop — Settings
// Two-pane: section nav on the left, detail view on the right.
// Different from mobile (bottom sheet) — full-page surface for power-user config.

function AdSettingsDesktop() {
  const AD = window.AD_TOKENS;
  const sections = [
    { id: 'general',     label: 'General',             icon: '◎' },
    { id: 'penalties',   label: 'Penalties & Streaks', icon: '◐', active: true },
    { id: 'categories',  label: 'Categories',          icon: '◍' },
    { id: 'home',        label: 'Home Layout',         icon: '◉' },
    { id: 'notify',      label: 'Notifications',       icon: '◑' },
    { id: 'maintenance', label: 'Maintenance',         icon: '◌', warn: true },
  ];

  return (
    <div style={{
      width: 1440, height: 900,
      background: AD.bg, color: AD.text,
      fontFamily: '"Manrope", system-ui, sans-serif',
      display: 'flex', overflow: 'hidden',
    }}>
      <AdSidebar active="settings" alertCount={window.FH_APPROVALS.length} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdTopBar
          breadcrumb="SETTINGS · PENALTIES & STREAKS"
          title="Penalties & Streaks"
          actions={
            <React.Fragment>
              <DeskBtn>Discard</DeskBtn>
              <DeskBtn primary>Save changes</DeskBtn>
            </React.Fragment>
          } />

        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Section nav */}
          <div style={{
            width: 240, flexShrink: 0,
            borderRight: `1px solid ${AD.stroke}`,
            padding: 12,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {sections.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 11px', borderRadius: 7,
                  background: s.active ? `${AD.blue}1A` : 'transparent',
                  color: s.active ? AD.text : (s.warn ? AD.amber : AD.textDim),
                  cursor: 'pointer',
                  position: 'relative',
                }}>
                  {s.active && <span style={{
                    position: 'absolute', left: -12, top: 6, bottom: 6, width: 3,
                    background: AD.blue, borderRadius: '0 2px 2px 0',
                  }} />}
                  <span style={{
                    width: 18, height: 18, display: 'grid', placeItems: 'center',
                    fontSize: 13, color: s.active ? AD.blue : (s.warn ? AD.amber : AD.textMute),
                  }}>{s.icon}</span>
                  <span style={{
                    flex: 1,
                    fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
                    fontWeight: s.active ? 700 : 600,
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div style={{
            flex: 1, overflow: 'auto', padding: 32,
            maxWidth: 720,
          }}>
            {/* Section header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
                fontSize: 24, color: AD.text, lineHeight: 1, letterSpacing: '-0.01em',
              }}>Penalties & Streaks</div>
              <div style={{
                fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 14,
                color: AD.textMute, fontWeight: 500, marginTop: 6, lineHeight: 1.5,
              }}>How missed chores affect kids' points and streaks. The global toggle below pauses everything at once (useful for vacations).</div>
            </div>

            {/* Master toggle — prominent */}
            <SettingsBlock
              accent={AD.green}
              header={
                <React.Fragment>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
                      fontSize: 16, color: AD.text,
                    }}>Globally active</div>
                    <div style={{
                      fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
                      color: AD.green, fontWeight: 600, marginTop: 3,
                    }}>● Skips break streaks and deduct points at the daily tick.</div>
                  </div>
                  <Toggle checked={true} />
                </React.Fragment>
              }>
              <DeskRow label="Alert time" hint="When the daily 'last chance' push fires for chores about to reset" value={
                <DeskInput value="08:00" suffix="AM" width={140} />
              } />
            </SettingsBlock>

            {/* Rank evaluation */}
            <SettingsBlock title="Weekly rank evaluation"
              subtitle="Each kid's rank is reassessed once a week against their weekly points.">
              <DeskRow label="Evaluation day" value={
                <DeskSelect>Monday</DeskSelect>
              } />
              <DeskRow label="Drop threshold" hint="Below this many points → rank drops one level" value={
                <DeskInput value="50" suffix="pts" width={140} />
              } />
              <DeskRow label="Gain threshold" hint="At or above this many points → rank rises" value={
                <DeskInput value="75" suffix="pts" width={140} />
              } />

              {/* Visual preview */}
              <div style={{
                marginTop: 12, padding: '14px 16px', borderRadius: 8,
                background: AD.cardSoft, border: `1px solid ${AD.stroke}`,
              }}>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  color: AD.textMute, fontWeight: 700, letterSpacing: '0.18em',
                  marginBottom: 8,
                }}>WEEKLY RANK BAR PREVIEW</div>
                <div style={{
                  position: 'relative', height: 14,
                  background: AD.cardHi, border: `1px solid ${AD.stroke}`,
                  borderRadius: 3, overflow: 'visible',
                }}>
                  {/* drop region */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: '67%', background: `linear-gradient(to right, ${AD.red}66, ${AD.amber}66)`,
                  }} />
                  <div style={{
                    position: 'absolute', left: '67%', top: 0, bottom: 0,
                    width: '33%', background: `${AD.green}66`,
                  }} />
                  {/* drop tick */}
                  <div style={{
                    position: 'absolute', left: '50%', top: -4, bottom: -4,
                    width: 2, background: AD.red,
                  }} />
                  <div style={{
                    position: 'absolute', left: '67%', top: -4, bottom: -4,
                    width: 2, background: AD.green,
                  }} />
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginTop: 6,
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  color: AD.textMute, fontWeight: 700, letterSpacing: '0.06em',
                }}>
                  <span style={{ color: AD.red }}>0pts · DROP</span>
                  <span style={{ color: AD.red, marginLeft: 130 }}>↑ 50</span>
                  <span style={{ color: AD.amber }}>HOLD</span>
                  <span style={{ color: AD.green }}>↑ 75 · GAIN</span>
                  <span style={{ color: AD.green }}>100pts+</span>
                </div>
              </div>
            </SettingsBlock>

            {/* Per-kid override */}
            <SettingsBlock title="Per-person overrides"
              subtitle="Pause penalties for one kid only (e.g. they're sick or away).">
              {window.FH_AGENTS.filter(a => a.kind === 'kid').map(a => (
                <DeskRow
                  key={a.id}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={a.name} color={a.color} size={22} />
                      <span style={{ fontWeight: 600 }}>{a.name}</span>
                    </span>
                  }
                  hint={a.id === 'spencer' ? 'Paused since May 10 · resumes manually' : 'Active'}
                  value={<Toggle checked={a.id !== 'spencer'} />}
                />
              ))}
            </SettingsBlock>

            {/* Footer help */}
            <div style={{
              marginTop: 30, padding: '14px 16px', borderRadius: 8,
              background: `${AD.blue}0E`, border: `1px solid ${AD.blue}33`,
              display: 'flex', gap: 12,
            }}>
              <span style={{ color: AD.blue, fontSize: 18, lineHeight: 1 }}>ⓘ</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: AD.text }}>About the rank mechanic</div>
                <div style={{
                  fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
                  color: AD.textDim, fontWeight: 500, marginTop: 4, lineHeight: 1.5,
                }}>Rank changes are evaluated once a week against weekly point totals — not lifetime points. This means kids who slack one week feel it, but the rank floor (Saibaman / Drafter / Apprentice / etc.) is the floor — they won't drop below it. <a style={{ color: AD.blue, fontWeight: 600 }}>Read more →</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsBlock({ title, subtitle, accent, header, children }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      marginBottom: 22,
      background: AD.card,
      border: `1px solid ${accent ? accent + '33' : AD.stroke}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {header && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px',
          borderBottom: `1px solid ${AD.stroke}`,
        }}>{header}</div>
      )}
      {title && (
        <div style={{
          padding: '14px 18px 10px',
          borderBottom: `1px solid ${AD.stroke}`,
        }}>
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700,
            fontSize: 15, color: AD.text,
          }}>{title}</div>
          {subtitle && <div style={{
            fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 12,
            color: AD.textMute, fontWeight: 500, marginTop: 3, lineHeight: 1.4,
          }}>{subtitle}</div>}
        </div>
      )}
      <div style={{ padding: '6px 18px 14px' }}>
        {children}
      </div>
    </div>
  );
}

function DeskRow({ label, hint, value }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '12px 0',
      borderBottom: `1px solid ${AD.stroke}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {typeof label === 'string' ? (
          <div style={{
            fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
            color: AD.text, fontWeight: 600,
          }}>{label}</div>
        ) : label}
        {hint && <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
          color: AD.textMute, fontWeight: 500, marginTop: 2, lineHeight: 1.4,
        }}>{hint}</div>}
      </div>
      {value}
    </div>
  );
}

function DeskInput({ value, suffix, width = 180 }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      width, padding: '7px 10px', borderRadius: 7,
      background: AD.card, border: `1px solid ${AD.stroke}`,
    }}>
      <input defaultValue={value} style={{
        all: 'unset', flex: 1,
        fontFamily: '"JetBrains Mono", monospace', fontWeight: 700,
        fontSize: 13, color: AD.text,
      }} />
      {suffix && <span style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        color: AD.textMute, fontWeight: 600, letterSpacing: '0.08em',
      }}>{suffix}</span>}
    </div>
  );
}

Object.assign(window, { AdSettingsDesktop });
