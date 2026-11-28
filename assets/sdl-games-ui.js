/* ══════════════════════════════════════════════════════════════
   SIDLAYAN · LESSON GAMES: screens
   Loaded right after app.js. Adds one builder (Blocks) and one wiring
   function (Init) per game. Rules and scenarios: assets/sdl-games.js.
   Every game is tap-only: no typing, no free answers. Finishing a game's
   challenge claims its gate (ungraded XP), which its lesson's Continue
   button waits for.
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function () {
  const G = window.SDLGames;
  if (!G || typeof Blocks === 'undefined' || typeof Init === 'undefined') return;

  /* ── shared pieces ─────────────────────────────────────────── */
  const STEPS = { 'sim-filters': 7, 'sim-copy': 2, 'sim-merger': 7, 'sim-agenda': 4, 'sim-pr': 2, 'sim-airtime': 3, 'sim-feed': 3, 'sim-data': 3 };

  function shell(b) {
    const n = actShell(b, 'game');
    const total = STEPS[b.t];
    $('.act-body', n).innerHTML = `<div class="gm" data-game="${esc(b.t)}">
      <div class="gm-done-note" hidden>✓ Challenge complete. You can play again any time.</div>
      <div class="gm-stage"></div>
      <div class="gm-reflect" hidden></div>
      <button type="button" class="gm-btn gm-primary gm-save" hidden>Save my result</button>
    </div>`;
    addFoot(n, b, `0 / ${total} steps`, '🎮 Finish the challenge to continue');
    return n;
  }

  /* The game's own progress line; the footer turns "complete" only once the
     server has the claim. */
  function progress(node, b, k) {
    const total = STEPS[b.t];
    if (!S.gates[b.gate]) setFoot(node, Math.min(k, total - 1), total);
  }

  function claim(node, b) {
    const save = $('.gm-save', node), total = STEPS[b.t];
    if (S.gates[b.gate]) { setFoot(node, total, total, '✓ Challenge complete!'); return; }
    save.hidden = true;
    Grade.submit({ gate: b.gate, claim: true, node, title: b.title, label: `${b.title} complete` })
      .then(res => {
        if (res && res.correct) {
          passGate(b.gate, node);
          setFoot(node, total, total, '✓ Challenge complete!');
          $('.gm-done-note', node).hidden = false;
        } else {
          save.hidden = false;   // offline or busy: keep the win and let them send it again
        }
      });
  }

  /* "What did you notice?": one tap question; a wrong tap explains and lets them try again. */
  function reflect(node, b, R, onRight) {
    const box = $('.gm-reflect', node);
    box.hidden = false;
    box.innerHTML = `<div class="gm-kicker">🧠 What did you notice?</div>
      <p class="gm-q">${esc(R.q)}</p>
      <div class="gm-opts">${R.opts.map((o, i) => `<button type="button" class="gm-opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>
      <div class="gm-fb" role="status" hidden></div>`;
    const fb = $('.gm-fb', box);
    let solved = false;
    $$('.gm-opt', box).forEach(btn => btn.addEventListener('click', () => {
      if (solved) return;
      const i = +btn.dataset.i, right = i === R.correct;
      fb.hidden = false;
      fb.className = 'gm-fb ' + (right ? 'ok' : 'no');
      fb.textContent = (right ? '✓ ' : '✗ ') + R.fb[i];
      btn.classList.add(right ? 'is-right' : 'is-wrong');
      Audio_.play(right ? 'correct' : 'wrong');
      if (right) {
        solved = true;
        $$('.gm-opt', box).forEach(x => { x.disabled = true; });
        onRight();
      }
    }));
    setTimeout(() => { try { box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {} }, 60);
  }

  function meter(label, value, max, txt, cls) {
    const pct = Math.max(0, Math.min(100, value / max * 100));
    return `<div class="gm-meter ${cls || ''}"><div class="gm-meter-h"><span>${esc(label)}</span><b>${esc(txt)}</b></div>
      <div class="gm-bar"><i style="width:${pct.toFixed(1)}%"></i></div></div>`;
  }
  function fbBox(ok, html) { return `<div class="gm-fb ${ok === 'info' ? 'info' : ok ? 'ok' : 'no'}" role="status">${html}</div>`; }
  function checklist(items) {
    return `<ul class="gm-check">${items.map(it => `<li class="${it[1] ? 'is-done' : ''}"><span>${it[1] ? '✓' : '○'}</span>${esc(it[0])}</li>`).join('')}</ul>`;
  }
  /* Ignore a second tap that lands while the first one is still being drawn. */
  /* Every game gets its own tap lock (see SDLGames.tapLock): each handler redraws the game, so a
     per-button flag could never stop a double tap landing on the button drawn underneath. */
  function makeGuard() { const lock = G.tapLock(300); return fn => function (e) { if (!lock()) return; fn.call(this, e); }; }
  function finishFlow(node, b, R, after) {
    reflect(node, b, R, () => { if (after) after(); claim(node, b); });
  }
  function common(node, b) {
    $('.gm-save', node).addEventListener('click', () => claim(node, b));
    if (S.gates[b.gate]) { $('.gm-done-note', node).hidden = false; setFoot(node, STEPS[b.t], STEPS[b.t], '✓ Challenge complete!'); }
  }

  ['sim-filters', 'sim-copy', 'sim-merger', 'sim-agenda', 'sim-pr', 'sim-airtime', 'sim-feed', 'sim-data'].forEach(t => { Blocks[t] = shell; });

  /* ── L3 · The Five Filters Newsroom ────────────────────────── */
  Init['sim-filters'] = function (node, b) {
    const guard = makeGuard();
    const F = G['sim-filters'], stage = $('.gm-stage', node);
    const st = { i: 0, phase: 'name', named: [], decided: [], tried: [] };
    common(node, b);
    function draw() {
      const p = F.pitches[st.i], sm = F.summary(st.decided);
      const meters = meter('📺 Watchdog stories aired', sm.aired, F.pitches.length, `${sm.aired} / ${F.pitches.length}`) +
                     meter('⚠️ Pressure on the station', sm.pressure, 15, sm.pressure ? `${sm.pressure} points` : 'none yet', 'warn');
      if (st.i >= F.pitches.length) return summary(meters);
      const filt = F.filters.find(f => f.id === p.filter);
      stage.innerHTML = `<div class="gm-meters">${meters}</div>
        <div class="gm-card">
          <div class="gm-kicker">📰 Pitch ${st.i + 1} of ${F.pitches.length} · fictional</div>
          <h4 class="gm-h">${esc(p.headline)}</h4>
          <p class="gm-pressure"><b>The pressure:</b> ${esc(p.pressure)}</p>
        </div>
        ${st.phase === 'name' ? `<p class="gm-ask">Which filter is pressing on this story?</p>
          <div class="gm-choices gm-5">${F.filters.map(f => `<button type="button" class="gm-btn ${st.tried.indexOf(f.id) >= 0 ? 'is-wrong' : ''}" data-f="${f.id}" ${st.tried.indexOf(f.id) >= 0 ? 'disabled' : ''}><span class="gm-ico">${f.ico}</span>${esc(f.name)}</button>`).join('')}</div>
          ${st.tried.length ? fbBox(false, `Not ${esc(F.filters.find(f => f.id === st.tried[st.tried.length - 1]).name)}: ${esc(F.filters.find(f => f.id === st.tried[st.tried.length - 1]).def)} Read the pressure again.`) : ''}` : ''}
        ${st.phase !== 'name' ? fbBox(true, `✓ <b>${filt.ico} ${esc(filt.name)}</b>: ${esc(filt.def)}`) : ''}
        ${st.phase === 'decide' ? `<p class="gm-ask">You are the editor. What do you do?</p>
          <div class="gm-choices gm-1"><button type="button" class="gm-btn gm-left" data-d="bold">📣 ${esc(p.bold)}</button><button type="button" class="gm-btn gm-left" data-d="safe">🛡️ ${esc(p.safe)}</button></div>` : ''}
        ${st.phase === 'fx' ? `<div class="gm-card gm-fx">${esc(st.decided[st.i] === 'bold' ? p.boldFx : p.safeFx)}</div>
          <button type="button" class="gm-btn gm-primary gm-next">${st.i + 1 < F.pitches.length ? 'Next pitch →' : 'See tonight’s newscast →'}</button>` : ''}`;
      $$('[data-f]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        if (F.check(st.i, btn.dataset.f)) { st.named[st.i] = true; st.phase = 'decide'; st.tried = []; Audio_.play('correct'); }
        else { st.tried.push(btn.dataset.f); Audio_.play('wrong'); }
        draw();
      })));
      $$('[data-d]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        st.decided[st.i] = btn.dataset.d; st.phase = 'fx'; Audio_.play('pop');
        progress(node, b, st.decided.filter(Boolean).length);   // one step per pitch decided
        draw();
      })));
      const nx = $('.gm-next', stage);
      if (nx) nx.addEventListener('click', guard(() => { st.i++; st.phase = 'name'; draw(); }));
    }
    function summary(meters) {
      const sm = F.summary(st.decided), names = sm.cutBy.map(id => F.filters.find(f => f.id === id).name);
      stage.innerHTML = `<div class="gm-meters">${meters}</div>
        <div class="gm-card gm-result">
          <div class="gm-kicker">📺 Tonight’s newscast</div>
          <p><b>${sm.aired} of ${F.pitches.length}</b> watchdog stories aired.</p>
          ${names.length ? `<p>Stories were cut or softened by: <b>${esc(names.join(', '))}</b>.</p>` : '<p>No filter cut a story tonight, but the station is under heavy pressure.</p>'}
          <p class="gm-small">${sm.aired >= 4 ? 'Closer to the Fourth Estate ideal: a watchful press, at a cost to the station.' : 'This is the propaganda model at work: the news narrowed one reasonable decision at a time.'}</p>
          <button type="button" class="gm-btn gm-ghost gm-again">↺ Edit the newscast again</button>
        </div>`;
      $('.gm-again', stage).addEventListener('click', () => { st.i = 0; st.phase = 'name'; st.decided = []; st.named = []; st.tried = []; draw(); });
      if ($('.gm-reflect', node).hidden) finishFlow(node, b, F.reflect, () => progress(node, b, 7));
    }
    draw();
  };

  /* ── L4 · First Copy, Many Screens ─────────────────────────── */
  Init['sim-copy'] = function (node, b) {
    const guard = makeGuard();
    const C = G['sim-copy'], stage = $('.gm-stage', node);
    const on = { tv: true };
    let reached = false;
    common(node, b);
    const peso = x => '₱' + x.toFixed(2);
    function draw() {
      const m = C.model(on), hit = m.perViewer < C.TARGET;
      /* The result sits above the outlet buttons, so on a phone every tap
         shows its effect without scrolling. */
      stage.innerHTML = `<p class="gm-ask">Your network spent <b>₱${C.FIRST_COPY}M</b> making one teleserye episode. Tap outlets to show the same episode on more screens. <span class="gm-small">(Fictional figures.)</span></p>
        <div class="gm-board">
          <div class="gm-stat gm-big ${hit ? 'is-hit' : ''}"><span>Cost per viewer</span><b>${peso(m.perViewer)}</b><small>Target: under ${peso(C.TARGET)}</small></div>
          <div class="gm-stat"><span>Viewers</span><b>${m.viewers.toFixed(1)}M</b></div>
          <div class="gm-stat"><span>Total cost</span><b>₱${m.total.toFixed(1)}M</b><small>₱${C.FIRST_COPY}M first copy + ₱${m.extra.toFixed(1)}M to show it</small></div>
        </div>
        <div class="gm-choices gm-toggles">${C.outlets.map(o => `<button type="button" class="gm-btn gm-toggle ${o.fixed || on[o.id] ? 'is-on' : ''}" data-o="${o.id}" aria-pressed="${!!(o.fixed || on[o.id])}" ${o.fixed ? 'disabled' : ''}>
            <span class="gm-ico">${o.ico}</span><span class="gm-tl">${esc(o.name)}<small>${o.fixed ? 'always on' : `+${o.viewers}M viewers · +₱${o.cost}M`}</small></span></button>`).join('')}</div>
        <div class="gm-card gm-compare"><b>🏚️ A small station</b> makes the same kind of episode for ₱${C.small.total}M but has one outlet and ${C.small.viewers}M viewers: <b>${peso(C.small.perViewer)} per viewer</b>.</div>
        ${hit ? fbBox(true, `✓ Under ${peso(C.TARGET)}! One more viewer costs the network almost nothing, so every extra screen spreads the first copy thinner.`) : ''}`;
      $$('[data-o]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        on[btn.dataset.o] = !on[btn.dataset.o]; Audio_.play('click'); draw();
      })));
      if (hit && !reached) {
        reached = true; Audio_.play('correct'); progress(node, b, 1);
        finishFlow(node, b, C.reflect);
      }
    }
    draw();
  };

  /* ── L5 · Merger Desk ──────────────────────────────────────── */
  Init['sim-merger'] = function (node, b) {
    const guard = makeGuard();
    const M = G['sim-merger'], stage = $('.gm-stage', node);
    const st = { i: 0, tried: [], revealed: false };
    common(node, b);
    function board(closed) {
      const s = M.state(closed);
      return `<div class="gm-meters">
        ${meter('📺 Tala Media’s share of TV viewers', s.tala, 100, s.tala + '%')}
        ${meter('👥 Top two groups together', s.topTwo, 100, s.topTwo + '%', s.topTwo >= 81 ? 'warn' : '')}
        <div class="gm-row-stats"><span>🏢 Outlets and companies: <b>${s.outlets}</b></span><span>🏦 Outside media: <b>${s.outside.length ? esc(s.outside.join(', ')) : 'none'}</b></span></div>
      </div>`;
    }
    function draw() {
      if (st.i >= M.deals.length) return summary();
      const d = M.deals[st.i];
      stage.innerHTML = `${board(st.i + (st.revealed ? 1 : 0))}
        <div class="gm-card"><div class="gm-kicker">🤝 Deal ${st.i + 1} of ${M.deals.length} · Tala Media Group (fictional)</div>
          <h4 class="gm-h">${d.ico} ${esc(d.title)}</h4></div>
        ${!st.revealed ? `<p class="gm-ask">What kind of concentration is this?</p>
          <div class="gm-choices gm-4">${M.kinds.map(k => `<button type="button" class="gm-btn ${st.tried.indexOf(k.id) >= 0 ? 'is-wrong' : ''}" data-k="${k.id}" ${st.tried.indexOf(k.id) >= 0 ? 'disabled' : ''}><span class="gm-ico">${k.ico}</span>${esc(k.name)}</button>`).join('')}</div>
          ${st.tried.length ? (k => fbBox(false, `Not ${esc(k.name)}: ${esc(k.def)} Look at what Tala is buying.`))(M.kinds.find(k => k.id === st.tried[st.tried.length - 1])) : ''}` :
          `${fbBox(true, `✓ <b>${esc(M.kinds.find(k => k.id === d.kind).name)}</b>. ${esc(d.fx)}`)}
          <button type="button" class="gm-btn gm-primary gm-next">${st.i + 1 < M.deals.length ? 'Next deal →' : 'See the market →'}</button>`}`;
      $$('[data-k]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        if (M.check(st.i, btn.dataset.k)) { st.revealed = true; st.tried = []; Audio_.play('correct'); progress(node, b, st.i + 1); }
        else { st.tried.push(btn.dataset.k); Audio_.play('wrong'); }
        draw();
      })));
      const nx = $('.gm-next', stage);
      if (nx) nx.addEventListener('click', guard(() => { st.i++; st.revealed = false; draw(); }));
    }
    function summary() {
      stage.innerHTML = `${board(M.deals.length)}
        <div class="gm-card gm-result"><div class="gm-kicker">📊 The market now</div>
          <p>Tala and its rival now hold <b>81% of TV viewers</b>: the same share the 2016 Media Ownership Monitor found ABS-CBN and GMA held together, a <b>duopoly</b> (RSF &amp; VERA Files, 2016).</p>
          <p class="gm-small">You classified all six deals. Horizontal, vertical, cross-media and conglomerate ownership can all happen inside one group.</p></div>`;
      if ($('.gm-reflect', node).hidden) finishFlow(node, b, M.reflect, () => progress(node, b, 7));
    }
    draw();
  };

  /* ── L6 · Newscast Lab ─────────────────────────────────────── */
  Init['sim-agenda'] = function (node, b) {
    const guard = makeGuard();
    const A = G['sim-agenda'], stage = $('.gm-stage', node);
    let min = A.start();
    const sel = [null, null, null], got = { agenda: false, protest: false, chaos: false };
    common(node, b);
    const tgt = A.issues.find(i => i.id === A.target);
    function count() { return (got.agenda ? 1 : 0) + (got.protest ? 1 : 0) + (got.chaos ? 1 : 0); }
    function draw() {
      const poll = A.poll(min), top = A.topIssue(min), used = A.issues.reduce((s, i) => s + min[i.id], 0);
      const reading = A.frame.reading(sel);
      stage.innerHTML = `<div class="gm-card"><div class="gm-kicker">📋 Part A · Agenda-setting</div>
          <p class="gm-ask">You plan this week’s newscasts: <b>${A.TOTAL} minutes</b> of stories (fictional). <b>Goal:</b> make ${tgt.ico} ${esc(tgt.name)} the issue the public ranks most important.</p>
          <div class="gm-issues">${A.issues.map(i => `<div class="gm-issue ${top === i.id ? 'is-top' : ''}">
            <span class="gm-iname">${i.ico} ${esc(i.name)}</span>
            <span class="gm-stepper"><button type="button" class="gm-step" data-i="${i.id}" data-v="-${A.STEP}" aria-label="Less ${esc(i.name)} coverage" ${min[i.id] <= 0 ? 'disabled' : ''}>−</button><b>${min[i.id]} min</b><button type="button" class="gm-step" data-i="${i.id}" data-v="${A.STEP}" aria-label="More ${esc(i.name)} coverage" ${used >= A.TOTAL ? 'disabled' : ''}>+</button></span>
            <span class="gm-poll"><i style="width:${poll[i.id].toFixed(1)}%"></i><em>${Math.round(poll[i.id])}%</em></span></div>`).join('')}</div>
          <p class="gm-small">${used < A.TOTAL ? `🕒 ${A.TOTAL - used} minutes not yet given to any issue. Take minutes from one issue (−) to give them to another (+).` : 'All minutes are used. Take minutes from one issue (−) to give them to another (+).'} Bars: share of the public naming each issue “most important.”</p>
          ${got.agenda ? fbBox(true, `✓ ${tgt.ico} ${esc(tgt.name)} is now the public’s top issue. You never told anyone what to think about it, only that it matters most.`) : ''}
        </div>
        ${got.agenda ? `<div class="gm-card"><div class="gm-kicker">🖼️ Part B · Framing</div>
          <p class="gm-ask">One rally, one minute of airtime. Build the story <b>both ways</b>: first as workers demanding fair wages, then as chaos on the streets.</p>
          ${A.frame.choices.map((c, k) => `<div class="gm-frame"><span class="gm-flabel">${esc(c.name)}</span>
            <div class="gm-choices gm-2"><button type="button" class="gm-btn ${sel[k] === 'protest' ? 'is-on' : ''}" data-c="${k}" data-s="protest" aria-pressed="${sel[k] === 'protest'}">${esc(c.protest)}</button><button type="button" class="gm-btn ${sel[k] === 'chaos' ? 'is-on' : ''}" data-c="${k}" data-s="chaos" aria-pressed="${sel[k] === 'chaos'}">${esc(c.chaos)}</button></div></div>`).join('')}
          <div class="gm-reading gm-r-${reading.id}">📺 ${esc(reading.text)}</div>
          ${checklist([['Build the “workers demanding fair wages” story', got.protest], ['Build the “chaos on the streets” story', got.chaos]])}
        </div>` : ''}`;
      $$('[data-i]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        const next = A.move(min, btn.dataset.i, +btn.dataset.v);
        if (!next) return;
        min = next; Audio_.play('click');
        if (!got.agenda && A.topIssue(min) === A.target) { got.agenda = true; Audio_.play('correct'); progress(node, b, count()); }
        draw();
      })));
      $$('[data-c]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        sel[+btn.dataset.c] = btn.dataset.s; Audio_.play('click');
        const r = A.frame.reading(sel).id;
        if ((r === 'protest' && !got.protest) || (r === 'chaos' && !got.chaos)) { got[r] = true; Audio_.play('correct'); progress(node, b, count()); }
        draw();
        if (got.agenda && got.protest && got.chaos && $('.gm-reflect', node).hidden) finishFlow(node, b, A.reflect, () => progress(node, b, 4));
      })));
    }
    draw();
  };

  /* ── L7 · PR Week ──────────────────────────────────────────── */
  Init['sim-pr'] = function (node, b) {
    const guard = makeGuard();
    const P = G['sim-pr'], stage = $('.gm-stage', node);
    let picks = [], shown = null, weeks = 0;
    common(node, b);
    function draw() {
      const r = P.result(picks), d = P.days[picks.length];
      const meters = meter('📺 News coverage', r.cov, 45, `${r.cov} min · goal ${P.COVERAGE}+`, r.cov >= P.COVERAGE ? 'ok' : '') +
                     meter('🗳️ What voters learned', r.know, 40, `${r.know} pts · goal ${P.KNOWLEDGE}+`, r.know >= P.KNOWLEDGE ? 'ok' : '');
      if (shown) {
        const o = P.days[shown.day].opts[shown.opt], t = P.tactics[o.tactic];
        stage.innerHTML = `<div class="gm-meters">${meters}</div>
          ${fbBox('info', `<b>${esc(P.days[shown.day].day)}: ${esc(t.name)}.</b> ${esc(t.def)} <span class="gm-small">(+${o.cov} min coverage, +${o.know} voter knowledge)</span>`)}
          <button type="button" class="gm-btn gm-primary gm-next">${picks.length < P.days.length ? 'Next day →' : 'See the week →'}</button>`;
        $('.gm-next', stage).addEventListener('click', guard(() => { shown = null; draw(); }));
        return;
      }
      if (!d) return week(r, meters);
      stage.innerHTML = `<div class="gm-meters">${meters}</div>
        <div class="gm-card"><div class="gm-kicker">🗓️ ${esc(d.day)} · day ${picks.length + 1} of ${P.days.length}</div>
          <p class="gm-ask">You are Mayor Reyes’s PR officer (fictional). <b>Goal for the week:</b> at least ${P.COVERAGE} minutes of coverage <b>and</b> at least ${P.KNOWLEDGE} points of voter knowledge. What does the mayor do today?</p></div>
        <div class="gm-choices gm-1">${d.opts.map((o, i) => `<button type="button" class="gm-btn gm-left" data-o="${i}">${esc(o.txt)}</button>`).join('')}</div>`;
      $$('[data-o]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        shown = { day: picks.length, opt: +btn.dataset.o }; picks.push(+btn.dataset.o); Audio_.play('pop'); draw();
      })));
    }
    function week(r, meters) {
      weeks++;
      const pseudo = r.pseudo.length ? `Pseudo-events and photo ops used: <b>${esc(r.pseudo.join(', '))}</b>.` : 'You used no pseudo-events.';
      stage.innerHTML = `<div class="gm-meters">${meters}</div>
        <div class="gm-card gm-result"><div class="gm-kicker">📅 The week in review</div>
          ${r.win ? fbBox(true, `✓ Both goals met: ${r.cov} minutes of coverage and ${r.know} points of voter knowledge.`) :
            fbBox(false, `Not yet: ${r.cov < P.COVERAGE ? `coverage ${r.cov}/${P.COVERAGE}` : ''}${r.cov < P.COVERAGE && r.know < P.KNOWLEDGE ? ' and ' : ''}${r.know < P.KNOWLEDGE ? `voter knowledge ${r.know}/${P.KNOWLEDGE}` : ''}.`)}
          <p>${pseudo}</p>
          ${!r.win ? `<p class="gm-small">💡 ${r.cov < P.COVERAGE ? 'Events staged for the cameras win the most coverage.' : 'Real announcements, records and debates teach voters the most.'} Try mixing the two across the week.${weeks >= 2 ? ' <b>Plan tip:</b> about two days of events staged for the cameras, and real announcements or records on the other three, can meet both goals. Watch which days give the most coverage.' : ''}</p>` : ''}
          <button type="button" class="gm-btn ${r.win ? 'gm-ghost' : 'gm-primary'} gm-again">↺ Plan another week</button></div>`;
      $('.gm-again', stage).addEventListener('click', () => { picks = []; shown = null; draw(); });
      if (r.win && $('.gm-reflect', node).hidden) { Audio_.play('correct'); progress(node, b, 1); finishFlow(node, b, P.reflect, () => progress(node, b, 2)); }
    }
    draw();
  };

  /* ── L8 · Airtime Ledger ───────────────────────────────────── */
  Init['sim-airtime'] = function (node, b) {
    const guard = makeGuard();
    const T = G['sim-airtime'], stage = $('.gm-stage', node);
    const buy = {}; T.stations.forEach(s => { buy[s.id] = 0; });
    let mode = 'total', maxedTotal = false, perAnswered = false, tried = [];
    common(node, b);
    function draw() {
      const c = T.check(buy, mode), capTxt = k => mode === 'per' ? `${T.CAP[k]} per station` : `${T.CAP[k]} in total`;
      stage.innerHTML = `<div class="gm-card"><p class="gm-ask">You buy airtime for <b>Senator Dela Paz</b> (fictional), a candidate for national office. RA 9006 allows <b>${T.CAP.tv} minutes of TV</b> and <b>${T.CAP.radio} minutes of radio</b>. But is that per station, or in total?</p>
          <div class="gm-choices gm-2 gm-mode"><button type="button" class="gm-btn ${mode === 'total' ? 'is-on' : ''}" data-m="total" aria-pressed="${mode === 'total'}">∑ Count the cap in total</button><button type="button" class="gm-btn ${mode === 'per' ? 'is-on' : ''}" data-m="per" aria-pressed="${mode === 'per'}" ${!maxedTotal ? 'disabled' : ''}>📍 Count it per station${!maxedTotal ? ' 🔒' : ''}</button></div></div>
        <div class="gm-stations">${T.stations.map(s => `<div class="gm-station ${mode === 'per' && buy[s.id] > T.CAP[s.kind] ? 'is-over' : ''}"><span class="gm-iname">${s.ico} ${esc(s.name)}</span>
          <span class="gm-stepper"><button type="button" class="gm-step" data-s="${s.id}" data-v="-${T.STEP}" aria-label="Fewer minutes on ${esc(s.name)}" ${buy[s.id] <= 0 ? 'disabled' : ''}>−</button><b>${buy[s.id]} min</b><button type="button" class="gm-step" data-s="${s.id}" data-v="${T.STEP}" aria-label="More minutes on ${esc(s.name)}" ${buy[s.id] >= T.MAX[s.kind] ? 'disabled' : ''}>+</button></span></div>`).join('')}</div>
        <div class="gm-board">
          <div class="gm-stat ${mode === 'total' && c.tv > T.CAP.tv ? 'is-over' : ''}"><span>📺 TV bought</span><b>${c.tv} min</b><small>limit ${capTxt('tv')}</small></div>
          <div class="gm-stat ${mode === 'total' && c.radio > T.CAP.radio ? 'is-over' : ''}"><span>📻 Radio bought</span><b>${c.radio} min</b><small>limit ${capTxt('radio')}</small></div>
          <div class="gm-stat"><span>💸 Cost (fictional)</span><b>₱${c.cost.toFixed(1)}M</b><small>₱${T.RATE.tv}M per TV minute, ₱${T.RATE.radio}M per radio minute</small></div>
        </div>
        ${fbBox(c.legal, c.legal ? '✓ Within the law under this counting rule.' : '✗ Over the cap under this counting rule.')}
        ${checklist([['Counted in total: buy exactly 120 TV and 180 radio minutes, on at least two stations of each kind', maxedTotal], ['Counted per station: find how much TV the same law allows', perAnswered]])}
        ${maxedTotal && mode === 'total' && !perAnswered ? fbBox(true, '✓ Legal maximum reached under the total count.') +
          '<button type="button" class="gm-btn gm-primary" data-m="per">📍 Now count the cap per station →</button>' : ''}
        ${mode === 'per' && !perAnswered ? `<div class="gm-card"><p class="gm-q">${esc(T.question.q)}</p>
          <div class="gm-choices gm-4">${T.question.opts.map((o, i) => `<button type="button" class="gm-btn ${tried.indexOf(i) >= 0 ? 'is-wrong' : ''}" data-q="${i}" ${tried.indexOf(i) >= 0 ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
          ${tried.length ? fbBox(false, esc(T.question.fb[tried[tried.length - 1]])) : '<p class="gm-small">Tip: try buying the most this rule allows on each TV station.</p>'}</div>` : ''}
        ${perAnswered ? fbBox(true, '✓ ' + esc(T.question.fb[T.question.correct])) : ''}`;
      $$('[data-s]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        buy[btn.dataset.s] = Math.max(0, buy[btn.dataset.s] + (+btn.dataset.v)); Audio_.play('click');
        const k = T.check(buy, 'total');
        if (mode === 'total' && !maxedTotal && k.legal && k.maxed && k.spread) { maxedTotal = true; Audio_.play('correct'); progress(node, b, 1); }
        draw();
      })));
      $$('[data-m]', stage).forEach(btn => btn.addEventListener('click', guard(() => { mode = btn.dataset.m; Audio_.play('click'); draw(); })));
      $$('[data-q]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        const i = +btn.dataset.q;
        if (i === T.question.correct) {
          perAnswered = true; Audio_.play('correct'); progress(node, b, 2); draw();
          if ($('.gm-reflect', node).hidden) finishFlow(node, b, T.reflect, () => progress(node, b, 3));
        } else { tried.push(i); Audio_.play('wrong'); draw(); }
      })));
    }
    draw();
  };

  /* ── L9 · Tune the Feed ────────────────────────────────────── */
  Init['sim-feed'] = function (node, b) {
    const guard = makeGuard();
    const F = G['sim-feed'], stage = $('.gm-stage', node);
    const wt = Object.assign({}, F.start), got = { m1: false, m2: false };
    common(node, b);
    stage.innerHTML = `<p class="gm-ask">You set the ranking for a free platform (fictional). It starts as a plain newest-first feed. Each slider tells the code how much to favour posts with that quality; the top 5 posts are what users see first.</p>
      <div class="gm-sliders">${F.weights.map(k => `<label class="gm-slider"><span>${k.ico} ${esc(k.name)} <b data-wv="${k.id}">${wt[k.id]}</b></span>
        <input type="range" min="0" max="10" step="1" value="${wt[k.id]}" data-w="${k.id}" aria-label="${esc(k.name)} weight"></label>`).join('')}</div>
      <div class="gm-out"></div>`;
    const out = $('.gm-out', stage);
    function draw() {
      const r = F.rank(wt);
      if (!got.m1 && F.mission1(r)) { got.m1 = true; Audio_.play('correct'); progress(node, b, 1); }
      if (got.m1 && !got.m2 && F.mission2(r)) { got.m2 = true; Audio_.play('correct'); progress(node, b, 2); }
      out.innerHTML = `<div class="gm-meters">
          ${meter('⏳ Time spent per user', r.time, 30, r.time.toFixed(1) + ' min a day')}
          ${meter('💰 Ad earnings', r.revenue, 360, '₱' + r.revenue + ' per 1,000 users')}
          ${meter('✅ Information quality', r.quality, 100, r.quality + '%', r.quality >= F.M2.quality ? 'ok' : 'warn')}
        </div>
        <ol class="gm-feed">${r.top.map(p => `<li><span class="gm-ico">${p.ico}</span><span>${esc(p.txt)}</span>${p.accuracy <= 2 ? '<em class="gm-tag bad">doubtful</em>' : p.accuracy >= 9 ? '<em class="gm-tag good">verified</em>' : ''}</li>`).join('')}</ol>
        ${checklist([[`Mission 1, the platform’s goal: hold users for at least ${F.M1.time} minutes a day`, got.m1],
                     [`Mission 2, the public’s goal: keep information quality at ${F.M2.quality}% or more while still holding ${F.M2.time}+ minutes`, got.m2]])}
        ${got.m1 && !got.m2 ? '<p class="gm-small">💡 No single slider does Mission 2. Try mixing accuracy with the others.</p>' : ''}`;
      if (got.m1 && got.m2 && $('.gm-reflect', node).hidden) finishFlow(node, b, F.reflect, () => progress(node, b, 3));
    }
    $$('[data-w]', stage).forEach(r => r.addEventListener('input', () => {
      wt[r.dataset.w] = +r.value; $(`[data-wv="${r.dataset.w}"]`, stage).textContent = r.value; draw();
    }));
    draw();
  };

  /* ── L10 · Your Data Day ───────────────────────────────────── */
  Init['sim-data'] = function (node, b) {
    const guard = makeGuard();
    const D = G['sim-data'], stage = $('.gm-stage', node);
    const sw = { location: true, activity: true, ads: true }, got = { fullDay: false, leanDay: false };
    let step = -1;   // -1 = not started; 0..5 = moment shown; 6 = day over
    common(node, b);
    const runSw = Object.assign({}, sw);
    function draw() {
      const running = step >= 0 && step < D.moments.length, over = step >= D.moments.length;
      const res = D.run(runSw);
      const seenData = step < 0 ? [] : D.moments.slice(0, Math.min(step + 1, D.moments.length)).reduce((a, m) => a.concat(m.data.filter(d => runSw[d.kind])), []);
      stage.innerHTML = `<p class="gm-ask">Mika, a student (fictional), uses one free app all day. Choose her settings, then follow her day.</p>
        <div class="gm-choices gm-3">${D.switches.map(s => `<button type="button" class="gm-btn gm-toggle ${sw[s.id] ? 'is-on' : ''}" data-sw="${s.id}" aria-pressed="${sw[s.id]}" ${running ? 'disabled' : ''}><span class="gm-ico">${s.ico}</span><span class="gm-tl">${esc(s.name)}<small>${sw[s.id] ? 'ON' : 'OFF'}</small></span></button>`).join('')}</div>
        ${step < 0 || over ? `<button type="button" class="gm-btn gm-primary gm-start">▶ ${over ? 'Run the day again with these settings' : 'Start Mika’s day'}</button>` : ''}
        ${step >= 0 ? `<ol class="gm-day">${D.moments.slice(0, Math.min(step + 1, D.moments.length)).map(m => {
            const got = m.data.filter(d => runSw[d.kind]);
            return `<li><span class="gm-time">${m.time}</span><span>${m.ico} ${esc(m.txt)}</span>
              <div class="gm-chips">${got.length ? got.map(d => `<em class="gm-chip ${d.kind}">${d.kind === 'location' ? '📍' : '🖐️'} ${esc(d.txt)}</em>`).join('') : '<em class="gm-chip none">Nothing recorded</em>'}</div></li>`; }).join('')}</ol>` : ''}
        ${running ? `<button type="button" class="gm-btn gm-primary gm-step-day">${step + 1 < D.moments.length ? 'Next moment →' : 'End of the day →'}</button>` : ''}
        ${over ? `<div class="gm-card gm-result"><div class="gm-kicker">🔮 What the app now predicts about Mika</div>
            <p class="gm-small">${seenData.length} pieces of data recorded today.</p>
            ${res.predictions.length ? `<ul class="gm-preds">${res.predictions.map(p => `<li><b>${esc(p.txt)}</b><span>${runSw.ads ? `💰 sold to ${esc(p.buyer)}` : '🔒 made, not sold for ads'}</span></li>`).join('')}</ul>` : '<p>No predictions: the app learned nothing about Mika today.</p>'}
            ${res.predictions.length && !runSw.ads ? '<p class="gm-small">With personalized ads off, the predictions are not sold for ads in this game, but the data was still collected.</p>' : ''}
          </div>` : ''}
        ${checklist([['Run a full day with all three settings ON', got.fullDay], [`Keep Location ON (Mika needs maps) but let the app make at most ${D.LEAN_MAX} predictions`, got.leanDay]])}
        ${over && !(got.fullDay && got.leanDay) ? '<button type="button" class="gm-btn gm-ghost gm-to-settings">⚙️ Change Mika’s settings for another day ↑</button>' : ''}`;
      const back = $('.gm-to-settings', stage);
      if (back) back.addEventListener('click', () => { try { stage.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} });
      $$('[data-sw]', stage).forEach(btn => btn.addEventListener('click', guard(() => {
        sw[btn.dataset.sw] = !sw[btn.dataset.sw]; if (step >= D.moments.length) step = -1; Audio_.play('click'); draw();
      })));
      const start = $('.gm-start', stage);
      if (start) start.addEventListener('click', guard(() => { Object.assign(runSw, sw); step = 0; Audio_.play('pop'); draw(); }));
      const nx = $('.gm-step-day', stage);
      if (nx) nx.addEventListener('click', guard(() => {
        step++;
        if (step >= D.moments.length) {
          if (runSw.location && runSw.activity && runSw.ads && !got.fullDay) { got.fullDay = true; Audio_.play('correct'); }
          if (D.lean(runSw) && !got.leanDay) { got.leanDay = true; Audio_.play('correct'); }
          progress(node, b, (got.fullDay ? 1 : 0) + (got.leanDay ? 1 : 0));
        } else Audio_.play('click');
        draw();
        if (got.fullDay && got.leanDay && $('.gm-reflect', node).hidden) finishFlow(node, b, D.reflect, () => progress(node, b, 3));
      }));
    }
    draw();
  };
})();
