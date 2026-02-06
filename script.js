document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const portalButtons = document.querySelectorAll(".portal-btn");
  const sidebarNav = document.getElementById("sidebarNav");
  const portalName = document.getElementById("portalName");
  const userMenuBtn = document.getElementById("userMenuBtn");
  const userDropdown = document.getElementById("userDropdown");
  const notificationBtn = document.getElementById("notificationBtn");

  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("emailInput");
  const employeeIdInput = document.getElementById("employeeIdInput");
  const passwordInput = document.getElementById("passwordInput");
  const unlockBtn = document.getElementById("unlockBtn");
  const attemptCountEl = document.getElementById("attemptCount");
  const accountStatusEl = document.getElementById("accountStatus");
  const isActiveFlagEl = document.getElementById("isActiveFlag");
  const loginMessageEl = document.getElementById("loginMessage");

  const identityIdEl = document.getElementById("identityId");
  const identityEmailEl = document.getElementById("identityEmail");
  const generateIdentityBtn = document.getElementById("generateIdentity");

  const copyPromptBtn = document.getElementById("copyPrompt");
  const promptText = document.getElementById("promptText");
  const copyStatus = document.getElementById("copyStatus");
  const securityLogEl = document.getElementById("securityLog");
  const authLogEl = document.getElementById("authLog");

  const statTargets = [
    { id: "statFlights", min: 85, max: 180, jitter: 6 },
    { id: "statAlerts", min: 1, max: 9, jitter: 1 },
    { id: "statStaff", min: 280, max: 420, jitter: 8 },
    { id: "statPipelines", min: 18, max: 30, jitter: 2 }
  ];

  const securityEvents = [
    {
      title: "Perimeter scan complete",
      detail: "All secure zones reporting nominal status.",
      type: "success"
    },
    {
      title: "Badge access denied",
      detail: "Terminal A - Door 3 flagged for review.",
      type: "warning"
    },
    {
      title: "Threat intel update",
      detail: "Inbound aviation advisory synced from partner feeds.",
      type: "success"
    },
    {
      title: "CCTV anomaly flagged",
      detail: "Hangar 2 - automated review queued.",
      type: "warning"
    },
    {
      title: "Critical alert escalated",
      detail: "Unauthorized access attempt quarantined.",
      type: "danger"
    }
  ];

  const portalConfig = {
    hr: {
      name: "HR Portal",
      accent: "#4f46e5",
      accentStrong: "#4338ca",
      accentSoft: "rgba(79, 70, 229, 0.16)",
      nav: [
        { label: "Dashboard", icon: "fa-chart-line" },
        { label: "Staff Registry", icon: "fa-users" },
        { label: "Onboarding", icon: "fa-user-check" },
        { label: "Training", icon: "fa-graduation-cap" },
        { label: "Compliance", icon: "fa-shield" }
      ]
    },
    ops: {
      name: "Operations Portal",
      accent: "#0ea5e9",
      accentStrong: "#0284c7",
      accentSoft: "rgba(14, 165, 233, 0.16)",
      nav: [
        { label: "Flight Ops", icon: "fa-plane-departure" },
        { label: "Gate Control", icon: "fa-door-open" },
        { label: "Runway Status", icon: "fa-road" },
        { label: "Dispatch", icon: "fa-headset" },
        { label: "Weather", icon: "fa-cloud-sun" }
      ]
    },
    sec: {
      name: "Security Portal",
      accent: "#ef4444",
      accentStrong: "#dc2626",
      accentSoft: "rgba(239, 68, 68, 0.16)",
      nav: [
        { label: "Threat Intel", icon: "fa-shield-halved" },
        { label: "Access Control", icon: "fa-fingerprint" },
        { label: "Incident Desk", icon: "fa-triangle-exclamation" },
        { label: "Surveillance", icon: "fa-video" },
        { label: "Audit Logs", icon: "fa-file-lines" }
      ]
    }
  };

  const THEME_KEY = "ria-theme";
  const SIDEBAR_KEY = "ria-sidebar-collapsed";
  const ATTEMPT_KEY = "ria-3fa-attempts";
  const ACTIVE_KEY = "ria-3fa-active";
  const MAX_ATTEMPTS = 3;

  let attempts = Number.parseInt(localStorage.getItem(ATTEMPT_KEY), 10);
  if (Number.isNaN(attempts)) {
    attempts = 0;
  }

  let isActive = localStorage.getItem(ACTIVE_KEY);
  if (isActive === null) {
    isActive = true;
  } else {
    isActive = isActive === "true";
  }

  function applyTheme(theme, withTransition = false) {
    if (withTransition) {
      body.classList.add("theme-transition");
      window.setTimeout(() => body.classList.remove("theme-transition"), 300);
    }

    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
    } else {
      root.removeAttribute("data-theme");
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    }

    localStorage.setItem(THEME_KEY, theme);
  }

  function setPortal(portalKey) {
    const portal = portalConfig[portalKey] || portalConfig.hr;
    body.dataset.portal = portalKey;
    if (portalName) {
      portalName.textContent = portal.name;
    }

    portalButtons.forEach((btn) => {
      const isActiveBtn = btn.dataset.portal === portalKey;
      btn.classList.toggle("active", isActiveBtn);
      btn.setAttribute("aria-selected", isActiveBtn ? "true" : "false");
    });

    if (sidebarNav) {
      sidebarNav.innerHTML = portal.nav
        .map(
          (item, index) =>
            `<a class="nav-item ${index === 0 ? "active" : ""}" href="#">
              <i class="fas ${item.icon}"></i>
              <span class="nav-text">${item.label}</span>
            </a>`
        )
        .join("");
    }

    root.style.setProperty("--accent", portal.accent);
    root.style.setProperty("--accent-strong", portal.accentStrong);
    root.style.setProperty("--accent-soft", portal.accentSoft);
  }

  function updateLoginStatus(message, type) {
    attemptCountEl.textContent = attempts;
    accountStatusEl.textContent = isActive ? "Active" : "Locked";
    accountStatusEl.className = `status ${isActive ? "ok" : "danger"}`;
    isActiveFlagEl.textContent = isActive ? "True" : "False";

    if (message) {
      loginMessageEl.textContent = message;
    }
    loginMessageEl.classList.remove("success", "error");
    if (type) {
      loginMessageEl.classList.add(type);
    }
  }

  function persistAuthState() {
    localStorage.setItem(ATTEMPT_KEY, attempts.toString());
    localStorage.setItem(ACTIVE_KEY, isActive.toString());
  }

  function handleLogin(event) {
    event.preventDefault();
    if (!isActive) {
      updateLoginStatus("Account locked. Only IT SuperAdmin can re-enable access.", "error");
      addAuthLog("Login blocked - account inactive.", "danger");
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const employeeId = employeeIdInput.value.trim().toUpperCase();
    const password = passwordInput.value;

    const isValid =
      email === "it.admin@ria.gov.lr" &&
      employeeId === "LAA-0001" &&
      password === "Aviation#2026";

    if (isValid) {
      attempts = 0;
      updateLoginStatus("3FA verified. Secure session established.", "success");
      addAuthLog("3FA verification successful for IT SuperAdmin.", "success");
      loginForm.reset();
    } else {
      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) {
        isActive = false;
        updateLoginStatus("3-strike lockout applied. Account is inactive.", "error");
        addAuthLog("3-strike lockout enforced. Account disabled.", "danger");
      } else {
        updateLoginStatus("Invalid credentials. Attempts logged for IT review.", "error");
        addAuthLog(
          `Invalid 3FA attempt logged (${attempts}/${MAX_ATTEMPTS}).`,
          "warning"
        );
      }
    }

    persistAuthState();
  }

  function unlockAccount() {
    attempts = 0;
    isActive = true;
    persistAuthState();
    updateLoginStatus("Account re-enabled by IT SuperAdmin.", "success");
    addAuthLog("Account re-enabled by IT SuperAdmin.", "success");
  }

  function generateIdentity() {
    const id = Math.floor(1000 + Math.random() * 9000);
    const formattedId = `LAA-${id}`;
    identityIdEl.textContent = formattedId;
    identityEmailEl.textContent = `laa-${id}@ria.gov.lr`;
  }

  function applyStatPayload(payload) {
    if (!payload) {
      return;
    }
    Object.entries(payload.stats).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-updated]").forEach((el) => {
      el.textContent = `Updated ${payload.updated}`;
    });
  }

  function addLogEntry(listEl, entry) {
    if (!listEl || !entry) {
      return;
    }
    const item = document.createElement("li");
    const typeClass = entry.type ? ` ${entry.type}` : "";
    item.className = `log-item${typeClass}`;
    item.innerHTML = `
      <div class="log-meta">
        <span>${entry.time}</span>
        <span>${entry.source}</span>
      </div>
      <strong>${entry.title}</strong>
      <span class="muted">${entry.detail}</span>
    `;
    listEl.prepend(item);
    while (listEl.children.length > 6) {
      listEl.removeChild(listEl.lastElementChild);
    }
  }

  function formatTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addSecurityLog(event) {
    addLogEntry(securityLogEl, {
      ...event,
      time: formatTime(),
      source: "WebSocket"
    });
  }

  function addAuthLog(message, type = "success") {
    addLogEntry(authLogEl, {
      title: "3FA Gateway",
      detail: message,
      type,
      time: formatTime(),
      source: "Auth Service"
    });
  }

  function createMockSocket() {
    const target = new EventTarget();
    const statState = {};
    statTargets.forEach((stat) => {
      const currentValue = Number.parseInt(document.getElementById(stat.id)?.textContent, 10);
      statState[stat.id] = Number.isNaN(currentValue) ? stat.min : currentValue;
    });

    const timer = window.setInterval(() => {
      const timeLabel = formatTime();
      const stats = {};
      statTargets.forEach((stat) => {
        const delta = Math.floor(Math.random() * (stat.jitter * 2 + 1)) - stat.jitter;
        let nextValue = statState[stat.id] + delta;
        if (nextValue < stat.min) {
          nextValue = stat.min;
        }
        if (nextValue > stat.max) {
          nextValue = stat.max;
        }
        statState[stat.id] = nextValue;
        stats[stat.id] = nextValue;
      });

      target.dispatchEvent(
        new MessageEvent("message", {
          data: JSON.stringify({
            type: "stats",
            payload: { stats, updated: timeLabel }
          })
        })
      );

      if (Math.random() > 0.35) {
        const event = securityEvents[Math.floor(Math.random() * securityEvents.length)];
        target.dispatchEvent(
          new MessageEvent("message", {
            data: JSON.stringify({ type: "security", payload: event })
          })
        );
      }
    }, 3500);

    return {
      addEventListener: (...args) => target.addEventListener(...args),
      close: () => window.clearInterval(timer)
    };
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(promptText.value);
      copyStatus.textContent = "Prompt copied to clipboard.";
    } catch (error) {
      promptText.select();
      document.execCommand("copy");
      copyStatus.textContent = "Prompt copied via fallback method.";
    }
  }

  function closeDropdown() {
    if (!userDropdown || !userMenuBtn) {
      return;
    }
    userDropdown.classList.remove("open");
    userMenuBtn.setAttribute("aria-expanded", "false");
  }

  function toggleDropdown(event) {
    if (!userDropdown || !userMenuBtn) {
      return;
    }
    event.stopPropagation();
    const isOpen = userDropdown.classList.toggle("open");
    userMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(nextTheme, true);
    });
  }

  if (sidebarToggle) {
    const isCollapsed = localStorage.getItem(SIDEBAR_KEY) === "true";
    if (isCollapsed) {
      sidebar.classList.add("collapsed");
    }
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      localStorage.setItem(SIDEBAR_KEY, sidebar.classList.contains("collapsed"));
    });
  }

  portalButtons.forEach((btn) => {
    btn.addEventListener("click", () => setPortal(btn.dataset.portal));
  });

  if (userMenuBtn) {
    userMenuBtn.addEventListener("click", toggleDropdown);
  }

  document.addEventListener("click", (event) => {
    if (!userDropdown || !userMenuBtn) {
      return;
    }
    if (!userDropdown.contains(event.target) && !userMenuBtn.contains(event.target)) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdown();
    }
  });

  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      notificationBtn.classList.toggle("acknowledged");
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (unlockBtn) {
    unlockBtn.addEventListener("click", unlockAccount);
  }

  if (generateIdentityBtn) {
    generateIdentityBtn.addEventListener("click", generateIdentity);
  }

  if (copyPromptBtn) {
    copyPromptBtn.addEventListener("click", copyPrompt);
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);
  setPortal("hr");
  updateLoginStatus();
  generateIdentity();
  addAuthLog("Auth gateway online. Awaiting 3FA verification.", "success");
  addSecurityLog({
    title: "Secure stream connected",
    detail: "Live telemetry subscribed to /ws/security.",
    type: "success"
  });

  const mockSocket = createMockSocket();
  mockSocket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "stats") {
      applyStatPayload(data.payload);
    }
    if (data.type === "security") {
      addSecurityLog(data.payload);
    }
  });
});
