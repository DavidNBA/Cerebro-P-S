// Theme switching logic (light/dark mode)

const THEME_KEY = 'theme';
let currentTheme = 'light'; // Default theme, will be updated by loadTheme
let themeSwitcherButton = null; // Hold reference to the button

/**
 * Applies the given theme to the document and updates the switcher button.
 * @param {'light' | 'dark'} theme - The theme to apply.
 */
function applyTheme(theme) {
    currentTheme = theme;
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme + '-mode');

    if (themeSwitcherButton) {
        themeSwitcherButton.textContent = theme === 'light' ? 'Modo Oscuro' : 'Modo Claro';
    }
}

/**
 * Saves the chosen theme to localStorage.
 * @param {'light' | 'dark'} theme - The theme to save.
 */
function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

/**
 * Loads the theme from localStorage or system preference and applies it.
 */
export function loadTheme() {
    let initialTheme = localStorage.getItem(THEME_KEY);
    if (!initialTheme) {
        initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(initialTheme); // currentTheme is updated inside applyTheme
}

/**
 * Toggles the current theme between light and dark.
 */
export function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    saveTheme(newTheme);
    applyTheme(newTheme);
}

/**
 * Initializes the theme switcher button.
 * @param {string} buttonId - The ID of the theme switcher button.
 */
export function initThemeSwitcher(buttonId) {
    themeSwitcherButton = document.getElementById(buttonId); // Store button reference
    if (themeSwitcherButton) {
        // Initial text is set by applyTheme called from loadTheme
        themeSwitcherButton.addEventListener('click', toggleTheme);
    } else {
        console.warn(`Theme switcher button with ID "${buttonId}" not found.`);
    }
}

// Initialize theme when module is first loaded.
// loadTheme(); // This will be called from app.js after DOM is ready for button finding.
// It's better to call loadTheme explicitly in app.js to ensure document.body exists.
// However, if this script is deferred or type="module", body usually exists.
// For safety, app.js calling loadTheme is more robust.
// The previous version called it here, which is fine if script is at end of body or deferred.
// Let's stick to calling it from app.js as per current app.js structure.
// If app.js doesn't call loadTheme(), then it should be called here.
// The current app.js *does* call loadTheme().
console.log('Theme manager module loaded.');
