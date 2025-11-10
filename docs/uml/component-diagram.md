# UML Component Diagram — MedFlow Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[Next.js Pages<br/>React Components]
    end
    
    subgraph "API Layer"
        API[Next.js API Routes]
        Auth[Auth.js / NextAuth]
        Validation[Zod Validation]
    end
    
    subgraph "Business Logic"
        PatientService[Patient Service]
        AppointmentService[Appointment Service]
        BillingService[Billing Service]
        PrescriptionService[Prescription Service]
    end
    
    subgraph "Data Layer"
        ORM[Prisma ORM]
        DB[(PostgreSQL/MySQL)]
    end
    
    subgraph "External Services"
        Stripe[Stripe Payments]
        Email[Email Service]
        PDFGen[PDF Generator]
    end
    
    UI --> API
    API --> Auth
    API --> Validation
    API --> PatientService
    API --> AppointmentService
    API --> BillingService
    API --> PrescriptionService
    
    PatientService --> ORM
    AppointmentService --> ORM
    BillingService --> ORM
    PrescriptionService --> ORM
    
    ORM --> DB
    
    BillingService --> Stripe
    AppointmentService --> Email
    PrescriptionService --> PDFGen
    
    style UI fill:#e3f2fd
    style API fill:#fff3e0
    style DB fill:#f3e5f5
```

## Component descriptions

- **UI (Next.js Pages)**: Client-side rendering, server components, forms, tables.
- **API Routes**: REST endpoints for CRUD operations and business workflows.
- **Auth.js**: Authentication and session management with role-based access control.
- **Zod Validation**: Schema validation for request payloads.
- **Services**: Business logic separated by domain (Patient, Appointment, Billing, Prescription).
- **Prisma ORM**: Type-safe database access and migrations.
- **Database**: PostgreSQL or MySQL for persistent storage.
- **Stripe**: Payment processing in test mode.
- **Email Service**: Appointment confirmations and notifications.
- **PDF Generator**: Prescription export to PDF.
