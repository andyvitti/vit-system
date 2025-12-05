# VIT System (WMS/TMS/HR Platform)

## Overview
The VIT System hosts multiple operational modules:
- **WMS (Warehouse Management System):** Warehouse-facing pages and applications.
- **TMS (Transport Management System):** Driver and transport workflows.
- **HR:** Human resources front-end.
- **VIT Portal:** Portal-facing login and portal pages.

Current HTML, CSS, and JavaScript assets placed in `public/` are the source of truth from the existing implementation. Logic rewrites and refactors will happen later; for now the files are preserved as-is.

## Folder Structure
```
public/
  assets/            # Shared static assets (e.g., images, configuration files)
  WMS/               # Warehouse Management System pages
  TMS/               # Transport Management System pages
  HR/                # Human Resources pages
  VIT_PORTAL/        # Portal-specific pages
  index.html         # Root landing page
  demo.html          # Demo entry point
```

## Deployment (Firebase Hosting)
1. Install Firebase CLI and authenticate: `firebase login`.
2. Initialize hosting in the repository root if not already configured: `firebase init hosting`.
3. Set the public directory to `public` and disable automatic rewrites unless needed.
4. Deploy the static site: `firebase deploy --only hosting`.

## Notes
- Do not alter Firebase configuration values or application logic until the rewrite phase.
- Uploaded files inside `public/` represent the current production state and should remain unchanged unless explicitly updated later.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
