# Database Seed - Complete Test Data

## Overview
The database has been populated with comprehensive, realistic test data across **3 clinics** to facilitate thorough testing of the multi-tenant clinic management platform.

## How to Re-seed
```bash
node prisma/seed.js
```

---

## 📊 Database Contents Summary

### Clinics (3)
1. **MedFlow Clinic** - Main clinic with full staff
2. **City Health Center** - Secondary clinic with specialized services
3. **Elite Medical Center** - Premium clinic with extended hours

### Users (11 staff members)
- **3 Admins** (1 per clinic - Clinic 2 has no admin)
- **6 Doctors** (2 per clinic)
- **2 Receptionists** (Clinic 1 and 2 only)

### Patients (12 total)
- **2 patients with user accounts** (can log in) - Clinic 1
- **10 patients without accounts** (walk-in patients)

### Services (17 total)
- **Clinic 1**: 5 services (General, Specialist, Follow-up, Certificate, Vaccination)
- **Clinic 2**: 6 services (Cardiology, Pediatrics, Dental, Therapy, X-Ray, Blood Test)
- **Clinic 3**: 6 services (Dermatology, Orthopedic, Neurology, Ultrasound, ECG, Annual Checkup)

### Appointments (18 total)
- **Status distribution**: Scheduled, Confirmed, Completed, Cancelled
- **Time spread**: Yesterday, Today, Tomorrow, Next Week
- **1 with consultation and prescription** (completed appointment)

### Invoices (8 total)
- **Status**: Paid (4), Pending (3), Overdue (1)
- Distributed across all 3 clinics

### Notifications (8)
- Appointment reminders, payment reminders, system notifications

---

## 🔐 Login Credentials

**Default Password for ALL accounts**: `password123`

### CLINIC 1 - MedFlow Clinic
| Role | Email | Name | Notes |
|------|-------|------|-------|
| Admin | admin@medflow.com | Admin User | Full access |
| Doctor | dr.smith@medflow.com | Dr. Sarah Smith | Has completed appointments |
| Doctor | dr.jones@medflow.com | Dr. John Jones | Has scheduled appointments |
| Receptionist | reception@medflow.com | Maria Garcia | Front desk |
| Patient | lina.benali@email.com | Lina Ben Ali | Has upcoming appointment |
| Patient | ahmed.mohamed@email.com | Ahmed Mohamed | Has pending invoice |

### CLINIC 2 - City Health Center
| Role | Email | Name | Specialty |
|------|-------|------|-----------|
| Doctor | dr.hassan@cityhc.com | Dr. Hassan Mansour | Cardiology |
| Doctor | dr.amira@cityhc.com | Dr. Amira Khaled | Pediatrics |
| Receptionist | reception@cityhc.com | Salma Najjar | Front desk |

### CLINIC 3 - Elite Medical Center
| Role | Email | Name | Specialty |
|------|-------|------|-----------|
| Admin | admin@elitemc.com | Rami Abidi | Full access |
| Doctor | dr.youssef@elitemc.com | Dr. Youssef Ezzedine | Dermatology |
| Doctor | dr.leila@elitemc.com | Dr. Leila Hadded | Orthopedics |

---

## 📅 Test Scenarios by Clinic

### CLINIC 1 - MedFlow Clinic
#### Patients (6 total)
1. **Lina Ben Ali** (User Account) - Female, A+, Diabetes, Penicillin allergy
2. **Ahmed Mohamed** (User Account) - Male, O+, Hypertension
3. **Fatima Karim** - Female, walk-in patient
4. **Omar Trabelsi** - Male, B+, Asthma, Aspirin allergy
5. **Samir Bouzid** - Male, AB+
6. **Nadia Slimani** - Female, O-, Seasonal allergies

#### Appointments (8)
- **Tomorrow 9:00 AM**: Lina Ben Ali → Dr. Smith (General Consultation) - CONFIRMED
- **Tomorrow 10:00 AM**: Fatima Karim → Dr. Smith (Follow-up) - SCHEDULED
- **Tomorrow 11:00 AM**: Samir Bouzid → Dr. Jones (General) - CONFIRMED
- **Tomorrow 2:00 PM**: Ahmed Mohamed → Dr. Jones (Specialist) - SCHEDULED
- **Tomorrow 3:30 PM**: Omar Trabelsi → Dr. Smith (Follow-up) - CONFIRMED
- **Next week 10:00 AM**: Nadia Slimani → Dr. Smith (General) - SCHEDULED
- **Yesterday 11:00 AM**: Fatima Karim → Dr. Smith (General) - COMPLETED ✅ *Has consultation + prescription*
- **Last week 9:30 AM**: Samir Bouzid → Dr. Jones (General) - COMPLETED

