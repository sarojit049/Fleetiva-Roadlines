# UX Redesign Rationale

This document outlines the rationale behind the recent UX overhaul and provides guidelines for maintaining the new clean, modern aesthetic.

## Goals

1.  **Clarity**: Reduce visual noise and focus on critical information (e.g., earnings, shipment status).
2.  **Modern Aesthetics**: Implement a premium feel using a consistent color palette, subtle shadows, and spacious layouts.
3.  **Responsiveness**: Ensure all new components work seamlessly across different screen sizes.
4.  **Accessibility**: Improve contrast and use semantic HTML for better screen reader support.

## Key Changes

### 1. Dashboard & Navigation
- Replaced cluttered navigation with a streamlined layout.
- Introduced `Skeleton` components for better perceived performance during data loading.

### 2. Stats & Analytics
- Redesigned the `Stats` page to use a grid-based layout for earnings.
- Added "Future Estimation" cards to provide proactive value to users.
- Standardized currency formatting across the application.

### 3. Tenant Management
- Revamped the tenant management UI to be more intuitive, with clear activation/deactivation workflows.
- Improved error handling and feedback for administrative actions.

## Guidelines for New Components

- **Spacing**: Use a consistent 8px/16px/24px spacing scale.
- **Typography**: Stick to the predefined heading hierarchy (`h1` for page titles, `h2` for sections).
- **Feedback**: Always provide optimistic UI updates or clear loading/error states using the new design tokens.
- **Colors**: Use the curated HSL palette defined in the global CSS.
