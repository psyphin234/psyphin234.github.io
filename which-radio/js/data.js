/* Which Two-Way Radio? THE data file: sources, the two bands, the range model's
   parameters, antennas, handheld vs mobile, licences, illegal radios and type
   approval. Owner's rules (2026-10-20/21):
   - keep readers legal: ICASA is the authority. No exact club frequencies,
     channels or tones, and no programming instructions. Band ranges are fine.
   - published sources only (law, regulators, ITU-R, issuers, makers, physics).
     No anecdotes; modelling assumptions are labelled. The Patrol4x4 guide by
     Family_Dog (t=413) is a handy summary only: cite ORRA, not the guide
     (owner, 2026-10-21).
   - no recommendation to get an amateur (ham) licence; only the fact that some
     bands are limited to licensed amateurs.
   Every figure names its sources by id (see SOURCES). */
(() => {
  "use strict";

  const CHECKED = "21 October 2026";

  const SOURCES = {
    rfsr2015: {
      title: "Radio Frequency Spectrum Regulations, 2015 (GG 38641, 30 March 2015)",
      by: "ICASA", kind: "law",
      url: "https://www.icasa.org.za/uploads/files/Radio-Frequency-Spectrum-Regulations-2015.pdf"
    },
    annexB2023: {
      title: "Notice to amend Annexure B (licence-exempt apparatus), Notice 1822 of 2023 (GG 48643, 23 May 2023)",
      by: "ICASA", kind: "law",
      url: "https://www.icasa.org.za/uploads/files/Notice-to-amend-Annexure-B-of-the-Radio-Frequency-Spectrum.pdf"
    },
    baofeng2022: {
      title: "Notice to prohibit the usage and sale of Baofeng UV-5R, General Notice 1304 of 2022 (GG 46990, 28 September 2022)",
      by: "ICASA", kind: "law",
      url: "https://www.icasa.org.za/uploads/files/Notice-to-prohibit-the-usage-and-sale-of-BAOFENG-Model-Number-UV-5R.pdf"
    },
    taGuidelines: {
      title: "Type Approval Guidelines",
      by: "ICASA", kind: "regulator",
      url: "https://www.icasa.org.za/uploads/files/Type-Approval-Guidelines.pdf"
    },
    ta2018: {
      title: "RF Type Approved Equipment, 2018",
      by: "ICASA", kind: "regulator",
      url: "https://www.icasa.org.za/uploads/files/RF-Type-Approved-Equipment-2018.pdf"
    },
    bocraSrd: {
      title: "Guidelines on the Use of Short-Range Devices (SRDs) in Botswana, February 2022",
      by: "BOCRA", kind: "regulator",
      url: "https://www.bocra.org.bw/sites/default/files/documents/Annexure_3.3.2A_SRDs_Guidelines_Feb_2022.pdf"
    },
    orra: {
      title: "Off Road Radio Association: about, Botswana and Namibia",
      by: "ORRA", kind: "issuer",
      url: "http://www.orra.co.za/"
    },
    orraIndividuals: {
      title: "Individual Application Process",
      by: "ORRA", kind: "issuer",
      url: "http://www.orra.co.za/individuals.html"
    },
    orraVhf: {
      title: "VHF",
      by: "ORRA", kind: "issuer",
      url: "http://www.orra.co.za/vhf.html"
    },
    orraAntenna: {
      title: "Antennas",
      by: "ORRA", kind: "issuer",
      url: "http://www.orra.co.za/antenna.html"
    },
    x4c: {
      title: "4x4Community radio licence (licence year 1 April 2025 - 31 March 2026)",
      by: "4x4Community", kind: "issuer",
      url: "https://www.4x4community.co.za/radiolicense/"
    },
    x4cFaq: {
      title: "Radio licence FAQ",
      by: "4x4Community", kind: "issuer",
      url: "https://www.4x4community.co.za/radiolicense/content/faq"
    },
    webb60: {
      title: "ZARA®60 Mobile Antenna: 1/4-wave + spring, 54-174 MHz, 0 dB",
      by: "Webb Industries", kind: "maker",
      url: "https://www.webb.co.za/product/zara60-mobile-antenna/"
    },
    webb130: {
      title: "ZARA® 130 Mobile Antenna: base-loaded 5/8, 138-174 MHz",
      by: "Webb Industries", kind: "maker",
      url: "https://www.webb.co.za/product/zara130-mobile-antenna-base-loaded-5-8-138-174-mhz-2-db-tuneable/"
    },
    webbOverview: {
      title: "ZARA® Mobile Antennas (overview, 13 April 2023)",
      by: "Webb Industries", kind: "maker",
      url: "https://www.webb.co.za/zara-mobile-antennas/"
    },
    vratvark: {
      title: "Bosvark (UHF) Radio - License Free (seller's product page)",
      by: "Vratvark", kind: "maker",
      url: "https://www.vratvark.co.za/product/bosvark-radio/"
    },
    orraChannels: {
      title: "Our Channels: New ORRA VHF channels, 1 December 2011 (user version, v-5)",
      by: "ORRA", kind: "issuer",
      url: "http://www.orra.co.za/channels.html"
    },
    x4cChannels: {
      title: "Recommended 4x4 channels programming (for dealers)",
      by: "4x4Community", kind: "issuer",
      url: "https://www.4x4community.co.za/radiolicense/4x4channels"
    },
    webb60spec: {
      title: "ZARA®60 specification sheet (2024-08-22): bandwidth 0.5-9 MHz, unity gain",
      by: "Webb Industries", kind: "maker",
      url: "https://docs.google.com/document/d/1i5ynFTHPWLjJpFPvWIhChe0eZ-5u0qwn6I7BSF8dKvI/export?format=pdf"
    },
    webb130spec: {
      title: "ZARA®130 specification sheet (2025-01-31): bandwidth 3 MHz, 3 dB relative to a quarter-wave",
      by: "Webb Industries", kind: "maker",
      url: "https://docs.google.com/document/d/1Nbp5jiaZAl9wLhGnOtjQ3bHMCY7tEvm5IwzsalsOJHI/export?format=pdf"
    },
    webbInstall: {
      title: "ZARA® installation guide with cutting charts (2026-10-16)",
      by: "Webb Industries", kind: "maker",
      url: "https://docs.google.com/document/d/1hSMLyVsVokbLbG0wLL4ZzXFeHxLJrED2Tmr_RSmGcME/export?format=pdf"
    },
    orraFaq: {
      title: "FAQ (channel programming with CTCSS tones)",
      by: "ORRA", kind: "issuer",
      url: "http://www.orra.co.za/faq.html"
    },
    photos: {
      title: "Photos: four handhelds, and the ICASA label in a Vratvark 2.0 (RTS DV-3140UV)",
      by: "PsyPhin", kind: "photo",
      url: ""
    },
    baofengUV32: {
      title: "UV-32 10W Multi-Band GPS Radio (product page)",
      by: "Baofeng", kind: "maker",
      url: "https://www.baofengradio.com/products/uv-32"
    },
    baofengDM32: {
      title: "DM-32UV 10W Multi-Band DMR Radio (product page)",
      by: "Baofeng", kind: "maker",
      url: "https://www.baofengradio.com/products/dm-32uv"
    },
    baofengReview: {
      title: "Review of the DM-32UV & UV-32 (6 November 2025): \"built on the same modern chassis\"",
      by: "Baofeng", kind: "maker",
      url: "https://www.baofengradio.com/blogs/news/review-of-the-dm-32uv-uv-32"
    },
    uv16: {
      title: "Baofeng UV-16 (catalogue listing)",
      by: "e-catalog", kind: "catalogue",
      url: "https://e-catalog.co.uk/BAOFENG-UV-16.htm"
    },
    mybroadband: {
      title: "\"Many walkie-talkies sold in South Africa are illegal\" (13 November 2025)",
      by: "MyBroadband", kind: "news",
      url: "https://mybroadband.co.za/news/telecoms/618094-many-walkie-talkies-sold-in-south-africa-are-illegal.html"
    },
    p526: {
      title: "Recommendation ITU-R P.526-16: Propagation by diffraction",
      by: "ITU-R", kind: "standard",
      url: "https://www.itu.int/rec/R-REC-P.526/en"
    },
    physics: {
      title: "Radio physics: free-space and two-ray (plane-earth) path loss",
      by: "textbook physics", kind: "physics",
      url: ""
    },
    antennaTheory: {
      title: "Antenna theory: a thin vertical monopole with a sinusoidal current over a perfect ground plane (image theory)",
      by: "textbook physics", kind: "physics",
      url: ""
    }
  };

  /* The set-ups the range model knows. Power is the legal or approved figure;
     antenna gains and heights are modelling assumptions (see MODEL). */
  const RADIOS = {
    pmr: { name: "Licence-free UHF handheld", band: "UHF", watts: 0.5, kind: "handheld" },
    vhfHand: { name: "Club VHF handheld", band: "VHF", watts: 5, kind: "handheld" },
    vhfMobile: { name: "Club VHF mobile (fitted)", band: "VHF", watts: 30, kind: "mobile" }
  };

  /* Range model parameters (js/model.js). Category: law | standard | physics | assumption. */
  const MODEL = {
    freqMHz: { VHF: 160, UHF: 446.1 },   // middle of the club band (146-174) and of PMR446
    earthRadiusKm: 8500,                  // ITU-R P.526
    sensitivityDbm: -118,                 // assumption: a typical FM receiver
    clearMarginDb: 10,                    // assumption: clear speech
    scratchyMarginDb: 0,                  // assumption: in and out
    cabLossDb: 9,                         // assumption: from inside a vehicle's metal body
    positions: {
      cab:    { label: "Handheld inside the cab", height: 1.3, gainDbi: -3, cab: true },
      window: { label: "Handheld out of the window", height: 1.6, gainDbi: -3, cab: false },
      roof:   { label: "Roof antenna", height: 2.1, gainDbi: 0, cab: false }
    },
    indoorHandheld: { height: 1.5, gainDbi: -3 },
    vegetation: [
      { mhz: 105.9, gamma: 0.04, am: 9.4 },
      { mhz: 466.475, gamma: 0.12, am: 18.0 }
    ],
    bel: {
      traditional: { r: 12.64, s: 3.72, t: 0.96, u: 9.6, v: 2.0, w: 9.1, x: -3.0, y: 4.5, z: -2.0 },
      efficient:   { r: 28.19, s: -3.00, t: 8.48, u: 13.5, v: 3.8, w: 27.8, x: -2.9, y: 9.4, z: -2.1 }
    }
  };

  /* ---------------------------------------------------------- 1. what radio do you need? */
  const CHOOSER = {
    questions: [
      { id: "who", label: "Who will you be talking to?", options: [
        ["club", "Other vehicles on a 4x4 club or group trip"],
        ["far", "Our own vehicles, sometimes several km apart"],
        ["near", "Family or friends close by: camp, a walk, guiding a driver"]
      ] },
      { id: "kind", label: "Handheld, or fitted in the vehicle?", options: [
        ["fitted", "Fitted in the vehicle"],
        ["handheld", "Handheld"]
      ] }
    ],
    defaults: { who: "club", kind: "fitted" },
    answer(a) {
      if (a.who === "near") {
        return a.kind === "handheld"
          ? { band: "UHF", text: "Licence-free UHF handhelds. No paperwork; short range is all you need." }
          : { band: "UHF", text: "Licence-free UHF handhelds. A licence-free radio can't be given an external high-gain antenna, so it isn't fitted with a roof antenna; at short range a handheld does the job." };
      }
      const club = a.who === "club"
        ? "Ask the club which radio the convoy uses (usually VHF): every vehicle has to be on the same system. "
        : "";
      return a.kind === "fitted"
        ? { band: "VHF", text: `${club}A club VHF mobile radio with a roof antenna, on a yearly licence through ORRA or 4x4Community.` }
        : { band: "VHF", text: `${club}A club VHF handheld, on a yearly licence through ORRA or 4x4Community. It reaches far less from inside a vehicle than a fitted radio (see below).` };
    },
    sources: ["orra", "orraVhf", "x4c", "annexB2023"]
  };

  /* ---------------------------------------------------------- 2. VHF and UHF side by side */
  const BANDS = {
    UHF: {
      title: "UHF",
      tag: "Licence-free",
      lead: "Short range, no paperwork.",
      rows: [
        ["What", "Handhelds on the licence-free UHF channels: PMR446 (446.0-446.2 MHz) and South Africa's own five channels at about 464 MHz. Radios sold as licence-free often cover both (13 channels)."],
        ["Licence", "None. The radio must be ICASA type-approved and stay exactly as approved."],
        ["Power", "0.5 W e.r.p. (radiated power), set by law."],
        ["Antenna", "Its own. ICASA: the frequencies, power and \"external high-gain antenna\" must not be altered without a new type approval. And because the 0.5 W limit is radiated power, an antenna with gain would push it over."],
        ["Range", "Short: a few km in the open with the radio held out of the window, much less from inside the vehicle (see the range figures below)."],
        ["Cost", "No licence fee."],
        ["Watch out", "Channels are shared and get no protection from interference. The 464 MHz channels are licence-free in South Africa only."]
      ],
      sources: ["annexB2023", "vratvark", "bocraSrd", "physics"]
    },
    VHF: {
      title: "VHF",
      tag: "What most 4x4 clubs use",
      lead: "The convoy radio, on a club licence.",
      rows: [
        ["What", "Club radios in the 146-174 MHz band, on channels licensed to an issuer such as ORRA, which licenses off-road clubs across South Africa, or 4x4Community."],
        ["Licence", "A yearly authorisation through ORRA (via a recognised club) or 4x4Community (about R225 a year). Valid in South Africa only."],
        ["Power", "Handhelds about 5 W (a common approved rating); fitted radios up to 30 W (ORRA)."],
        ["Antenna", "A fitted radio uses a roof or pillar antenna, tuned for your channels."],
        ["Range", "About 15-30 km between fitted radios, depending on the terrain (ORRA)."],
        ["Cost", "The licence, the radio and fitting."],
        ["Watch out", "An accredited dealer programs the radio to your licence's channels. Cover for Botswana and Namibia has to be arranged (ORRA does this for members)."]
      ],
      sources: ["orra", "orraVhf", "x4c", "ta2018", "baofeng2022"]
    },
    note: "Not covered here: 27 MHz CB (licence-free since May 2023) and 29 MHz (licensed). Some bands and equipment are limited to licensed radio amateurs (ham radio)."
  };

  /* ---------------------------------------------------------- 4. antennas */
  const ANTENNAS = {
    rows: [
      ["Type", "Quarter-wave whip with a spring", "Base-loaded 5/8-wave"],
      ["Gain (relative to a quarter-wave)", "0 dB (unity)", "3 dB on Webb's spec sheet (2 dB on its overview page)"],
      ["Bandwidth (SWR 1.5:1 or better)", "0.5 to 9 MHz", "3 MHz"],
      ["Whip length (Webb's cutting chart)", "about 500 mm at 150 MHz, 480 mm at 160 MHz", "about 1,350 mm at 150 MHz, 1,250 mm at 160 MHz"],
      ["ORRA's channels", "Tuned midway between ORRA's channel groups, covers them all (its bandwidth is about their spread)", "Tuned for channels 1-4 (regular member communication); not right for channels 5-7"],
      ["Strongest", "Spread evenly: low and higher angles", "Toward the horizon"],
      ["Suits", "All your channels; hills and mountains", "Channels close together; flat, open country"]
    ],
    /* Tuning: ORRA's FAQ says its first 6 channels are its 3 frequencies with 2
       tone sets, originally around 150 and 160 MHz with a third added in the
       160 MHz range; 4x4Community's published programming puts channels 1-4 on
       two frequencies under 1 MHz apart and channels 5-7 on one about 8.5 MHz
       lower. Only the spacing is shown on the page, never the frequencies. */
    tuning: {
      groupGapMHz: 8.5,       // channels 5-7 below channels 1-4 (4x4Community programming)
      groupSpanMHz: 0.7,      // channels 1-4 span (4x4Community programming)
      bw60: 9, bw130: 3,      // Webb spec sheets
      len130: { low: 1350, high: 1250 }, // Webb cutting chart, ~150 / ~160 MHz (mm)
      len60: { low: 500, high: 480 },
      text: [
        "Every antenna is tuned for a band of frequencies: cut to length (Webb's chart; cut about 25 mm long first), then adjusted for the lowest SWR with proper test equipment.",
        "ORRA's channels sit in two groups: channels 1-4 close together, and channels 5-7 several MHz lower (about 8.5 MHz on 4x4Community's published programming).",
        "A ZARA60's bandwidth is up to 9 MHz, about the spread of ORRA's channels, so tuned midway between the groups it covers them all; that's why ORRA prefers the quarter-wave. A ZARA130 covers 3 MHz: tuned for channels 1-4, it isn't right for channels 5-7. Its whip for channel 5 would be about 10 cm longer than for channel 1; the ZARA60's only about 2 cm."
      ],
      sources: ["webb60spec", "webb130spec", "webbInstall", "orraFaq", "orraChannels", "x4cChannels", "orraVhf", "orraAntenna"]
    },
    scenarios: [
      { id: "flat", deg: 0, label: "Flat country", where: "The other vehicle is level with you, on the horizon." },
      { id: "hills", deg: 10, label: "Rolling hills", where: "The other vehicle is on a rise, about 10° up." },
      { id: "mountains", deg: 25, label: "Mountains", where: "The other vehicle is up a steep pass, about 25° up." }
    ],
    points: [
      "Gain isn't power. Both antennas get the same power from the radio; a 5/8 squeezes it into a flatter shape, so it sends more toward the horizon and less upward.",
      "So the ZARA60 has less gain, yet in the mountains it often does better: the other vehicle is above or below you, outside the 5/8's flat beam. Above about 18° the quarter-wave is stronger, and at about 37° the 5/8 is almost deaf.",
      "ORRA prefers the quarter-wave because its channels are spread wide, and calls it \"a good choice in hilly terrain\".",
      "Size isn't range: an antenna's length is set by its frequency and design (Webb's chart: a ZARA60 whip is about 500 mm at 150 MHz, a ZARA130's about 1,350 mm). Height and a clear path give range."
    ],
    sources: ["webb60", "webb130", "webb130spec", "webbOverview", "webbInstall", "orraVhf", "orraAntenna", "antennaTheory"]
  };

  /* ---------------------------------------------------------- 5. handheld vs mobile */
  const KINDS = {
    handheld: {
      title: "Handheld",
      pros: [
        "Goes with you out of the vehicle: spotting, guiding a driver over an obstacle, around camp.",
        "Runs on its own battery; nothing to fit.",
        "A club VHF handheld uses the same licence as your fitted radio (4x4Community: one licence covers both)."
      ],
      cons: [
        "Low power: 0.5 W licence-free, about 5 W on club VHF.",
        "A short antenna, and inside the cab the metal body blocks much of the signal.",
        "Runs on a battery that needs charging."
      ],
      sources: ["annexB2023", "ta2018", "x4c", "physics"]
    },
    mobile: {
      title: "Fitted in the vehicle (mobile)",
      pros: [
        "Up to 30 W on club VHF, through an antenna outside the metal body.",
        "About 15-30 km between vehicles, depending on the terrain.",
        "Powered by the vehicle; always on and ready in the convoy."
      ],
      cons: [
        "Needs a licence (club VHF) and fitting.",
        "The antenna must be mounted well and tuned with proper test equipment by someone skilled; on VHF a poor installation can damage the radio or hurt people (ORRA).",
        "Stays in the vehicle."
      ],
      sources: ["orraVhf", "orraAntenna"]
    }
  };

  /* ---------------------------------------------------------- 6. where to get a VHF licence */
  const LICENCES = [
    {
      title: "ORRA (Off Road Radio Association)",
      who: "Members of recognised off-road clubs.",
      steps: [
        "Join a club that ORRA recognises.",
        "Ask your club's radio officer to confirm your membership.",
        "Fill in ORRA's individual application form and pay the fee on ORRA's invoice.",
        "ORRA issues your User Authorisation card."
      ],
      extra: "ORRA also holds licences in Botswana and Namibia and can arrange cover for members: start at least 4 weeks before you travel.",
      links: [["ORRA: how to apply", "http://www.orra.co.za/individuals.html"], ["ORRA's approved dealers", "http://www.orra.co.za/approveddealers.html"]],
      sources: ["orra", "orraIndividuals"]
    },
    {
      title: "4x4Community",
      who: "4x4Community forum members.",
      steps: [
        "Join the 4x4Community forum.",
        "Apply online with a copy of your ID.",
        "Pay R225 for the year (1 April 2025 - 31 March 2026).",
        "You get your licence as a PDF to keep in the vehicle."
      ],
      extra: "One licence per person covers your fitted radio and a handheld. VHF only, and valid in South Africa only.",
      links: [["4x4Community: apply", "https://www.4x4community.co.za/radiolicense/"], ["4x4Community's radio dealers", "https://www.4x4community.co.za/radiolicense/radiodealers"]],
      sources: ["x4c", "x4cFaq"]
    },
    {
      title: "Other routes",
      who: "",
      steps: [
        "ICASA may license a registered club or association for communication among its members (regulation 28), so some clubs hold their own licence.",
        "You can also apply to ICASA for your own two-way radio licence through its standard application procedure."
      ],
      extra: "",
      links: [],
      sources: ["rfsr2015"]
    }
  ];
  const LICENCE_THEN = "Then buy an ICASA type-approved radio from an accredited dealer, who programs it to your licence's channels.";

  /* ---------------------------------------------------------- 7. illegal radios */
  const ILLEGAL = [
    { title: "Radios you can set to any frequency",
      text: "ICASA banned the sale and use of the Baofeng UV-5R in September 2022 because it tunes continuously: any frequency can be typed in, including ones the user isn't licensed for. Owning a receiver that tunes continuously above 30 MHz is restricted too.",
      sources: ["baofeng2022", "rfsr2015"] },
    { title: "Radios without ICASA type approval",
      text: "Every radio used in South Africa must be type-approved, licence-free ones included. Owning radio apparatus without a licence, an exemption or type approval can carry 6 to 24 months in jail and/or a fine of R250,000 to R5 million (regulations 38(1) and 42(6)).",
      sources: ["rfsr2015", "annexB2023"] },
    { title: "Licence-free radios pushed past the rules",
      text: "More than 0.5 W radiated, an external high-gain antenna (a magnetic roof antenna, for example), or changed frequencies or power. ICASA says these must not be altered without a new type approval. A radio that can do 5 W on UHF is only licence-free when it runs at 0.5 W on the licence-free channels; anything more needs a licence.",
      sources: ["annexB2023", "vratvark"] },
    { title: "Any radio on channels you aren't licensed for",
      text: "Using club VHF channels without an authorisation is transmitting without a licence. A licensed user may only use the frequencies they were given.",
      sources: ["baofeng2022", "rfsr2015"] }
  ];

  /* ---------------------------------------------------------- 8. type approval */
  const TYPE_APPROVAL = {
    points: [
      "ICASA checks a radio model against the technical standards ICASA regulates for that kind of equipment, and gives it a type approval number, such as TA-2018/870.",
      "Look for the ICASA label with the approval number, like the one in this Vratvark 2.0 (inside the battery compartment).",
      "The aim is that only type-approved equipment is sold, leased or used in South Africa.",
      "It applies to the model as approved. Changing a licence-free radio's frequencies, power or antenna needs a new type approval.",
      "Type approval isn't a licence. It means the radio may be used; you still need a licence unless it's a licence-free radio used as approved.",
      "ICASA can suspend an approval: the Baofeng UV-5R was approved in 2018 (TA-2018/870, 4 W, VHF and UHF) and banned in 2022."
    ],
    sources: ["taGuidelines", "ta2018", "annexB2023", "baofeng2022", "photos"]
  };

  /* ---------------------------------------------------------- 7b. four real radios
     The owner's photo (site/img/radios-800.jpg, from 3.jpeg: background cleaned up), left to right. Badge x
     positions are fractions of the photo's width. */
  const EXAMPLES = {
    intro: "Four handhelds on one table, and what the law says about each for 4x4 use. A club VHF licence lets you use your issuer's channels on a type-approved radio that an accredited dealer has programmed. It doesn't make any radio legal.",
    radios: [
      { n: 1, x: 0.27, name: "Baofeng UV-32", verdict: "Not for club VHF", tone: "fail",
        text: "Baofeng lists it as transmitting on 136-174, 220-260 and 400-520 MHz at 10 W, programmable from the keypad. A licensed user may only use the frequencies they were given, programmed by an accredited dealer, and owning a radio that tunes continuously above 30 MHz is restricted except on the amateur bands. A club VHF licence doesn't make it legal: it's equipment for licensed radio amateurs.",
        sources: ["baofengUV32", "baofeng2022", "rfsr2015"] },
      { n: 2, x: 0.49, name: "Baofeng UV-16", verdict: "Not for club VHF", tone: "fail",
        text: "A dual-band keypad radio (136-174 and 400-520 MHz in listings) with a frequency mode, in the same style as the UV-5R that ICASA banned in 2022. The same rules apply: a club licence doesn't cover a radio you can tune to any frequency. We found no ICASA type approval for it.",
        sources: ["uv16", "baofeng2022", "rfsr2015"] },
      { n: 3, x: 0.67, name: "Vratvark 2.0 (RTS DV-3140UV)", verdict: "Legal with a club VHF licence", tone: "pass",
        text: "A VHF and UHF FM radio with ICASA type approval TA-2014/1255 (the label is shown below). It has no keypad for typing in frequencies: an accredited dealer programs its channels. With a club VHF licence and your issuer's channels programmed in, it's legal to use.",
        sources: ["photos", "baofeng2022"] },
      { n: 4, x: 0.89, name: "Baofeng 888S (V6)", verdict: "Not for club VHF", tone: "fail",
        text: "A UHF-only radio (400-470 MHz, 16 channels), so it can't reach club VHF channels at all, and a VHF licence doesn't cover it. Tested at about 2-3 W, it's also above the 0.5 W licence-free limit. A BF-88S/BF-888 appears on ICASA's 2018 type-approval list, but that doesn't make it licence-free or usable on club VHF.",
        sources: ["mybroadband", "annexB2023", "ta2018"] }
    ]
  };

  /* ---------------------------------------------------------- 9. analogue or digital */
  const DIGITAL = {
    lead: "Most two-way radios used by 4x4 groups are analogue FM. Digital radios, such as DMR, are on sale too, but for a convoy they don't help yet.",
    points: [
      { title: "4x4 radio is analogue", text: "ORRA's channel plan uses CTCSS tones, an analogue FM feature, and club radios such as the Vratvark 2.0 are FM transceivers.", sources: ["orraFaq", "photos"] },
      { title: "Digital only talks to digital", text: "A digital radio speaks digitally only to radios on the same digital system with matching settings. Most can also do analogue FM, and in an analogue convoy that's the mode they have to use, like everyone else.", sources: ["baofengDM32"] },
      { title: "Digital costs more", text: "On Baofeng's own store, the analogue UV-32 lists at $39.99 and the DMR version on the same chassis, the DM-32UV, at $74.99: about double (sale prices, 21 October 2026).", sources: ["baofengUV32", "baofengDM32", "baofengReview"] },
      { title: "So, for now: analogue", text: "Until club channel plans change, an analogue radio, or a digital one used in analogue mode, is what talks to the convoy. Digital adds cost and settings without letting you talk to more of it.", sources: ["orraFaq"] }
    ]
  };

  window.RADIO = Object.assign(window.RADIO || {}, {
    CHECKED, SOURCES, RADIOS, MODEL, CHOOSER, BANDS, ANTENNAS, KINDS, LICENCES, LICENCE_THEN, ILLEGAL, TYPE_APPROVAL, EXAMPLES, DIGITAL
  });
})();
