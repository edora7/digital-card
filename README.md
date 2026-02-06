# RIA Aviation Platform UI (Demo)

High-assurance, premium UI mock for a government aviation management system.
This single-page frontend demonstrates the visual architecture and security
flows described in the specification.

## Highlights

- Glassmorphism sidebar with collapse-to-icons toggle
- Centered topbar search, notification pulse, and user dropdown
- Persistent light/dark theme toggle (localStorage)
- Live updating dashboard stats (simulated WebSocket updates)
- Live security stream + 3FA audit trail
- 3-Factor Authentication demo with 3-strike lockout and IT unlock
- System-generated identity preview (LAA-XXXX + @ria.gov.lr)
- RBAC portal switcher with department-specific navigation
- Master prompt preview for the AI agent

## Demo credentials (3FA)

- Email: `it.admin@ria.gov.lr`
- Employee ID: `LAA-0001`
- Password: `Aviation#2026`

## Run

Open `index.html` in your browser. No build step required.

## Technical manual

See `COMPREHENSIVE_README.md` for the full architecture and security model.
