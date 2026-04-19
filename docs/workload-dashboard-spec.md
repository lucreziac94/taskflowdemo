# Feature Spec: Team Workload Dashboard

## Vision
Transform the Team page from a static directory into a live capacity planning tool. A PM checking team capacity before assigning new work can instantly see who's drowning and who has room — no clicking required. The "wow" moment: look at the team grid and immediately know the workload distribution across the entire team.

## Constraints
- **No time-based tracking or historical trends** — this is a current-state snapshot, not an analytics tool
- **No drag-and-drop reassignment** — if reassignment is added later, it uses dropdowns
- **No notification or alerting system** — shows overload visually, doesn't send messages
- **No task creation from the workload view** — view-only in V1; reassignment is a V2 consideration
- **Overload threshold:** fixed at 8+ tasks = overloaded (simple, predictable, easy to explain)

## Acceptance Criteria
1. **Overload flagging** — Members with 8+ tasks are visually flagged with color/icon warning (MOST CRITICAL)
2. **Workload view** — Team page has a "Workload" view toggle showing all members with task counts and priority breakdown (urgent/high/medium/low)
3. **Summary stats** — Row of summary numbers above the cards: total team tasks, average per member, number of overloaded members
4. **Three variant interaction models** — Expandable rows, slide-out panel, and modal deep-dive, accessible via tabs
5. **Single API call** — Dedicated `/api/team/workload` endpoint, no N+1 per-member requests
6. **Design token compliance** — All styling uses existing tokens from `tokens.css`
7. **Sorted by workload** — Cards sorted by task count descending; most loaded members float to top

## Edge Cases & Error States
- **Zero tasks:** Show member card with a green "Available" badge — zero tasks is a signal (available capacity), not an empty state
- **API failure:** Show a simple error message with a retry button
- **Overload boundary:** 7 tasks = normal display, 8 tasks = overloaded display (must be exact)

## Variant Directions

### Variant A: Expandable Rows
Click a member card and it expands inline to show their task list below.
- **Strongest argument:** No context switching — you see the detail right where the card is
- **Biggest risk:** Layout shift can feel jarring; expanding multiple members gets visually noisy
- **Interaction model:** Click card → card expands downward → task list appears inline → click again to collapse

### Variant B: Slide-Out Panel
Click a member and a panel slides in from the right showing their tasks.
- **Strongest argument:** You keep the team overview visible while drilling into one person
- **Biggest risk:** Reduces grid space on smaller screens; split attention between two views
- **Interaction model:** Click card → panel slides from right → team grid shrinks to accommodate → click X or another member to switch

### Variant C: Modal Deep-Dive
Click a member and a full modal opens with their complete workload breakdown.
- **Strongest argument:** Clear focus — you're looking at one person's workload, nothing else
- **Biggest risk:** Loses team context; frequent opening/closing gets tedious for comparing members
- **Interaction model:** Click card → modal opens centered → full task breakdown → close modal to return

## Test Plan

### Visual Verification
- Screenshot Team page before changes (baseline)
- Screenshot Workload view with all member cards loaded
- Screenshot overloaded member (Rachel) vs. available member side by side
- Screenshot each variant's detail interaction (expanded row, panel, modal)

### Functional Verification
- Workload view loads from Team page via a view toggle button
- Cards show correct task counts matching the database
- Overload indicator appears on members with 8+ tasks
- Cards are sorted by workload (highest first)
- Members with 0 tasks show green "Available" badge
- Summary stats display total team tasks and average per member
- All three variant tabs work and display the correct detail interaction

### Edge Case Verification
- API error shows message with retry button
- Member with 0 tasks renders with "Available" badge
- **Boundary test:** member with exactly 7 tasks = normal, member with exactly 8 tasks = overloaded
