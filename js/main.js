// Renders the project cards from window.PROJECTS (defined in /projects.js).
(function () {
  var grid = document.getElementById("project-grid");
  var projects = window.PROJECTS || [];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  if (!projects.length) {
    grid.appendChild(el("p", "empty", "Projects coming soon."));
  }

  projects.forEach(function (project) {
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

  document.getElementById("year").textContent = new Date().getFullYear();
})();
