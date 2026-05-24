/**
 * Family Hub Card — Printable Chore List (v0.6.3)
 *
 * Opens a fresh tab with a self-contained HTML document that prints to a
 * fridge-magnet-friendly chore summary. No HA dependency at print time —
 * everything is inlined into the new document, so the print preview is
 * stable even after the source dashboard navigates away.
 *
 * Data source: sensor.family_hub_needs_attention attributes (active_chores,
 * people, family_name). Card-side only; no Python.
 */

const _esc = (s) => String(s ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");

const _DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function _recurrenceLabel(rec) {
    const t = rec?.type || "daily";
    if (t === "daily") {
        const df = rec.day_filter || [];
        if (!df.length || df.length === 7) return "Every day";
        // Compact "Mon-Fri" when contiguous, else "Mon Wed Fri".
        const sorted = [...df].sort((a, b) => a - b);
        let contiguous = true;
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] !== sorted[i - 1] + 1) { contiguous = false; break; }
        }
        if (contiguous && sorted.length >= 3) {
            return `${_DAY_SHORT[sorted[0]]}–${_DAY_SHORT[sorted[sorted.length - 1]]}`;
        }
        return sorted.map(d => _DAY_SHORT[d]).join(" ");
    }
    if (t === "weekly") {
        const wd = rec.weekdays || [];
        if (!wd.length) return "Weekly";
        return wd.map(d => _DAY_SHORT[d]).join(" ");
    }
    if (t === "every_n_days")    return `Every ${rec.interval || 2} days`;
    if (t === "every_n_weeks")   return `Every ${rec.interval || 2} weeks`;
    if (t === "monthly_on_date") return "Monthly";
    if (t === "one_time")        return "One time";
    return t;
}

function _renderRow(c) {
    const desc = c.description
        ? `<div class="pl-desc">${_esc(c.description)}</div>` : "";
    const penalty = c.penalty_enabled && c.penalty_points > 0
        ? ` <span class="pl-penalty">−${c.penalty_points}</span>` : "";
    const pts = c.points > 0
        ? `<span class="pl-pts">+${c.points}</span>${penalty}`
        : (c.penalty_enabled && c.penalty_points > 0
            ? `<span class="pl-penalty">−${c.penalty_points}</span>`
            : "");
    return `
      <tr>
        <td class="pl-name"><div>${_esc(c.name)}</div>${desc}</td>
        <td class="pl-when">${_esc(_recurrenceLabel(c.recurrence))}</td>
        <td class="pl-points">${pts}</td>
      </tr>`;
}

function _renderSection(title, chores, subtitle) {
    if (!chores.length) return "";
    const sub = subtitle ? `<div class="pl-section-sub">${_esc(subtitle)}</div>` : "";
    return `
      <section class="pl-section">
        <header class="pl-section-head">
          <h2>${_esc(title)}</h2>
          ${sub}
        </header>
        <table class="pl-table">
          <thead>
            <tr><th>Chore</th><th>When</th><th class="pl-points">Points</th></tr>
          </thead>
          <tbody>
            ${chores.map(_renderRow).join("")}
          </tbody>
        </table>
      </section>`;
}

/**
 * Build the self-contained HTML for the print tab.
 *
 * @param {object} naAttr  needs_attention sensor attributes
 * @returns {string}       complete <!doctype html>… document
 */
