# TODO

## Goal
Enable admins to click a **Blocked** slot in the court schedule and remove it (unblock).

## Plan
- [x] Implement DELETE endpoint for `/api/admin/bookings/block` to remove a blocked booking.

- [x] Update `src/app/admin/pages/courtSchedule.js` so clicking a blocked cell triggers a confirmation and calls the new endpoint.

- [x] Ensure the schedule refreshes after removal.

- [ ] Quick manual test: block creation still works; clicking blocked removes it; UI updates without reload.



