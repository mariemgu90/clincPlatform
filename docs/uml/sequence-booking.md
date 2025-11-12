# UML Sequence Diagram — Patient Booking Flow

```mermaid
sequenceDiagram
    participant P as Patient
    participant UI as Patient Portal
    participant API as Next.js API
    participant DB as Database

    P->>UI: Open booking page
    UI->>API: GET /api/services
    API->>DB: Query available services
    DB-->>API: Services list
    API-->>UI: Return services
    UI-->>P: Display services

    P->>UI: Select service, date, time
    UI->>API: GET /api/availability?date=...
    API->>DB: Query doctor availability
    DB-->>API: Available slots
    API-->>UI: Return slots
    UI-->>P: Display available slots

    P->>UI: Confirm booking
    UI->>API: POST /api/appointments {patientId, serviceId, slot}
    API->>DB: Insert appointment
    DB-->>API: Appointment created
    API-->>UI: Return appointment ID
    UI-->>P: Show confirmation & send email
```

## Flow summary

1. Patient opens portal and views available services.
2. Patient selects service, date and time.
3. System queries doctor availability for that date.
4. Patient confirms booking.
5. Appointment is stored and confirmation is sent.