export function buildPrintableChoreList(naAttr) {
    const famName = naAttr?.family_name || "Family";
    const people  = naAttr?.people || [];
    const chores  = naAttr?.active_chores || [];

    const dateStr = new Date().toLocaleDateString(undefined, {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    // Group ASSIGNED by primary assignee. A chore with multiple assignees
    // appears under each (helps the kid who only reads their own column).
    // A chore with a rotation pool lists the whole pool in the subtitle so
    // parents see "this rotates between Jackson + Olivia."
    const assignedByPerson = new Map();
    const unassigned = [];
    const claimable  = [];
    const reminders  = [];

    for (const c of chores) {
        if (c.chore_type === "reminder") { reminders.push(c); continue; }
        if (c.chore_type === "claimable") { claimable.push(c); continue; }
        const ids = c.assigned_to || [];
        if (!ids.length) { unassigned.push(c); continue; }
        for (const pid of ids) {
            if (!assignedByPerson.has(pid)) assignedByPerson.set(pid, []);
            assignedByPerson.get(pid).push(c);
        }
    }

    // Render assigned sections in the people-list order.
    const peopleSections = people
        .filter(p => assignedByPerson.has(p.person_id))
        .map(p => {
            const list = assignedByPerson.get(p.person_id);
            return _renderSection(p.name, list);
        }).join("");

    // Rotation pool subtitle helper — only for the dedicated rotation rows.
    const rotationChores = chores.filter(
        c => c.chore_type === "assigned" && (c.rotation_pool || []).length > 1
    );
    const rotationNote = rotationChores.length
        ? `${rotationChores.length} chore${rotationChores.length === 1 ? "" : "s"} rotate between people. The assignee shown is whose turn it is now.`
        : "";

    const claimableSection  = _renderSection("Up for grabs", claimable,
        "Anyone can claim — first done gets the points.");
    const reminderSection   = _renderSection("Reminders", reminders,
        "No points — just a daily nudge.");
    const unassignedSection = _renderSection("Unassigned", unassigned,
        "Not assigned to anyone yet.");

    const totalChores = chores.length;
    const totalPoints = chores.reduce((sum, c) => sum + (c.points > 0 ? c.points : 0), 0);

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${_esc(famName)} — Chore List</title>
<style>
  :root {
    --ink: #1a1a1a;
    --ink-sec: #555;
    --rule: #d0d0d0;
    --panel: #f3f3f3;
    --accent: #2563eb;
    --penalty: #c0392b;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 "Helvetica Neue", Arial, sans-serif;
    font-size: 12pt; line-height: 1.35;
    color: var(--ink); background: #fff;
  }
  body { padding: 32px 36px; max-width: 8.5in; margin: 0 auto; }
  header.pl-doc-head {
    display: flex; align-items: baseline; justify-content: space-between;
    margin: 0 0 16px; padding-bottom: 10px;
    border-bottom: 2px solid var(--ink);
  }
  header.pl-doc-head h1 { margin: 0; font-size: 22pt; letter-spacing: -0.01em; }
  header.pl-doc-head .pl-doc-date {
    font-size: 10pt; color: var(--ink-sec); font-variant-numeric: tabular-nums;
  }
  .pl-doc-summary {
    font-size: 10pt; color: var(--ink-sec);
    margin: 0 0 18px;
  }
  .pl-doc-note {
    margin: 0 0 14px; padding: 6px 10px;
    background: var(--panel); border-left: 3px solid var(--accent);
    font-size: 9.5pt; color: var(--ink-sec);
  }
  .pl-section {
    margin: 0 0 18px;
    page-break-inside: avoid; break-inside: avoid;
  }
  .pl-section-head { margin: 0 0 6px; }
  .pl-section-head h2 {
    margin: 0; font-size: 13pt; font-weight: 700;
    letter-spacing: 0.02em; text-transform: uppercase;
    padding: 4px 8px; background: var(--panel);
    border-left: 4px solid var(--ink); display: inline-block;
  }
  .pl-section-sub {
    margin: 4px 0 0; font-size: 9pt; color: var(--ink-sec); font-style: italic;
  }
  table.pl-table {
    width: 100%; border-collapse: collapse;
    margin-top: 6px; font-size: 11pt;
  }
  table.pl-table th, table.pl-table td {
    text-align: left; padding: 5px 8px;
    border-bottom: 1px solid var(--rule);
    vertical-align: top;
  }
  table.pl-table th {
    font-size: 9pt; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--ink-sec); font-weight: 600;
    border-bottom: 1.5px solid var(--ink);
  }
  table.pl-table td.pl-name { width: 55%; font-weight: 600; }
  table.pl-table td.pl-name .pl-desc {
    font-weight: 400; font-size: 9.5pt; color: var(--ink-sec); margin-top: 2px;
  }
  table.pl-table td.pl-when { width: 22%; font-variant-numeric: tabular-nums; }
  table.pl-table .pl-points { width: 23%; text-align: right; font-variant-numeric: tabular-nums; }
  .pl-pts { font-weight: 700; }
  .pl-penalty { color: var(--penalty); font-weight: 700; }
  .pl-toolbar {
    position: fixed; top: 12px; right: 12px;
    display: flex; gap: 6px;
  }
  .pl-toolbar button {
    font: inherit; font-size: 10pt;
    padding: 6px 12px; cursor: pointer;
    border: 1px solid var(--ink); background: #fff; border-radius: 4px;
  }
  .pl-toolbar button:hover { background: var(--panel); }
  footer.pl-doc-foot {
    margin-top: 24px; padding-top: 8px;
    border-top: 1px solid var(--rule);
    font-size: 8.5pt; color: var(--ink-sec); text-align: center;
  }
  @media print {
    .pl-toolbar { display: none; }
    body { padding: 0; }
    @page { margin: 0.5in; }
  }
</style>
</head>
<body>
  <div class="pl-toolbar">
    <button onclick="window.print()">Print</button>
    <button onclick="window.close()">Close</button>
  </div>

  <header class="pl-doc-head">
    <h1>${_esc(famName)} — Chores</h1>
    <div class="pl-doc-date">${_esc(dateStr)}</div>
  </header>

  <p class="pl-doc-summary">
    ${totalChores} active chore${totalChores === 1 ? "" : "s"} ·
    Up to ${totalPoints} points/cycle available
  </p>

  ${rotationNote ? `<p class="pl-doc-note">${_esc(rotationNote)}</p>` : ""}

  ${peopleSections}
  ${unassignedSection}
  ${claimableSection}
  ${reminderSection}

  <footer class="pl-doc-foot">
    Generated by Family Hub · ${_esc(new Date().toLocaleString())}
  </footer>
</body>
</html>`;
}

/**
 * Open a new tab with the printable chore list rendered from a card instance.
 * Pop-up blockers may swallow the call if it isn't triggered by a user
 * gesture — the caller (dispatch handler) is the click event, so this is fine.
 *
 * @param {FamilyHubCard} card
 */
export function openPrintableChoreList(card) {
    const naAttr = card._hass?.states?.["sensor.family_hub_needs_attention"]?.attributes || {};
    const html   = buildPrintableChoreList(naAttr);
    const w = window.open("", "_blank");
    if (!w) {
        // Pop-up blocker. Fall back to a data: URL the user can choose to open.
        // (Most browsers still allow this within a user-gesture handler, but
        // belt + suspenders.)
        const blob = new Blob([html], { type: "text/html" });
        const url  = URL.createObjectURL(blob);
        window.location.href = url;
        return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.document.title = `${naAttr?.family_name || "Family"} — Chore List`;
}
