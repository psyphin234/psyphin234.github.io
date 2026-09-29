// Shared page script: renders cards from window.PROJECTS (projects.js) into #tool-grid
// (kind: "tool") and #project-grid (everything else) when the page has them, fills a
// project page's heading + tags from the same data (data-project="<url>"), wires up
// copy-to-clipboard buttons, and sets the footer year.
(function () {
  var projects = window.PROJECTS || [];
  var grids = [
    { node: document.getElementById("tool-grid"), items: projects.filter(function (p) { return p.kind === "tool"; }), empty: "Tools coming soon." },
    { node: document.getElementById("project-grid"), items: projects.filter(function (p) { return p.kind !== "tool"; }), empty: "Projects coming soon." }
  ].filter(function (g) { return g.node; });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // A tag is a plain string (blue), or { label, color } for a coloured tag, e.g. color: "green".
  function tagList(tagsData) {
    var tags = el("ul", "tags");
    tagsData.forEach(function (tag) {
      if (typeof tag === "string") return tags.appendChild(el("li", null, tag));
      tags.appendChild(el("li", tag.color ? "tag--" + tag.color : null, tag.label));
    });
    return tags;
  }

  function renderCard(grid, project) {
    var card = el("article", "card");
    // Outside sites open in a new tab (with the arrow); pages on this site open in place.
    var external = project.url && /^https?:/.test(project.url);

    // Photo across the top of the card; it links to the project too (hidden from screen
    // readers and the tab order, since the button below is the accessible link).
    if (project.image) {
      var media = el(project.url ? "a" : "div", "card-media");
      if (project.url) {
        media.href = project.url;
        media.tabIndex = -1;
        media.setAttribute("aria-hidden", "true");
        if (external) { media.target = "_blank"; media.rel = "noopener"; }
      }
      var img = el("img");
      img.src = project.image;
      img.alt = project.imageAlt || "";
      img.loading = "lazy";
      img.width = 800;
      img.height = 450;
      media.appendChild(img);
      card.appendChild(media);
    }

    if (project.tags && project.tags.length) card.appendChild(tagList(project.tags));
    card.appendChild(el("h3", null, project.title));
    card.appendChild(el("p", null, project.description));
    if (project.updated) card.appendChild(el("p", "card-updated", project.updated));

    if (project.url) {
      var link = el("a", external ? "button" : "button button--plain", project.cta || "Open");
      link.href = project.url;
      if (external) {
        link.target = "_blank";
        link.rel = "noopener";
        link.setAttribute("aria-label", (project.cta || "Open") + ": " + project.title + " (opens in a new tab)");
      } else {
        link.setAttribute("aria-label", (project.cta || "Open") + ": " + project.title);
      }
      card.appendChild(link);
    }

    grid.appendChild(card);
  }

  grids.forEach(function (g) {
    if (!g.items.length) g.node.appendChild(el("p", "empty", g.empty));
    g.items.forEach(function (project) { renderCard(g.node, project); });
  });

  // Cards fade up as they come into view (skipped when the visitor prefers reduced motion).
  // Fail-safe: cards already on screen show at once, and anything still hidden after 2 s is
  // shown anyway, so a browser quirk can never leave the project list invisible.
  if (grids.length && "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var show = function (card) { card.classList.add("is-visible"); };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -40px 0px" });
    var cards = [];
    grids.forEach(function (g) {
      g.node.querySelectorAll(".card").forEach(function (card, i) {
        card.classList.add("reveal");
        card.style.setProperty("--delay", (i % 3) * 90 + "ms");
        if (card.getBoundingClientRect().top < window.innerHeight) show(card);
        else observer.observe(card);
        cards.push(card);
      });
    });
    setTimeout(function () { cards.forEach(show); }, 2000);
  }

  // Pinned header: once the page scrolls, give the header a background and show the brand mark.
  function onScroll() { document.body.classList.toggle("scrolled", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Project page heading: <div data-project="dmr-hotspot/"> gets that project's title and tags
  // from projects.js, so a status change there shows on the card and the page at once.
  document.querySelectorAll("[data-project]").forEach(function (head) {
    var project = projects.filter(function (p) { return p.url === head.getAttribute("data-project"); })[0];
    if (!project) return;
    head.textContent = "";
    head.appendChild(el("h2", null, project.title));
    if (project.tags && project.tags.length) head.appendChild(tagList(project.tags));
  });

  // Anti-scraping email: elements with data-user + data-domain get the real address at runtime.
  // Links become mailto: links, data-email="text" also shows the address, and buttons become
  // copy buttons (data-copy). The HTML itself never contains a plain name@domain.
  document.querySelectorAll("[data-user][data-domain]").forEach(function (node) {
    var address = node.getAttribute("data-user") + "@" + node.getAttribute("data-domain");
    if (node.tagName === "A") node.href = "mailto:" + address;
    if (node.tagName === "BUTTON") node.setAttribute("data-copy", address);
    if (node.getAttribute("data-email") === "text") node.textContent = address;
  });

  // <button data-copy-from="id">: copy the text of that element (e.g. a code listing).
  document.querySelectorAll("[data-copy-from]").forEach(function (button) {
    var source = document.getElementById(button.getAttribute("data-copy-from"));
    if (source) button.setAttribute("data-copy", source.textContent);
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
