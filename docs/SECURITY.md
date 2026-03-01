# Security Documentation

## Authentication & Authorization

### JWT Strategy
- **Access Token**: Short-lived, used for API requests. For drivers with active shift, expiration = `min(15m, shiftEndTime)`.
- **Refresh Token**: Invalidated at shift end for drivers. For other roles, 7-day expiry.
- **Secrets**: Stored in environment variables. Minimum 32 characters recommended.

### Role-Based Access Control
- **ADMIN**: Full CRUD, analytics, CSV export, cross-entity reports.
- **DRIVER**: Can only scan QR codes during active shift. Shift must be started explicitly.
- **BUS_OWNER**: Aggregated statistics only. No student PII.
- **STUDENT**: Passive role. No login. QR codes only work when scanned by authenticated driver.

### Driver Session Rules
1. Driver must log in every working day.
2. Driver must explicitly start shift via "Start Shift" button.
3. Token expiration = shift end time (dynamic, not fixed).
4. When shift ends: token invalid, QR scanning blocked immediately.
5. Middleware verifies: `role === DRIVER`, shift active, `current time ∈ working hours`.

## QR Code Scanning Security

### Allowed Only When
- Driver is authenticated
- Driver has active shift
- Driver is assigned to a bus

### Protections Implemented
- **QR Reuse (Photo Replay)**: Daily limit of 2 scans (TO + FROM) per student. Second scan of same direction blocks for the day.
- **Concurrent Scans**: Serializable transaction isolation with unique constraint `(studentId, calendarDate, direction)`.
- **Multiple Drivers**: Each scan creates immutable Trip record. Same QR can only be scanned once per direction per day.
- **Outside Shift**: `requireActiveDriverShift` middleware blocks all scan requests when shift expired.
- **Time Manipulation**: All timestamps in UTC. Calendar date computed server-side.
- **Unauthorized Access**: RBAC middleware on all routes.

### Rate Limiting
- Global: 100 requests/minute
- Scan endpoint: 30 scans/minute per IP

## Data Integrity

- **Trip Records**: Append-only. No updates or deletes.
- **Daily Constraints**: Enforced at DB level via `@@unique([studentId, calendarDate, direction])`.
- **Transactions**: Scan operations use `Serializable` isolation for race condition prevention.

## Audit Trail

- All trips logged with: studentId, driverId, busId, shiftId, direction, scannedAt (UTC).
- Immutable audit log. No deletion of historical data.