#### Invoices (3)
1. **INV-2025-001**: Fatima Karim, $50, PAID (Credit Card)
2. **INV-2025-002**: Ahmed Mohamed, $80, PENDING (Due in 7 days)
3. **INV-2025-003**: Samir Bouzid, $50, PAID (Cash)

---

### CLINIC 2 - City Health Center
#### Patients (3 total)
1. **Karim Jaziri** - Male, A-, Heart disease
2. **Samia Hamdi** - Female, B-, Latex allergy
3. **Yassine Maalej** - Male, pediatric patient

#### Appointments (4)
- **Tomorrow 9:00 AM**: Karim Jaziri → Dr. Hassan (Cardiology) - CONFIRMED
- **Tomorrow 10:30 AM**: Yassine Maalej → Dr. Amira (Pediatrics) - SCHEDULED
- **Tomorrow 2:00 PM**: Samia Hamdi → Dr. Hassan (Blood Test) - CONFIRMED
- **Next week 11:00 AM**: Karim Jaziri → Dr. Hassan (Cardiology) - SCHEDULED

#### Invoices (2)
1. **INV-C2-2025-001**: Karim Jaziri, $120, PAID (Bank Transfer)
2. **INV-C2-2025-002**: Samia Hamdi, $40, PENDING (Due in 5 days)

---

### CLINIC 3 - Elite Medical Center
#### Patients (3 total)
1. **Sana Gharbi** - Female, A+, Eczema, Shellfish allergy
2. **Mehdi Souissi** - Male, O+, Diabetes & High cholesterol
3. **Rim Chaabane** - Female, AB-

#### Appointments (6)
- **Tomorrow 9:00 AM**: Sana Gharbi → Dr. Youssef (Dermatology) - CONFIRMED
- **Tomorrow 11:00 AM**: Mehdi Souissi → Dr. Leila (Orthopedic) - SCHEDULED
- **Tomorrow 2:30 PM**: Rim Chaabane → Dr. Youssef (Annual Checkup) - CONFIRMED
- **Next week 10:00 AM**: Sana Gharbi → Dr. Youssef (Dermatology) - SCHEDULED
- **Last week 3:00 PM**: Rim Chaabane → Dr. Leila (Orthopedic) - CANCELLED

#### Invoices (3)
1. **INV-C3-2025-001**: Rim Chaabane, $200, PAID (Credit Card)
2. **INV-C3-2025-002**: Sana Gharbi, $110, OVERDUE 🔴 (Due 2 days ago)
3. **INV-C3-2025-003**: Mehdi Souissi, $130, PENDING (Due in 10 days)

---

## 🧪 Testing Scenarios

### 1. Multi-Tenant Isolation
- Login as `admin@medflow.com` → Should only see Clinic 1 data
- Login as `dr.hassan@cityhc.com` → Should only see Clinic 2 data
- Login as `admin@elitemc.com` → Should only see Clinic 3 data

