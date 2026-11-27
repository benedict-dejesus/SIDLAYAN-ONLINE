/* ══════════════════════════════════════════════════════════════
   SIDLAYAN · CONTENT LAYER
   BAB 303 · Political Economy in Broadcasting, Interactive and
   Emerging Media. Structure is declarative: app.js renders each
   block by its `t` type.

   No answers, feedback or XP live here. They are in
   _apps-script/AnswerKey.gs, which never leaves the server.
   ══════════════════════════════════════════════════════════════ */
'use strict';

/* The term label comes from config.js so a new semester is a one-line change. */
const SDL_TERM = (typeof window !== 'undefined' && window.SDL_CONFIG && window.SDL_CONFIG.TERM) || '2nd Semester, A.Y. 2026–2027';

/* ─────────── Lesson labels ───────────
   `no` is the lesson's number in the course (0 = the Welcome page). The final
   term continues the count, so its lessons read Lesson 6 to Lesson 10. */
function lessonNo(l){ return (l && l.no !== undefined) ? l.no : l.num; }
function lessonLabel(l){ const n = lessonNo(l); return n === 0 ? 'Welcome' : 'Lesson ' + n; }
function lessonIcon(l){ const n = lessonNo(l); return n === 0 ? '👋' : String(n); }

/* ─────────── Badges ─────────── */
const BADGES = [
  {id:'first-steps', em:'🎧', n:'On Air',              d:'Open your first lesson'},
  {id:'sharp-eye',   em:'🔎', n:'Fact-Checker',        d:'Nail a knowledge check with no misses'},
  {id:'sorter',      em:'🗂️', n:'Clean Rundown',       d:'Ace a sorting challenge on the first try'},
  {id:'matchmaker',  em:'🧩', n:'Source Matcher',      d:'Clear a memory match with a perfect run'},
  {id:'boss',        em:'⏱️', n:'Beat the Clock',      d:'Win a Speed Round'},
  {id:'perfect-boss',em:'💎', n:'Live and Flawless',   d:'Win a Speed Round with 100% accuracy'},
  {id:'combo5',      em:'🔥', n:'Breaking Streak',     d:'Reach a 5-answer streak'},
  {id:'market',      em:'📈', n:'Market Analyst',      d:'Run the Dual-Product Market simulator'},
  {id:'mapper',      em:'🕸️', n:'Ownership Mapper',    d:'Trace who owns the airwaves'},
  {id:'midterm',     em:'📻', n:'Midterm Signed Off',  d:'Complete the Midterm Module'},
  {id:'final',       em:'📡', n:'Final Broadcast',     d:'Complete the Final Term Module'},
  {id:'scholar',     em:'🎓', n:'Political Economist', d:'Complete both modules'}
];

/* ─────────── Level curve ─────────── */
const RANKS = [
  {lvl:1, xp:0,    name:'Intern',               em:'🎧'},
  {lvl:2, xp:150,  name:'Production Assistant', em:'📋'},
  {lvl:3, xp:350,  name:'Researcher',           em:'🔎'},
  {lvl:4, xp:600,  name:'Reporter',             em:'🎤'},
  {lvl:5, xp:900,  name:'Producer',             em:'🎬'},
  {lvl:6, xp:1300, name:'Anchor',               em:'📺'},
  {lvl:7, xp:1800, name:'News Director',        em:'🗞️'},
  {lvl:8, xp:2400, name:'Station Manager',      em:'📡'}
];

/* A knowledge check with its options; the key and feedback are in AnswerKey.gs. */
function kc(gate, title, q, opts){
  return {t:'quiz', mode:'single', gate:gate, title:title, kicker:'Knowledge Check', q:q, opts:opts.map(function(o){ return {txt:o}; })};
}
function cont(id, req, label, note, go, unlock){
  var b = {t:'continue', id:'cont-' + id, req:req, label:label, note:note, go:go};
  if (unlock) b.unlock = unlock;
  return b;
}

/* ══════════════════════════════════════════════════════════════
   MODULES
   ══════════════════════════════════════════════════════════════ */
