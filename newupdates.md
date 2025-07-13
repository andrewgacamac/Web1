# Website Expansion Plan

## Objective
Add "Residential" and "Commercial" service pages with consistent navigation and styling.

## Implementation Steps

### 1. Navigation Updates
- **Dropdown Menu Enhancement**
  - Add to all pages (index, about, portfolio, contact, faq)
  - New structure:
    ```html
    <div class="dropdown">
        <a href="#">Our Services ▾</a>
        <div class="dropdown-content">
            <a href="residential.html">Residential</a>
            <a href="commercial.html">Commercial</a>
        </div>
    </div>
    ```
- **Footer Updates**
  - Modify "Our Services" link in all footers to:
    ```html
    <li><a href="residential.html">Residential</a></li>
    <li><a href="commercial.html">Commercial</a></li>
    ```

### 2. CSS Additions
```css
/* Dropdown Styles */
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background: var(--text-light);
    min-width: 200px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    z-index: 1;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown-content a {
    color: var(--text-dark);
    padding: 12px 16px;
    display: block;
    text-decoration: none;
}

/* New Hero Variations */
.residential-hero,
.commercial-hero {
    padding: calc(var(--spacing-lg) * 2) var(--spacing-md) var(--spacing-lg);
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: var(--text-light);
    text-align: center;
}
```

### 3. New Page Templates
**residential.html**
- Use about.html structure with:
  - Unique hero section
  - Service-specific content
  - Updated page title
  - Same footer as other pages

**commercial.html**
- Mirror residential.html structure
- Commercial-focused content
- Maintain identical layout patterns

### 4. Required Edits
| File | Changes Needed |
|------|----------------|
| styles.css | Add dropdown styles + new hero classes |
| index.html | Update navigation + test dropdown |
| about.html | Update navigation + footer links |
| portfolio.html | Update navigation + footer links |
| contact.html | Update navigation + footer links |
| faq.html | Update navigation + footer links |

### 5. Quality Assurance
1. Cross-browser dropdown testing
2. Mobile menu functionality check
3. Footer consistency verification
4. Page load speed analysis
5. Broken link check

## Risk Mitigation
- Create backup before making changes
- Implement changes incrementally
- Test each navigation update separately