### 2. Appointment Management
- **View Calendar**: See appointments color-coded by status
- **Create Appointment**: Select patients/doctors/services filtered by clinic
- **Edit/Cancel**: Test permissions (patients can't edit)
- **Consultation**: View completed appointment with medical notes

### 3. Patient Portal
- Login as `lina.benali@email.com`
  - View upcoming appointment (Tomorrow 9:00 AM)
  - View appointment history
  - Check notifications
- Login as `ahmed.mohamed@email.com`
  - View pending invoice (INV-2025-002)
  - View upcoming appointment

### 4. Invoice Testing
- **Paid invoices**: INV-2025-001, INV-2025-003, INV-C2-2025-001, INV-C3-2025-001
- **Pending invoices**: INV-2025-002, INV-C2-2025-002, INV-C3-2025-003
- **Overdue invoice**: INV-C3-2025-002 (test overdue alerts)

### 5. Service Filtering
- Create appointment with Dr. Smith → Should show Clinic 1 services only
- Create appointment with Dr. Hassan → Should show Clinic 2 services only
- Test "General Consultation" option (no specific service)

### 6. Doctor Availability
- Open calendar for tomorrow → See multiple appointments across different doctors
- Check time conflicts when scheduling
- Test appointment duration auto-calculation based on service

### 7. Notifications
- Login as any user → Check notification bell
- Mix of read/unread notifications
- Different notification types (appointment, payment, system)

### 8. Search & Filters
- Patient search: Try "Lina", "Ben Ali", "+216 98"
- Appointment filters: Date range, status, doctor
- Invoice filters: Status (Paid/Pending/Overdue)

---

## 📋 Permissions Seeded
35 permissions across 10 categories:
- **Patients**: view, create, edit, delete
- **Appointments**: view, create, edit, delete
- **Consultations**: view, create, edit, delete
- **Prescriptions**: view, create, edit, delete
- **Invoices**: view, create, edit, delete
- **Staff**: view, create, edit, delete
- **Services**: view, create, edit, delete
- **Reports**: view
- **Settings**: manage_settings, manage_roles
- **Clinics**: view, create, edit, delete

---

## 💡 Tips for Testing

1. **Start with Clinic 1** - It has the most complete data (admin, doctors, receptionists, patients with accounts)

2. **Test Service Optional Field**:
   - Book appointment without selecting service
   - Should default to "General Consultation"

3. **Test Clinic Filtering**:
   - Create new appointment
   - Patient dropdown should only show patients from your clinic
   - Doctor dropdown should only show doctors from your clinic
   - Services should filter by clinic

4. **Test Appointment Statuses**:
   - **SCHEDULED**: Can edit or cancel
   - **CONFIRMED**: Can edit or cancel
   - **COMPLETED**: View only, has consultation data
   - **CANCELLED**: View only

5. **Test Invoice Statuses**:
   - **PENDING**: Can edit or mark as paid
   - **PAID**: View only
   - **OVERDUE**: Highlighted in red, can still mark as paid

6. **Test Completed Appointment**:
   - Find yesterday's appointment (Fatima Karim)
   - View consultation details with vital signs
   - View prescription with 2 medications

---

## 🔄 Re-seeding Process

The seed script automatically:
1. **Cleans up** existing data (in correct foreign key order)
2. **Creates** 35 permissions
3. **Creates** 3 clinics with different settings
4. **Creates** 11 staff members (admins, doctors, receptionists)
5. **Creates** 17 services across clinics
6. **Creates** 12 patients (mix of accounts and walk-ins)
7. **Creates** 18 appointments (past, present, future)
8. **Creates** 8 invoices (various statuses)
9. **Creates** 8 notifications

**Total time**: ~3-5 seconds

---

## 📝 Data Characteristics

### Realistic Details
- **Tunisian context**: Phone numbers (+216), addresses in Tunis/Sfax/Sousse
- **Medical details**: Blood types, allergies, chronic conditions
- **Proper relationships**: Appointments linked to consultations, prescriptions, invoices
- **Time distribution**: Past week, yesterday, today, tomorrow, next week
- **Status variety**: All appointment/invoice statuses represented
- **Clinic specialization**: Each clinic has unique service offerings

### Multi-Tenant Ready
- Each clinic has its own:
  - Staff members
  - Patients
  - Services
  - Appointments
  - Invoices
  - Working hours configuration

### Testing Edge Cases
- **Patients without user accounts** (walk-in patients)
- **Completed appointments with consultations**
- **Overdue invoices** (payment reminders)
- **Cancelled appointments** (appointment history)
- **Partial payments** (future enhancement)
- **Multiple medications in prescriptions**

---

## 🎯 Next Steps for Testing

1. **Login Flow**: Test each role (admin, doctor, receptionist, patient)
2. **Calendar View**: Verify clinic-specific appointments display
3. **Create Appointment**: Test filtered dropdowns by clinic
4. **Service Optional**: Book without service, verify "General Consultation"
5. **Patient Portal**: Login as patient, view appointments/invoices
6. **Invoice Management**: Test payment processing
7. **Consultation**: View completed appointment details
8. **Notifications**: Check notification center
9. **Search**: Test patient/appointment search
10. **Permissions**: Verify role-based access control

---

**Last Updated**: November 16, 2025
**Version**: 1.0
**Total Records**: 77 (clinics, users, patients, appointments, services, invoices, notifications, permissions)
