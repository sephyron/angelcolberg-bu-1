(function() {
    'use strict';

    var storageKey = 'portfolio-theme';

    function getSavedTheme() {
        try {
            return window.localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    }

    function applyTheme(theme) {
        var isLight = theme === 'light';
        document.body.classList.toggle('light-theme', isLight);

        document.querySelectorAll('[data-theme-toggle]').forEach(function(toggle) {
            var nextLabel = isLight ? 'Switch to dark mode' : 'Switch to light mode';
            var icon = toggle.querySelector('.theme-toggle-icon');

            toggle.setAttribute('aria-pressed', String(isLight));
            toggle.setAttribute('aria-label', nextLabel);
            toggle.setAttribute('title', nextLabel);

            if (icon) {
                icon.classList.toggle('icon-moon', isLight);
                icon.classList.toggle('icon-sun2', !isLight);
            }
        });
    }

    function saveTheme(theme) {
        try {
            window.localStorage.setItem(storageKey, theme);
        } catch (error) {
            return;
        }
    }

    function initialize() {
        applyTheme(getSavedTheme() || 'dark');

        new MutationObserver(function() {
            applyTheme(document.body.classList.contains('light-theme') ? 'light' : 'dark');
        }).observe(document.body, { childList: true, subtree: true });

        document.addEventListener('click', function(event) {
            var toggle = event.target.closest('[data-theme-toggle]');
            if (!toggle) return;

            var nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
            applyTheme(nextTheme);
            saveTheme(nextTheme);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();