-- DropIndex
DROP INDEX "boardings_studentId_busId_calendarDate_key";

-- CreateIndex
CREATE INDEX "boardings_studentId_calendarDate_idx" ON "boardings"("studentId", "calendarDate");
