// Admin Redesign — Settings sheet.
// Rendered as a bottom-sheet overlay over any base screen. Grouped sections,
// dangerous actions isolated to the bottom MAINTENANCE block.

function SettingsSheet() {
  const AD = window.AD_TOKENS;
  return (
    <PhoneShell>
      {/* Faint backdrop showing the Today screen behind */}
      <div style={{
        position: 'absolute', inset: 0,
        background: AD.bg,
        opacity: 0.4,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)',
      }} />

      {/* The actual sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        top: 90, // peek of the screen below
        background: AD.bgHi,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 -8px 32px rgba(0,0,0,.5)',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <span style={{
            width: 40, height: 4, borderRadius: 99, background: AD.stroke,
          }} />
        </div>

        {/* Sheet header */}
        <div style={{
          padding: '0 20px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${AD.stroke}`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 22, color: AD.text, lineHeight: 1,
            }}>Settings</div>
            <div style={{
              fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
              color: AD.textMute, fontWeight: 500, marginTop: 4,
            }}>Rathnokan Household</div>
          </div>
          <button style={{
            all: 'unset', cursor: 'pointer',
            width: 36, height: 36, borderRadius: 9,
            background: AD.card, border: `1px solid ${AD.stroke}`,
            color: AD.textDim,
            display: 'grid', placeItems: 'center',
            fontSize: 20, fontWeight: 700,
          }}>✕</button>
        </div>

        {/* Body — grouped sections */}
        <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 30px' }}>

          {/* GENERAL */}
          <SettingsGroup label="General">
            <Setting label="Family name"      value="Rathnokan Household" chevron />
            <Setting label="Points per dollar" value="10 pts = $1"          chevron />
            <Setting label="Show $ value to kids" value={<Toggle checked={false} />} />
          </SettingsGroup>

          {/* PENALTIES & STREAKS — most-touched group, prominent */}
          <SettingsGroup label="Penalties & Streaks">
            <Setting
              label="Globally active"
              subtitle="Skips break streaks · penalties apply"
              value={<Toggle checked={true} />}
              accentBorder={AD.green}
            />
            <Setting label="Alert time"          value="8:00 AM"  chevron />
            <Setting label="Rank evaluation"     value="Monday"   chevron subtitle="Drop <50pts · Gain ≥75pts" />
          </SettingsGroup>

          {/* CATEGORIES */}
          <SettingsGroup label="Categories"
            help="Sections that group chores in the kitchen Echo Show order.">
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6,
              padding: '4px 0 10px',
            }}>
              {window.FH_CATEGORIES.map(c => (
                <div key={c} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 10px 6px 12px', borderRadius: 99,
                  background: AD.card, border: `1px solid ${AD.stroke}`,
                  fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600,
                  fontSize: 12, color: AD.text,
                }}>
                  {c}
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: AD.cardHi, color: AD.textMute,
                    display: 'grid', placeItems: 'center', fontSize: 11, cursor: 'pointer',
                  }}>×</span>
                </div>
              ))}
              <button style={{
                all: 'unset', cursor: 'pointer',
                padding: '6px 12px', borderRadius: 99,
                border: `1px dashed ${AD.strokeHi}`,
                fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600,
                fontSize: 12, color: AD.textDim,
              }}>+ Add category</button>
            </div>
          </SettingsGroup>

          {/* HOME LAYOUT — Echo Show 15 surface controls (v0.6.0 rooms_config) */}
          <SettingsGroup label="Home layout"
            help="Controls what shows up on the kitchen Echo Show 15.">
            <Setting label="Weather entity"     value="weather.home"        chevron />
            <Setting label="Calendar entities"  value="None set"            chevron subtitle="Powers today-strip when Calendar room ships" />
            <Setting label="Visible rooms"      value="Chores · Home Care"  chevron subtitle="Tap to manage coming-soon rooms" />
          </SettingsGroup>

          {/* MAINTENANCE — DANGEROUS actions, isolated */}
          <SettingsGroup label="Maintenance" tone="warn">
            <Setting label="Export backup" subtitle="Saves a dated copy of family_hub_data.json" value={
              <span style={{
                fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
                color: AD.blue, fontWeight: 600,
              }}>Export</span>
            } />
            <Setting label="Rebuild data" subtitle="Removes ghost instances · safe but slow" value={
              <span style={{
                fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
                color: AD.amber, fontWeight: 700,
              }}>Run</span>
            } accentBorder={AD.amber} />
            <Setting label="Force daily tick" subtitle="Testing & recovery only" value={
              <span style={{
                fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
                color: AD.amber, fontWeight: 700,
              }}>Trigger</span>
            } />
          </SettingsGroup>

          {/* Version footer */}
          <div style={{
            textAlign: 'center', padding: '20px 0 10px',
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            color: AD.textMute, fontWeight: 600, letterSpacing: '0.16em',
          }}>FAMILY HUB v0.6.0 · ops day 217</div>
        </div>
      </div>
    </PhoneShell>
  );
}

function SettingsGroup({ label, help, tone, children }) {
  const AD = window.AD_TOKENS;
  const tint = tone === 'warn' ? AD.amber : null;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        padding: '0 4px 8px',
        display: 'flex', alignItems: 'baseline', gap: 8,
      }}>
        <span style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 700,
          fontSize: 12, letterSpacing: '0.12em',
          color: tint || AD.textMute, textTransform: 'uppercase',
        }}>{label}</span>
      </div>
      <div style={{
        background: AD.card,
        border: `1px solid ${tint ? tint + '44' : AD.stroke}`,
        borderRadius: 12,
        overflow: 'hidden',
      }}>{children}</div>
      {help && (
        <div style={{
          padding: '6px 4px 0',
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
          color: AD.textMute, fontWeight: 500, lineHeight: 1.4,
        }}>{help}</div>
      )}
    </div>
  );
}

function Setting({ label, subtitle, value, chevron, accentBorder }) {
  const AD = window.AD_TOKENS;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: `1px solid ${AD.stroke}`,
      borderLeft: accentBorder ? `3px solid ${accentBorder}` : 'none',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 14,
          color: AD.text, fontWeight: 600,
        }}>{label}</div>
        {subtitle && <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 11,
          color: AD.textMute, fontWeight: 500, marginTop: 2, lineHeight: 1.4,
        }}>{subtitle}</div>}
      </div>
      {typeof value === 'string' ? (
        <span style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
          color: AD.textDim, fontWeight: 500,
        }}>{value}</span>
      ) : value}
      {chevron && <span style={{ color: AD.textMute, fontSize: 16, marginLeft: -4 }}>›</span>}
    </div>
  );
}

Object.assign(window, { SettingsSheet });
