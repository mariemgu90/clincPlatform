/*
  Warnings:

  - Added the required column `doctorId` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prescription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medications" JSONB NOT NULL,
    "diagnosis" TEXT,
    "notes" TEXT,
    "pdfUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "consultationId" TEXT,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL DEFAULT 'temp-doctor-id',
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prescription_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
-- Copy old data and try to get doctorId from consultation
INSERT INTO "new_Prescription" ("consultationId", "createdAt", "expiresAt", "id", "issuedAt", "medications", "notes", "patientId", "pdfUrl", "updatedAt", "doctorId") 
SELECT 
  "Prescription"."consultationId", 
  "Prescription"."createdAt", 
  "Prescription"."expiresAt", 
  "Prescription"."id", 
  "Prescription"."issuedAt", 
  "Prescription"."medications", 
  "Prescription"."notes", 
  "Prescription"."patientId", 
  "Prescription"."pdfUrl", 
  "Prescription"."updatedAt",
  COALESCE(
    (SELECT "Consultation"."doctorId" FROM "Consultation" WHERE "Consultation"."id" = "Prescription"."consultationId"),
    (SELECT "id" FROM "User" WHERE "role" = 'DOCTOR' LIMIT 1),
    'temp-doctor-id'
  ) as "doctorId"
FROM "Prescription";
DROP TABLE "Prescription";
ALTER TABLE "new_Prescription" RENAME TO "Prescription";
CREATE INDEX "Prescription_consultationId_idx" ON "Prescription"("consultationId");
CREATE INDEX "Prescription_patientId_idx" ON "Prescription"("patientId");
CREATE INDEX "Prescription_doctorId_idx" ON "Prescription"("doctorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
