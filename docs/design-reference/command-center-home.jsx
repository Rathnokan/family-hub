// Command Center Home — Echo Show 15 (1920×1080).
//
// MIRRORS src/card/hub-skins/classic.js (v0.6.0 Session 2 shipped).
// Layout: family-name + day-of-week header, AGENTS ON DUTY row, ROOMS grid,
// today strip (weather + approvals only — no schedule until Calendar room is live).
//
// Major differences from the original mock:
//   - No giant FAMILY HUB wordmark or header stat block
//   - Person tiles show: code, name, "Rank · subLabel" line, dual PTS/OPEN block, allowance pill
//   - Room tiles use SVG glyph icons (not chore icons), inline stats
//   - Today strip = weather icon + temp/cond on the left, approval count on the right

const HC = window.FH_PALETTE;

// SVG room icons — match what's in src/card/rooms/index.js (paths copied).
const ROOM_ICONS = {
  check:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  wrench:   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.78 15.3 19.78 21.3 21.89 19.14 15.89 13.14 13.78 15.3M17.5 10.1c-.39 0-.81-.05-1.14-.19L4.97 21.25 2.86 19.14l7.41-7.4-1.77-1.78-.72.7-1.45-1.41V12.1L5.62 12.82 2.08 9.28l.71-.72H5.62L4.18 7.11 7.78 3.5c.98-1 2.69-1 3.69 0L9.36 5.61l1.42 1.44-.72.71 1.77 1.78 2.37-2.38c-.14-.33-.2-.75-.2-1.16C14 3.79 15.79 2 18 2c.68 0 1.32.19 1.86.5L17.5 4.86l1.64 1.64L21.5 4.14C21.81 4.68 22 5.32 22 6c0 2.21-1.79 4-4 4-.18 0-.34-.03-.5-.05v.15z"/></svg>,
  meals:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05M1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-1.46-.74-2.87-2.22-4.28-1.13-1.07-2.84-1.93-4.43-2.43-.25-.08-.5-.12-.76-.12H8.5c-.25 0-.5.04-.76.12-1.59.5-3.3 1.36-4.43 2.43C1.83 13.13 1 14.54 1 16h15.03z"/></svg>,
  house:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>,
  sun:      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>,
  cloud:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>,
};

// ----------------------------------------------------------------------------

