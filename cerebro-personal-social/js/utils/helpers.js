// Placeholder for general utility functions

export function generateId() {
    // Simple ID generator (consider more robust solutions for real apps)
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { // Example for Spanish date format
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Debounce function (example)
export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

console.log('Helper utilities loaded');
