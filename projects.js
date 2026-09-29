// The projects shown on the home page, in display order.
// To add a project, add one line. Fields:
//   title       - card heading
//   description - one or two sentences
//   url         - where the button links (the only place a project's URL lives). A full
//                 https:// address opens in a new tab; a folder on this site ("dmr-hotspot/")
//                 opens in place, and that folder's page shows the same title + tags.
//                 Optional: leave it out and the card has no button (e.g. no public page yet).
//   cta         - button label (optional, defaults to "Open")
//   image       - picture across the top of the card, 16:9 crop (optional); imageAlt describes it
//   updated     - short line above the button, e.g. "Updated 25 Sep 2026" (optional)
//   tags        - short labels shown on the card (optional). A plain string is a blue tag;
//                 { label: "...", color: "green" } is a green one (e.g. for status).
//                 Status tags: green "Actively maintained"; amber "In progress" / "Prototyping" /
//                 "In testing"; grey "Complete".
window.PROJECTS = [
  { title: "SA Fuel Price Preview", description: "Fuel price predictions for South Africa, so you know what's coming at the pump before the official announcement.", url: "https://fuel.psyphin.co.za/", cta: "View predictions", image: "assets/img/projects/fuel-chart.jpg", imageAlt: "Chart of the daily Basic Fuel Price rising through the review period, with estimated days marked", updated: "Live data, updated hourly", tags: ["Data", "South Africa", { label: "Actively maintained", color: "green" }] },
  { title: "SA Towing Check", description: "Is your car or bakkie plus trailer legal? Checks your licence code, trailer brakes, speed limit and overloading, plus payload and towing ratings, with a source for every rule.", url: "https://psyphin.co.za/sa-towing-check/", cta: "Check your rig", image: "assets/img/projects/sa-towing-check.jpg", imageAlt: "Side-view diagram of a bakkie towing a trailer, with the mass on each axle and on the tow ball", updated: "Launched 29 Sep 2026", tags: ["Towing", "South Africa", { label: "In testing", color: "amber" }] },
  { title: "Digital Radio Hotspot", description: "A true-duplex DMR hotspot on a Raspberry Pi 3B with an MMDVM dual hat, running WPSD and linking a handheld radio to the BrandMeister network.", url: "dmr-hotspot/", cta: "View project", image: "assets/img/projects/dmr-gem.jpg", imageAlt: "The hotspot in its blue 3D-printed case, with two antennas and glowing status lights", updated: "Updated 27 Sep 2026", tags: ["DMR", "Raspberry Pi", { label: "In testing", color: "amber" }] },
  { title: "RC SHERP Crawler", description: "A scratch-built 1:15 radio-controlled crawler based on the SHERP ATV, designed in Tinkercad, 3D printed in PETG and TPU, and driven by an ESP32.", url: "sherp-crawler/", cta: "View project", image: "assets/img/projects/sherp-wire.jpg", imageAlt: "Wireframe 3D model of the SHERP-style crawler with its big tyres", updated: "Updated 25 Sep 2026", tags: ["3D printing", "ESP32", { label: "Prototyping", color: "amber" }] },
  { title: "Caravan Battery Monitor", description: "An ESP32-C3 gadget that monitors the caravan's LiFePO4 battery (it doesn't charge it) on its own screen and in Home Assistant, and doubles as a car-battery crank tester.", url: "battery-monitor/", cta: "View project", image: "assets/img/projects/battery-monitor.jpg", imageAlt: "The open black 3D-printed monitor box on a white background, with its OLED showing 12.53 V and the honeycomb lid beside it", updated: "Built Apr 2026; current shunt planned", tags: ["ESP32", "Home Assistant", { label: "In progress", color: "amber" }] },
  { title: "ESP32 RC Remote", description: "A 3D-printed two-joystick 2.4 GHz remote and receiver on ESP32 boards, talking directly over ESP-NOW with no router needed.", url: "rc-remote/", cta: "View project", image: "assets/img/projects/rc-remote.jpg", imageAlt: "The orange 3D-printed remote with two black thumbsticks and an ESP32-C3 board on top", updated: "Built Jul 2026", tags: ["ESP32", "3D printing", { label: "In progress", color: "amber" }] },
];