const CONTENT = {

/* ─────────────────────────────────────────────────────────────
   MIDTERM MODULE · Weeks 1–9
   ───────────────────────────────────────────────────────────── */
m: {
  label:'Midterm Module',
  short:'Midterm',
  desc:'Lessons 1–5: what political economy is, the political economy of broadcast media, media and democracy, media economics and business models, and media ownership in the Philippines. Then the Midterm Examination.',
  doneIcon:'📻',
  lessons:[

  /* ── M1 · Welcome ── */
  {
    id:'m1', num:1, no:0, title:'About the Instructor', tag:'Midterm · Welcome',
    desc:'Meet the person guiding Section E through BAB 303 this semester.',
    blocks:[
      {t:'quote', img:'images/image1.jpg', alt:'Sir Kito',
       html:'"Every broadcast is a decision someone paid for. This course is about learning to see who."',
       attr:'– Sir Kito'},

      {t:'text', html:`
        <p>Mr. Benedict C. de Jesus (Sir Kito) is a licensed professional teacher who has been serving as a part-time instructor at Bulacan State University for 8 years. He is also an enthusiast of music, research, statistics, AI technology, and instructional design.</p>
        <p>He has been a freelance research and thesis consultant for 16 years and a frequent guest lecturer and workshop facilitator for the City Government of Malolos.</p>`},

      {t:'text', html:`
        <p><strong>Welcome, Section E · SIDLAYAN.</strong> You have met this course before, and that is an advantage: you already know where it gets hard. This module is built so the ideas stick this time. Each lesson is short, explains one idea at a time, and lets you check yourself as often as you like before anything is graded.</p>
        <p>Activities earn XP and badges, and your progress saves to the class record automatically, so you can continue on any phone or computer with your access code. Quizzes and exams appear under <strong>Quizzes &amp; Exams</strong>, and your grades appear under <strong>My Grades</strong>.</p>`},

      {t:'discover', gate:'m1-tour', cols:3,
       title:'How SIDLAYAN Works', kicker:'Discovery Grid',
       instr:'Tap each tile to see how this course runs. <strong>Open all 3</strong> to continue.',
       items:[
         {label:'Lessons', ico:'📚', title:'Ten short lessons',
          html:'<p>Five lessons in the Midterm and five in the Final Term. Each one ends with a recap and a check you can retake until you are confident.</p>'},
         {label:'Grading', ico:'⚖️', title:'How your grade is built',
          html:'<p>Each term: Attendance &amp; Recitation 10%, Activity &amp; Performance 25%, Quizzes 15%, Project 20%, Examination 30%. Your final rating is the average of the two terms.</p>'},
         {label:'Quizzes', ico:'📝', title:'Two tries on every quiz',
          html:'<p>Each quiz allows two attempts and your best score counts. Exams allow one attempt. The timer is the server\'s, so it is the same for everyone.</p>'}
       ]},

      cont('m1', ['m1-tour'], 'Continue to Lesson 1', '📚 Open all 3 tiles above to continue.', 'm2', 2)
    ]
  },

  /* ── M2 · Lesson 1 ── */
  {
    id:'m2', num:2, no:1, title:'What is Political Economy?', tag:'Midterm · Lesson 1',
    desc:'Who owns, who controls, who profits, and why it matters for what we see and hear.',
    blocks:[
      {t:'heading', lvl:2, text:'What is Political Economy?'},
      {t:'text', html:'<p>Political economy studies how power and wealth shape each other. Applied to media, it asks who owns and controls the channels we use, how they make money, and how those arrangements shape what gets produced and who gets heard.</p>'},
      kc('m2-kc', 'The Core Question',
         'Which question sits at the heart of the political economy of media?',
         ['How an audience interprets a single TV episode',
          'Who owns, controls and profits from media, and how that shapes what we see and hear',
          'How to light a television studio set',
          'Which camera angle makes a scene look most dramatic']),
      cont('m2', ['m2-kc'], 'Continue to Lesson 2', '⚠️ Answer the knowledge check to continue.', 'm3', 3)
    ]
  },

  /* ── M3 · Lesson 2 ── */
  {
    id:'m3', num:3, no:2, title:'Communication and the Political Economy of Broadcast Media', tag:'Midterm · Lesson 2',
    desc:'Commodification, spatialization and structuration in the broadcast industry.',
    blocks:[
      {t:'heading', lvl:2, text:'Communication and the Political Economy of Broadcast Media'},
      {t:'text', html:'<p>Vincent Mosco describes three entry points for studying the political economy of communication. Each one gives you a different question to ask about a broadcaster.</p>'},
      kc('m3-kc', 'Three Entry Points',
         'Mosco names commodification and spatialization as two entry points into the political economy of communication. What is the third?',
         ['Digitization', 'Regulation', 'Structuration', 'Globalization']),
      cont('m3', ['m3-kc'], 'Continue to Lesson 3', '⚠️ Answer the knowledge check to continue.', 'm4', 4)
    ]
  },

  /* ── M4 · Lesson 3 ── */
  {
    id:'m4', num:4, no:3, title:'Media, Politics and Democracy', tag:'Midterm · Lesson 3',
    desc:'What democracy needs from the media, and what can get in the way.',
    blocks:[
      {t:'heading', lvl:2, text:'Media, Politics and Democracy'},
      {t:'text', html:'<p>Democracies rely on media to inform citizens, give voice to different groups, and keep watch over those in power. This lesson looks at how well broadcasting performs those roles, and why.</p>'},
      kc('m4-kc', 'The Watchdog',
         'What does the "watchdog" role of the press mean?',
         ['Holding those in power to account by investigating and exposing wrongdoing',
          'Protecting the government\'s image during a crisis',
          'Choosing which entertainment shows get the best time slots',
          'Guarding a station\'s broadcast equipment']),
      cont('m4', ['m4-kc'], 'Continue to Lesson 4', '⚠️ Answer the knowledge check to continue.', 'm5', 5)
    ]
  },

  /* ── M5 · Lesson 4 ── */
  {
    id:'m5', num:5, no:4, title:'Media Economics and Business Models', tag:'Midterm · Lesson 4',
    desc:'How media industries make money, and how that shapes their content.',
    blocks:[
      {t:'heading', lvl:2, text:'Media Economics and Business Models'},
      {t:'text', html:'<p>Media products are unusual goods: expensive to make once, cheap to copy, and often paid for by someone other than the viewer. That is why media companies use very different business models, from advertising to subscriptions to public funding.</p>'},
      kc('m5-kc', 'The Dual-Product Market',
         'Commercial broadcasters operate in a "dual-product market". What two things do they sell?',
         ['Equipment to producers, and airtime to the government',
          'Tickets to viewers, and scripts to writers',
          'News to journalists, and ratings to regulators',
          'Programmes to audiences, and audiences to advertisers']),
      {t:'sim-market', gate:'m5-sim',
       title:'The Dual-Product Market', kicker:'Simulator',
       instr:'You run a fictional free-to-air station for one week. <strong>Move all three sliders</strong> and watch how programmes buy an audience, and how that audience is sold to advertisers.'},
      cont('m5', ['m5-sim','m5-kc'], 'Continue to Lesson 5', '⚠️ Try the simulator and answer the knowledge check to continue.', 'm6', 6)
    ]
  },

  /* ── M6 · Lesson 5 ── */
  {
    id:'m6', num:6, no:5, title:'Globalization and Media Ownership in the Philippines', tag:'Midterm · Lesson 5',
    desc:'Who owns the airwaves, at home and across borders.',
    blocks:[
      {t:'heading', lvl:2, text:'Globalization and Media Ownership in the Philippines'},
      {t:'text', html:'<p>A handful of groups own most of what Filipinos watch, hear and read, and many of those groups also run businesses in other industries. This lesson maps that landscape and asks what it means for the public.</p>'},
      kc('m6-kc', 'Concentration',
         'What does "media ownership concentration" mean?',
         ['Every town has its own independent radio station',
          'A few companies or families control a large share of media outlets',
          'Broadcasters focus their programming on one topic',
          'The government licenses every journalist']),
      {t:'ownership', gate:'m6-own',
       title:'Who Owns the Airwaves?', kicker:'Ownership Map',
       instr:'Tap a media group to see who owns it, what else it owns, and where the facts come from. <strong>Trace at least 3 groups</strong> to continue.'},
      cont('m6', ['m6-own','m6-kc'], 'Complete Midterm Module 🎉', '⚠️ Trace 3 groups and answer the knowledge check to complete this module.', 'mc')
    ]
  }
  ],
  complete:{
    id:'mc', icon:'🎉', title:'Midterm Module Complete!', conf:'📻 ✨ 📈 🗞️ ✨ 📻',
    badge:'midterm',
    html:"Congratulations! You've completed the <strong>Midterm Module</strong> of BAB 303. You can now explain what political economy is, how it applies to broadcasting, what democracy asks of the media, how media industries make money, and who owns the airwaves in the Philippines. Review any lesson before the <strong>Midterm Examination</strong>."
  }
},

/* ─────────────────────────────────────────────────────────────
   FINAL TERM MODULE · Weeks 10–18
   ───────────────────────────────────────────────────────────── */
f: {
  label:'Final Term Module',
  short:'Final Term',
  desc:'Lessons 6–10: the power of broadcasting, advertising and political public relations, media in campaigns, new media and political futures, and the commercialized internet. Then the Final Examination and the final analytical paper.',
  doneIcon:'📡',
  lessons:[

  /* ── F1 · Lesson 6 ── */
  {
    id:'f1', num:1, no:6, title:'How Powerful Is Broadcasting?', tag:'Final Term · Lesson 6',
    desc:'What television and radio can and cannot do to public opinion.',
    blocks:[
      {t:'heading', lvl:2, text:'How Powerful Is Broadcasting?'},
      {t:'text', html:'<p>Researchers have argued for a century about how strongly broadcasting shapes what people think. This lesson walks through the main answers, from agenda-setting to framing and cultivation.</p>'},
      kc('f1-kc', 'Agenda-Setting',
         'According to agenda-setting research, the news media are most successful at telling us…',
         ['exactly what to think', 'which products to buy', 'what to think about', 'how to vote']),
      cont('f1', ['f1-kc'], 'Continue to Lesson 7', '⚠️ Answer the knowledge check to continue.', 'f2', 2)
    ]
  },

  /* ── F2 · Lesson 7 ── */
  {
    id:'f2', num:2, no:7, title:'Advertising, News and Political Public Relations', tag:'Final Term · Lesson 7',
    desc:'Who pays for the news, and who tries to shape it.',
    blocks:[
      {t:'heading', lvl:2, text:'Advertising, News and Political Public Relations'},
      {t:'text', html:'<p>Advertising pays for most commercial broadcasting, and politicians invest heavily in managing how journalists cover them. This lesson follows the money and the messages.</p>'},
      kc('f2-kc', 'Political PR',
         'Which best describes political public relations?',
         ['The planned communication of politicians and parties to shape news coverage and public opinion',
          'A government office that licenses broadcasters',
          'Advertising that sells consumer products during the news',
          'Fact-checking done by independent journalists']),
      cont('f2', ['f2-kc'], 'Continue to Lesson 8', '⚠️ Answer the knowledge check to continue.', 'f3', 3)
    ]
  },

  /* ── F3 · Lesson 8 ── */
  {
    id:'f3', num:3, no:8, title:'Media Politics and Campaigns', tag:'Final Term · Lesson 8',
    desc:'How elections are covered, and how campaigns use the media.',
    blocks:[
      {t:'heading', lvl:2, text:'Media Politics and Campaigns'},
      {t:'text', html:'<p>Election coverage decides which candidates and issues the public hears about. This lesson looks at the habits of campaign coverage and how to analyse them.</p>'},
      kc('f3-kc', 'Horse-Race Coverage',
         'What does "horse-race" election coverage focus on?',
         ['The candidates\' detailed policy platforms',
          'The rules of the electoral commission',
          'Voters\' personal stories',
          'Who is ahead or behind in the surveys, rather than the issues']),
      cont('f3', ['f3-kc'], 'Continue to Lesson 9', '⚠️ Answer the knowledge check to continue.', 'f4', 4)
    ]
  },

  /* ── F4 · Lesson 9 ── */
  {
    id:'f4', num:4, no:9, title:'New Media and Political Futures', tag:'Final Term · Lesson 9',
    desc:'Platforms, networks and competition in the digital world.',
    blocks:[
      {t:'heading', lvl:2, text:'New Media and Political Futures'},
      {t:'text', html:'<p>Digital platforms now compete with broadcasters for audiences, advertising and political attention. This lesson explains the economics that give platforms their power.</p>'},
      kc('f4-kc', 'Network Effects',
         'What is a "network effect"?',
         ['A platform becomes slower as more people use it',
          'A platform becomes more valuable to each user as more people use it',
          'A TV network shares programmes with its regional stations',
          'A broadcast signal weakens over long distances']),
      cont('f4', ['f4-kc'], 'Continue to Lesson 10', '⚠️ Answer the knowledge check to continue.', 'f5', 5)
    ]
  },

  /* ── F5 · Lesson 10 ── */
  {
    id:'f5', num:5, no:10, title:'The Political Economy of Communication and the Commercialized Internet', tag:'Final Term · Lesson 10',
    desc:'From a public research network to an advertising machine, and your final paper.',
    blocks:[
      {t:'heading', lvl:2, text:'The Political Economy of Communication and the Commercialized Internet'},
      {t:'text', html:'<p>The internet began as a publicly funded research network and became one of the most commercial spaces in history. This lesson traces that shift and prepares you to pitch your final analytical paper.</p>'},
      kc('f5-kc', 'Commercialization',
         'What does the "commercialization of the internet" refer to?',
         ['Making internet access free for everyone',
          'Replacing broadcasting with radio',
          'The shift from a public, research-based network to one organized around advertising, data and private profit',
          'Government ownership of all websites']),
      cont('f5', ['f5-kc'], 'Complete Final Term Module 🎉', '⚠️ Answer the knowledge check to complete this module.', 'fc')
    ]
  }
  ],
  complete:{
    id:'fc', icon:'🏆', title:'Final Term Module Complete!', conf:'📡 ✨ 📺 🌐 ✨ 📡',
    badge:'final',
    html:"Congratulations! You've completed the <strong>Final Term Module</strong> of BAB 303. You can now evaluate the influence of broadcasting, trace the links between advertising, news and political public relations, analyse election coverage, explain platform economics, and critique the commercialized internet. Finish strong in the <strong>Final Examination</strong> and your final analytical paper."
  }
}
};

/* ─────────── Terminal / home page content ─────────── */
const TERMINAL = {
  heroTag:'Bulacan State University · College of Arts and Letters',
  heroTitle:'Political Economy in Broadcasting',
  heroSub:'BAB 303 · Section E · SIDLAYAN · '+SDL_TERM+'<br>Instructor: Mr. Benedict C. de Jesus, LPT. <span style="white-space:nowrap">(Sir Kito)</span>',
  welcome:'<p>Welcome to <strong>BAB 303 – Political Economy in Broadcasting, Interactive and Emerging Media</strong>, Section E · SIDLAYAN, under Mr. Benedict de Jesus (Sir Kito)!</p>',
  warnTitle:'⚠️ &nbsp;WARNING!!!',
  warn:'This learning module was created by <strong>Mr. Benedict de Jesus (Sir Kito)</strong> for his BAB 303 students at <strong>Bulacan State University</strong> for the '+SDL_TERM+'. Distribution and sharing of the link/url/screenshots/codes to people <strong>not enrolled in BAB 303 under Sir Kito during the aforementioned semester is extremely prohibited</strong>. Enrolled students, while given access rights to the course, are <strong>discouraged to take screenshots</strong>, as the interactive elements for learning the topic will be compromised.'
};
