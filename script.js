document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ============================================
  // THEME TOGGLE (DARK / LIGHT MODE)
  // ============================================
  function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    const html = document.documentElement;

    function getPreferredTheme() {
      const stored = localStorage.getItem("theme");
      return stored || "light";
    }

    function setTheme(theme) {
      html.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      if (toggle) {
        toggle.innerHTML = theme === "dark"
          ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      }
    }

    setTheme(getPreferredTheme());

    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        setTheme(next);
      });
    }


  }

  initThemeToggle();

  // ============================================
  // THREE.JS INTERACTIVE BACKGROUND
  // ============================================
  function initThreeBackground() {
    const canvas = document.getElementById("three-bg");
    if (!canvas || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);

    // Lighting for blocks
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
    dirLight2.position.set(-1, -1, 2);
    scene.add(dirLight2);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const isMobile = window.innerWidth < 768;

    // ==============================
    // COLORS
    // ==============================
    const accent = 0x5b5cf6;

    // ==============================
    // 3D GRID PLANE WITH WAVE
    // ==============================
    const gridSize = 20;
    const gridDivisions = 40;
    const gridStep = gridSize / gridDivisions;

    const gridPositions = [];
    const gridIndices = [];

    for (let i = 0; i <= gridDivisions; i++) {
      for (let j = 0; j <= gridDivisions; j++) {
        const x = -gridSize / 2 + i * gridStep;
        const z = -gridSize / 2 + j * gridStep;
        gridPositions.push(x, 0, z);
      }
    }

    for (let i = 0; i < gridDivisions; i++) {
      for (let j = 0; j < gridDivisions; j++) {
        const a = i * (gridDivisions + 1) + j;
        const b = i * (gridDivisions + 1) + j + 1;
        const c = (i + 1) * (gridDivisions + 1) + j;
        const d = (i + 1) * (gridDivisions + 1) + j + 1;
        gridIndices.push(a, b, c);
        gridIndices.push(b, d, c);
      }
    }

    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridPositions, 3));
    gridGeo.setIndex(gridIndices);
    gridGeo.computeVertexNormals();

    const gridMat = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.position.y = -1.5;
    scene.add(gridMesh);

    // Store original Y positions for wave animation
    const origY = new Float32Array(gridPositions.length / 3);
    for (let i = 0; i < origY.length; i++) {
      origY[i] = 0;
    }

    // ==============================
    // SUBTLE GRID GLOW OVERLAY
    // ==============================
    const glowGeo = new THREE.PlaneGeometry(14, 8);
    const glowMat = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
    });
    const glowPlane = new THREE.Mesh(glowGeo, glowMat);
    glowPlane.position.set(0, 0, -0.5);
    scene.add(glowPlane);

    // ==============================
    // PARTICLES (monochrome + subtle accent)
    // ==============================
    const particleCount = isMobile ? 60 : 150;
    const particleGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      pSizes[i] = 0.02 + Math.random() * 0.04;

      // Monochrome with occasional accent
      const isAccent = Math.random() < 0.15;
      if (isAccent) {
        pColors[i * 3] = 0.357;
        pColors[i * 3 + 1] = 0.361;
        pColors[i * 3 + 2] = 0.965;
      } else {
        const shade = 0.3 + Math.random() * 0.5;
        pColors[i * 3] = shade;
        pColors[i * 3 + 1] = shade;
        pColors[i * 3 + 2] = shade;
      }
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(pSizes, 1));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==============================
    // CONNECTING LINES (subtle)
    // ==============================
    const linePositions = [];
    const lineColors = [];
    const posArr = particles.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.5) {
          linePositions.push(
            posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2],
            posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]
          );
          const alpha = 1 - dist / 2.5;
          lineColors.push(0.9, 0.9, 0.9, alpha, 0.9, 0.9, 0.9, alpha);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.06,
    });

    const lineSystem = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSystem);

    // ==============================
    // FLOATING 3D BLOCKS (interactive falling)
    // ==============================
    const blocks = [];
    const maxBlocks = isMobile ? 30 : 60;

    // A few ambient floating blocks
    const ambientBlockCount = isMobile ? 3 : 8;
    const ambientBlocks = [];

    function createBlockMesh(size, color, opacity) {
      const geo = new THREE.BoxGeometry(size.x, size.y, size.z);
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        roughness: 0.3,
        metalness: 0.1,
        emissive: color,
        emissiveIntensity: 0.05,
      });
      return new THREE.Mesh(geo, mat);
    }

    // Ambient floating blocks
    for (let i = 0; i < ambientBlockCount; i++) {
      const s = 0.2 + Math.random() * 0.4;
      const shade = 0.2 + Math.random() * 0.4;
      const color = new THREE.Color(shade, shade, shade);
      const mesh = createBlockMesh(
        { x: s, y: s * (0.5 + Math.random()), z: s * (0.5 + Math.random()) },
        color,
        0.15 + Math.random() * 0.15
      );
      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6,
        -1 - Math.random() * 3
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(mesh);
      ambientBlocks.push({
        mesh: mesh,
        rotSpeed: { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005 },
        floatSpeed: 0.2 + Math.random() * 0.3,
        floatPhase: Math.random() * Math.PI * 2,
        startY: mesh.position.y,
      });
    }

    // Spawn falling blocks on click
    function spawnFallingBlocks(screenX, screenY) {
      const count = isMobile ? 2 : 4;
      for (let i = 0; i < count; i++) {
        if (blocks.length >= maxBlocks) {
          const old = blocks.shift();
          scene.remove(old.mesh);
          old.mesh.geometry.dispose();
          old.mesh.material.dispose();
        }

        // Convert screen to 3D position
        const ndcX = (screenX / window.innerWidth) * 2 - 1;
        const ndcY = -(screenY / window.innerHeight) * 2 + 1;
        const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
        vec.unproject(camera);
        const dir = vec.sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(dist));

        const w = 0.3 + Math.random() * 0.5;
        const h = w * (0.5 + Math.random() * 1);
        const d = w * (0.5 + Math.random() * 1);

        // Monochrome with rare accent
        const isAccent = Math.random() < 0.1;
        let col;
        if (isAccent) {
          col = new THREE.Color(0.357, 0.361, 0.965);
        } else {
          const shade = 0.15 + Math.random() * 0.5;
          col = new THREE.Color(shade, shade, shade);
        }

        const mesh = createBlockMesh(
          { x: w, y: h, z: d },
          col,
          0.4 + Math.random() * 0.3
        );

        mesh.position.set(
          pos.x + (Math.random() - 0.5) * 0.8,
          pos.y + (Math.random() - 0.5) * 0.3,
          -0.5 - Math.random() * 1.5
        );

        scene.add(mesh);
        blocks.push({
          mesh: mesh,
          vx: (Math.random() - 0.5) * 0.02,
          vy: -(0.005 + Math.random() * 0.015),
          vz: (Math.random() - 0.5) * 0.005,
          gravity: -0.0004,
          rotSpeed: {
            x: (Math.random() - 0.5) * 0.04,
            y: (Math.random() - 0.5) * 0.04,
            z: (Math.random() - 0.5) * 0.02,
          },
        });
      }
    }

    // Listen for clicks on document (since canvas has pointer-events: none)
    document.addEventListener("click", function (e) {
      spawnFallingBlocks(e.clientX, e.clientY);
    });

    // ==============================
    // MOUSE TRACKING (lerp-based)
    // ==============================
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    window.addEventListener("mousemove", (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // ==============================
    // SCROLL TRACKING
    // ==============================
    let scrollY = 0;
    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
    });

    // ==============================
    // ANIMATION LOOP
    // ==============================
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const scrollProgress = Math.min(scrollY / (document.body.scrollHeight - window.innerHeight), 1);

      // Smooth mouse follow (lerp)
      mouse.x += (target.x * 0.4 - mouse.x) * 0.04;
      mouse.y += (target.y * 0.3 - mouse.y) * 0.04;

      // Camera follow with scroll offset
      const camTargetX = mouse.x * 0.5;
      const camTargetY = mouse.y * 0.3;
      camera.position.x += (camTargetX - camera.position.x) * 0.02;
      camera.position.y += (camTargetY - camera.position.y) * 0.02;
      camera.position.z = 12 + scrollProgress * 2;
      camera.lookAt(scene.position);

      // Grid wave animation
      const positions = gridMesh.geometry.attributes.position.array;
      for (let i = 0; i < positions.length / 3; i++) {
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        const wave = Math.sin(x * 0.5 + elapsed * 0.3) * 0.06 +
                     Math.sin(z * 0.4 + elapsed * 0.25) * 0.04;
        positions[i * 3 + 1] = origY[i] + wave;
      }
      gridMesh.geometry.attributes.position.needsUpdate = true;
      gridMesh.geometry.computeVertexNormals();

      // Grid subtle rotation on scroll
      gridMesh.rotation.x = 0.1 + scrollProgress * 0.15;
      gridMesh.position.y = -1.5 - scrollProgress * 0.5;

      // Glow plane pulse
      glowPlane.material.opacity = 0.03 + Math.sin(elapsed * 0.5) * 0.015;

      // Particles float slowly
      const pPosAttr = particles.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        pPosAttr.array[i * 3 + 1] += Math.sin(elapsed * 0.2 + i) * 0.0003;
      }
      pPosAttr.needsUpdate = true;

      // Particles subtle rotation
      particles.rotation.y += 0.0003;
      particles.rotation.x += mouse.y * 0.0001;

      // Line system subtle rotation
      lineSystem.rotation.y += 0.0002;

      // Ambient floating blocks
      for (var i = 0; i < ambientBlocks.length; i++) {
        var ab = ambientBlocks[i];
        ab.mesh.rotation.x += ab.rotSpeed.x;
        ab.mesh.rotation.y += ab.rotSpeed.y;
        ab.mesh.position.y = ab.startY + Math.sin(elapsed * ab.floatSpeed + ab.floatPhase) * 0.15;
      }

      // Falling blocks physics
      for (var i = blocks.length - 1; i >= 0; i--) {
        var b = blocks[i];
        b.vy += b.gravity;
        b.mesh.position.x += b.vx;
        b.mesh.position.y += b.vy;
        b.mesh.position.z += b.vz;
        b.mesh.rotation.x += b.rotSpeed.x;
        b.mesh.rotation.y += b.rotSpeed.y;
        b.mesh.rotation.z += b.rotSpeed.z;

        // Remove if too far down
        if (b.mesh.position.y < -6) {
          scene.remove(b.mesh);
          b.mesh.geometry.dispose();
          b.mesh.material.dispose();
          blocks.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // ==============================
    // RESIZE
    // ==============================
    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener("resize", onResize);
  }

  initThreeBackground();

  // ============================================
  // MOBILE NAVIGATION TOGGLE
  // ============================================
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active");
      nav.classList.toggle("open");
    });

    // Close nav on link click
    document.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        nav.classList.remove("open");
      });
    });
  }

  // ============================================
  // HEADER SCROLL SHADOW
  // ============================================
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // ============================================
  // ACTIVE NAV LINK ON SCROLL
  // ============================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  function updateActiveLink() {
    let current = "";
    sections.forEach(function (section) {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("load", updateActiveLink);

  // ============================================
  // REVEAL ANIMATION (Intersection Observer)
  // ============================================
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) {
      // Set staggered delays for children
      const siblings = el.parentElement.querySelectorAll(".reveal");
      if (siblings.length > 1) {
        siblings.forEach(function (sib, index) {
          sib.style.transitionDelay = index * 0.1 + "s";
        });
      }
      revealObserver.observe(el);
    });
  }

  // ============================================
  // PROJECTS CAROUSEL (homepage featured only)
  // ============================================

  // The shared projects array comes from assets/js/projects-data.js
  // Use window.projects to avoid var-hoisting conflicts with the local `projects` var
  var allProjects = typeof window.projects !== "undefined" ? window.projects : [];

  // Filter to featured projects only for the homepage carousel
  var featuredProjects = allProjects.filter(function (p) {
    return p.featured === true;
  });

  // Use featuredProjects for all carousel rendering
  var projects = featuredProjects;

  var projectCarouselState = {
    currentPage: 0,
    userHasInteracted: false
  };

  var carouselConfig = {
    gap: 30
  };

  function isPlaceholderLink(url) {
    return !url || url.indexOf("YOUR_") === 0;
  }

  function wrapIndex(index, len) {
    return ((index % len) + len) % len;
  }

  function getSlotPositionClass(offset) {
    switch (offset) {
      case -2: return "project-position-far-left";
      case -1: return "project-position-left";
      case 0:  return "project-position-center";
      case 1:  return "project-position-right";
      case 2:  return "project-position-far-right";
      default: return "project-position-hidden";
    }
  }

  function fillSlotContent(slot, project) {
    var hasPlaceholder = isPlaceholderLink(project.url);

    // Image
    var img = slot.querySelector(".project-image");
    if (img) {
      img.src = project.image || "";
      img.alt = project.imageAlt || (project.title ? project.title + " screenshot" : "Project screenshot");
      img.style.display = "";
      // Rebind error handler
      img.addEventListener("error", function handler() {
        img.src = "assets/images/project-fallback-placeholder.jpg";
        img.removeEventListener("error", handler);
        img.addEventListener("error", function () {
          img.style.display = "none";
          var ph = document.createElement("div");
          ph.className = "project-image-placeholder";
          ph.textContent = project.title || "Project";
          img.parentNode.insertBefore(ph, img);
        }, { once: true });
      }, { once: true });
    }

    // Title (both summary and hover)
    var summaryTitle = slot.querySelector(".project-card-summary .project-title");
    if (summaryTitle) summaryTitle.textContent = project.title || "Untitled Project";

    var hoverTitle = slot.querySelector(".project-hover-title");
    if (hoverTitle) hoverTitle.textContent = project.title || "Untitled Project";

    // Category
    var category = slot.querySelector(".project-card-summary .project-category");
    if (category) category.textContent = project.category || "";

    // Description
    var desc = slot.querySelector(".project-hover-description");
    if (desc) {
      if (project.description) {
        desc.textContent = project.description;
        desc.style.display = "";
      } else {
        desc.style.display = "none";
      }
    }

    // Technologies
    var tags = slot.querySelector(".project-technologies");
    if (tags) {
      tags.innerHTML = "";
      if (project.technologies && project.technologies.length > 0) {
        project.technologies.forEach(function (tech) {
          var tag = document.createElement("span");
          tag.className = "project-technology";
          tag.textContent = tech;
          tags.appendChild(tag);
        });
        tags.style.display = "";
      } else {
        tags.style.display = "none";
      }
    }

    // Link href
    var link = slot.querySelector(".project-card-link");
    if (link) {
      link.href = hasPlaceholder ? "#" : project.url;
      link.setAttribute("aria-label", "View " + (project.title || "project") + " project");
      // Replace old click listeners
      var newLink = link.cloneNode(true);
      newLink.addEventListener("click", function (e) {
        if (hasPlaceholder) {
          e.preventDefault();
          if (project.title) {
            console.warn("Replace the placeholder URL for " + project.title + ".");
          }
        }
      });
      link.parentNode.replaceChild(newLink, link);
    }
  }

  function createProjectSlot(project, offset) {
    var card = document.createElement("article");
    card.className = "project-card " + getSlotPositionClass(offset);

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
        var ph = document.createElement("div");
        ph.className = "project-image-placeholder";
        ph.textContent = project.title || "Project";
        media.insertBefore(ph, media.firstChild);
      }, { once: true });
    }, { once: true });

    media.appendChild(img);
    inner.appendChild(media);

    // Overlay
    var overlay = document.createElement("div");
    overlay.className = "project-card-overlay";
    inner.appendChild(overlay);

    // Summary
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
    var hover = document.createElement("div");
    hover.className = "project-hover-details";

    var label = document.createElement("span");
    label.className = "project-hover-label";
    label.textContent = "Project";
    hover.appendChild(label);

    var hTitle = document.createElement("h3");
    hTitle.className = "project-hover-title";
    hTitle.textContent = project.title || "Untitled Project";
    hover.appendChild(hTitle);

    if (project.description) {
      var desc = document.createElement("p");
      desc.className = "project-hover-description";
      desc.textContent = project.description;
      hover.appendChild(desc);
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
      hover.appendChild(tags);
    }

    var viewLink = document.createElement("span");
    viewLink.className = "project-view-link";
    viewLink.innerHTML = 'View Project <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

    hover.appendChild(viewLink);
    inner.appendChild(hover);

    card.appendChild(inner);

    // Link overlay
    var link = document.createElement("a");
    link.className = "project-card-link";
    var hp = isPlaceholderLink(project.url);
    link.href = hp ? "#" : project.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "View " + (project.title || "project") + " project");

    if (hp) {
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

  function renderProjects() {
    var stage = document.getElementById("projectsStage");
    var pagination = document.getElementById("projects-pagination");
    var status = document.getElementById("project-carousel-status");
    if (!stage) return;

    if (!projects || projects.length === 0) {
      stage.innerHTML = '<div class="projects-empty">New projects are coming soon.</div>';
      if (pagination) pagination.innerHTML = "";
      if (status) status.textContent = "";
      return;
    }

    stage.innerHTML = "";

    // Create 5 persistent slot elements
    var initOffsets = [-2, -1, 0, 1, 2];
    initOffsets.forEach(function (offset) {
      var idx = wrapIndex(offset, projects.length);
      var slot = createProjectSlot(projects[idx], offset);
      stage.appendChild(slot);
    });

    initCarousel();
  }

  function initCarousel() {
    var stage = document.getElementById("projectsStage");
    var prevBtn = document.querySelector(".projects-arrow-prev");
    var nextBtn = document.querySelector(".projects-arrow-next");
    var pagination = document.getElementById("projects-pagination");
    var status = document.getElementById("project-carousel-status");

    if (!stage || projects.length === 0) return;

    var slots = stage.querySelectorAll(".project-card");
    var slotCount = 5;
    var slotOffsets = [-2, -1, 0, 1, 2];
    var activeIndex = 0;
    var isAnimating = false;
    var TRANSITION_DURATION = 750;
    var CARD_COUNT = projects.length;

    // ─── Autoplay ────────────────────────────────────────────
    var autoPlayDelay = 3000;
    var autoPlayTimer = null;
    var autoPlayPaused = false;

    function startAutoPlay() {
      stopAutoPlay();
      if (CARD_COUNT <= 1) return;
      autoPlayTimer = setInterval(function () {
        if (!autoPlayPaused && !isAnimating) showNext();
      }, autoPlayDelay);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function pauseAutoPlay() { autoPlayPaused = true; }
    function resumeAutoPlay() { autoPlayPaused = false; }

    function resetAutoPlay() {
      pauseAutoPlay();
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setTimeout(function () {
          autoPlayTimer = setInterval(function () {
            if (!autoPlayPaused && !isAnimating) showNext();
          }, autoPlayDelay);
        }, 8000);
      }
    }

    // ─── Apply positions ─────────────────────────────────────
    function applyPositions() {
      for (var i = 0; i < slotCount; i++) {
        var cls = "project-card " + getSlotPositionClass(slotOffsets[i]);
        slots[i].className = cls;
      }
    }

    // ─── Update slot content ─────────────────────────────────
    function updateSlotByIndex(slotElement, projectIndex) {
      var project = projects[wrapIndex(projectIndex, CARD_COUNT)];
      fillSlotContent(slotElement, project);
    }

    // ─── Sequential shift ────────────────────────────────────
    function shiftSlots(direction) {
      // direction: 1 = next (content slides left), -1 = prev (content slides right)
      if (isAnimating || CARD_COUNT < 2) return;

      isAnimating = true;
      projectCarouselState.userHasInteracted = true;

      // Update active index
      activeIndex = wrapIndex(activeIndex + direction, CARD_COUNT);

      // Find the slot that wraps around (the exiting slot becomes the entering slot)
      var wrapFrom = direction === 1 ? -2 : 2;
      var wrapTo   = direction === 1 ? 2 : -2;

      var wrapSlotIdx = -1;
      for (var i = 0; i < slotCount; i++) {
        if (slotOffsets[i] === wrapFrom) {
          wrapSlotIdx = i;
          break;
        }
      }

      // Update the wrapping slot's content to the entering project
      if (wrapSlotIdx !== -1) {
        var enteringProjectIdx = wrapIndex(activeIndex + wrapTo, CARD_COUNT);
        updateSlotByIndex(slots[wrapSlotIdx], enteringProjectIdx);

        // Instantly position it at the entering offset (no transition)
        slots[wrapSlotIdx].style.transition = "none";
        slotOffsets[wrapSlotIdx] = wrapTo;
        slots[wrapSlotIdx].className = "project-card " + getSlotPositionClass(wrapTo);
        void slots[wrapSlotIdx].offsetWidth; // force reflow
        slots[wrapSlotIdx].style.transition = "";
        slots[wrapSlotIdx].style.opacity = "0";
      }

      // Shift all other slots' offsets
      for (var i = 0; i < slotCount; i++) {
        if (i === wrapSlotIdx) continue;
        slotOffsets[i] -= direction;
        if (slotOffsets[i] < -2) slotOffsets[i] = 2;
        if (slotOffsets[i] > 2) slotOffsets[i] = -2;
      }

      // Animate: apply new position classes
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          applyPositions();
          // Fade in the wrapping slot
          if (wrapSlotIdx !== -1) {
            slots[wrapSlotIdx].style.opacity = "";
          }
        });
      });

      // Complete after transition
      window.setTimeout(function () {
        updatePagination();
        isAnimating = false;
      }, TRANSITION_DURATION);
    }

    function showNext() { shiftSlots(1); }
    function showPrev() { shiftSlots(-1); }

    // ─── Navigate to specific index ──────────────────────────
    function goToIndex(targetIndex) {
      if (isAnimating || CARD_COUNT < 2) return;
      if (targetIndex < 0 || targetIndex >= CARD_COUNT) return;

      var diff = targetIndex - activeIndex;
      // Shortest circular distance
      var altDiff = diff > 0 ? diff - CARD_COUNT : diff + CARD_COUNT;
      var steps = Math.abs(diff) <= Math.abs(altDiff) ? diff : altDiff;

      // For adjacent moves, animate one step
      if (Math.abs(steps) === 1) {
        shiftSlots(steps);
        return;
      }

      // For larger jumps, do a direct transition
      isAnimating = true;
      projectCarouselState.userHasInteracted = true;
      activeIndex = targetIndex;

      // Recalculate all slot contents and positions
      for (var i = 0; i < slotCount; i++) {
        var newOffset = slotOffsets[i];
        var projectIdx = wrapIndex(activeIndex + newOffset, CARD_COUNT);
        updateSlotByIndex(slots[i], projectIdx);
      }

      applyPositions();
      updatePagination();

      window.setTimeout(function () {
        isAnimating = false;
      }, TRANSITION_DURATION);
    }

    // ─── Pagination ──────────────────────────────────────────
    function updatePagination() {
      if (!pagination) return;
      pagination.innerHTML = "";
      for (var i = 0; i < CARD_COUNT; i++) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "project-dot";
        dot.setAttribute("aria-label", "Go to project " + (i + 1));
        if (i === activeIndex) dot.setAttribute("aria-current", "true");
        dot.addEventListener("click", (function (idx) {
          return function () { goToIndex(idx); resetAutoPlay(); };
        })(i));
        pagination.appendChild(dot);
      }

      if (status) {
        status.textContent = "Project " + (activeIndex + 1) + " of " + CARD_COUNT + ".";
      }

      var single = CARD_COUNT <= 1;
      if (prevBtn) prevBtn.style.display = single ? "none" : "";
      if (nextBtn) nextBtn.style.display = single ? "none" : "";
      if (pagination) pagination.style.display = single ? "none" : "";
    }

    // ─── Slot click handling ────────────────────────────────
    for (var i = 0; i < slotCount; i++) {
      (function (slotIdx) {
        slots[slotIdx].addEventListener("click", function (e) {
          if (isAnimating) return;
          e.preventDefault();
          var offset = slotOffsets[slotIdx];

          if (offset === -1) {
            showPrev();
            resetAutoPlay();
          } else if (offset === 1) {
            showNext();
            resetAutoPlay();
          } else if (offset === 0) {
            // Center card → open URL
            var link = this.querySelector(".project-card-link");
            if (link) {
              var href = link.getAttribute("href");
              if (href && href !== "#" && href.indexOf("YOUR_") !== 0) {
                window.open(href, "_blank");
              }
            }
          }
          // offset ±2: no action
        });
      })(i);
    }

    // ─── Arrow buttons ────────────────────────────────────────
    if (prevBtn) prevBtn.addEventListener("click", function () { showPrev(); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { showNext(); resetAutoPlay(); });

    // ─── Keyboard ─────────────────────────────────────────────
    stage.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); showPrev(); resetAutoPlay(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); showNext(); resetAutoPlay(); }
      else if (e.key === "Home") { e.preventDefault(); goToIndex(0); resetAutoPlay(); }
      else if (e.key === "End") { e.preventDefault(); goToIndex(CARD_COUNT - 1); resetAutoPlay(); }
    });

    // ─── Touch swipe ──────────────────────────────────────────
    var touchStartX = 0;
    var touchActive = false;
    var touchMoved = false;

    stage.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
      touchActive = true;
      touchMoved = false;
      pauseAutoPlay();
    }, { passive: true });

    stage.addEventListener("touchmove", function (e) {
      if (!touchActive) return;
      if (Math.abs(e.touches[0].clientX - touchStartX) > 10) touchMoved = true;
    }, { passive: true });

    stage.addEventListener("touchend", function (e) {
      if (!touchActive) return;
      touchActive = false;
      if (!touchMoved) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (dx < -50) { showNext(); resetAutoPlay(); }
      else if (dx > 50) { showPrev(); resetAutoPlay(); }
      resumeAutoPlay();
    }, { passive: true });

    // ─── Mouse drag ───────────────────────────────────────────
    var mouseStartX = 0;
    var mouseDown = false;
    var mouseDragged = false;

    stage.addEventListener("mousedown", function (e) {
      mouseStartX = e.clientX;
      mouseDown = true;
      mouseDragged = false;
      pauseAutoPlay();
    });

    stage.addEventListener("mousemove", function (e) {
      if (!mouseDown) return;
      if (Math.abs(e.clientX - mouseStartX) > 10) mouseDragged = true;
    });

    stage.addEventListener("mouseup", function (e) {
      if (!mouseDown) return;
      mouseDown = false;
      if (!mouseDragged) return;
      var dx = e.clientX - mouseStartX;
      if (dx < -50) { showNext(); resetAutoPlay(); }
      else if (dx > 50) { showPrev(); resetAutoPlay(); }
      resumeAutoPlay();
    });

    stage.addEventListener("mouseleave", function () { mouseDown = false; });

    // ─── Hover pause ──────────────────────────────────────────
    stage.addEventListener("mouseenter", pauseAutoPlay);
    stage.addEventListener("mouseleave", resumeAutoPlay);

    // ─── Visibility change ────────────────────────────────────
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { pauseAutoPlay(); stopAutoPlay(); }
      else { resumeAutoPlay(); startAutoPlay(); }
    });

    // ─── Resize ───────────────────────────────────────────────
    var resizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        stopAutoPlay();
        startAutoPlay();
      }, 200);
    });

    // ─── Init ─────────────────────────────────────────────────
    applyPositions();
    updatePagination();
    startAutoPlay();
  }

  renderProjects();

  // Update View All Projects button count
  var viewAllCount = document.getElementById("viewAllProjectCount");
  if (viewAllCount && typeof allProjects !== "undefined") {
    viewAllCount.textContent = "(" + allProjects.length + ")";
  }

  // ============================================
  // CONTACT FORM VALIDATION
  // ============================================
  const form = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (form) {
    const nameInput = document.getElementById("formName");
    const emailInput = document.getElementById("formEmail");
    const messageInput = document.getElementById("formMessage");

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function setError(input, show) {
      if (show) {
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;

      // Name validation
      if (!nameInput.value.trim()) {
        setError(nameInput, true);
        isValid = false;
      } else {
        setError(nameInput, false);
      }

      // Email validation
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        setError(emailInput, true);
        isValid = false;
      } else {
        setError(emailInput, false);
      }

      // Message validation
      if (!messageInput.value.trim()) {
        setError(messageInput, true);
        isValid = false;
      } else {
        setError(messageInput, false);
      }

      if (isValid) {
        form.style.display = "none";
        if (formSuccess) {
          formSuccess.classList.add("show");
        }
      }
    });

    // Clear error on input
    [nameInput, emailInput, messageInput].forEach(function (input) {
      input.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          setError(this, false);
        }
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL ANCHOR FIX
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (targetId === "#projects") {
          const headerH = 72;
          const extra = 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerH - extra;
          window.scrollTo({ top, behavior: "smooth" });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  });

  // ============================================
  // HERO HOVER: Swap emphasis between texts
  // ============================================
  const frontendDev = document.getElementById("frontendDev");
  const webDesignerFill = document.querySelector(".hero__title-back .hero__title--fill");
  const webDesignerFront = document.querySelector(".hero__title--fill-front");
  const frontendDevFront = document.querySelector(".hero__title--outline-front");

  if (frontendDev && webDesignerFill) {
    frontendDev.addEventListener("mouseenter", function () {
      // Back layer: swap fill and outline
      webDesignerFill.classList.add("outline-only");
      frontendDev.classList.add("solid");
      // Front layer: hide Web Designer outline, show Front-End outline
      if (webDesignerFront) webDesignerFront.classList.add("hidden");
      if (frontendDevFront) frontendDevFront.classList.add("visible");
    });

    frontendDev.addEventListener("mouseleave", function () {
      // Back layer: restore defaults
      webDesignerFill.classList.remove("outline-only");
      frontendDev.classList.remove("solid");
      // Front layer: restore defaults
      if (webDesignerFront) webDesignerFront.classList.remove("hidden");
      if (frontendDevFront) frontendDevFront.classList.remove("visible");
    });
  }
});
