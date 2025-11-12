# UML Sequence Diagram — Doctor Consultation & Prescription

```mermaid
sequenceDiagram
    participant D as Doctor
    participant UI as Doctor Dashboard
    participant API as Next.js API
    participant DB as Database
    participant PDF as PDF Generator

    D->>UI: Open appointment
    UI->>API: GET /api/appointments/:id
    API->>DB: Query appointment + patient history
    DB-->>API: Appointment & patient data
    API-->>UI: Return data
    UI-->>D: Display patient profile + history

    D->>UI: Record consultation notes
    D->>UI: Add prescription medications
    UI->>API: POST /api/consultations {notes, medications}
    API->>DB: Insert consultation + prescription
    DB-->>API: Saved
    API-->>UI: Return consultation ID

    D->>UI: Request PDF generation
    UI->>API: POST /api/prescriptions/:id/pdf
    API->>PDF: Generate PDF (with patient + meds)
    PDF-->>API: PDF binary
    API->>DB: Store PDF URL/blob
    DB-->>API: Saved
    API-->>UI: Return PDF URL
    UI-->>D: Display download link
```

## Flow summary

1. Doctor opens appointment from calendar.
2. System loads patient history.
3. Doctor records consultation notes and adds medications.
4. Consultation and prescription are saved to database.
5. Doctor requests PDF; system generates and provides download link.
6. Patient can later download the prescription from their portal.