function HCHeader({ familyName, paused }) {
  const now = new Date(2026, 4, 13, 7, 42);
  const day  = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 32px',
      borderBottom: `1px solid ${HC.stroke}`,
    }}>
      <div style={{
        fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
        fontSize: 34, color: HC.text, letterSpacing: '-0.01em',
      }}>{familyName}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600,
          fontSize: 22, color: HC.textDim, letterSpacing: '0.01em',
        }}>{day}, {date}</div>
        {paused && (
          <div style={{
            padding: '6px 14px', borderRadius: 99,
            background: `${HC.gold}1A`,
            border: `1px solid ${HC.gold}55`,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
            fontWeight: 700, color: HC.gold, letterSpacing: '0.22em',
          }}>PAUSED</div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------

function HCAgentTile({ agent, openCount, pendingCount }) {
  const meta = window.FH_THEME_META[agent.themeKey];
  const rank = window.FH_RANKS[agent.themeKey];
  const rankName = agent.rankIndex >= 999
    ? rank[rank.length - 1].name
    : rank[Math.min(Math.max(0, agent.rankIndex), rank.length - 1)].name;

  return (
    <div style={{
      position: 'relative',
      borderRadius: 16,
      background: `linear-gradient(180deg, ${meta.tint}EE 0%, ${HC.panel} 75%)`,
      border: `1px solid ${HC.stroke}`,
      borderTop: `2px solid ${agent.color}`,
      padding: 22,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0,
      cursor: 'pointer',
    }}>
      {/* Sigil watermark */}
      <span style={{
        position: 'absolute', top: -28, right: -10,
        fontFamily: '"Bricolage Grotesque", sans-serif',
        fontSize: 220, color: agent.color, opacity: 0.10, lineHeight: 0.8,
        pointerEvents: 'none', fontWeight: 800,
      }}>{meta.sigil}</span>

      {/* Pending approval dot */}
      {pendingCount > 0 && (
        <span style={{
          position: 'absolute', top: 14, right: 14,
          width: 14, height: 14, borderRadius: 99,
          background: HC.red,
          boxShadow: `0 0 0 3px ${HC.panel}`,
        }} title={`${pendingCount} pending`} />
      )}

      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        letterSpacing: '0.28em', color: agent.color, fontWeight: 700,
      }}>AGT · {agent.code}</div>

      <div style={{
        fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
        fontSize: 40, color: HC.text, lineHeight: 1.0, letterSpacing: '-0.02em',
        marginTop: 6,
      }}>{agent.name}</div>

      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        color: HC.textDim, fontWeight: 600, letterSpacing: '0.16em',
        marginTop: 8, textTransform: 'uppercase',
      }}>{rankName} · {meta.subLabel}</div>

      <div style={{ flex: 1 }} />

      {/* Dual stat block — PTS · OPEN */}
      <div style={{
        display: 'flex', alignItems: 'center',
        marginTop: 18, paddingTop: 14,
        borderTop: `1px dashed ${HC.stroke}`,
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 36, color: HC.text, lineHeight: 1,
          }}>{agent.balance}</span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: HC.textMute, fontWeight: 700, letterSpacing: '0.24em', marginTop: 4,
          }}>PTS</span>
        </div>
        <div style={{ width: 1, height: 36, background: HC.stroke }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 36, color: openCount > 0 ? agent.color : HC.textMute, lineHeight: 1,
          }}>{openCount}</span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
            color: HC.textMute, fontWeight: 700, letterSpacing: '0.24em', marginTop: 4,
          }}>OPEN</span>
        </div>
      </div>

      {/* Allowance pill */}
      {agent.kind === 'kid' && (
        <div style={{
          marginTop: 10, alignSelf: 'flex-start',
          padding: '4px 10px', borderRadius: 99,
          background: `${HC.green}1A`, border: `1px solid ${HC.green}33`,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
          fontWeight: 700, color: HC.green, letterSpacing: '0.08em',
        }}>+{agent.kind === 'kid' ? (agent.id === 'jackson' ? 25 : agent.id === 'olivia' ? 40 : 50) : 0}/wk</div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------

function HCRoomTile({ room }) {
  const live = room.status === 'live';
  return (
    <div style={{
      position: 'relative',
      borderRadius: 14,
      background: live
        ? `linear-gradient(180deg, ${HC.panel} 0%, ${HC.panel2} 100%)`
        : HC.panel,
      border: `1px solid ${live ? room.accent + '33' : HC.stroke}`,
      padding: 22,
      display: 'flex', gap: 18,
      minHeight: 0, overflow: 'hidden',
      opacity: live ? 1 : 0.82,
      cursor: live ? 'pointer' : 'default',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 12,
        background: live ? `${room.accent}1A` : HC.ink2,
        border: `1px solid ${live ? room.accent + '44' : HC.stroke}`,
        display: 'grid', placeItems: 'center',
        color: live ? room.accent : HC.textMute,
        flexShrink: 0,
      }}>
        <span style={{ width: 32, height: 32, display: 'block' }}>
          {ROOM_ICONS[room.icon]}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
          fontSize: 22, color: HC.text, lineHeight: 1.0, letterSpacing: '-0.005em',
        }}>{room.label}</div>
        <div style={{
          fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 13,
          color: HC.textDim, fontWeight: 500, marginTop: 5,
        }}>{room.sub}</div>

        {/* Live: inline stats. Coming: COMING SOON badge + preview line. */}
        {live && room.stats && room.stats.length > 0 ? (
          <div style={{
            display: 'flex', gap: 22, marginTop: 14, alignItems: 'baseline',
          }}>
            {room.stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{
                  fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
                  fontSize: 28, color: s.accent || room.accent, lineHeight: 1,
                }}>{s.value}</span>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                  color: HC.textMute, fontWeight: 600, letterSpacing: '0.12em',
                }}>{s.label}</span>
              </div>
            ))}
          </div>
        ) : !live ? (
          <React.Fragment>
            <div style={{
              marginTop: 12, alignSelf: 'flex-start',
              padding: '4px 10px', borderRadius: 6,
              background: `${room.accent}1A`, border: `1px solid ${room.accent}44`,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              fontWeight: 700, color: room.accent, letterSpacing: '0.22em',
            }}>COMING SOON</div>
            {room.preview && (
              <div style={{
                marginTop: 8, fontFamily: '"Manrope", system-ui, sans-serif',
                fontSize: 12, color: HC.textMute, fontWeight: 500, lineHeight: 1.4,
              }}>{room.preview}</div>
            )}
          </React.Fragment>
        ) : null}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------

