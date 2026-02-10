
# 🔮 Future Features: Staff Scheduling & Leave Management

## 1. Staff Availability Logic

### Current System (Phase 1-2)
- Staff are either **Active** or **On Leave** (simple boolean flag `isActive`).
- Availability is determined by checking *Booking Conflicts* (if staff has a booking, they are busy).

### Planned Feature (Phase 4+)
- Implement **Flexible Schedules** (e.g., Staff A works Mon-Fri 10-18, Staff B works weekends).
- Implement **Leave Types** (Sick, Vacation, Personal).
- Allow admin to set "Block Out Dates" for specific staff.

## 2. Implementation Plan

### Step 1: Database Schema Update
Add new tables to `schema.prisma`:

```prisma
model StaffSchedule {
  id        Int      @id @default(autoincrement())
  staffId   Int
  staff     Staff    @relation(fields: [staffId], references: [id])
  dayOfWeek Int      // 0=Sun, 1=Mon...
  startTime String   // e.g. "10:00"
  endTime   String   // e.g. "18:00"

  @@unique([staffId, dayOfWeek])
}

model StaffLeave {
  id        Int      @id @default(autoincrement())
  staffId   Int
  staff     Staff    @relation(fields: [staffId], references: [id])
  startDate DateTime
  endDate   DateTime
  reason    String?
}
```

### Step 2: API Logic Update (`/api/availability`)

Modify the availability check to consider schedules and leaves:

1.  **Check Schedule**: Is the staff working on this *Day of Week*?
2.  **Check Leave**: Is the requested date within any `StaffLeave` range?
3.  **Check Bookings**: (Existing logic) Is there a conflict?

### Step 3: Admin UI (`/admin/staff`)

- **List View**: Staff names with current status.
- **Schedule Editor**: Grid view (Mon-Sun) to toggle working hours.
- **Leave Request**: Form to add leave dates.
- **Calendar View**: Visual representation of staff availability.

## 3. Benefits

- **Better Resource Management**: Prevent bookings on off-days.
- **Automated Rules**: Reduce manual coordination.
- **Customer Satisfaction**: Accurate availability shown to customers.
