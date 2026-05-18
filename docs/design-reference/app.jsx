// Canvas wiring — Family Hub for Echo Show 15.
//
// Sections:
//   1. Home Command Center — the new family hub front door
//   2. Person pages — 5 themed pages, one per family member
//   3. Earlier directions — kept for reference / comparison

const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <DesignCanvas defaultZoom={0.6}>
      <DCSection
        id="admin-desktop"
        title="Admin · Desktop (1440×900)"
        subtitle="Power-user console for the parent doing backend work on a PC. Persistent sidebar, master-detail panes, inline editors. Different surface than the mobile admin — same data, same actions, more density.">
        <DCArtboard id="admin-desk-today" label="Today · Dashboard" width={1440} height={900}>
          <AdTodayDesktop />
        </DCArtboard>
        <DCArtboard id="admin-desk-tasks" label="Tasks · table + inline editor" width={1440} height={900}>
          <AdTasksDesktop />
        </DCArtboard>
        <DCArtboard id="admin-desk-settings" label="Settings · Penalties & Streaks section" width={1440} height={900}>
          <AdSettingsDesktop />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="admin"
        title="Admin · Mobile (414px)"
        subtitle="The HA companion app surface — for the other parent doing quick approvals from their phone.">
        <DCArtboard id="admin-today" label="Today · landing screen" width={430} height={912}>
          <TodayScreen />
        </DCArtboard>
        <DCArtboard id="admin-family" label="Family · Olivia expanded" width={430} height={912}>
          <FamilyScreen />
        </DCArtboard>
        <DCArtboard id="admin-chores" label="Tasks · Chores tab" width={430} height={912}>
          <TasksScreen mode="chores" />
        </DCArtboard>
        <DCArtboard id="admin-rewards" label="Tasks · Rewards tab" width={430} height={912}>
          <TasksScreen mode="rewards" />
        </DCArtboard>
        <DCArtboard id="admin-settings" label="Settings · bottom sheet" width={430} height={912}>
          <SettingsSheet />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="home"
        title="Command Center — Home"
        subtitle="Echo Show 15 · 1920×1080. Mirrors src/card/hub-skins/classic.js as shipped in v0.6.0 Session 2. Family name + day · 5 agent tiles · 5 room tiles (Chores HQ + Home Care live; Meals/Smart Home/Calendar coming soon) · weather + approvals strip.">
        <DCArtboard id="home-cc" label="Family Hub · Home (v0.6.0 build)" width={1920} height={1080}>
          <CommandCenterHome />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="people"
        title="Themed Person Pages (v0.6.0 build)"
        subtitle="Mirrors src/card/themes/*.js. Each theme has 3 tabs (no Stats), a weekly rank bar with drop/gain thresholds, and per-theme button copy. Classic fallback not pictured.">
        <DCArtboard id="person-jackson" label="Jackson · DBZ (age 7 · child_mode)" width={1920} height={1080}>
          <DBZPage />
        </DCArtboard>
        <DCArtboard id="person-olivia" label="Olivia · Harry Potter (age 11)" width={1920} height={1080}>
          <HPPage />
        </DCArtboard>
        <DCArtboard id="person-spencer" label="Spencer · Dinosaurs (age 12)" width={1920} height={1080}>
          <DNPage />
        </DCArtboard>
        <DCArtboard id="person-jim" label="Jim · Civil Engineer" width={1920} height={1080}>
          <EngineerPage />
        </DCArtboard>
        <DCArtboard id="person-shannon" label="Shannon · Baker" width={1920} height={1080}>
          <BakerPage />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="cc-modes"
        title="Chores HQ · Mission Control (in progress — Session 3)"
        subtitle="This is what tapping the 'Chores HQ' room opens. Interactive: tap a GO button on any mission row (try Olivia's 7/7 'Feed the cat' for the milestone). Note: backend in src/card/modes-chores.js is still being implemented — this mock predates the final Session 3 layout.">
        <DCArtboard id="v1-interactive" label="Mission Control · interactive (pre-S3)" width={1920} height={1080}>
          <MissionControl interactive={true} />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="earlier"
        title="Earlier direction studies (reference only)"
        subtitle="Kept for reference — alternate aesthetics explored before the v0.6.0 architecture was locked in.">
        <DCArtboard id="v2-brief" label="The Daily Brief · newsroom dossier" width={1920} height={1080}>
          <DailyBrief />
        </DCArtboard>
        <DCArtboard id="v3-roster" label="Agent Roster · character-cards" width={1920} height={1080}>
          <AgentRosterView />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
