 # RIA Aviation Platform - Technical Manual

 ## Overview
 The RIA Aviation Platform is a high-security government aviation management system
 for Roberts International Airport (RIA). The platform enforces a zero-trust access
 model, system-generated identities, and department-isolated portals designed for
 mission-critical operations.

 ## Advanced Repository Structure
 ```
 ria_aviation_platform/
 ├── backend/ (Django - The Core)
 │   ├── core/                   # Settings, WSGI, Security Middleware
 │   ├── api/                    # REST API Endpoints
 │   ├── ai_assistant/           # "Siri-like" logic, TTS/STT, NLP
 │   ├── accounts/               # Custom User Model, 3FA, Lockout logic
 │   ├── departments/            # Module-based portals (HR, OPS, SEC)
 │   └── snowflake_connector/    # Data bridge to Snowflake
 ├── frontend/ (Modern UI)
 │   ├── assets/                 # Premium Icons, CSS (Shadow styles)
 │   ├── components/             # Sidebar, Topbar, Premium Cards
 │   └── templates/              # Portal-specific views
 ├── snowflake/ (Data Pipelines)
 │   ├── installer/              # Streamlit Installer (Overture Maps)
 │   ├── dashboard/              # Analytics Dashboard
 │   └── dbt/                    # Data transformation models
 ├── .env                        # Secrets (Aviationstack, GitHub, Snowflake)
 ├── docker-compose.yml          # Production deployment
 └── COMPREHENSIVE_README.md     # Technical Manual
 ```

 ## Security Model

 ### System-Generated Identity
 - Employees cannot self-register.
 - The IT Department provisions every user record.
 - The system auto-generates:
   - Employee ID: `LAA-XXXX`
   - Official email: `@ria.gov.lr`

 ### 3-Factor Authentication (3FA)
 Authentication requires three factors:
 1. Official system email
 2. Employee ID (LAA-XXXX)
 3. Password

 ### 3-Strike Account Lockout
 - After 3 failed login attempts, the account is locked.
 - `is_active` is set to `False` on the Django User model.
 - Lockout events are logged and escalated to IT.
 - Only a SuperAdmin (IT Department) can re-enable the account.

 ### Zero-Trust Middleware
 - Every request is verified for department scope and role access.
 - Sensitive operations require explicit policy validation.

 ## RBAC Department Portals
 Each department has an isolated portal with dedicated navigation and data access.
 - HR Portal: onboarding, staff registry, training compliance
 - Operations Portal: flight coordination, gate control, runway status
 - Security Portal: threat monitoring, access control, incident response

 ## AI Assistant: RIA-Voice
 A "Siri-like" voice assistant providing internal operational support.

 ### Capabilities
 - Text-to-Speech (TTS) and Speech-to-Text (STT)
 - Voice-command workflows for internal messaging and queries

 ### Guardrails
 - Never expose employee personal data.
 - Route account and technical issues to IT Admin.
 - Block system-level troubleshooting requests.

 ## Snowflake Integration
 - **Overture Maps - Base** for infrastructure visualization.
 - Automated ingestion for:
   - Aviationstack API
   - ADS-B historical data
 - DBT models for transformation and governance.

 ## Observability and Auditing
 - Centralized audit log for authentication, data access, and admin actions.
 - Alerts for lockouts, policy violations, and suspicious activity.

 ## Deployment (Production)
 Use Docker Compose for production deployment.
 - `docker-compose.yml` orchestrates backend, frontend, and data services.
 - Environment variables managed via `.env`.

 ## Environment Variables (Examples)
 ```
 DJANGO_SECRET_KEY=...
 DJANGO_ALLOWED_HOSTS=...
 SNOWFLAKE_ACCOUNT=...
 SNOWFLAKE_USER=...
 SNOWFLAKE_PASSWORD=...
 AVIATIONSTACK_API_KEY=...
 ADSB_API_KEY=...
 ```

 ## Master Prompt (AI Agent Bootstrap)
 ```
 I am building a high-security Government Aviation Management System for Roberts
 International Airport (RIA).

 Tech Stack: Django (Backend), Snowflake (Data Warehouse), Tailwind CSS (Frontend),
 and a Python-based Voice/Text AI Assistant.

 Core Security Requirements:

 Implement a Custom User Model with 3-Factor Authentication: Official Email
 (system-generated), EmployeeID (system-generated LAA-XXXX), and Password.

 Disable user registration. Only the 'IT Department' role can create accounts.

 Implement a '3-Strikes' lockout: if login fails 3 times, block the account and
 log the event for IT review.

 Create a Zero-Trust middleware: Each department (HR, Operations, Security) must
 have its own secure module and unique portal UI.

 AI Assistant (Siri-style):

 Build an AI module called 'RIA-Voice' using Text-to-Speech (TTS) and
 Speech-to-Text (STT).

 The AI must allow employees to 'Contact' peers via internal messaging through
 voice commands.

 Strict AI Guardrails: NEVER expose employee personal info. Refer all account/
 technical issues to 'IT Admin'. Do not allow the AI to troubleshoot system-level
 errors.

 UI/UX Specs:

 Create a standalone, stylish sidebar (Microsoft Edge style) with a
 collapse/expand toggle.

 Build a Topbar with Notification & User icons with premium shadow effects.

 Implement a 'Live Preview' dashboard with animated cards showing real-time data
 from Snowflake.

 Include a high-end Dark/Light mode toggle.

 Snowflake Integration:

 Integrate 'Overture Maps - Base' for infrastructure visualization.

 Set up automated ingestion for 'Aviationstack API' and 'ADS-B' historical data.

 Begin by generating the Django User Model and the 3FA login logic.
 ```
