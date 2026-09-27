// The projects shown on the home page, in display order.
// To add a project, add one line. Fields:
//   title       - card heading
//   description - one or two sentences
//   url         - where the button links (the only place a project's URL lives).
//                 Optional: leave it out and the card has no button (e.g. no public page yet).
//   cta         - button label (optional, defaults to "Open")
//   tags        - short labels shown on the card (optional). A plain string is a blue tag;
//                 { label: "...", color: "green" } is a green one (e.g. for status).
//                 Status tags: green "Actively maintained" / "In progress", grey "Complete".
window.PROJECTS = [
  { title: "SA Fuel Price Preview", description: "Fuel price predictions for South Africa, so you know what's coming at the pump before the official announcement.", url: "https://fuel.psyphin.co.za/", cta: "View predictions", tags: ["Data", "South Africa", { label: "Actively maintained", color: "green" }] },
  { title: "Digital Radio Hotspot", description: "A DMR digital radio hotspot on a Raspberry Pi, linking a handheld radio to digital voice networks over the internet.", tags: ["DMR", "Raspberry Pi", { label: "Complete", color: "grey" }] },
  { title: "Patient Monitor Smartwatch", description: "An experimental ESP32 wearable that reads and displays vital signs. A hobby build for learning, not a medical device.", tags: ["ESP32", "Health", { label: "In progress", color: "green" }] },
];