function HCTodayStrip({ weather, pendingCount }) {
  // Match _weatherIcon mapping in classic.js
  const iconKey = weather.cond === 'sunny' || weather.cond === 'clear_night' ? 'sun' : 'cloud';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 24,
      padding: '18px 24px',
      background: HC.panel,
      border: `1px solid ${HC.stroke}`,
      borderRadius: 14,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        paddingRight: 24, borderRight: `1px solid ${HC.stroke}`,
      }}>
        <span style={{
          width: 40, height: 40, display: 'inline-block',
          color: HC.cyan,
        }}>{ROOM_ICONS[iconKey]}</span>
        <div>
          <div style={{
            fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
            fontSize: 26, color: HC.text, lineHeight: 1,
          }}>{weather.temp}°</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            color: HC.textDim, fontWeight: 600, letterSpacing: '0.12em', marginTop: 3,
          }}>{weather.label}</div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {pendingCount > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              padding: '4px 12px', borderRadius: 99,
              background: HC.red, color: HC.text,
              fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800,
              fontSize: 18,
            }}>{pendingCount}</span>
            <span style={{
              fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 16,
              color: HC.text, fontWeight: 600,
            }}>{pendingCount === 1 ? 'approval pending' : 'approvals pending'}</span>
          </div>
        ) : (
          <div style={{
            fontFamily: '"Manrope", system-ui, sans-serif', fontSize: 16,
            color: HC.textMute, fontWeight: 500, fontStyle: 'italic',
          }}>All clear — no approvals waiting</div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------

function HCSectionLabel({ label }) {
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace', fontSize: 13,
      letterSpacing: '0.32em', color: HC.textMute, fontWeight: 700,
      marginBottom: 12,
    }}>// {label}</div>
  );
}

// ----------------------------------------------------------------------------

function CommandCenterHome() {
  const now = window.FH_NOW;
  const missionsByAgent = window.FH_MISSIONS.reduce((acc, m) => {
    (acc[m.assigned] ||= []).push(m); return acc;
  }, {});
  const approvalsByAgent = window.FH_APPROVALS.reduce((acc, a) => {
    acc[a.person] = (acc[a.person] || 0) + 1; return acc;
  }, {});

  return (
    <div style={{
      width: 1920, height: 1080,
      background: `radial-gradient(ellipse at 20% -10%, ${HC.panel} 0%, ${HC.ink} 70%)`,
      color: HC.text,
      fontFamily: '"Manrope", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <HCHeader familyName={now.familyName} paused={now.globalPaused} />

      <div style={{
        flex: 1,
        padding: '24px 32px 24px',
        display: 'flex', flexDirection: 'column', gap: 18,
        minHeight: 0,
      }}>
        {/* Agents row */}
        <div>
          <HCSectionLabel label="AGENTS ON DUTY" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
            height: 320,
          }}>
            {window.FH_AGENTS.map(a => (
              <HCAgentTile key={a.id} agent={a}
                openCount={(missionsByAgent[a.id] || []).length}
                pendingCount={approvalsByAgent[a.id] || 0} />
            ))}
          </div>
        </div>

        {/* Rooms grid */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <HCSectionLabel label="ROOMS" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 16,
            flex: 1, minHeight: 0,
          }}>
            {window.FH_ROOMS.map(r => (
              <HCRoomTile key={r.id} room={r} />
            ))}
            {/* 6th tile = today strip in its place, spanning */}
          </div>
        </div>

        <HCTodayStrip weather={now.weather} pendingCount={window.FH_APPROVALS.length} />
      </div>
    </div>
  );
}

Object.assign(window, { CommandCenterHome });
