# VIT System (WMS/TMS/HR Platform)

## Overview
The VIT System hosts multiple operational modules:
- **WMS (Warehouse Management System):** Warehouse-facing pages and applications.
- **TMS (Transport Management System):** Driver and transport workflows.
- **HR:** Human resources front-end (placeholder).
- **VIT Portal:** Super admin portal for multi-tenant oversight.

Current HTML, CSS, and JavaScript assets placed in `public/` are the source of truth for the neon-themed implementation. Logic rewrites and refactors will happen later; for now the files are preserved as-is.

## Folder Structure
```
public/
  index.html           # Landing entry
  company.html         # Multi-step company login
  demo.html            # Demo entry point
  assets/              # Shared static assets (styles, scripts, config, logo)
  WMS/                 # Warehouse Management System pages
  TMS/                 # Transport Management System pages
  HR/                  # Human Resources placeholder
  VIT_PORTAL/          # Super admin portal pages
```

## Deployment (Firebase Hosting)
1. Install Firebase CLI and authenticate: `firebase login`.
2. Initialize hosting in the repository root if not already configured: `firebase init hosting`.
3. Set the public directory to `public` and disable automatic rewrites unless needed.
4. Deploy the static site: `firebase deploy --only hosting`.

## Notes
- Do not alter Firebase configuration values inside `public/assets/firebase-config.js`.
- Uploaded files inside `public/` represent the current production state and should remain unchanged unless explicitly updated later.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
