/* ══════════════════════════════════════════════════════════════
   SIDLAYAN · LESSON GAMES (Lessons 3–10): rules and scenarios
   One game per lesson, each practising only what its lesson teaches.
   Every scenario is fictional (stations, people, prices). Nothing here
   is graded: finishing a game's challenge claims its gate for XP.
   Screens: assets/sdl-games-ui.js · Tests: tests/test-games.js
   Spec: docs/superpowers/specs/2026-11-29-lesson-games-design.md
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function (w) {
  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
  function reflect(q, opts, correct, fb) { return { q: q, opts: opts, correct: correct, fb: fb }; }

  /* ── L3 · The Five Filters Newsroom ──
     The propaganda model's five filters (Herman & Chomsky, 1988), as the
     lesson's flip cards describe them. Each pitch is pressed by one filter;
     the student names it, then airs the story (watchdog) or plays it safe. */
  var FILTERS = {
    filters: [
      { id: 'ownership',   ico: '🏢', name: 'Ownership',   def: 'The owner has wider business interests that a story could hurt.' },
      { id: 'advertising', ico: '💼', name: 'Advertising', def: 'The station depends on advertisers, so stories that drive them away are harder to run.' },
      { id: 'sourcing',    ico: '🎙️', name: 'Sourcing',    def: 'Official sources are steady and cheap to cover, so their version is easiest to air.' },
      { id: 'flak',        ico: '📢', name: 'Flak',        def: 'Complaints, lawsuits or threats raise the cost of running a story.' },
      { id: 'fear',        ico: '🚩', name: 'Anti-communism (shared fear)', def: 'In the original model, anti-communism; later writers broadened it to any shared fear used to dismiss critics.' }
    ],
    pitches: [
      { headline: 'Power rates jump 18% this month', filter: 'ownership', cost: 3,
        pressure: 'The station’s owner also owns the power company in the story.',
        bold: 'Air the full story on the rate hike', safe: 'Run a short item without naming the company',
        boldFx: 'Viewers learn who raised their bills. The owner’s office calls the newsroom.',
        safeFx: 'The owner is spared. Viewers never learn who raised their bills.' },
      { headline: 'Energy drink linked to hospital cases', filter: 'advertising', cost: 3,
        pressure: 'The drink’s maker buys more ad spots on your evening news than anyone else.',
        bold: 'Air the investigation', safe: 'Hold the story “for more checking”',
        boldFx: 'The public is warned. The drink maker pulls next month’s ads.',
        safeFx: 'The ads keep running, and so does the drink.' },
      { headline: 'Raid in Barangay Malinis: “all suspects fought back”', filter: 'sourcing', cost: 1,
        pressure: 'The only ready account is the police press release. Residents who saw the raid tell a different story, but interviewing them takes a day.',
        bold: 'Wait a day and air the residents’ side too', safe: 'Air the press release as it is',
        boldFx: 'Viewers hear more than one account of what happened.',
        safeFx: 'Fast and cheap, but only the official version reaches viewers.' },
      { headline: 'Congressman’s road funds cannot be accounted for', filter: 'flak', cost: 3,
        pressure: 'His lawyers threaten a libel suit, and his supporters flood the station with complaints.',
        bold: 'Air it, backed by the audit documents', safe: 'Drop it to avoid the lawsuit',
        boldFx: 'The watchdog barks: the public sees the audit. The legal bills begin.',
        safeFx: 'No lawsuit, and no accountability either.' },
      { headline: 'Farmers march against the conversion of their land', filter: 'fear', cost: 2,
        pressure: 'An official calls the marchers “enemies of the state” and says covering them helps the enemy.',
        bold: 'Cover the march and the farmers’ demands', safe: 'Report only the official’s warning',
        boldFx: 'The farmers are heard in the public forum, and the label is questioned.',
        safeFx: 'The label does the work: the farmers’ case is never heard.' },
      { headline: 'Mall chain cuts its workers’ hours', filter: 'advertising', cost: 3,
        pressure: 'The mall chain is the station’s biggest advertiser this quarter.',
        bold: 'Air the workers’ story', safe: 'Swap it for a feature on holiday sales',
        boldFx: 'Workers are represented on air. The ad sales team is worried.',
        safeFx: 'The sponsor is happy; the workers are invisible.' }
    ],
    check: function (i, filterId) { var p = FILTERS.pitches[i]; return !!p && p.filter === filterId; },
    summary: function (decisions) {
      var aired = 0, pressure = 0, cutBy = [];
      FILTERS.pitches.forEach(function (p, i) {
        if (decisions[i] === 'bold') { aired++; pressure += p.cost; }
        else if (decisions[i] === 'safe' && cutBy.indexOf(p.filter) < 0) cutBy.push(p.filter);
      });
      return { aired: aired, pressure: pressure, cutBy: cutBy };
    },
    done: function (s) {
      s = s || {};
      var n = FILTERS.pitches.length;
      return !!(s.reflected && s.named && s.decided && s.named.length === n && s.decided.length === n &&
        s.named.every(Boolean) && s.decided.every(function (d) { return d === 'bold' || d === 'safe'; }));
    },
    reflect: reflect('The propaganda model says news is narrowed “without any conspiracy.” What did your newsroom show?',
      ['Each pressure made the safe choice a little easier, one story at a time',
       'The government wrote the newscast for you',
       'Journalists were secretly paid by the advertisers',
       'Viewers asked for fewer watchdog stories'],
      0,
      ['Right. No one ordered you to drop anything. Ownership, advertising, sourcing, flak and fear each raised the cost of one story, and the safe choice was always cheaper. That is how the filters narrow the news.',
       'No one wrote your newscast. You chose every story yourself; the filters only made some choices costlier than others.',
       'No one was paid in this game. The pressure came from ordinary business and political costs, which is the model’s point.',
       'Viewers were never asked. The pressures came from owners, advertisers, sources and critics, not from the audience.'])
  };

  /* ── L4 · First Copy, Many Screens ──
     Media goods cost a lot to make once and almost nothing to show again
     (Doyle, 2013). Reusing one programme across outlets spreads that first
     copy over more viewers. Fictional figures, ₱ million and million viewers. */
  var COPY = {
    FIRST_COPY: 12, TARGET: 2,
    outlets: [
      { id: 'tv',       ico: '📺', name: 'Main TV channel',             viewers: 3.0, cost: 0,   fixed: true },
      { id: 'regional', ico: '🗺️', name: 'Regional TV stations',        viewers: 1.2, cost: 0.6 },
      { id: 'radio',    ico: '📻', name: 'Radio simulcast',             viewers: 0.8, cost: 0.3 },
      { id: 'stream',   ico: '🎬', name: 'Streaming app',               viewers: 1.5, cost: 0.5 },
      { id: 'clips',    ico: '📱', name: 'Online clips on video sites', viewers: 2.0, cost: 0.4 },
      { id: 'cable',    ico: '📡', name: 'Cable channel replay',        viewers: 0.6, cost: 0.3 }
    ],
    model: function (on) {
      var viewers = 0, extra = 0, used = [];
      COPY.outlets.forEach(function (o) {
        if (o.fixed || (on && on[o.id])) { viewers += o.viewers; extra += o.cost; used.push(o.id); }
      });
      var total = COPY.FIRST_COPY + extra;
      return { viewers: Math.round(viewers * 10) / 10, total: Math.round(total * 10) / 10, extra: Math.round(extra * 10) / 10,
               perViewer: total / viewers, used: used };
    },
    small: { viewers: 0.5, total: 12, perViewer: 24 },
    done: function (s) { return !!(s && s.reached && s.reflected); },
    reflect: reflect('Why did showing the same programme on more outlets cut the cost per viewer?',
      ['Making the programme costs a lot once; showing it again costs very little',
       'Each new outlet paid for its own copy of the programme',
       'Advertisers paid for the extra outlets',
       'More outlets made the programme cheaper to produce'],
      0,
      ['Right. The first copy carries most of the cost. Every extra screen spreads it over more viewers for very little more, which is why media firms are pushed to grow big and reuse content (Doyle, 2013).',
       'No, the programme was made only once. Each outlet added only a small cost to show it.',
       'Advertisers did not enter this game. The saving came from reusing one costly first copy.',
       'The production cost stayed the same (₱12M). What changed was how many viewers shared it.'])
  };

  /* ── L5 · Merger Desk ──
     The four kinds of concentration from the lesson's Discovery Grid. A
     fictional group grows; the top two end at the 2016 duopoly figure the
     lesson cites (about 81% of the TV audience; RSF & VERA Files, 2016). */
  var MERGER = {
    kinds: [
      { id: 'horizontal',   ico: '↔️', name: 'Horizontal',   def: 'One owner controls many outlets of the same kind.' },
      { id: 'vertical',     ico: '↕️', name: 'Vertical',     def: 'One owner controls several stages: producing, broadcasting, distributing online.' },
      { id: 'cross',        ico: '🔀', name: 'Cross-media',  def: 'One owner controls different kinds of media at once.' },
      { id: 'conglomerate', ico: '🏙️', name: 'Conglomerate', def: 'The media company belongs to a group with businesses outside media.' }
    ],
    start: { tala: 28, bituin: 33, outlets: 1 },
    deals: [
      { ico: '📺', title: 'Buy Liwanag TV, a rival free-to-air network', kind: 'horizontal', share: 14, outlets: 1,
        fx: 'Two TV networks under one owner: same kind of outlet, more of it.' },
      { ico: '🎞️', title: 'Buy a studio that produces teleseryes and films', kind: 'vertical', share: 0, outlets: 1,
        fx: 'Tala now makes the shows it airs: one more stage of the chain.' },
      { ico: '🗞️', title: 'Buy a national daily newspaper and its news website', kind: 'cross', share: 0, outlets: 2,
        fx: 'TV, print and web under one owner: different kinds of media at once.' },
      { ico: '🏦', title: 'Merge into a family group that owns a bank and a water utility', kind: 'conglomerate', share: 0, outlets: 0,
        outside: ['a bank', 'a water utility'],
        fx: 'Critics worry news about the bank and the utility may now suffer.' },
      { ico: '📡', title: 'Buy three more TV channels from a smaller rival', kind: 'horizontal', share: 6, outlets: 3,
        fx: 'Still more of the same kind of outlet. Viewers have fewer owners to choose from.' },
      { ico: '📲', title: 'Buy a streaming app so it can distribute its own shows online', kind: 'vertical', share: 0, outlets: 1,
        fx: 'Make it, broadcast it, distribute it online: the whole chain.' }
    ],
    check: function (i, kind) { var d = MERGER.deals[i]; return !!d && d.kind === kind; },
    state: function (closed) {
      var tala = MERGER.start.tala, outlets = MERGER.start.outlets, outside = [];
      MERGER.deals.slice(0, closed).forEach(function (d) { tala += d.share; outlets += d.outlets; (d.outside || []).forEach(function (x) { outside.push(x); }); });
      return { tala: tala, bituin: MERGER.start.bituin, topTwo: tala + MERGER.start.bituin, others: 100 - tala - MERGER.start.bituin, outlets: outlets, outside: outside };
    },
    done: function (s) { return !!(s && s.closed >= MERGER.deals.length && s.reflected); },
    reflect: reflect('Tala now belongs to a group that also owns a bank and a water utility. What do critics fear about this kind of ownership?',
      ['News about the group’s other businesses may suffer',
       'The group’s TV shows will cost more to make',
       'The group will stop selling advertising',
       'Foreign companies will take over the group'],
      0,
      ['Right. That is the lesson’s worry about conglomerate ownership: a newsroom may go easy on stories that hurt the bank or the utility its owners also run.',
       'Production costs are a business question, not the concern the lesson raises about conglomerates.',
       'Nothing in the deal touches advertising. The worry is about news involving the owners’ other businesses.',
       'The Constitution restricts foreign ownership of mass media, so the lesson’s sharper worry is concentration at home.'])
  };

  /* ── L6 · Newscast Lab ──
     (A) Agenda-setting (McCombs & Shaw, 1972): the issues covered most become
     the issues the public ranks most important. (B) Framing (Entman, 1993):
     the same rally told as "chaos" or as "workers demanding fair wages". */
  var AGENDA = {
    TOTAL: 20, STEP: 2, target: 'health',
    issues: [
      { id: 'prices',  ico: '🍚', name: 'Prices',  base: 30 },
      { id: 'jobs',    ico: '💼', name: 'Jobs',    base: 25 },
      { id: 'crime',   ico: '🚨', name: 'Crime',   base: 20 },
      { id: 'traffic', ico: '🚗', name: 'Traffic', base: 15 },
      { id: 'health',  ico: '🏥', name: 'Health',  base: 10 }
    ],
    start: function () { var m = {}; AGENDA.issues.forEach(function (i) { m[i.id] = AGENDA.TOTAL / AGENDA.issues.length; }); return m; },
    /* Public concern = 40% what people already worried about + 60% what the news covered. */
    poll: function (minutes) {
      var raw = {}, tot = 0;
      AGENDA.issues.forEach(function (i) { var x = 0.4 * i.base + 0.6 * ((minutes[i.id] || 0) / AGENDA.TOTAL) * 100; raw[i.id] = x; tot += x; });
      var out = {};
      AGENDA.issues.forEach(function (i) { out[i.id] = tot > 0 ? raw[i.id] / tot * 100 : 20; });
      return out;
    },
    topIssue: function (minutes) {
      var p = AGENDA.poll(minutes), best = null;
      AGENDA.issues.forEach(function (i) { if (best === null || p[i.id] > p[best]) best = i.id; });
      return best;
    },
    move: function (minutes, id, delta) {
      var next = {}, total = 0;
      AGENDA.issues.forEach(function (i) { next[i.id] = minutes[i.id] || 0; });
      next[id] = (next[id] || 0) + delta;
      AGENDA.issues.forEach(function (i) { total += next[i.id]; });
      if (next[id] < 0 || total > AGENDA.TOTAL) return null;
      return next;
    },
    frame: {
      choices: [
        { id: 'headline', name: 'Headline',
          protest: 'Workers demand fair wages in Manila march',
          chaos:   'Chaos on the streets as rally blocks traffic' },
        { id: 'picture', name: 'Picture',
          protest: '🪧 Workers holding placards with their wage demands',
          chaos:   '🚗 Stalled cars and an angry motorist' },
        { id: 'source', name: 'Who you quote',
          protest: '🎙️ A union leader explains the wage demand',
          chaos:   '🎙️ A traffic official complains about the delays' }
      ],
      reading: function (sel) {
        var p = sel.filter(function (x) { return x === 'protest'; }).length, c = sel.filter(function (x) { return x === 'chaos'; }).length;
        if (p + c < 3) return { id: 'incomplete', text: 'Choose a headline, a picture and a source to see how viewers will read the story.' };
        if (p === 3) return { id: 'protest', text: 'Viewers see workers with a cause: low wages are the problem, and fair pay is the solution.' };
        if (c === 3) return { id: 'chaos', text: 'Viewers see a disorder problem: the rally is the problem, and clearing the streets is the solution.' };
        return { id: 'mixed', text: 'A mixed story: viewers get no clear definition of the problem yet.' };
      }
    },
    done: function (s) { return !!(s && s.agenda && s.protest && s.chaos && s.reflected); },
    reflect: reflect('You moved the public’s top issue without telling anyone what to think, and told one rally two ways. What did you show?',
      ['The news shapes what people think about (agenda-setting) and how they see it (framing)',
       'The news tells people exactly what to think',
       'Heavy TV viewing slowly changes people’s picture of reality (cultivation)',
       'Influence always passes through opinion leaders first (two-step flow)'],
      0,
      ['Right. Coverage time decided which issue felt most important (agenda-setting), and your headline, picture and source decided how the same rally was seen (framing). Broadcasting rarely tells people what to think, but it is very good at both of these.',
       'You never told viewers what to conclude. You only chose what to cover and how to present it, which is the lesson’s point.',
       'Cultivation is real, but it builds over years of viewing. This lab showed agenda-setting and framing within one week of news.',
       'Two-step flow is about opinion leaders. This lab worked directly through coverage choices: agenda-setting and framing.'])
  };

  /* ── L7 · PR Week ──
     Political PR packages events for journalists; pseudo-events are staged
     mainly to be reported (Boorstin, 1961). The tactics match the lesson's
     PR Toolkit. Coverage minutes and voter knowledge are fictional scores. */
  var PR = {
    COVERAGE: 30, KNOWLEDGE: 20,
    tactics: {
      pseudo:    { name: 'Pseudo-event',  def: 'An event created mainly to be reported.' },
      photoop:   { name: 'Photo op',      def: 'An event staged mainly for cameras.' },
      release:   { name: 'Press release', def: 'A ready-made statement written for journalists to reuse.' },
      soundbite: { name: 'Sound bite',    def: 'A short, quotable line made for broadcast.' },
      leak:      { name: 'Leak',          def: 'Information passed unofficially to a reporter.' },
      spin:      { name: 'Spin',          def: 'Interpreting facts in the most favourable way.' },
      real:      { name: 'Real event',    def: 'Something that happens, or is decided, whether or not cameras come.' }
    },
    days: [
      { day: 'Monday', opts: [
        { txt: 'Cut the ribbon on a half-finished road, with cameras invited', tactic: 'pseudo', cov: 9, know: 0 },
        { txt: 'Send reporters the city’s audited flood-control spending', tactic: 'release', cov: 3, know: 8 },
        { txt: 'Leak an unproven rumour about a rival to a friendly reporter', tactic: 'leak', cov: 6, know: 0 } ] },
      { day: 'Tuesday', opts: [
        { txt: 'Hold a town hall where residents question the city budget', tactic: 'real', cov: 4, know: 7 },
        { txt: 'Make a “surprise” market visit, announced to the media the day before', tactic: 'pseudo', cov: 8, know: 1 },
        { txt: 'Give reporters a catchy line: “Bilis at malasakit!”', tactic: 'soundbite', cov: 5, know: 0 } ] },
      { day: 'Wednesday', opts: [
        { txt: 'Announce the new health centre’s opening date, staff and cost', tactic: 'real', cov: 5, know: 6 },
        { txt: 'Pose handing out relief packs, with no new aid announced', tactic: 'photoop', cov: 9, know: 0 },
        { txt: 'Describe a delayed bridge as “right on track”', tactic: 'spin', cov: 4, know: 0 } ] },
      { day: 'Thursday', opts: [
        { txt: 'Release the bridge contract: contractor, cost and deadline', tactic: 'release', cov: 3, know: 8 },
        { txt: 'Stage a tree-planting with a celebrity guest for the cameras', tactic: 'pseudo', cov: 10, know: 0 },
        { txt: 'Answer critics with a sharp sound bite', tactic: 'soundbite', cov: 6, know: 0 } ] },
      { day: 'Friday', opts: [
        { txt: 'Debate an opposition councillor on the city budget', tactic: 'real', cov: 6, know: 7 },
        { txt: 'Throw a livestreamed birthday celebration for the mayor', tactic: 'pseudo', cov: 8, know: 0 },
        { txt: 'Leak a “secret” project that has not been approved', tactic: 'leak', cov: 5, know: 1 } ] }
    ],
    result: function (choices) {
      var cov = 0, know = 0, pseudo = [];
      PR.days.forEach(function (d, i) {
        var o = d.opts[choices[i]];
        if (!o) return;
        cov += o.cov; know += o.know;
        if (o.tactic === 'pseudo' || o.tactic === 'photoop') pseudo.push(d.day);
      });
      return { cov: cov, know: know, pseudo: pseudo, win: cov >= PR.COVERAGE && know >= PR.KNOWLEDGE };
    },
    done: function (s) { return !!(s && s.won && s.reflected); },
    reflect: reflect('Which kind of event won the most coverage while telling voters the least?',
      ['Pseudo-events and photo ops, staged mainly to be reported',
       'Released budgets and contracts',
       'Town halls and debates',
       'Leaks'],
      0,
      ['Right. Events made for cameras are easy for newsrooms to cover and fill airtime well, but they tell voters little. That is why PR uses them, and why Boorstin (1961) gave them a name.',
       'Budgets and contracts informed voters the most but earned the least coverage: hard to film, slow to explain.',
       'Town halls and debates informed voters well but won only middling coverage.',
       'Leaks won some coverage, but the ribbon-cuttings and staged visits won the most.'])
  };

  /* ── L8 · Airtime Ledger ──
     RA 9006 (Fair Election Act, 2001) caps a national candidate's purchased or
     donated airtime at 120 minutes of TV and 180 of radio. Whether the cap
     counts per station or in total has been contested, as the lesson says.
     Stations and prices are fictional. */
  var AIRTIME = {
    CAP: { tv: 120, radio: 180 }, STEP: 15, MAX: { tv: 180, radio: 240 },
    RATE: { tv: 1.0, radio: 0.1 },        // fictional ₱ million per minute
    stations: [
      { id: 'tvA', kind: 'tv',    ico: '📺', name: 'Channel 1' },
      { id: 'tvB', kind: 'tv',    ico: '📺', name: 'Channel 2' },
      { id: 'tvC', kind: 'tv',    ico: '📺', name: 'Channel 3' },
      { id: 'r1',  kind: 'radio', ico: '📻', name: 'Radio 1' },
      { id: 'r2',  kind: 'radio', ico: '📻', name: 'Radio 2' },
      { id: 'r3',  kind: 'radio', ico: '📻', name: 'Radio 3' }
    ],
    check: function (buy, mode) {
      var tv = 0, radio = 0, nTv = 0, nRadio = 0, perOk = true, cost = 0;
      AIRTIME.stations.forEach(function (s) {
        var m = Number(buy[s.id]) || 0;
        if (s.kind === 'tv') { tv += m; if (m > 0) nTv++; if (m > AIRTIME.CAP.tv) perOk = false; }
        else { radio += m; if (m > 0) nRadio++; if (m > AIRTIME.CAP.radio) perOk = false; }
        cost += m * AIRTIME.RATE[s.kind];
      });
      var legal = mode === 'per' ? perOk : (tv <= AIRTIME.CAP.tv && radio <= AIRTIME.CAP.radio);
      return { tv: tv, radio: radio, legal: legal, cost: Math.round(cost * 10) / 10,
               maxed: mode !== 'per' && tv === AIRTIME.CAP.tv && radio === AIRTIME.CAP.radio,
               spread: nTv >= 2 && nRadio >= 2 };
    },
    question: { q: 'If the cap counts per station, how many minutes of TV could the same candidate buy on these three TV stations?',
      opts: ['120 minutes', '240 minutes', '360 minutes', '480 minutes'], correct: 2,
      fb: ['That is the cap counted in total. Counted per station, each of the three stations allows 120 minutes.',
           'Count all three stations: 120 minutes on each.',
           'Right: 120 minutes on each of three stations is 360 minutes, three times the total-count limit.',
           'Each station allows 120 minutes, and there are three stations, not four.'] },
    done: function (s) { return !!(s && s.maxedTotal && s.perAnswered && s.reflected); },
    reflect: reflect('Why does the way the airtime cap is counted matter so much?',
      ['It decides how much airtime money can buy, and so how far big spenders can outshout rivals',
       'Stations cannot count minutes accurately',
       'COMELEC does not cover radio advertising',
       'Radio minutes cost more than TV minutes'],
      0,
      ['Right. The same law allowed 120 minutes of TV counted in total, or 360 counted per station on these three stations. That gap is why the counting rule was contested: it shows how much money and power ride on airtime.',
       'The question was never how to count minutes. The dispute is about which limit the law sets.',
       'RA 9006 caps both TV and radio airtime, as the lesson explains.',
       'In this game TV minutes cost more. Either way, the point is how much the counting rule lets money buy.'])
  };

  /* ── L9 · Tune the Feed ──
     The attention economy and algorithmic gatekeeping, from the lesson's card
     deck: platforms earn more when people stay longer, which rewards content
     that provokes strong emotions. Posts and figures are fictional. */
  var FEED = {
    M1: { time: 25 }, M2: { time: 21, quality: 68 },
    start: { emotion: 0, accuracy: 0, recency: 10, friends: 0 },   // a plain newest-first feed: meets neither mission
    weights: [
      { id: 'emotion',  ico: '😡', name: 'Strong emotion' },
      { id: 'accuracy', ico: '✅', name: 'Accuracy' },
      { id: 'recency',  ico: '🕒', name: 'Recency' },
      { id: 'friends',  ico: '👥', name: 'From friends' }
    ],
    posts: [
      { id: 'p1', ico: '😤', txt: 'A celebrity insults a whole province',          emotion: 9,  accuracy: 2,  recency: 8,  friends: 0 },
      { id: 'p2', ico: '🌀', txt: 'Weather bureau: typhoon signal raised',          emotion: 3,  accuracy: 10, recency: 10, friends: 0 },
      { id: 'p3', ico: '🎓', txt: 'Your friend’s graduation photos',               emotion: 5,  accuracy: 9,  recency: 6,  friends: 10 },
      { id: 'p4', ico: '💊', txt: 'Viral post: a “miracle cure” for dengue',        emotion: 8,  accuracy: 0,  recency: 7,  friends: 4 },
      { id: 'p5', ico: '📊', txt: 'Explainer: where the city budget goes',          emotion: 1,  accuracy: 10, recency: 3,  friends: 0 },
      { id: 'p6', ico: '🗯️', txt: 'Shouting match at a public hearing',            emotion: 10, accuracy: 5,  recency: 9,  friends: 2 },
      { id: 'p7', ico: '🤫', txt: 'Rumour: a candidate is secretly ill',            emotion: 9,  accuracy: 1,  recency: 9,  friends: 3 },
      { id: 'p8', ico: '🌊', txt: 'Flood survivors tell their story (verified report)', emotion: 8, accuracy: 9, recency: 8, friends: 2 }
    ],
    rank: function (wt) {
      var scored = FEED.posts.map(function (p, i) {
        var s = 0; FEED.weights.forEach(function (k) { s += (Number(wt[k.id]) || 0) * p[k.id]; });
        return { p: p, s: s, i: i };
      }).sort(function (a, b) { return b.s - a.s || a.i - b.i; });
      var top = scored.slice(0, 5).map(function (x) { return x.p; });
      var time = sum(top.map(function (p) { return 1 + 0.45 * p.emotion + 0.15 * p.friends; }));
      var quality = sum(top.map(function (p) { return p.accuracy; })) / top.length * 10;
      return { top: top, time: Math.round(time * 10) / 10, quality: Math.round(quality), revenue: Math.round(time * 12) };
    },
    mission1: function (r) { return r.time >= FEED.M1.time; },
    mission2: function (r) { return r.quality >= FEED.M2.quality && r.time >= FEED.M2.time; },
    done: function (s) { return !!(s && s.m1 && s.m2 && s.reflected); },
    reflect: reflect('Why does a platform in the attention economy tend to reward outrage?',
      ['It earns more from advertising the longer people stay, and strong emotions keep them scrolling',
       'Outraged posts are usually the most accurate',
       'The law requires platforms to show emotional content',
       'Advertisers pay more for posts that are false'],
      0,
      ['Right. Time spent is what the platform sells to advertisers, so a ranking that chases attention lifts whatever provokes us, including outrage and sensationalism. The ranking code is now part of the gatekeeping that editors once did alone.',
       'In your feed, the most outraged posts were among the least accurate.',
       'No law set your weights. You did, and the platform’s income followed the time spent.',
       'Advertisers pay for attention. The ranking simply rewards whatever provokes strong emotion, true or not.'])
  };

  /* ── L10 · Your Data Day ──
     Surveillance capitalism (Zuboff, 2019): behaviour becomes data, data
     becomes predictions, and predictions are sold. A fictional student's day
     on a fictional free app. The switches are a simplified model. */
  var DATA = {
    switches: [
      { id: 'location', ico: '📍', name: 'Location history' },
      { id: 'activity', ico: '🖐️', name: 'Web & app activity' },
      { id: 'ads',      ico: '🎯', name: 'Personalized ads' }
    ],
    moments: [
      { time: '07:00', ico: '🛏️', txt: 'Scrolls videos in bed', data: [
        { id: 'travel', kind: 'activity', txt: 'Watched 12 budget-travel videos' },
        { id: 'home',   kind: 'location', txt: 'Phone spent the night at the same address' } ] },
      { time: '09:30', ico: '🔎', txt: 'Searches the web', data: [
        { id: 'flight', kind: 'activity', txt: 'Searched “cheap flights to Cebu”' } ] },
      { time: '12:15', ico: '🍜', txt: 'Lunch at the mall', data: [
        { id: 'mall',   kind: 'location', txt: '50 minutes at a mall food court' },
        { id: 'wallet', kind: 'activity', txt: 'Paid with an e-wallet' } ] },
      { time: '15:00', ico: '👍', txt: 'Likes a page', data: [
        { id: 'gym', kind: 'activity', txt: 'Liked a gym’s page' } ] },
      { time: '18:00', ico: '🚌', txt: 'Rides home', data: [
        { id: 'commute', kind: 'location', txt: 'Same commute route as every weekday' } ] },
      { time: '21:00', ico: '👟', txt: 'Joins a live selling', data: [
        { id: 'shoes', kind: 'activity', txt: 'Bought running shoes in a live selling' } ] }
    ],
    predictions: [
      { id: 'trip',    needs: ['travel', 'flight'],   txt: 'Planning a trip soon',            buyer: 'airlines and travel agencies' },
      { id: 'price',   needs: ['flight', 'shoes'],    txt: 'Hunts for the lowest price',      buyer: 'online shops' },
      { id: 'fitness', needs: ['gym', 'shoes'],       txt: 'Starting a fitness routine',      buyer: 'gyms and sportswear brands' },
      { id: 'area',    needs: ['home', 'commute'],    txt: 'Lives here and travels that way every weekday', buyer: 'local stores and lenders' },
      { id: 'lunch',   needs: ['mall'],               txt: 'Eats at the mall on weekdays',    buyer: 'food chains' }
    ],
    run: function (sw) {
      var data = [], ids = {};
      DATA.moments.forEach(function (m) { m.data.forEach(function (d) { if (sw && sw[d.kind]) { data.push(d); ids[d.id] = true; } }); });
      var predictions = DATA.predictions.filter(function (p) { return p.needs.every(function (n) { return ids[n]; }); });
      return { data: data, predictions: predictions, sold: sw && sw.ads ? predictions : [] };
    },
    LEAN_MAX: 2,
    lean: function (sw) { return !!(sw && sw.location && DATA.run(sw).predictions.length <= DATA.LEAN_MAX); },
    done: function (s) { return !!(s && s.fullDay && s.leanDay && s.reflected); },
    reflect: reflect('In surveillance capitalism (Zuboff, 2019), what is really being sold?',
      ['Predictions of what people will do next, made from their behaviour',
       'Only people’s attention, as in Smythe’s audience commodity',
       'The phones people use',
       'Monthly subscriptions to the app'],
      0,
      ['Right. Your day became data, the data became forecasts (“planning a trip soon”), and the forecasts were sold to advertisers. Zuboff takes Smythe’s audience commodity one step further.',
       'Close, but Zuboff goes one step further than Smythe: not only attention is sold, but forecasts of future behaviour.',
       'The app never sold a phone. It sold what it learned about the person using it.',
       'The app in this game was free. It earned from predictions, not from fees.'])
  };

  /* One lock per game: after an accepted tap, ignore taps for a moment, so the
     second tap of a double tap never lands on the button drawn underneath. */
  function tapLock(ms, now) {
    now = now || function () { return Date.now(); };
    var last = -Infinity;
    return function () { var t = now(); if (t - last < ms) return false; last = t; return true; };
  }

  w.SDLGames = {
    tapLock: tapLock,
    'sim-filters': FILTERS, 'sim-copy': COPY, 'sim-merger': MERGER, 'sim-agenda': AGENDA,
    'sim-pr': PR, 'sim-airtime': AIRTIME, 'sim-feed': FEED, 'sim-data': DATA
  };
})(typeof window !== 'undefined' ? window : this);
