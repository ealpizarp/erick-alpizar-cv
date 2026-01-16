(() => {
  const SELECTORS = {
    navToggle: "#nav-toggle",
    navMenu: "#nav-menu",
    navLink: ".nav__link",
    sectionWithId: "section[id]",
    scrollTop: "#scroll-top",
    themeButton: "#theme-button",
    skillsButton: "#skills-button",
    skillsSection: "#skills",
    skillsItems: ".skills__name.showmore",
    resumeButton: "#resume-button",
    resumeArea: "#area-cv",
  };

  const CLASS_NAMES = {
    showMenu: "show-menu",
    activeLink: "active-link",
    showScroll: "show-scroll",
    darkTheme: "dark-theme",
    iconTheme: "bx-sun",
    show: "show",
    hide: "hide",
    scaleCv: "scale-cv",
  };

  const STORAGE_KEYS = {
    theme: "selected-theme",
    icon: "selected-icon",
  };

  const TEXT = {
    seeMore: "See More",
    seeLess: "See Less",
  };

  const PDF_OPTIONS = {
    margin: 1,
    filename: "Curriculum Erick Alpizar",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 4 },
    jsPDF: { format: "a4", orientation: "portrait" },
  };

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));
  const on = (element, event, handler) => {
    if (element) {
      element.addEventListener(event, handler);
    }
  };

  /*==================== SHOW MENU ====================*/
  const initMenuToggle = () => {
    const toggle = qs(SELECTORS.navToggle);
    const nav = qs(SELECTORS.navMenu);

    if (!toggle || !nav) {
      return;
    }

    on(toggle, "click", () => {
      const isExpanded = nav.classList.contains(CLASS_NAMES.showMenu);
      nav.classList.toggle(CLASS_NAMES.showMenu);
      toggle.setAttribute("aria-expanded", !isExpanded);
    });
  };

  /*==================== REMOVE MENU MOBILE ====================*/
  const initMobileMenuClose = () => {
    const navLinks = qsa(SELECTORS.navLink);
    const navMenu = qs(SELECTORS.navMenu);

    if (!navMenu) {
      return;
    }

    navLinks.forEach((link) => {
      on(link, "click", () => {
        navMenu.classList.remove(CLASS_NAMES.showMenu);
      });
    });
  };

  /*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
  const initScrollActive = () => {
    const sections = qsa(SELECTORS.sectionWithId);

    const onScroll = () => {
      const scrollY = window.scrollY;

      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 50;
        const sectionId = section.getAttribute("id");
        const link = qs(`${SELECTORS.navMenu} a[href*="${sectionId}"]`);

        if (!link) {
          return;
        }

        const isActive =
          scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;
        link.classList.toggle(CLASS_NAMES.activeLink, isActive);
      });
    };

    window.addEventListener("scroll", onScroll);
  };

  /*==================== SHOW SCROLL TOP ====================*/
  const initScrollTop = () => {
    const scrollTop = qs(SELECTORS.scrollTop);

    on(window, "scroll", () => {
      if (!scrollTop) {
        return;
      }
      scrollTop.classList.toggle(CLASS_NAMES.showScroll, window.scrollY >= 200);
    });
  };

  /*==================== DARK LIGHT THEME ====================*/
  const initThemeToggle = () => {
    const themeButton = qs(SELECTORS.themeButton);
    if (!themeButton) {
      return;
    }

    const selectedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    const selectedIcon = localStorage.getItem(STORAGE_KEYS.icon);

    const getCurrentTheme = () =>
      document.body.classList.contains(CLASS_NAMES.darkTheme)
        ? "dark"
        : "light";
    const getCurrentIcon = () =>
      themeButton.classList.contains(CLASS_NAMES.iconTheme)
        ? "bx-moon"
        : "bx-sun";

    if (selectedTheme) {
      document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        CLASS_NAMES.darkTheme
      );
      themeButton.classList[selectedIcon === "bx-moon" ? "add" : "remove"](
        CLASS_NAMES.iconTheme
      );
    }

    on(themeButton, "click", () => {
      document.body.classList.toggle(CLASS_NAMES.darkTheme);
      themeButton.classList.toggle(CLASS_NAMES.iconTheme);
      localStorage.setItem(STORAGE_KEYS.theme, getCurrentTheme());
      localStorage.setItem(STORAGE_KEYS.icon, getCurrentIcon());
    });
  };

  /*==================== SEE MORE ====================*/
  const initSkillsToggle = () => {
    const skillsButton = qs(SELECTORS.skillsButton);
    const skillsSection = qs(SELECTORS.skillsSection);
    const skillsItems = qsa(SELECTORS.skillsItems);

    if (!skillsButton || !skillsSection) {
      return;
    }

    on(skillsButton, "click", (event) => {
      event.preventDefault();
      const isExpanded = skillsSection.classList.contains(CLASS_NAMES.show);
      skillsButton.textContent = isExpanded ? TEXT.seeMore : TEXT.seeLess;
      skillsSection.classList.toggle(CLASS_NAMES.show);
      skillsSection.classList.toggle(CLASS_NAMES.hide);
      skillsItems.forEach((item) => {
        item.classList.toggle(CLASS_NAMES.hide);
        item.classList.toggle(CLASS_NAMES.show);
      });
    });
  };

  /*==================== REDUCE THE SIZE AND PRINT ON AN A4 SHEET ====================*/
  const scaleCv = () => document.body.classList.add(CLASS_NAMES.scaleCv);

  /*==================== REMOVE THE SIZE WHEN THE CV IS DOWNLOADED ====================*/
  const removeScale = () => document.body.classList.remove(CLASS_NAMES.scaleCv);

  /*==================== GENERATE PDF ====================*/
  const initPdfGenerator = () => {
    const areaCv = qs(SELECTORS.resumeArea);
    const resumeButton = qs(SELECTORS.resumeButton);

    if (!areaCv || !resumeButton) {
      return;
    }

    const generateResume = () => {
      // Use browser's native print functionality for text-selectable PDFs
      // This ensures AI recruiters and ATS systems can parse the content
      scaleCv();

      // Wait for scaling to apply, then trigger print
      setTimeout(() => {
        // Store original title
        const originalTitle = document.title;
        // Don't set a custom title to avoid filename metadata
        // document.title = PDF_OPTIONS.filename;

        // Trigger browser's print dialog (user can save as PDF)
        // This generates a text-selectable PDF that AI recruiters can parse
        // Note: Users should disable headers/footers in print dialog to remove date/filename
        window.print();

        // Restore original title after a delay
        setTimeout(() => {
          document.title = originalTitle;
          removeScale();
        }, 1000);
      }, 100);
    };

    on(resumeButton, "click", generateResume);
  };

  initMenuToggle();
  initMobileMenuClose();
  initScrollActive();
  initScrollTop();
  initThemeToggle();
  initSkillsToggle();
  initPdfGenerator();
})();
