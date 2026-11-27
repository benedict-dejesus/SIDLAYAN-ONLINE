/* ══════════════════════════════════════════════════════════════
   SIDLAYAN · ACTIVITY LOGIC
   Plain functions behind the two SIDLAYAN activities, kept apart from
   app.js so they can be tested. app.js draws the activities and calls
   these. Nothing here decides a grade: both activities are
   exploration, recorded as CLAIMED by the server.
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function (w) {

  /* ── The Dual-Product Market ──
     A fictional free-to-air station for one week.
       spend  programme budget, ₱ million per week (5–50)
       rate   price of one 30-second ad spot, ₱ thousand (10–200)
       pa     share of airtime given to news and public affairs, % (0–60)
     Ratings rise with programme spend, with diminishing returns, and dip a
     little as public-affairs airtime grows. Advertisers pay for audiences:
     the more rating points, the more a spot is worth to them, and the
     higher the price, the fewer spots they buy. */
  var MARKET = {
    SPOTS_MAX: 600,          // ad spots available in a week
    WORTH_PER_POINT: 6,      // ₱ thousand an advertiser will pay per rating point
    AUDIENCE: 20000000,      // people the station can reach

    sliders: {
      spend: { min: 5,  max: 50,  step: 1, value: 20, label: 'Programme budget',        unit: '₱M / week' },
      rate:  { min: 10, max: 200, step: 5, value: 60, label: 'Price of a 30-second ad', unit: '₱K' },
      pa:    { min: 0,  max: 60,  step: 5, value: 20, label: 'News & public affairs',   unit: '% of airtime' }
    },

    model: function (v) {
      var spend = Number(v.spend), rate = Number(v.rate), pa = Number(v.pa);
      var ratings = (4 + 16 * (1 - Math.exp(-spend / 18))) * (1 - 0.004 * pa);
      var worth = ratings * MARKET.WORTH_PER_POINT;
      var share = Math.max(0, 1 - rate / (2 * worth));
      var spotsSold = Math.round(MARKET.SPOTS_MAX * share);
      var adRevenue = spotsSold * rate / 1000;            // ₱ million
      return {
        ratings: Math.round(ratings * 10) / 10,
        viewers: Math.round(MARKET.AUDIENCE * ratings / 100),
        spotsSold: spotsSold,
        adRevenue: adRevenue,
        profit: adRevenue - spend
      };
    },

    /** Done once the student has tried all three levers. */
    ready: function (moved) {
      moved = moved || {};
      return !!(moved.spend && moved.rate && moved.pa);
    }
  };

  /* ── Who Owns the Airwaves? ── done after opening three different groups. */
  var OWNERSHIP = {
    NEED: 3,
    ready: function (opened) {
      var seen = {};
      (opened || []).forEach(function (id) { seen[id] = 1; });
      return Object.keys(seen).length >= OWNERSHIP.NEED;
    }
  };

  w.SDLBlocks = { market: MARKET, ownership: OWNERSHIP };
})(typeof window !== 'undefined' ? window : this);
