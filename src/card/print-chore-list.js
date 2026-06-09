/**
 * Family Hub Card — Printable Chore List (v0.7.4)
 *
 * Opens a fresh tab with a self-contained HTML document for printing and going
 * over with the family. No HA dependency at print time — everything is inlined
 * into the new document, so the print preview is stable even after the source
 * dashboard navigates away.
 *
 * Layout (kids-only):
 *   1. Everyone — chores every kid does (listed once, not repeated per kid).
 *   2. Per-kid sections — that kid's own chores + the rotations they hold now,
 *      with a weekly points + $ total in the header.
 *   3. Rotation schedule — every rotating chore in one table for planning.
 *   4. Up for grabs (bonus) + Reminders, if present.
 *
 * Money is a standardised estimate at Rank 3 (the mid-point rate) so the sheet
 * shows one consistent $/point for every kid regardless of their actual rank.
 *
 * Data source: sensor.family_hub_needs_attention attributes (active_chores,
 * people, family_name, rank_ppd_ladder). Card-side only; no Python.
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

// Average times per week a chore comes due (mirrors modes-admin _choreOccPerWeek).
function _occPerWeek(rec) {
    const t = rec?.type || "daily";
    if (t === "daily")           return (rec.day_filter || []).length || 7;
    if (t === "weekly")          return (rec.weekdays || []).length || 1;
    if (t === "every_n_days")  { const n = rec.interval || 1; return n > 0 ? 7 / n : 0; }
    if (t === "every_n_weeks") { const n = rec.interval || 1; return n > 0 ? 1 / n : 0; }
    if (t === "monthly_on_date") {
        const d = (rec.days_of_month && rec.days_of_month.length) ? rec.days_of_month.length : 1;
        return d * 12 / 52;
    }
    return 0;
}

function _cadenceLabel(c) {
    const cad = c.rotation_cadence;
    if (cad === "weekly")       return "Weekly";
    if (cad === "per_instance") return "Each time";
    if (cad === "daily")        return "Daily";
    return cad || "—";
}

// Points cell: green "+earn" on top, red "−penalty" (if any) beneath.
function _ptsCell(c) {
    const parts = [];
    if (c.points > 0) parts.push(`<span class="pl-pts">+${c.points}</span>`);
    if (c.penalty_enabled && c.penalty_points > 0) parts.push(`<span class="pl-penalty">−${c.penalty_points}</span>`);
    return parts.join("");
}

// A plain Chore / When / Pts row (no person column).
function _row(c) {
    const desc = c.description ? `<div class="pl-desc">${_esc(c.description)}</div>` : "";
    return `
      <tr>
        <td class="pl-name"><div>${_esc(c.name)}</div>${desc}</td>
        <td class="pl-when">${_esc(_recurrenceLabel(c.recurrence))}</td>
        <td class="pl-points">${_ptsCell(c)}</td>
      </tr>`;
}

function _simpleSection(title, chores, subtitle) {
    if (!chores.length) return "";
    const sub = subtitle ? `<div class="pl-section-sub">${_esc(subtitle)}</div>` : "";
    return `
      <section class="pl-section">
        <header class="pl-section-head"><h2>${_esc(title)}</h2>${sub}</header>
        <table class="pl-table">
          <thead><tr><th>Chore</th><th>When</th><th class="pl-points">Pts</th></tr></thead>
          <tbody>${chores.map(_row).join("")}</tbody>
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
    const famName   = naAttr?.family_name || "Family";
    const allPeople = naAttr?.people || [];
    const chores    = naAttr?.active_chores || [];
    const ladder    = (naAttr?.rank_ppd_ladder && naAttr.rank_ppd_ladder.length)
        ? naAttr.rank_ppd_ladder : [3, 3.5, 4, 4.5, 5];

    // Money: standardised at "Rank 3" (the mid-point rung, index 2) so every
    // kid is shown at one consistent $/point regardless of their real rank.
    const rank3Idx   = Math.min(2, ladder.length - 1);
    const centsPerPt = ladder[Math.max(0, rank3Idx)];
    const usd = pts => `$${(pts * centsPerPt / 100).toFixed(2)}`;

    const dateStr = new Date().toLocaleDateString(undefined, {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    const kids   = allPeople.filter(p => p.type === "kid" && p.active !== false);
    const kidIds = kids.map(k => k.person_id);
    const nameOf = id => allPeople.find(p => p.person_id === id)?.name || "—";
    const isActive = id => allPeople.find(p => p.person_id === id)?.active !== false;

    const isRot   = c => (c.rotation_pool || []).length > 1 && c.rotation_cadence;
    const allKids = c => kidIds.length > 0 && kidIds.every(id => (c.assigned_to || []).includes(id));

    // ---- Categorise (kids only) ----
    const everyone  = [];   // non-rotating, assigned to every kid → listed once
    const rotations = [];   // rotating chores → schedule table
    const claimable = [];
    const reminders = [];
    const perKid    = new Map(); kids.forEach(k => perKid.set(k.person_id, []));

    for (const c of chores) {
        if (c.chore_type === "reminder") {
            const ids = c.assigned_to || [];
            if (!ids.length || ids.some(id => kidIds.includes(id))) reminders.push(c);
            continue;
        }
        if (c.chore_type === "claimable") { claimable.push(c); continue; }
        if (isRot(c))   { rotations.push(c); continue; }
        if (allKids(c)) { everyone.push(c);  continue; }
        // Solo / partial assignment → under each kid assignee (parent-only is skipped).
        for (const id of (c.assigned_to || [])) if (perKid.has(id)) perKid.get(id).push(c);
    }

    // ---- Per-kid weekly points (fair-share; rotations split across active pool) ----
    const weekPts = {}; kidIds.forEach(id => weekPts[id] = 0);
    for (const c of chores) {
        if (c.chore_type !== "assigned") continue;
        const eff = _occPerWeek(c.recurrence) * (c.points || 0);
        if (eff <= 0) continue;
        if (isRot(c)) {
            const pool = (c.rotation_pool || []).filter(id => kidIds.includes(id) && isActive(id));
            if (!pool.length) continue;
            const share = eff / pool.length;
            pool.forEach(id => { weekPts[id] += share; });
        } else {
            for (const id of (c.assigned_to || [])) if (weekPts[id] != null) weekPts[id] += eff;
        }
    }

    // ---- Per-kid section (own chores + rotations they hold right now) ----
    const rotMark = `<span class="pl-rot" title="Rotates">↻</span> `;
    const kidRow = (c, rot) => {
        const desc = c.description ? `<div class="pl-desc">${_esc(c.description)}</div>` : "";
        return `
          <tr>
            <td class="pl-name"><div>${rot ? rotMark : ""}${_esc(c.name)}</div>${desc}</td>
            <td class="pl-when">${_esc(_recurrenceLabel(c.recurrence))}</td>
            <td class="pl-points">${_ptsCell(c)}</td>
          </tr>`;
    };

    const kidSections = kids.map(k => {
        const solo = perKid.get(k.person_id) || [];
        const mine = rotations.filter(c => ((c.assigned_to || [])[0] || null) === k.person_id);
        const total = Math.round(weekPts[k.person_id] || 0);
        const body = (solo.length || mine.length)
            ? `<table class="pl-table">
                 <thead><tr><th>Chore</th><th>When</th><th class="pl-points">Pts</th></tr></thead>
                 <tbody>${solo.map(c => kidRow(c, false)).join("")}${mine.map(c => kidRow(c, true)).join("")}</tbody>
               </table>`
            : `<div class="pl-section-note">Just the shared + rotation chores (see above &amp; below).</div>`;
        return `
          <section class="pl-section">
            <header class="pl-section-head pl-kid-head">
              <h2>${_esc(k.name)}</h2>
              <span class="pl-kid-total">~${total} pts/wk · ${usd(weekPts[k.person_id] || 0)}</span>
            </header>
            ${body}
            <div class="pl-section-note">+ everyone chores (top of sheet)${mine.length ? " · ↻ = rotates, see schedule" : ""}</div>
          </section>`;
    }).join("");

    // ---- Rotation schedule (planning table) ----
    let rotationSection = "";
    if (rotations.length) {
        const rows = rotations.map(c => {
            const pool = (c.rotation_pool || []).filter(isActive);
            const cur  = (c.assigned_to || [])[0] || pool[0];
            const order = pool.map(id =>
                id === cur ? `<b>${_esc(nameOf(id))}</b>` : _esc(nameOf(id))).join(" → ");
            return `
              <tr>
                <td class="pl-name">${_esc(c.name)}</td>
                <td class="pl-points">${_ptsCell(c)}</td>
                <td>${order}</td>
                <td class="pl-when">${_esc(_cadenceLabel(c))}</td>
              </tr>`;
        }).join("");
        rotationSection = `
          <section class="pl-section">
            <header class="pl-section-head">
              <h2>Rotation schedule</h2>
              <div class="pl-section-sub">Who's up now is in <b>bold</b>; the next name is whose turn comes after. Plan or adjust turns here.</div>
            </header>
            <table class="pl-table pl-rot-table">
              <thead><tr><th>Chore</th><th class="pl-points">Pts</th><th>Rotates (in order)</th><th>Switches</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </section>`;
    }

    const everyoneSection  = _simpleSection("Everyone — every kid does these", everyone);
    const claimableSection = _simpleSection("Up for grabs", claimable,
        "Anyone can claim — first done gets the points.");
    const reminderSection  = _simpleSection("Reminders", reminders, "No points — just a daily nudge.");

    const summary = `${kids.length} kid${kids.length === 1 ? "" : "s"} · `
        + `${everyone.length} shared · ${rotations.length} rotating · `
        + `+earned / −penalty if skipped · $ shown at Rank 3 (mid-point rate)`;

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
    font-size: 12pt; line-height: 1.3;
    color: var(--ink); background: #fff;
  }
  body { padding: 30px 34px; max-width: 8.5in; margin: 0 auto; }
  header.pl-doc-head {
    display: flex; align-items: baseline; justify-content: space-between;
    margin: 0 0 12px; padding-bottom: 8px;
    border-bottom: 2px solid var(--ink);
  }
  header.pl-doc-head h1 { margin: 0; font-size: 22pt; letter-spacing: -0.01em; }
  header.pl-doc-head .pl-doc-date {
    font-size: 10pt; color: var(--ink-sec); font-variant-numeric: tabular-nums;
  }
  .pl-doc-summary { font-size: 9.5pt; color: var(--ink-sec); margin: 0 0 16px; }
  .pl-section { margin: 0 0 16px; page-break-inside: avoid; break-inside: avoid; }
  .pl-section-head { margin: 0 0 6px; }
  .pl-section-head h2 {
    margin: 0; font-size: 13pt; font-weight: 700;
    letter-spacing: 0.02em; text-transform: uppercase;
    padding: 4px 8px; background: var(--panel);
    border-left: 4px solid var(--ink); display: inline-block;
  }
  .pl-section-head.pl-kid-head {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .pl-kid-total {
    font-size: 11pt; font-weight: 700; color: var(--accent);
    white-space: nowrap; font-variant-numeric: tabular-nums;
  }
  .pl-section-sub { margin: 4px 0 0; font-size: 9pt; color: var(--ink-sec); font-style: italic; }
  .pl-section-note { margin: 4px 0 0; font-size: 8.5pt; color: var(--ink-sec); font-style: italic; }
  table.pl-table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 11pt; }
  table.pl-table th, table.pl-table td {
    text-align: left; padding: 4px 8px;
    border-bottom: 1px solid var(--rule); vertical-align: top;
  }
  table.pl-table th {
    font-size: 9pt; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--ink-sec); font-weight: 600; border-bottom: 1.5px solid var(--ink);
  }
  table.pl-table td.pl-name { font-weight: 600; }
  table.pl-table td.pl-name .pl-desc {
    font-weight: 400; font-size: 9.5pt; color: var(--ink-sec); margin-top: 2px;
  }
  table.pl-table td.pl-when { width: 22%; font-variant-numeric: tabular-nums; font-weight: 400; }
  table.pl-table .pl-points { width: 64px; text-align: right; font-variant-numeric: tabular-nums; font-weight: 700; }
  .pl-pts { display: block; }
  .pl-penalty { display: block; color: var(--penalty); font-weight: 700; font-size: 10pt; }
  .pl-rot { color: var(--accent); font-weight: 700; }
  /* Rotation schedule table */
  .pl-rot-table td, .pl-rot-table th { font-size: 10.5pt; }
  .pl-rot-table td.pl-name { width: 38%; }
  .pl-rot-table td.pl-when { width: 18%; }
  .pl-toolbar { position: fixed; top: 12px; right: 12px; display: flex; gap: 6px; }
  .pl-toolbar button {
    font: inherit; font-size: 10pt; padding: 6px 12px; cursor: pointer;
    border: 1px solid var(--ink); background: #fff; border-radius: 4px;
  }
  .pl-toolbar button:hover { background: var(--panel); }
  footer.pl-doc-foot {
    margin-top: 22px; padding-top: 8px; border-top: 1px solid var(--rule);
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

  <p class="pl-doc-summary">${_esc(summary)}</p>

  ${everyoneSection}
  ${kidSections}
  ${rotationSection}
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
    const naAttr = card._attrs("sensor.family_hub_needs_attention");
    const html   = buildPrintableChoreList(naAttr);
    const w = window.open("", "_blank");
    if (!w) {
        const blob = new Blob([html], { type: "text/html" });
        const url  = URL.createObjectURL(blob);
        const w2   = window.open(url, "_blank");
        if (!w2) {
            const msg = document.createElement("div");
            msg.style.cssText = "position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#1c1c1e;color:#fff;padding:12px 18px;border-radius:8px;z-index:9999;font:14px/1.5 sans-serif";
            msg.innerHTML = `Pop-ups are blocked. <a href="${url}" target="_blank" style="color:#64d2ff">Open chore list</a>`;
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 15000);
        }
        return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.document.title = `${naAttr?.family_name || "Family"} — Chore List`;
}
