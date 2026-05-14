---
name: vanilla-frontend
description: Frontend development rules for Vanilla HTML, CSS, and JS without a framework.
---

# Skill: Vanilla Frontend Development

## 🚨 Critical Rules

1.  **No Frameworks**:
    - **ALWAYS** use standard Vanilla HTML, CSS, and JavaScript.
    - **NEVER** use React, Vue, Svelte, TailwindCSS, Bootstrap, or any other framework/library unless explicitly specified.

2.  **DOM Manipulation**:
    - Use `document.getElementById()`, `document.querySelector()`, and `document.createElement()`.
    - Handle state changes by directly updating the DOM or storing data in local variables and re-rendering specific sections.

3.  **Event Handling**:
    - Add event listeners using `element.addEventListener()`.
    - Ensure listeners are attached after the DOM has loaded (e.g., using `DOMContentLoaded`).

4.  **CSS and Theming**:
    - This project uses a "CoinMarketCap dark-theme portfolio tracker style."
    - **ALWAYS** use CSS custom properties (variables) for colors, spacing, and fonts in `index.css`.
    - Ensure responsive design using standard CSS media queries.

5.  **JavaScript Modules**:
    - Use ES modules (`import` / `export`) to keep code organized and separated by concern (e.g., api calls, ui updates, chart logic).

## ✅ Correct Implementation Example

```javascript
// js/ui.js
export function updatePortfolioValue(value) {
    const valueElement = document.getElementById('portfolio-total');
    if (valueElement) {
        valueElement.textContent = `$${value.toFixed(2)}`;
    }
}

// js/main.js
import { updatePortfolioValue } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialization logic
    fetchDataAndUpdateUI();
});
```
