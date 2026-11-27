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
      {t:'quote', html:'"Political economy is the study of the social relations, particularly the power relations, that mutually constitute the production, distribution, and consumption of resources."',
       attr:'– Vincent Mosco, The Political Economy of Communication (2009)'},

      {t:'text', html:`
        <p>Every evening newscast you have ever watched was paid for by someone, approved by someone, and scheduled by someone. <strong>Political economy</strong> is the study of those someones. It asks how <strong>power</strong> (politics) and <strong>wealth</strong> (economics) shape each other, and how that relationship decides what gets made, who gets it, and who is left out.</p>
        <p>When we apply it to broadcasting, the questions get very concrete. Who owns this channel? Who pays for this programme? Who regulates the airwaves? Who benefits when a story runs, and who benefits when it does not? Mosco (2009) calls the media <strong>resources</strong> like any other: they are produced, distributed and consumed inside relationships of power.</p>
        <p>This lesson gives you the vocabulary. You will meet the thinkers who built the field, see the two big ways of looking at media markets, and practise asking the four questions a political economist always asks.</p>`},

      {t:'heading', lvl:2, text:'Where the field comes from'},
      {t:'text', html:`<p>Political economy is older than television, radio, or even the newspaper industry. It began with philosophers trying to explain how markets work, and it grew into a set of tools for asking who markets work <em>for</em>. Flip each card to meet the people whose ideas you will use all semester.</p>`},

      {t:'flipdeck', gate:'m2-flip', title:'The Thinkers', kicker:'Flip to Reveal',
       instr:'Flip all 6 cards. Each one is a thinker whose idea you will use in this course.',
       items:[
         {ico:'🏭', title:'Adam Smith (1776)',
          def:'In The Wealth of Nations, Smith argued that free markets, guided by self-interest and competition, tend to serve the public good, the famous "invisible hand." Media owners who defend open, unregulated markets still echo this idea.'},
         {ico:'⚖️', title:'David Ricardo (1817)',
          def:'Ricardo studied how value and income are divided between landowners, workers and owners of capital. His question, who gets what share, is the root of every debate about who profits from media.'},
         {ico:'🛠️', title:'Karl Marx (1867)',
          def:'In Capital, Marx argued that whoever owns the means of production holds power over everyone else. With Engels he also argued that the class which owns material production tends to shape the ruling ideas of its time. Critics apply this to who owns the means of communication.'},
         {ico:'📺', title:'Dallas Smythe (1977)',
          def:'Smythe argued that commercial broadcasting does not mainly sell programmes to viewers. It sells the attention of viewers to advertisers. He called this the audience commodity, and it changed how scholars study free TV.'},
         {ico:'📰', title:'Herman & Chomsky (1988)',
          def:'In Manufacturing Consent they proposed a propaganda model: news in a market system passes through filters such as ownership and advertising, which narrow what gets reported. You will study the filters in Lesson 3.'},
         {ico:'🧭', title:'Vincent Mosco (2009)',
          def:'Mosco organised the political economy of communication around three processes, commodification, spatialization and structuration, which you will use to analyse broadcasters in Lesson 2.'}
       ]},

      {t:'heading', lvl:2, text:'Two ways of looking at media markets'},
      {t:'compare', items:[
        {badge:'Market view', h:'🏪 Liberal political economy',
         html:'<p>Media are businesses like any other. If broadcasters compete freely, audiences "vote" with their remotes and ratings, and the market gives people what they want. Government should mainly stay out of the way.</p>'},
        {badge:'Power view', h:'🔍 Critical political economy',
         html:'<p>Markets are shaped by power. Ownership, advertising and regulation decide whose voices are heard, and ratings measure what advertisers value, not everything citizens need. Hardy (2014) calls this tradition <strong>critical political economy of the media</strong>.</p>'}
      ]},
      {t:'text', html:`<p>Neither view is "the answer." Throughout this course you will use both and test them against Philippine examples. Try sorting the statements below into the view each one comes from.</p>`},

      {t:'sorter', gate:'m2-dnd', badgeOnPerfect:'sorter',
       title:'Which View Is Speaking?', kicker:'Sorting Challenge',
       instr:'Sort each statement into the view it comes from.<br><em>Desktop: drag &amp; drop. Phone: tap a statement, then tap a box.</em>',
       items:[
         {id:'compete',  label:'📈 Competition between networks gives viewers the shows they want.'},
         {id:'owners',   label:'🏢 Who owns a network shapes which stories get airtime.'},
         {id:'adbuyer',  label:'💼 Advertisers, not viewers, are the real customers of free TV.'},
         {id:'handsoff', label:'🚫 Government should stay out of media markets.'},
         {id:'narrow',   label:'🔒 When a few groups own most outlets, fewer voices are heard.'},
         {id:'ratings',  label:'📊 Ratings are the best guide to what the public values.'}
       ],
       cats:[{id:'liberal', label:'🏪 Liberal (market) view'},{id:'critical', label:'🔍 Critical political economy'}]},

      {t:'heading', lvl:2, text:'The four questions'},
      {t:'discover', gate:'m2-tabs', cols:2,
       title:'Ask Like a Political Economist', kicker:'Discovery Grid',
       instr:'Tap each question. You will ask all four in every activity this semester.',
       items:[
         {label:'Who owns it?', ico:'🏢', title:'Who owns it?',
          html:'<p>Trace the company, its parent group and the family or investors behind it. In the Philippines, the 1987 Constitution reserves ownership of mass media to Filipino citizens or corporations wholly owned by them, so tracing owners is also tracing who is allowed to own.</p>'},
         {label:'Who pays for it?', ico:'💰', title:'Who pays for it?',
          html:'<p>Advertisers, subscribers, the government, or a sponsor buying airtime? The one who pays has the most say over what is made.</p>'},
         {label:'Who controls it?', ico:'🏛️', title:'Who controls it?',
          html:'<p>Broadcasters in the Philippines need a <strong>legislative franchise</strong> from Congress and are regulated by the National Telecommunications Commission. Whoever grants and renews permission to broadcast holds power over broadcasters.</p>'},
         {label:'Who benefits?', ico:'⚖️', title:'Who benefits, and who is left out?',
          html:'<p>Look for the groups whose stories are told often, and the ones who are rarely heard: rural communities, workers, minorities. Silence is evidence too.</p>'}
       ]},

      kc('m2-kc', 'The Core Question',
         'Which question sits at the heart of the political economy of media?',
         ['How an audience interprets a single TV episode',
          'Who owns, controls and profits from media, and how that shapes what we see and hear',
          'How to light a television studio set',
          'Which camera angle makes a scene look most dramatic']),

      {t:'text', html:`
        <p><strong>📌 Recap</strong></p>
        <ul>
          <li>Political economy studies how power and wealth shape the production, distribution and consumption of resources, including media.</li>
          <li>The liberal view trusts competitive markets; the critical view looks at how ownership, advertising and regulation shape media.</li>
          <li>Always ask: who owns it, who pays for it, who controls it, and who benefits.</li>
        </ul>
        <p class="refs"><strong>References</strong><br>
          Hardy, J. (2014). <em>Critical political economy of the media: An introduction</em>. Routledge.<br>
          Herman, E. S., &amp; Chomsky, N. (1988). <em>Manufacturing consent: The political economy of the mass media</em>. Pantheon.<br>
          Mosco, V. (2009). <em>The political economy of communication</em> (2nd ed.). SAGE.<br>
          Smythe, D. W. (1977). Communications: Blindspot of Western Marxism. <em>Canadian Journal of Political and Social Theory, 1</em>(3), 1–27.</p>`},

      cont('m2', ['m2-flip','m2-dnd','m2-tabs','m2-kc'], 'Continue to Lesson 2', '⚠️ Finish the four activities above to continue.', 'm3', 3)
    ]
  },

  /* ── M3 · Lesson 2 ── */
  {
    id:'m3', num:3, no:2, title:'Communication and the Political Economy of Broadcast Media', tag:'Midterm · Lesson 2',
    desc:'Commodification, spatialization and structuration in the broadcast industry.',
    blocks:[
      {t:'text', html:`
        <p>In Lesson 1 you learned the questions. In this lesson you get the tools. Mosco (2009) suggests three <strong>entry points</strong> for studying the political economy of communication. Each one is a lens you can hold up to any broadcaster, from a provincial AM station to a national TV network.</p>
        <p>Broadcasting is a good place to use them, because it sits where three things meet: a public resource (the airwaves), a private business (the station), and a public good (information citizens need).</p>`},

      {t:'discover', gate:'m3-tabs', cols:3,
       title:'Mosco’s Three Entry Points', kicker:'Discovery Grid',
       instr:'Open all 3 entry points and read the broadcast example in each.',
       items:[
         {label:'Commodification', ico:'🏷️', title:'Commodification',
          html:'<p>Turning things into products that can be bought and sold. In broadcasting, programmes become products, airtime becomes a product, and, following Smythe (1977), the <strong>audience itself</strong> becomes a product sold to advertisers through ratings.</p><p><em>Ask:</em> what is being sold here, and to whom?</p>'},
         {label:'Spatialization', ico:'🌏', title:'Spatialization',
          html:'<p>Overcoming the limits of space and distance. Networks build relay stations and regional channels to reach more of the archipelago, launch international channels for Filipinos abroad, and grow by buying or merging with other companies.</p><p><em>Ask:</em> how far does this broadcaster reach, and how did it grow?</p>'},
         {label:'Structuration', ico:'🧱', title:'Structuration',
          html:'<p>The way social structures (class, gender, ownership rules) and human action shape each other. Journalists make real choices every day, but they make them inside routines, budgets and ownership structures that they did not choose.</p><p><em>Ask:</em> what structures shape the choices people in this newsroom make?</p>'}
       ]},

      {t:'heading', lvl:2, text:'The audience as a commodity'},
      {t:'text', html:`
        <p>On free-to-air TV and radio, you do not pay to watch. So who is the customer? Smythe (1977) argued that the customer is the <strong>advertiser</strong>, and the product is <strong>your attention</strong>, measured and packaged as ratings. The programme is, in a sense, the bait.</p>
        <p>This is why a network may move a public-affairs show out of primetime even if it wins awards: an entertainment show in the same slot may deliver a bigger audience to sell. Keep this idea in mind; you will test it yourself with the simulator in Lesson 4.</p>`},

      {t:'match', gate:'m3-match',
       title:'Concept Match', kicker:'Memory Minigame',
       instr:'Pair each <strong>concept</strong> with a broadcast example. Tap a concept, then tap its match. Fewer misses = more XP.',
       pairs:[
         {a:'Commodification', b:'Selling 30-second spots during a primetime drama'},
         {a:'Audience commodity', b:'Ratings packaged and sold to advertisers'},
         {a:'Spatialization', b:'Adding regional stations to reach more provinces'},
         {a:'Structuration', b:'Reporters following newsroom routines set by management'},
         {a:'Vertical integration', b:'One company producing, airing and streaming its own shows'},
         {a:'Horizontal integration', b:'One group buying several radio stations'}
       ]},

      {t:'quiz', mode:'multi', gate:'m3-mc', title:'Spot the Commodity', kicker:'Knowledge Check',
       badgeText:'Select 2 answers',
       q:'Which <strong>two</strong> of these are examples of <strong>commodification</strong> in broadcasting?',
       opts:[{txt:'A network sells advertising slots during a basketball final'},
             {txt:'A reporter interviews flood victims for a newscast'},
             {txt:'A station builds a relay tower in Mindanao'},
             {txt:'A radio station sells blocks of airtime to independent hosts (blocktime)'},
             {txt:'Viewers discuss a teleserye on social media'}]},

      kc('m3-kc', 'Three Entry Points',
         'Mosco names commodification and spatialization as two entry points into the political economy of communication. What is the third?',
         ['Digitization', 'Regulation', 'Structuration', 'Globalization']),

      {t:'heading', lvl:2, text:'Midterm Activity 1: Broadcast Organization Case Analysis'},
      {t:'text', html:`
        <p><strong>Task (Week 4).</strong> Choose one Philippine broadcast organization (a TV network, a radio network, or a regional station). In 600–800 words, analyse the <strong>political and economic factors</strong> that influence it, using Mosco’s three entry points and the four questions from Lesson 1. Cite at least three sources, including at least one from the Media Ownership Monitor Philippines.</p>`},
      {t:'rubric', kicker:'Rubric R1 · How it is scored', title:'Activity 1: Broadcast Organization Case Analysis', when:'Submit in Week 4',
       task:'Analyse the political and economic factors that influence one Philippine broadcast organization (600–800 words).',
       crit:[
         {name:'Ownership and economic factors', pts:25, ex:'Identifies owners, parent group, revenue sources and business model accurately, with evidence.'},
         {name:'Political and regulatory factors', pts:25, ex:'Explains the franchise, regulation and political relationships that affect the organization.'},
         {name:'Use of political economy concepts', pts:25, ex:'Applies commodification, spatialization and structuration correctly to the case.'},
         {name:'Evidence and sources', pts:15, ex:'At least three credible sources, including the Media Ownership Monitor, cited in APA 7.'},
         {name:'Organization and mechanics', pts:10, ex:'Clear structure, within the word count, few errors.'}
       ],
       note:'Your own analysis only. AI tools may help you brainstorm if you disclose how you used them; AI-written analyses score 0.'},

      {t:'text', html:`
        <p><strong>📌 Recap</strong></p>
        <ul>
          <li><strong>Commodification:</strong> what is turned into a product, including the audience.</li>
          <li><strong>Spatialization:</strong> how broadcasters overcome distance and grow.</li>
          <li><strong>Structuration:</strong> how structures and people’s choices shape each other.</li>
        </ul>
        <p class="refs"><strong>References</strong><br>
          Mosco, V. (2009). <em>The political economy of communication</em> (2nd ed.). SAGE.<br>
          Smythe, D. W. (1977). Communications: Blindspot of Western Marxism. <em>Canadian Journal of Political and Social Theory, 1</em>(3), 1–27.<br>
          VERA Files &amp; Global Media Registry. (2023). <em>Media Ownership Monitor Philippines</em>. https://philippines.mom-gmr.org/en/</p>`},

      cont('m3', ['m3-tabs','m3-match','m3-mc','m3-kc'], 'Continue to Lesson 3', '⚠️ Finish the activities above to continue.', 'm4', 4)
    ]
  },

  /* ── M4 · Lesson 3 ── */
  {
    id:'m4', num:4, no:3, title:'Media, Politics and Democracy', tag:'Midterm · Lesson 3',
    desc:'What democracy needs from the media, and what can get in the way.',
    blocks:[
      {t:'text', html:`
        <p>A democracy asks citizens to choose their leaders and judge their decisions. Citizens can only do that if they know what is going on. For most people, most of what they know about politics comes through the media. That makes the media a political institution, whether or not it wants to be one.</p>
        <p>Street (2021) describes how media and politics shape each other: politicians depend on media to reach voters, media depend on politicians for news, and both are shaped by who owns and funds the media. This lesson looks at what democracy needs from broadcasting, and at a famous argument about why it may not get it.</p>`},

      {t:'discover', gate:'m4-tabs', cols:2,
       title:'What Democracy Needs from Broadcasting', kicker:'Discovery Grid',
       instr:'Open all 4 roles.',
       items:[
         {label:'Inform', ico:'📡', title:'Inform citizens',
          html:'<p>Give people accurate, timely information about public issues, so they can form opinions and vote.</p>'},
         {label:'Watchdog', ico:'🐕', title:'Act as a watchdog',
          html:'<p>Investigate and expose wrongdoing by those in power, in government and in business, so they can be held to account.</p>'},
         {label:'Forum', ico:'🗣️', title:'Provide a forum',
          html:'<p>Open a space where different groups can be heard and argue in public. Habermas (1989) called this the <strong>public sphere</strong>: a space between private life and the state where citizens reason together about common concerns.</p>'},
         {label:'Represent', ico:'🙋', title:'Represent and mobilize',
          html:'<p>Make sure the concerns of many groups reach those in power, and help citizens organize around shared issues.</p>'}
       ]},

      {t:'heading', lvl:2, text:'Fourth Estate or propaganda?'},
      {t:'compare', items:[
        {badge:'Optimistic', h:'🏛️ The Fourth Estate',
         html:'<p>A free press acts as a fourth branch of power beside the executive, legislature and judiciary. Competition and professional journalism keep it independent and watchful.</p>'},
        {badge:'Critical', h:'🧪 The propaganda model',
         html:'<p>Herman and Chomsky (1988) argue that in market systems, news passes through <strong>filters</strong> that, without any conspiracy, narrow what gets reported in ways that suit powerful interests.</p>'}
      ]},

      {t:'flipdeck', gate:'m4-flip', title:'The Five Filters', kicker:'Flip to Reveal',
       instr:'Flip all 5 filters of the propaganda model.',
       items:[
         {ico:'🏢', title:'1 · Ownership', def:'Large media firms are owned by wealthy individuals or corporations with wider business interests, which may discourage stories that hurt those interests.'},
         {ico:'💼', title:'2 · Advertising', def:'Commercial media depend on advertisers, so content that drives advertisers away or attracts audiences advertisers do not want is harder to sustain.'},
         {ico:'🎙️', title:'3 · Sourcing', def:'Newsrooms rely on official sources such as government offices and big companies because they are steady and cheap to cover, which gives those sources more influence over the agenda.'},
         {ico:'📢', title:'4 · Flak', def:'Organized negative responses, such as complaints, lawsuits or threats, raise the cost of running certain stories.'},
         {ico:'🚩', title:'5 · Anti-communism', def:'In the original model, anti-communism worked as a control ideology. Later writers broadened this filter to any shared fear that can be used to dismiss critics.'}
       ]},

      {t:'text', html:`
        <p><strong>A Philippine reminder.</strong> The relationship between the state and broadcasters is not only theory here. When martial law was declared in September 1972, independent newspapers and broadcast stations, including ABS-CBN, were shut down. Because broadcasters need a franchise from Congress, the question of who controls permission to broadcast remains a live political issue, as you will see in Lesson 5.</p>`},

      {t:'boss', gate:'m4-boss', optional:true,
       title:'Speed Round: Media and Democracy', emoji:'⏱️',
       desc:'Eight questions. Ten seconds each. Every correct answer in a row multiplies your XP.',
       time:10,
       questions:[
         {q:'Which democratic role means exposing wrongdoing by the powerful?', opts:['Forum','Watchdog','Represent','Entertain']},
         {q:'Who wrote about the "public sphere"?', opts:['Adam Smith','Dallas Smythe','Jürgen Habermas','David Ricardo']},
         {q:'Which filter is about relying on official sources?', opts:['Flak','Ownership','Advertising','Sourcing']},
         {q:'Lawsuits and organized complaints against a station are…', opts:['Flak','Sourcing','Spatialization','Ratings']},
         {q:'Who proposed the propaganda model?', opts:['Mosco','Herman and Chomsky','Habermas','Smythe']},
         {q:'The "Fourth Estate" idea sees the press as…', opts:['A branch of government','A watchful power beside the three branches','An advertising business only','A form of entertainment']},
         {q:'Which filter is about media firms depending on sponsors?', opts:['Advertising','Flak','Sourcing','Anti-communism']},
         {q:'In 1972, under martial law, independent broadcast stations were…', opts:['Expanded','Privatized','Shut down','Exported']}
       ]},

      kc('m4-kc', 'The Watchdog',
         'What does the "watchdog" role of the press mean?',
         ['Holding those in power to account by investigating and exposing wrongdoing',
          'Protecting the government’s image during a crisis',
          'Choosing which entertainment shows get the best time slots',
          'Guarding a station’s broadcast equipment']),

      {t:'text', html:`
        <p><strong>📌 Recap</strong></p>
        <ul>
          <li>Democracy needs media to inform, watch, host debate and represent citizens.</li>
          <li>The Fourth Estate view trusts a free press; the propaganda model warns that ownership, advertising, sourcing, flak and ideology filter the news.</li>
          <li>In the Philippines, the state’s power over broadcast franchises makes the media–politics relationship especially direct.</li>
        </ul>
        <p class="refs"><strong>References</strong><br>
          Habermas, J. (1989). <em>The structural transformation of the public sphere</em> (T. Burger, Trans.). MIT Press. (Original work published 1962)<br>
          Herman, E. S., &amp; Chomsky, N. (1988). <em>Manufacturing consent: The political economy of the mass media</em>. Pantheon.<br>
          Street, J. (2021). <em>Media, politics and democracy</em> (3rd ed.). Red Globe Press.</p>`},

      cont('m4', ['m4-tabs','m4-flip','m4-kc'], 'Continue to Lesson 4', '⚠️ Finish the activities above to continue. The Speed Round is optional.', 'm5', 5)
    ]
  },

  /* ── M5 · Lesson 4 ── */
  {
    id:'m5', num:5, no:4, title:'Media Economics and Business Models', tag:'Midterm · Lesson 4',
    desc:'How media industries make money, and how that shapes their content.',
    blocks:[
      {t:'text', html:`
        <p>Media products are strange goods. A news programme costs a lot to make the first time and almost nothing to show to one more viewer. One person watching does not stop another from watching. And on free TV, the viewer does not pay at all. Doyle (2013) explains that these features push media firms to grow big, to reuse content across many outlets, and to search for whoever is willing to pay.</p>
        <p>How a broadcaster earns its money, its <strong>business model</strong>, shapes what it makes. This lesson compares the main models and lets you run a station yourself.</p>`},

      {t:'deck', gate:'m5-deck', title:'Six Ways to Pay for Media', kicker:'Card Deck',
       instr:'Go through all 6 business models. Use ← → arrow keys, the buttons, or the dots.',
       items:[
         {ico:'📺', title:'Advertising-funded', html:'<p>Free to the audience; advertisers pay for the audience’s attention. Typical of free-to-air TV and commercial radio. <strong>Pressure:</strong> chase the biggest or richest audiences.</p>'},
         {ico:'💳', title:'Subscription', html:'<p>The audience pays a monthly fee, as with cable packages and streaming services. <strong>Pressure:</strong> keep subscribers from cancelling, often with exclusive content.</p>'},
         {ico:'🎟️', title:'Pay-per-view', html:'<p>The audience pays for a single event or title, such as a big boxing match. <strong>Pressure:</strong> invest in a few blockbuster events.</p>'},
         {ico:'🏛️', title:'Public or state funding', html:'<p>Paid by the government or by a licence fee. In the Philippines, People’s Television Network (PTV) is state-owned. <strong>Pressure:</strong> independence from whoever holds the budget.</p>'},
         {ico:'🕰️', title:'Blocktime', html:'<p>Common in Philippine radio: a station sells blocks of airtime to independent producers, who then sell their own ads. <strong>Pressure:</strong> the station may have little control over what is said in a block.</p>'},
         {ico:'📱', title:'Platform and data', html:'<p>Free platforms earn from targeted advertising built on user data, and take a share of creators’ earnings. <strong>Pressure:</strong> maximize time spent and data collected.</p>'}
       ]},

      {t:'sim-market', gate:'m5-sim',
       title:'The Dual-Product Market', kicker:'Simulator',
       instr:'You run a fictional free-to-air station for one week. <strong>Move all three sliders</strong> and watch how programmes buy an audience, and how that audience is sold to advertisers.'},

      {t:'text', html:`<p><strong>What did you notice?</strong> Spending more on programmes raises ratings, but each extra peso buys less. Charging advertisers too much empties your ad breaks. Giving more airtime to news and public affairs costs a little in ratings. That last trade-off is the tension at the heart of commercial broadcasting: the public needs information, but the business rewards audience size.</p>`},

      {t:'sorter', gate:'m5-dnd', badgeOnPerfect:'sorter',
       title:'Who Pays?', kicker:'Sorting Challenge',
       instr:'Sort each media service by <strong>who mainly pays for it</strong>.<br><em>Desktop: drag &amp; drop. Phone: tap an item, then tap a box.</em>',
       items:[
         {id:'fta',     label:'📺 A free-to-air primetime teleserye'},
         {id:'stream',  label:'🎬 A monthly video-streaming service'},
         {id:'ptv',     label:'🏛️ People’s Television Network (PTV)'},
         {id:'fm',      label:'📻 A commercial FM music station'},
         {id:'ppv',     label:'🥊 A pay-per-view boxing match'},
         {id:'cable',   label:'📡 A cable TV channel package'}
       ],
       cats:[{id:'adv', label:'💼 Advertisers'},{id:'aud', label:'💳 The audience'},{id:'state', label:'🏛️ The state'}]},

      kc('m5-kc', 'The Dual-Product Market',
         'Commercial broadcasters operate in a "dual-product market". What two things do they sell?',
         ['Equipment to producers, and airtime to the government',
          'Tickets to viewers, and scripts to writers',
          'News to journalists, and ratings to regulators',
          'Programmes to audiences, and audiences to advertisers']),

      {t:'heading', lvl:2, text:'Midterm Activity 2: Business Model Comparison'},
      {t:'text', html:`<p><strong>Task (Week 7, in groups).</strong> Compare the business models of two media organizations, for example a free-to-air network and a streaming service, or a commercial and a state broadcaster. Present for 8–10 minutes: how each earns money, what that money pushes it to produce, and what it means for audiences.</p>`},
      {t:'rubric', kicker:'Rubric R2 · How it is scored', title:'Activity 2: Business Model Comparison', when:'Present in Week 7',
       task:'Group presentation comparing the business models of two media organizations (8–10 minutes).',
       crit:[
         {name:'Accuracy of each business model', pts:25, ex:'Correctly explains how each organization earns its revenue, with evidence.'},
         {name:'Comparison and analysis', pts:30, ex:'Explains how each model shapes content and audiences; compares, not just describes.'},
         {name:'Use of concepts', pts:20, ex:'Uses dual-product market, audience commodity and other lesson concepts accurately.'},
         {name:'Delivery and visuals', pts:15, ex:'Clear, organized, within time; visuals support the argument.'},
         {name:'Sources and teamwork', pts:10, ex:'Sources cited; every member contributes.'}
       ],
       note:'Each member must speak. Cite your sources on your last slide.'},

      {t:'text', html:`
        <p><strong>📌 Recap</strong></p>
        <ul>
          <li>Media goods are costly to make once and cheap to copy, which rewards size and reuse.</li>
          <li>Business models (advertising, subscription, pay-per-view, public funding, blocktime, platform data) each push content in a different direction.</li>
          <li>Commercial broadcasters sell programmes to audiences and audiences to advertisers.</li>
        </ul>
        <p class="refs"><strong>References</strong><br>
          Doyle, G. (2013). <em>Understanding media economics</em> (2nd ed.). SAGE.<br>
          Smythe, D. W. (1977). Communications: Blindspot of Western Marxism. <em>Canadian Journal of Political and Social Theory, 1</em>(3), 1–27.</p>`},

      cont('m5', ['m5-deck','m5-sim','m5-dnd','m5-kc'], 'Continue to Lesson 5', '⚠️ Finish the activities above to continue.', 'm6', 6)
    ]
  },

  /* ── M6 · Lesson 5 ── */
  {
    id:'m6', num:6, no:5, title:'Globalization and Media Ownership in the Philippines', tag:'Midterm · Lesson 5',
    desc:'Who owns the airwaves, at home and across borders.',
    blocks:[
      {t:'text', html:`
        <p>Media cross borders more easily than almost any other product. Filipino audiences watch Korean dramas, American films and Japanese anime, while Filipino shows reach overseas Filipino workers around the world. <strong>Globalization</strong> raises two worries at once: that local media will be crowded out by foreign giants, and that a few local giants will control what stays local.</p>
        <p>In the Philippines, foreign ownership of mass media is restricted by the Constitution, so the sharper question has been <strong>concentration at home</strong>. This lesson gives you the words for it and then the evidence.</p>`},

      {t:'discover', gate:'m6-tabs', cols:2,
       title:'Four Kinds of Concentration', kicker:'Discovery Grid',
       instr:'Open all 4 kinds of ownership concentration.',
       items:[
         {label:'Horizontal', ico:'↔️', title:'Horizontal concentration',
          html:'<p>One owner controls many outlets of the same kind, such as many radio stations.</p>'},
         {label:'Vertical', ico:'↕️', title:'Vertical integration',
          html:'<p>One owner controls several stages of the chain: producing content, broadcasting it, and distributing it online.</p>'},
         {label:'Cross-media', ico:'🔀', title:'Cross-media ownership',
          html:'<p>One owner controls different kinds of media at once: TV, radio, newspapers and websites.</p>'},
         {label:'Conglomerate', ico:'🏙️', title:'Conglomerate ownership',
          html:'<p>The media company belongs to a group with businesses outside media, such as banking, utilities or telecommunications. Critics worry that news about those businesses may suffer.</p>'}
       ]},

      {t:'heading', lvl:2, text:'What the evidence says'},
      {t:'text', html:`
        <ul>
          <li>The 2016 Media Ownership Monitor Philippines by Reporters Without Borders and VERA Files found a <strong>duopoly</strong>: ABS-CBN and GMA together held about 81% of the TV audience (RSF &amp; VERA Files, 2016).</li>
          <li>In 2020, Congress denied the renewal of ABS-CBN’s broadcast franchise. The updated Monitor (VERA Files &amp; Global Media Registry, 2023) says this happened at the instigation of then-President Rodrigo Duterte, and that ABS-CBN lost its free-to-air and regional stations and became mainly a content producer.</li>
          <li>The updated Monitor says the old duopoly no longer holds, with GMA now leading in revenue and audience share, and rates <strong>political control over media outlets as high</strong>.</li>
          <li>A 2024 study by the Philippine Institute for Development Studies found that radio is less concentrated than TV broadcasting and news publishing, and that many large media companies are family-owned, some with business interests beyond media (Serafica &amp; Oren, 2024).</li>
        </ul>`},

      {t:'ownership', gate:'m6-own',
       title:'Who Owns the Airwaves?', kicker:'Ownership Map',
       instr:'Tap a media group to see who owns it, what else it owns, and where the facts come from. <strong>Trace at least 3 groups</strong> to continue.'},

      kc('m6-kc', 'Concentration',
         'What does "media ownership concentration" mean?',
         ['Every town has its own independent radio station',
          'A few companies or families control a large share of media outlets',
          'Broadcasters focus their programming on one topic',
          'The government licenses every journalist']),

      {t:'heading', lvl:2, text:'Midterm Project: Philippine Media Ownership Map'},
      {t:'text', html:`<p><strong>Task (due Week 8, in groups).</strong> Build an ownership map of one Philippine media group: its owners, parent company, outlets, sister businesses and any political links, each supported by a cited source. Present it as a poster or slide deck, with a one-page written analysis of what the map means for the public.</p>`},
      {t:'timeline', gate:'m6-quest', optional:true,
       title:'Project Quest Log', kicker:'6-Step Roadmap',
       instr:'Tap a step to expand it, then tick it off as you go. Your progress is saved.',
       steps:[
         {title:'Pick your media group', html:'<p>Choose one group from the Media Ownership Monitor Philippines and agree on it with your instructor.</p>'},
         {title:'Find the owners', html:'<p>Trace the company to its parent group and to the families or investors who control it.</p>'},
         {title:'List the outlets', html:'<p>TV channels, radio stations, newspapers, websites and streaming services.</p>'},
         {title:'Find sister businesses', html:'<p>What else does the parent group own outside media?</p>'},
         {title:'Check political links', html:'<p>Only include links a credible source states. Cite every one.</p>'},
         {title:'Draw the map and write the analysis', html:'<p>Make the map readable at a glance, then explain in one page what it means for the public.</p>'}
       ]},
      {t:'rubric', kicker:'Rubric R3 · How it is scored', title:'Midterm Project: Philippine Media Ownership Map', when:'Submit in Week 8',
       task:'Map the ownership of one Philippine media group and analyse what it means for the public.',
       crit:[
         {name:'Accuracy and completeness of the map', pts:30, ex:'Owners, parent company, outlets and sister businesses are correct and complete.'},
         {name:'Evidence and sourcing', pts:20, ex:'Every claim on the map is supported by a credible, cited source.'},
         {name:'Analysis', pts:30, ex:'Explains what the ownership structure means for content, diversity and democracy, using lesson concepts.'},
         {name:'Design and clarity', pts:10, ex:'The map is easy to read; labels and links are clear.'},
         {name:'Teamwork and presentation', pts:10, ex:'Every member contributes; presented clearly and on time.'}
       ],
       note:'Include only political links that a credible source states. Unsupported claims score 0 on Evidence.'},

      {t:'text', html:`
        <p><strong>📌 Recap</strong></p>
        <ul>
          <li>Concentration can be horizontal, vertical, cross-media or conglomerate.</li>
          <li>Philippine TV was a duopoly in 2016; after the 2020 franchise denial, the Monitor finds GMA leading and political control over outlets high.</li>
          <li>Radio is less concentrated than TV and news publishing, and many large media firms are family-owned.</li>
        </ul>
        <p class="refs"><strong>References</strong><br>
          Reporters Without Borders &amp; VERA Files. (2016). <em>Media Ownership Monitor Philippines: Duopoly in the Philippine media</em>. https://rsf.org/en/reporters-without-borders-and-vera-files-present-media-ownership-monitor-philippines-duopoly<br>
          Serafica, R. B., &amp; Oren, Q. C. A. (2024). <em>Analysis of the competition landscape of Philippine mass media</em> (PIDS Discussion Paper No. 2024-29). Philippine Institute for Development Studies. https://www.pids.gov.ph/publication/discussion-papers/analysis-of-the-competition-landscape-of-philippine-mass-media<br>
          VERA Files &amp; Global Media Registry. (2023). <em>Media Ownership Monitor Philippines</em>. https://philippines.mom-gmr.org/en/</p>`},

      cont('m6', ['m6-tabs','m6-own','m6-kc'], 'Complete Midterm Module 🎉', '⚠️ Finish the activities above to complete this module. The quest log is your project checklist.', 'mc')
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
