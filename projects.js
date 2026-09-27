// The projects shown on the home page, in display order.
// To add a project, add one line. Fields:
//   title       - card heading
//   description - one or two sentences
//   url         - where the button links (the only place a project's URL lives). A full
//                 https:// address opens in a new tab; a folder on this site ("dmr-hotspot/")
//                 opens in place, and that folder's page shows the same title + tags.
//                 Optional: leave it out and the card has no button (e.g. no public page yet).
//   cta         - button label (optional, defaults to "Open")
//   tags        - short labels shown on the card (optional). A plain string is a blue tag;
//                 { label: "...", color: "green" } is a green one (e.g. for status).
//                 Status tags: green "Actively maintained" / "In progress", yellow "Prototyping",
//                 amber "In testing", grey "Complete".
window.PROJECTS = [
  { title: "SA Fuel Price Preview", description: "Fuel price predictions for South Africa, so you know what's coming at the pump before the official announcement.", url: "https://fuel.psyphin.co.za/", cta: "View predictions", tags: ["Data", "South Africa", { label: "Actively maintained", color: "green" }] },
  { title: "Digital Radio Hotspot", description: "A true-duplex DMR hotspot on a Raspberry Pi 3B with an MMDVM dual hat, running WPSD and linking a handheld radio to the BrandMeister network.", url: "dmr-hotspot/", cta: "View project", tags: ["DMR", "Raspberry Pi", { label: "In testing", color: "amber" }] },
  { title: "RC SHERP Crawler", description: "A scratch-built 1:15 radio-controlled crawler based on the SHERP ATV, designed in Tinkercad, 3D printed in PETG and TPU, and driven by an ESP32.", url: "sherp-crawler/", cta: "View project", tags: ["3D printing", "ESP32", { label: "Prototyping", color: "yellow" }] },
];
