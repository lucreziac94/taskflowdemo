# Scoping Brief: Team Workload Dashboard

## What You'd Need to Build

**1. New API endpoint: `GET /api/team/workload`**
A single endpoint that returns each team member with their task counts broken down by priority and status. Right now `GET /api/team` only returns member info (name, role, email) — no task data. You could hit `GET /api/team/:id/tasks` per member, but that's N+1 requests. A dedicated workload endpoint runs one SQL query with GROUP BY and returns everything the dashboard needs in a single call.

**2. New component: WorkloadCard**
Replaces or extends the existing `MemberCard` (`components/team/MemberCard.jsx`). Shows the same avatar/name/role, but adds: total task count, priority breakdown (urgent/high/medium/low counts), and an overload indicator (color coding or warning icon when someone has too many tasks or too many high-priority items).

**3. New component: WorkloadGrid (or enhanced MemberList)**
A grid of WorkloadCards with optional summary stats at the top (total team tasks, average per member, number of overloaded members). Follows the same `repeat(auto-fill, minmax(...))` grid pattern used by `MemberList` and `ProjectList`.

**4. Updated Team page**
`pages/Team.jsx` is currently 20 lines — fetches team members and renders MemberList. It would need to fetch workload data (new endpoint or combined calls) and render the new WorkloadGrid instead of the plain MemberList.

**5. (V2) Triage/reassignment panel**
Click into a member's workload to see their tasks and reassign them. This would use Modal + a task list filtered by assignee. The API already supports `GET /api/team/:id/tasks` and `PUT /api/tasks/:id` for reassignment — so the backend is mostly there, it's a frontend build.

## What Already Exists

| What | Where | How It Helps |
|------|-------|-------------|
| **MemberCard** | `components/team/MemberCard.jsx` | Avatar + initials logic, card styling — extend rather than rebuild |
| **MemberList** | `components/team/MemberList.jsx` | Grid layout pattern (auto-fill, minmax) — reuse directly |
| **Stats** | `components/dashboard/Stats.jsx` | Stat card pattern (label + big number) — reuse for workload summary |
| **Badge** | `components/common/Badge.jsx` | Priority color mapping already built — reuse for priority breakdown |
| **useTeam hook** | `hooks/useTeam.js` | Team data fetching — extend or create parallel useWorkload hook |
| **useApi hook** | `hooks/useApi.js` | Generic fetch pattern — use for the new endpoint |
| **GET /api/team/:id/tasks** | `server/routes/teams.js` | Per-member task list already exists — useful for triage panel |
| **PUT /api/tasks/:id** | `server/routes/tasks.js` | Task update with partial fields (COALESCE) — reassignment is just `{ assignee_id: newId }` |
| **Priority tokens** | `styles/tokens.css` | `--color-priority-urgent/high/medium/low` already defined |
| **Warning/error tokens** | `styles/tokens.css` | `--color-warning`, `--color-error` + light variants for overload indicators |

## Dependencies & Unknowns

- **What counts as "overloaded"?** The notes say Rachel has 14 tasks and James has 3 — but there's no defined threshold. Is it a fixed number (>10 tasks)? Relative to the team average? Based on estimated hours vs. capacity? This needs a product decision before building the overload indicator.
- **Should estimated_hours factor in?** The tasks table has an `estimated_hours` column. 5 tasks at 2 hours each is very different from 5 tasks at 20 hours each. Whether to use task count or total hours changes the complexity of the workload calculation.
- **Triage scope:** The notes mention "click into someone's workload and see what could be reassigned" but flag it as maybe-V2. Deciding this up front affects whether WorkloadCard needs to be clickable and whether Modal integration is part of the initial build.

## Where the Difficulty Is

**Straightforward pieces:**
- The WorkloadCard component is a natural extension of MemberCard — same card pattern, same avatar logic, just more data displayed. The Stats component already shows the "label + number" pattern you'd reuse for priority breakdowns.
- The Team page update is minimal — it's 20 lines of code today and the pattern for fetching + rendering is identical to what's already there.
- Badge already maps priority values to colors, so showing priority breakdowns with color coding is plug-and-play.

**Where the real work is:**
- **The workload API endpoint** is the most important new piece. You need a SQL query that joins `team_members` with `tasks`, groups by member, and counts by priority. This is straightforward SQL but it's new server-side code that doesn't exist yet — every other piece depends on it returning the right data shape.
- **The overload logic** is a product + design problem more than a code problem. The code to apply a warning color is trivial once you decide the rule. But "too many tasks" needs a definition — and that definition shapes the entire dashboard's usefulness.
- **The triage panel (if V1)** is the biggest build. It needs a modal, a filtered task list, reassignment dropdowns, and API calls to update tasks — each piece exists individually, but wiring them together into a smooth interaction is the most complex frontend work in this feature.
