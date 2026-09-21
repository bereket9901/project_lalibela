# Project Lalibela

An interactive, session-only web and mobile prototype for investigating suspected illegal mining activity in Ethiopia.

## Explore

The opening screen separates Admin Login and User Login. Sample credentials are prefilled. User Login offers System Operator, Dashboard Viewer and Field Inspector accounts. All sample passwords are `Lalibela2026!`; these are fictional accounts, not production authentication.

- **Administrator:** user creation/editing/activation, role assignments, model availability and GPS verification radius.
- **Dashboard Viewer:** read-only overview, map, case register, case history and reports.
- **System Operator:** image previews, simulated Qwen/Gemini/Claude analysis, findings review, case creation, inspector assignment and case closure.
- **Field Inspector:** own assignments on the web and an interactive mobile app with case details, navigation, device or explicitly simulated GPS, photographs, observations and inspection submission.

Cases follow New → Assigned → Under Inspection → Inspection Submitted → Closed. Inspection outcomes are stored independently. Case creation records a New event before any immediate assignment. AI results remain suspected violations until field verification.

## Demonstration flow

1. Sign in with the prefilled System Operator account.
2. Open Imagery & analysis; use the sample or upload a local JPEG/PNG/WebP.
3. Select models, run simulated analysis, mark a finding reviewed, create a case and assign Hana Bekele.
4. Switch account to Hana, open the field app and select that case.
5. Open GPS verification. Expand the demo scenarios and compare outside-radius and on-site states, or use device GPS.
6. Start the inspection, add observations, optional photographs and an outcome. Submit.
7. Switch back to the operator to review the submission and close the case. Check the report exports.

## Scope

All cases, users, scores and field outcomes are fictional sample data. Changes and local image previews last only for the current browser session and reset on reload. Role permissions are UI demonstrations. No production identity, shared database, native mobile binary, AI API integration or actual investigation is supplied. The private Sites access layer controls access to the prototype itself.

JPEG/PNG/WebP previews are supported. GeoTIFF ingestion is represented by the sample workflow. GPS checks use a configurable radius, a fix less than two minutes old, and distance plus reported accuracy; location failures prevent on-site submission. Phone GPS requires the browser's permission and may be unavailable in embedded contexts. Explicit demo GPS is recorded as simulated in the receipt.

## Imagery

Two real basemap exports are bundled locally so the mockups do not depend on third-party tile loading. Satellite capture dates have not been verified. The detail imagery is near Shakiso and is illustrative across the prototype; metadata dates and detection polygons are simulated, not factual evidence. Attribution: Esri, Vantor, Earthstar Geographics, and the GIS User Community. Source and exact extents: `public/basemap-sources.json`.

## Verification

- TypeScript and production build passed.
- Desktop overview visually reviewed in the browser; operator simulation, progress state, and review-before-case-creation gate exercised.
- GPS boundary, stale-fix, invalid-fix and accuracy checks passed; all initial Case IDs, roles and workflow outcomes checked for consistency.
- PDF and Excel generation verified and files reopened with independent readers.
- Browser connection failed during further interaction checks; the remainder of the mobile flow and admin screens were not visually tested end to end.
- Optional WebMCP case tools are feature-detected. Validation was unavailable because the preview browser did not expose `document.modelContext`.
