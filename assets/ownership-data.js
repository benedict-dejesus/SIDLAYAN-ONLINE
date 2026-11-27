/* ══════════════════════════════════════════════════════════════
   SIDLAYAN · WHO OWNS THE AIRWAVES?  (data only)
   Every statement here was checked on 27 November 2026 against the
   public sources listed in `src`. Keep it that way: add nothing
   that a listed source does not say.

   Note on dates: the RSF / VERA Files "duopoly" study is from 2016
   (updated 2019). The Media Ownership Monitor Philippines was
   updated by VERA Files with 2023 data and presented in May 2024.
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function (w) {
  var RSF   = 'https://rsf.org/en/reporters-without-borders-and-vera-files-present-media-ownership-monitor-philippines-duopoly';
  var MOM   = 'https://philippines.mom-gmr.org/en/';
  var OWNI  = 'https://philippines.mom-gmr.org/en/owners/individual-owners/';
  var OWNC  = 'https://philippines.mom-gmr.org/en/owners/companies/';
  var TV    = 'https://philippines.mom-gmr.org/en/media/tv/';
  var RADIO = 'https://philippines.mom-gmr.org/en/media/radio/';
  var CONC  = 'https://philippines.mom-gmr.org/en/findings/media-concentration/';

  w.SDL_OWNERSHIP = {
    gma: {
      name: 'GMA Network, Inc.', kind: 'TV and radio', ico: '📺',
      owners: 'Controlled by three families: the Duavits, the Jimenezes and the Gozons.',
      outlets: ['GMA 7', 'GTV', 'DZBB Super Radyo 594'],
      sisters: [],
      politics: 'Gilberto Duavit, one of the controlling shareholders, is a former congressman. RSF also reported in 2016 that political advertising boosted GMA\'s profits in that election year.',
      note: 'In 2016 GMA and ABS-CBN together held about 81% of the TV audience. By 2023 the Media Ownership Monitor says that "duopoly" no longer holds and GMA leads in revenue and audience share.',
      src: [RSF, OWNI, OWNC, TV]
    },
    abscbn: {
      name: 'ABS-CBN Corporation', kind: 'Multi-platform content', ico: '🎞️',
      owners: 'The Lopez family, through the Lopez Group founded by Eugenio Lopez Sr.',
      outlets: ['Kapamilya Channel (pay TV)', 'ANC (pay TV)', 'Programmes on A2Z (block-time)', 'DWPM Teleradyo 630 (joint venture with Prime Media Holdings)'],
      sisters: ['iWantTFC and streaming deals (Netflix, Amazon Prime, Viu)'],
      politics: 'Congress denied the renewal of its broadcast franchise in 2020. The Media Ownership Monitor says this was at the instigation of then-President Rodrigo Duterte.',
      note: 'Losing the franchise cost ABS-CBN its free-to-air and regional stations. It now works mainly as a content producer that sells programmes to other channels and platforms.',
      src: [CONC, RSF, OWNI]
    },
    mediaquest: {
      name: 'MediaQuest Holdings (TV5)', kind: 'TV and print', ico: '📡',
      owners: 'The group of businessman Manuel V. Pangilinan.',
      outlets: ['TV5'],
      sisters: ['Interests in The Philippine Star and the Philippine Daily Inquirer'],
      politics: '',
      note: 'RSF describes the Pangilinan group as a cross-media and telecommunications empire. The Media Ownership Monitor notes it is an exception among large media owners because no family member is known to be in the media business.',
      src: [RSF, OWNI, TV, OWNC]
    },
    mbc: {
      name: 'Manila Broadcasting Company', kind: 'Radio', ico: '📻',
      owners: 'Managed by descendants of the Elizalde family.',
      outlets: ['DZRH Nationwide 666'],
      sisters: [],
      politics: '',
      note: 'DZRH is among the top AM radio stations listed by the Media Ownership Monitor.',
      src: [OWNI, RADIO]
    },
    veritas: {
      name: 'Radio Veritas', kind: 'Religious radio', ico: '⛪',
      owners: 'The Catholic Church, through the Archdiocese of Manila.',
      outlets: ['DZRV 846'],
      sisters: [],
      politics: '',
      note: 'Religious broadcasters among the top-ranked stations are a distinctive feature of Philippine media. Here the owner is a religious institution, not a family.',
      src: [OWNI, MOM]
    },
    inquirer: {
      name: 'Inquirer Group', kind: 'Print and online', ico: '📰',
      owners: 'The Rufino-Prieto family.',
      outlets: ['Philippine Daily Inquirer (print and online)'],
      sisters: ['Manuel V. Pangilinan is listed as having an interest'],
      politics: '',
      note: 'Cross-media ownership: one businessman, Pangilinan, is linked to a TV network and two major broadsheets.',
      src: [OWNI]
    },
    philstar: {
      name: 'Philstar Media Group', kind: 'Print and online', ico: '⭐',
      owners: 'The Belmonte family. Sons of founder Betty Go-Belmonte run the company.',
      outlets: ['The Philippine Star (print and online)'],
      sisters: ['Manuel V. Pangilinan is listed as having an interest'],
      politics: '',
      note: '',
      src: [OWNI]
    },
    bulletin: {
      name: 'Manila Bulletin Publishing', kind: 'Print', ico: '🗞️',
      owners: 'The Yap family, whose wealth comes from banking.',
      outlets: ['Manila Bulletin', 'Balita (tabloid)', 'Tempo (tabloid)'],
      sisters: ['Banking'],
      politics: '',
      note: '',
      src: [RSF]
    }
  };

  w.SDL_OWNERSHIP_SOURCES = [
    { label: 'Reporters Without Borders & VERA Files (2016). Media Ownership Monitor Philippines: Duopoly in the Philippine media.', url: RSF },
    { label: 'VERA Files & Global Media Registry (2023 data). Media Ownership Monitor Philippines.', url: MOM }
  ];
})(typeof window !== 'undefined' ? window : this);
