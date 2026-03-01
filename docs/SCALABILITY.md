# Scalability Notes

## Current Architecture

- **Monorepo**: Client (React) + Server (Express) in single repo.
- **Database**: PostgreSQL with Prisma ORM.
- **Stateless API**: JWT-based auth, no server-side session store.

## Horizontal Scaling

### API Servers
- Stateless design allows multiple API instances behind a load balancer.
- No in-memory session storage. JWT validation is CPU-only.
- Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are identical across instances.

### Database
- PostgreSQL supports connection pooling (e.g., PgBouncer).
- Prisma connection pool: configure `connection_limit` in DATABASE_URL.
- Read replicas for reporting queries (admin analytics, bus owner stats).

### Rate Limiting
- Current: In-memory rate limit (per instance). Under multiple instances, limit is multiplied.
- Production: Use Redis-backed rate limiter (e.g., `rate-limit-redis`) for global limits.

## Performance Considerations

### Indexes
- `Trip`: `(studentId, calendarDate)`, `(shiftId)`, `(scannedAt)`
- `DriverShift`: `(driverId, startTime)`, `(endTime)`
- `QRCode`: `(token)` unique

### Query Optimization
- Admin trips: Pagination (currently `take: 500`). Add cursor-based pagination for large datasets.
- Analytics: Consider materialized views or pre-aggregated tables for historical reports.

### Caching
- Student QR lookup: Consider short TTL cache (e.g., 60s) for high-scan scenarios.
- Admin dashboard: Cache analytics for 5–15 minutes.

## Deployment

- **Client**: Static build, serve via CDN (Vercel, Netlify, S3+CloudFront).
- **Server**: Containerized (Docker), deploy to Kubernetes or ECS.
- **Database**: Managed PostgreSQL (RDS, Cloud SQL, Supabase).

## Future Enhancements

- WebSocket for real-time scan feedback (optional).
- Queue (e.g., Bull/Redis) for async processing of heavy reports.
- Separate read/write DB for analytics workloads.
