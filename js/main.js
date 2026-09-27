// Shared page script: renders project cards from window.PROJECTS (projects.js) when the
// page has a #project-grid, wires up copy-to-clipboard buttons, and sets the footer year.
(function () {
  var grid = document.getElementById("project-grid");
  var projects = window.PROJECTS || [];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  if (grid && !projects.length) {
    grid.appendChild(el("p", "empty", "Projects coming soon."));
  }

  if (grid) projects.forEach(function (project) {
    var card = el("article", "card");

    if (project.tags && project.tags.length) {
      var tags = el("ul", "tags");
      project.tags.forEach(function (tag) {
        tags.appendChild(el("li", null, tag));
      });
      card.appendChild(tags);
    }

    card.appendChild(el("h3", null, project.title));
    card.appendChild(el("p", null, project.description));

    var link = el("a", "button", project.cta || "Open");
    link.href = project.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", (project.cta || "Open") + ": " + project.title + " (opens in a new tab)");
    card.appendChild(link);

    grid.appendChild(card);
  });

  // <button data-copy="text">: copies the text and briefly confirms on the button itself.
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var label = button.textContent;
    button.addEventListener("click", function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(button.getAttribute("data-copy")).then(function () {
        button.textContent = "Copied!";
        setTimeout(function () { button.textContent = label; }, 1800);
      });
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
