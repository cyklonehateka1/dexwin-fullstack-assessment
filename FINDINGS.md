## Finding: Controller layer bypasses service abstraction

- Location: /workspaces/dexwin-fullstack-assessment/backend/src/main/java/com/dexwin/taskflow/controller/AuthController.java
- Status: deferred
- Evidence: the controller calls `UserRepository` directly instead of delegating to a service.
- Impact: The controller is harder to test and maintain; business logic is mixed into the HTTP layer.
- Priority: Medium
- Proposed solution: Extract authentication logic into an `AuthService` and keep the controller focused on request/response translation.
- Verification: Unit-level service tests would confirm the logic remains isolated from web concerns.
- Implementation notes: This is architecturally useful, but it does not block the user-facing task flow.

## Finding: Task board was mutating stale state and not refreshing on project change

- Location: /workspaces/dexwin-fullstack-assessment/frontend/src/components/TaskBoard.tsx
- Status: fixed
- Evidence: the board used `setTasks(tasks)` on a stale closure, and the effect only ran once instead of when a project changed.
- Impact: The UI stayed stale until a full page refresh, which made task status updates feel broken.
- Priority: High
- Proposed solution: Re-fetch when the selected project changes and update local state from the current list instead of the stale closure.
- Verification: TypeScript diagnostics report no errors in the board component; the list now reflects the active `projectId` without a full refresh.
- Implementation notes: `TaskBoard` now optimistically updates the matching task and reverts on API failure without sending duplicate requests.

## Finding: Task titles were not rendered because the UI used the wrong field

- Location: /workspaces/dexwin-fullstack-assessment/frontend/src/components/TaskItem.tsx
- Status: fixed
- Evidence: the backend returns `title`, while the component rendered `task.name`, so the title text never appeared.
- Impact: Users could not see the actual task names on the board.
- Priority: High
- Proposed solution: Render `task.title ?? task.name ?? 'Untitled task'` and keep the field mapping aligned with the API contract.
- Verification: The task card now displays the API title directly and the UI no longer blanks out task names.
- Implementation notes: This was a contract mismatch between the REST model and the frontend view.

## Finding: Only TODO and DONE states were exposed in the UI

- Location: /workspaces/dexwin-fullstack-assessment/frontend/src/components/TaskItem.tsx
- Status: fixed
- Evidence: the toggle logic only cycled between `TODO` and `DONE`, even though the backend enum includes `IN_PROGRESS`.
- Impact: Users could not correctly represent in-progress work.
- Priority: High
- Proposed solution: Expose a status control that supports `TODO`, `IN_PROGRESS`, and `DONE` directly.
- Verification: The task card now uses a dropdown selector for all three valid statuses and sends the selected enum back to the API.
- Implementation notes: The UI matches the backend model instead of silently restricting valid workflows.

## Finding: Unassigned tasks were rendered as empty metadata

- Location: /workspaces/dexwin-fullstack-assessment/frontend/src/components/TaskItem.tsx
- Status: fixed
- Evidence: `task.assignee` was only rendered when present, leaving no placeholder for null assignees.
- Impact: Users could not tell whether a task had no assignee or the data was missing.
- Priority: Medium
- Proposed solution: Render an explicit `Unassigned` chip when the assignee is null.
- Verification: The row now shows a visible placeholder rather than an empty metadata spot.
- Implementation notes: This keeps the card readable even when backend data has no assignee.

## Finding: Network flow created redundant update behavior

- Location: /workspaces/dexwin-fullstack-assessment/frontend/src/components/TaskBoard.tsx
- Status: fixed
- Evidence: the toggle logic modified task state from a stale closure and did not keep the board state aligned with the API.
- Impact: Users saw delayed or stale status changes, especially when switching projects or updating statuses.
- Priority: High
- Proposed solution: Keep a single status update request per action and update the visible board state immediately from the current list.
- Verification: The task board now updates exactly once per user status change and reverts cleanly if the API call fails.
- Implementation notes: Avoiding unnecessary re-fetches prevents duplicate request patterns while keeping the board responsive.