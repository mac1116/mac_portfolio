/* ========================================================
   ALL PROJECTS PAGE
   ========================================================
   Renders the full project grid, filter buttons, load-more,
   and project count on projects.html.
   ======================================================== */

(function () {
  "use strict";

  var projectsPerLoad = 6;

  var state = {
    filteredProjects: [],
    visibleCount: 0,
    activeFilter: "all"
  };

  function isPlaceholderLink(url) {
    return !url || url.indexOf("YOUR_") === 0;
  }

  function buildProjectCard(project) {
    var hasPlaceholder = isPlaceholderLink(project.url);

    var card = document.createElement("article");
    card.className = "project-card" + (project.featured ? " project-card--featured" : "");
    card.setAttribute("tabindex", "0");

    var inner = document.createElement("div");
    inner.className = "project-card-inner";

    // Media (image)
    var media = document.createElement("div");
    media.className = "project-media";

    var img = document.createElement("img");
    img.className = "project-image";
    img.src = project.image || "";
    img.alt = project.imageAlt || (project.title ? project.title + " screenshot" : "Project screenshot");
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;

    img.addEventListener("error", function () {
      img.src = "assets/images/project-fallback-placeholder.jpg";
      img.addEventListener("error", function () {
        img.style.display = "none";
        var placeholder = document.createElement("div");
        placeholder.className = "project-image-placeholder";
        placeholder.textContent = project.title || "Project";
        media.insertBefore(placeholder, media.firstChild);
      }, { once: true });
    }, { once: true });

    media.appendChild(img);
    inner.appendChild(media);

    // Overlay
    var overlay = document.createElement("div");
    overlay.className = "project-card-overlay";
    inner.appendChild(overlay);

    // Summary (always visible)
    var summary = document.createElement("div");
    summary.className = "project-card-summary";

    var heading = document.createElement("div");
    heading.className = "project-summary-heading";

    var title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = project.title || "Untitled Project";

    var extIcon = document.createElement("span");
    extIcon.className = "project-external-icon";
    extIcon.setAttribute("aria-hidden", "true");
    extIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

    heading.appendChild(title);
    heading.appendChild(extIcon);

    var category = document.createElement("p");
    category.className = "project-category";
    category.textContent = project.category || "";

    summary.appendChild(heading);
    summary.appendChild(category);
    inner.appendChild(summary);

    // Hover details
    var hoverDetails = document.createElement("div");
    hoverDetails.className = "project-hover-details";

    var label = document.createElement("span");
    label.className = "project-hover-label";
    label.textContent = "Project";
    hoverDetails.appendChild(label);

    var hTitle = document.createElement("h3");
    hTitle.className = "project-hover-title";
    hTitle.textContent = project.title || "Untitled Project";
    hoverDetails.appendChild(hTitle);

    if (project.description) {
      var desc = document.createElement("p");
      desc.className = "project-hover-description";
      desc.textContent = project.description;
      hoverDetails.appendChild(desc);
    }

    if (project.technologies && project.technologies.length > 0) {
      var tags = document.createElement("div");
      tags.className = "project-technologies";
      project.technologies.forEach(function (tech) {
        var tag = document.createElement("span");
        tag.className = "project-technology";
        tag.textContent = tech;
        tags.appendChild(tag);
      });
      hoverDetails.appendChild(tags);
    }

    var viewLink = document.createElement("span");
    viewLink.className = "project-view-link";
    viewLink.innerHTML = 'View Project <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

    hoverDetails.appendChild(viewLink);
    inner.appendChild(hoverDetails);

    card.appendChild(inner);

    // Link overlay
    var link = document.createElement("a");
    link.className = "project-card-link";
    link.href = hasPlaceholder ? "#" : project.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "View " + (project.title || "project") + " project");

    if (hasPlaceholder) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (project.title) {
          console.warn("Replace the placeholder URL for " + project.title + ".");
        }
      });
    }

    card.appendChild(link);

    return card;
  }

  function renderGrid() {
    var grid = document.getElementById("allProjectsGrid");
    if (!grid) return;

    grid.innerHTML = "";

    var toShow = state.filteredProjects.slice(0, state.visibleCount);

    toShow.forEach(function (project) {
      var card = buildProjectCard(project);
      grid.appendChild(card);
    });

    updateLoadMore();
    updateCount();
  }

  function updateCount() {
    var countEl = document.getElementById("projectCount");
    if (!countEl) return;

    var showing = Math.min(state.visibleCount, state.filteredProjects.length);
    var total = state.filteredProjects.length;
    var filterLabel = state.activeFilter === "all" ? "projects" : state.activeFilter.replace(/-/g, " ") + " projects";

    countEl.textContent = "Showing " + showing + " of " + total + " " + filterLabel;
  }

  function updateLoadMore() {
    var btn = document.getElementById("loadMoreBtn");
    var endMsg = document.getElementById("loadMoreEnd");
    if (!btn || !endMsg) return;

    var remaining = state.filteredProjects.length - state.visibleCount;

    if (remaining <= 0) {
      btn.style.display = "none";
      endMsg.style.display = "block";
    } else {
      btn.style.display = "inline-flex";
      endMsg.style.display = "none";
    }
  }

  function loadMore() {
    state.visibleCount += projectsPerLoad;
    renderGrid();
  }

  function buildFilters() {
    var container = document.getElementById("projectFilters");
    if (!container) return;

    var categories = {};
    if (projects && projects.length) {
      projects.forEach(function (p) {
        if (p.categoryKey) {
          categories[p.categoryKey] = (categories[p.categoryKey] || 0) + 1;
        }
      });
    }

    var categoryLabels = {
      "web-design": "Web Design",
      "ui-ux-design": "UI/UX Design",
      "web-applications": "Web Applications",
      "e-commerce": "E-Commerce",
      "school-systems": "School Systems",
      "graphic-design": "Graphic Design"
    };

    Object.keys(categories).sort().forEach(function (key) {
      var btn = document.createElement("button");
      btn.className = "all-projects-filter";
      btn.setAttribute("data-filter", key);
      btn.setAttribute("role", "tab");
      btn.textContent = categoryLabels[key] || key.replace(/-/g, " ");
      btn.addEventListener("click", function () {
        setFilter(key);
      });
      container.appendChild(btn);
    });
  }

  function setFilter(filterKey) {
    state.activeFilter = filterKey;

    var filterBtns = document.querySelectorAll(".all-projects-filter");
    filterBtns.forEach(function (btn) {
      var isActive = btn.getAttribute("data-filter") === filterKey;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (filterKey === "all") {
      state.filteredProjects = projects.slice();
    } else {
      state.filteredProjects = projects.filter(function (p) {
        return p.categoryKey === filterKey;
      });
    }

    state.visibleCount = projectsPerLoad;
    renderGrid();

    var grid = document.getElementById("allProjectsGrid");
    if (grid) {
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function init() {
    if (!projects || !projects.length) {
      var grid = document.getElementById("allProjectsGrid");
      if (grid) {
        grid.innerHTML = '<div class="projects-empty">No projects to display yet.</div>';
      }
      var countEl = document.getElementById("projectCount");
      if (countEl) countEl.textContent = "";
      var loadMoreContainer = document.getElementById("loadMoreContainer");
      if (loadMoreContainer) loadMoreContainer.style.display = "none";
      return;
    }

    buildFilters();
    setFilter("all");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", loadMore);
    }

    init();
  });

})();
