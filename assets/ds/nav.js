/* ============================================================
   Agentic Network Design System v2 — nav.js
   Mobile menu + desktop dropdown behaviour for components.css.
   No dependencies. Progressive enhancement: content and links
   work without it; it only manages open/close state and focus.

   Markup contract:
     <button class="ds-menu-btn" data-ds-menu-btn
             aria-expanded="false" aria-controls="ds-menu">Menu</button>
     <div class="ds-menu-panel" id="ds-menu" data-ds-menu-panel>…</div>
   Desktop dropdowns:
     <li class="ds-hasdrop">
       <button data-ds-drop-btn aria-expanded="false">Section</button>
       <div class="ds-drop">…links…</div>
     </li>
   ============================================================ */
(function () {
  "use strict";

  /* — Mobile menu — */
  var btn = document.querySelector("[data-ds-menu-btn]");
  var panel = document.querySelector("[data-ds-menu-panel]");
  if (btn && panel) {
    var setMenu = function (open) {
      btn.setAttribute("aria-expanded", String(open));
      panel.setAttribute("data-open", String(open));
      if (open) {
        var first = panel.querySelector("a, button");
        if (first) first.focus();
      } else {
        btn.focus();
      }
    };
    var isOpen = function () {
      return btn.getAttribute("aria-expanded") === "true";
    };
    btn.addEventListener("click", function () { setMenu(!isOpen()); });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        btn.setAttribute("aria-expanded", "false");
        panel.setAttribute("data-open", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (isOpen() && !panel.contains(e.target) && !btn.contains(e.target)) {
        btn.setAttribute("aria-expanded", "false");
        panel.setAttribute("data-open", "false");
      }
    });
  }

  /* — Desktop dropdowns: click + Escape (hover/focus handled in CSS) — */
  document.querySelectorAll("[data-ds-drop-btn]").forEach(function (dropBtn) {
    var wrap = dropBtn.closest(".ds-hasdrop");
    if (!wrap) return;
    var setDrop = function (open) {
      dropBtn.setAttribute("aria-expanded", String(open));
      wrap.setAttribute("data-open", String(open));
    };
    dropBtn.addEventListener("click", function () {
      var open = wrap.getAttribute("data-open") === "true";
      document.querySelectorAll('.ds-hasdrop[data-open="true"]').forEach(function (w) {
        w.setAttribute("data-open", "false");
        var b = w.querySelector("[data-ds-drop-btn]");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      setDrop(!open);
    });
    wrap.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setDrop(false); dropBtn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) setDrop(false);
    });
  });

  /* — FAQ: mirror aria-expanded on <details> summaries — */
  document.querySelectorAll(".ds-faq details").forEach(function (d) {
    var s = d.querySelector("summary");
    if (!s) return;
    var sync = function () { s.setAttribute("aria-expanded", String(d.open)); };
    d.addEventListener("toggle", sync);
    sync();
  });
})();
