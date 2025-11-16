# 🧪 Complete Feature Testing Guide

## ✅ Pre-Test Checklist

Before testing, ensure:
- [x] Database seeded with test data (77 records)
- [x] Development server running on http://localhost:3000
- [x] Prisma Studio available at http://localhost:5556
- [x] No compilation errors

## 🔐 Test Accounts Ready

**Default Password**: `password123` for all accounts

---

## 📋 Feature Testing Checklist

### 1. Authentication & Authorization ✅

#### 1.1 Login Flow
- [ ] Visit http://localhost:3000
- [ ] Login as `admin@medflow.com` / `password123`
- [ ] Should redirect to `/dashboard`
- [ ] Verify welcome message shows "Admin User"
- [ ] Check sidebar shows all admin menu items

#### 1.2 Multi-Tenant Access
- [ ] Logout
- [ ] Login as `dr.hassan@cityhc.com` (Clinic 2)
- [ ] Go to Calendar
- [ ] Verify only Clinic 2 appointments visible
- [ ] Go to Patients
- [ ] Verify only Clinic 2 patients visible

#### 1.3 Role-Based Permissions
- [ ] Login as `lina.benali@email.com` (Patient)
- [ ] Try to access `/admin/staff` - Should be blocked
- [ ] Go to `/portal/appointments` - Should work
- [ ] Verify can view but not edit/delete appointments

---

### 2. Dashboard ✅

#### 2.1 Admin Dashboard
- [ ] Login as `admin@medflow.com`
- [ ] Visit `/dashboard`
- [ ] Verify stats cards show correct counts:
  - Total Patients
  - Today's Appointments
  - Pending Invoices
  - Total Revenue
- [ ] Check recent activity feed
- [ ] Verify charts/graphs display

#### 2.2 Doctor Dashboard
- [ ] Login as `dr.smith@medflow.com`
- [ ] Visit `/dashboard`
- [ ] Verify shows today's appointments
- [ ] Check upcoming consultations
- [ ] Verify only assigned patients visible

---

### 3. Calendar & Appointments ✅

#### 3.1 View Calendar
- [ ] Login as `admin@medflow.com`
- [ ] Go to `/calendar`
- [ ] Should see calendar grid for current month
- [ ] Verify appointments display on correct dates
- [ ] Check color coding by status:
  - Green: Confirmed
  - Blue: Scheduled
  - Gray: Completed
  - Red: Cancelled

#### 3.2 Create Appointment
- [ ] Click "New Appointment" button
- [ ] Verify Patient dropdown shows only Clinic 1 patients (6 total)
- [ ] Verify Doctor dropdown shows only Clinic 1 doctors (Dr. Smith, Dr. Jones)
- [ ] Verify Service dropdown shows only Clinic 1 services (5 total)
- [ ] Leave Service field empty or select "General Consultation"
- [ ] Select date: Tomorrow
- [ ] Select time: 3:00 PM
- [ ] Add note: "Test appointment"
- [ ] Click Create
- [ ] Should show success toast
- [ ] Appointment should appear in calendar

#### 3.3 Edit Appointment
- [ ] Click on tomorrow's 3:00 PM appointment
- [ ] Click Edit button
- [ ] Change time to 4:00 PM
- [ ] Change status to "Confirmed"
- [ ] Save changes
- [ ] Verify appointment updated in calendar
- [ ] Color should change to green (Confirmed)

#### 3.4 View Completed Appointment
- [ ] Find yesterday's 11:00 AM appointment (Fatima Karim)
- [ ] Click to view details
- [ ] Verify shows:
  - Status: COMPLETED
  - Consultation tab available
  - Prescription attached
  - Vital signs displayed
- [ ] Check consultation details:
  - Chief Complaint: "Headache and fever"
  - Diagnosis: "Viral infection"
  - Treatment: "Rest, hydration, antipyretics"
- [ ] View prescription:
  - Paracetamol 500mg
  - Vitamin C 1000mg

#### 3.5 Cancel Appointment
- [ ] Find a scheduled appointment
- [ ] Click Cancel button
- [ ] Confirm cancellation
- [ ] Verify status changes to "Cancelled"
- [ ] Color changes to red

#### 3.6 Delete Appointment (Admin Only)
- [ ] As admin, find test appointment
- [ ] Click Delete button
- [ ] Confirm deletion
- [ ] Verify appointment removed from calendar

---

### 4. Patients Management ✅

#### 4.1 View Patients List
- [ ] Login as `admin@medflow.com`
- [ ] Go to `/patients`
- [ ] Should see 6 patients from Clinic 1
- [ ] Verify patient cards show:
  - Name, age, blood type
  - Contact info
  - Last visit date
  - Upcoming appointments

#### 4.2 Search Patients
- [ ] Search for "Lina"
- [ ] Should show: Lina Ben Ali
- [ ] Search for "+216 98"
- [ ] Should show matching phone numbers
- [ ] Clear search
- [ ] All patients should reappear

#### 4.3 View Patient Details
- [ ] Click on "Lina Ben Ali"
- [ ] Modal should open with full details:
  - Personal info
  - Medical history: "Diabetes Type 2 (controlled)"
  - Allergies: "Penicillin"
  - Blood type: A+
  - Appointments history
  - Invoices
- [ ] Verify has upcoming appointment tomorrow 9:00 AM

#### 4.4 Create New Patient
- [ ] Click "Add Patient" button
- [ ] Fill in form:
  - First Name: Test
  - Last Name: Patient
  - Date of Birth: 01/01/1990
  - Gender: Male
  - Phone: +216 98 000 000
  - Email: test@email.com
  - Address: Test Address
  - Blood Type: O+
- [ ] Submit form
- [ ] Should show success toast
- [ ] New patient should appear in list

#### 4.5 Edit Patient
- [ ] Click Edit on "Test Patient"
- [ ] Update phone number
- [ ] Add medical history
- [ ] Save changes
- [ ] Verify updates reflected

---

### 5. Services ✅

#### 5.1 View Services
- [ ] Login as `admin@medflow.com`
- [ ] Go to `/admin/services` or Services page
- [ ] Should see 5 services for Clinic 1:
  - General Consultation ($50, 30 min)
  - Specialist Consultation ($80, 45 min)
  - Follow-up Visit ($30, 20 min)
  - Medical Certificate ($20, 15 min)
  - Vaccination ($25, 15 min)

#### 5.2 Create Service
- [ ] Click "Add Service"
- [ ] Fill in:
  - Name: Blood Pressure Check
  - Description: Quick BP measurement
  - Duration: 10 minutes
  - Price: $15
  - Active: Yes
- [ ] Submit
- [ ] New service should appear in list

#### 5.3 Service Filtering by Doctor
- [ ] Go to create appointment
- [ ] Select Dr. Smith
- [ ] Verify service dropdown filters by doctor specialty
- [ ] Select Dr. Jones
- [ ] Verify services update

---

### 6. Invoices & Billing ✅

#### 6.1 View Invoices
- [ ] Login as `admin@medflow.com`
- [ ] Go to `/billing`
- [ ] Should see financial summary:
  - Total Revenue
  - Paid Invoices (count)
  - Pending Amount
  - Overdue Invoices
- [ ] Should see 3 invoices for Clinic 1:
  - INV-2025-001: $50 PAID
  - INV-2025-002: $80 PENDING
  - INV-2025-003: $50 PAID

#### 6.2 View Invoice Details
- [ ] Click on INV-2025-002 (Ahmed Mohamed)
- [ ] Modal should show:
  - Patient: Ahmed Mohamed
  - Service: Specialist Consultation
  - Amount: $80
  - Status: PENDING
  - Due date
- [ ] Verify itemized breakdown

#### 6.3 Mark Invoice as Paid
- [ ] In invoice details modal
- [ ] Click "Mark as Paid" button
- [ ] Select payment method: Credit Card
- [ ] Enter payment date: Today
- [ ] Confirm payment
- [ ] Status should change to PAID
- [ ] Badge color changes to green

#### 6.4 View Overdue Invoices
- [ ] Login as `admin@elitemc.com` (Clinic 3)
- [ ] Go to `/billing`
- [ ] Should see INV-C3-2025-002 marked OVERDUE in red
- [ ] Amount: $110
- [ ] Patient: Sana Gharbi

---

### 7. Consultations ✅

#### 7.1 View Consultations
- [ ] Login as `dr.smith@medflow.com`
- [ ] Go to `/consultations`
- [ ] Should see 1 consultation
- [ ] Patient: Fatima Karim
- [ ] Date: Yesterday 11:00 AM

#### 7.2 View Consultation Details
- [ ] Click on consultation
- [ ] Should display:
  - Chief Complaint: "Headache and fever"
  - Symptoms: "Persistent headache for 2 days, mild fever (38.2°C)"
  - Diagnosis: "Viral infection"
  - Treatment: "Rest, hydration, antipyretics"
  - Vital Signs:
    - Temperature: 38.2°C
    - Blood Pressure: 120/80
    - Heart Rate: 78
    - Weight: 65 kg
  - Prescription attached (2 medications)

#### 7.3 Create Consultation
- [ ] Find a completed appointment without consultation
- [ ] Click "Add Consultation" button
- [ ] Fill in all sections
- [ ] Add vital signs
- [ ] Save consultation
- [ ] Should link to appointment

---

### 8. Prescriptions ✅

#### 8.1 View Prescriptions
- [ ] Login as `dr.smith@medflow.com`
- [ ] Go to `/prescriptions`
- [ ] Should see 1 prescription
- [ ] Patient: Fatima Karim
- [ ] Status: Active
- [ ] Issued: Yesterday

#### 8.2 View Prescription Details
- [ ] Click on prescription
- [ ] Should show:
  - Patient info
  - Doctor: Dr. Sarah Smith
  - Diagnosis: Viral infection
  - Medications (2):
    1. Paracetamol 500mg
       - Frequency: Every 6 hours
       - Duration: 3 days
       - Instructions: Take with food
    2. Vitamin C 1000mg
       - Frequency: Once daily
       - Duration: 7 days
       - Instructions: Take in the morning

#### 8.3 Create Prescription
- [ ] From consultation details
- [ ] Click "Create Prescription"
- [ ] Add medications
- [ ] Fill dosage, frequency, duration
- [ ] Add instructions
- [ ] Save prescription
- [ ] Should appear in prescriptions list

#### 8.4 Download Prescription PDF
- [ ] In prescription details
- [ ] Click "Download PDF" button
- [ ] PDF should download with:
  - Clinic header
  - Patient details
  - Doctor details
  - Medication list
  - Instructions

---

### 9. Patient Portal ✅

#### 9.1 Login as Patient
- [ ] Logout if logged in
- [ ] Login as `lina.benali@email.com`
- [ ] Should redirect to `/portal/appointments`
- [ ] Verify limited menu (no admin options)

#### 9.2 View My Appointments
- [ ] Should see upcoming appointment
- [ ] Tomorrow 9:00 AM with Dr. Smith
- [ ] Service: General Consultation
- [ ] Notes: "Annual checkup - first visit"
- [ ] Status: CONFIRMED (green badge)

#### 9.3 View Appointment History
- [ ] Filter by "Past" appointments
- [ ] Should show completed/cancelled appointments
- [ ] Verify cannot edit or delete

#### 9.4 Book New Appointment
- [ ] Go to `/portal/book-appointment`
- [ ] Step 1: Select Service
  - Should show only Clinic 1 services
  - Can skip (General Consultation)
- [ ] Step 2: Select Doctor
  - Should show Clinic 1 doctors
  - Select Dr. Smith or Dr. Jones
- [ ] Step 3: Select Date & Time
  - Choose available slot
  - Next week
- [ ] Step 4: Confirm Details
  - Review appointment
  - Confirm booking
- [ ] Should show success message
- [ ] New appointment appears in "My Appointments"

#### 9.5 Notifications
- [ ] Check notification bell (top right)
- [ ] Should have 2 notifications:
  - "Upcoming Appointment Reminder"
  - "Appointment Confirmed" (read)
- [ ] Click on unread notification
- [ ] Should mark as read
- [ ] Badge count decreases

---

### 10. Staff Management (Admin) ✅

#### 10.1 View Staff
- [ ] Login as `admin@medflow.com`
- [ ] Go to `/admin/staff`
- [ ] Should see staff table with:
  - Name, Email, Role, Clinic
  - 4 staff for Clinic 1:
    - Admin User (ADMIN)
    - Dr. Sarah Smith (DOCTOR)
    - Dr. John Jones (DOCTOR)
    - Maria Garcia (RECEPTIONIST)

#### 10.2 Add Staff Member
- [ ] Click "Add Staff" button
- [ ] Fill form:
  - Name: Test Doctor
  - Email: test.doctor@medflow.com
  - Role: DOCTOR
  - Phone: +216 71 999 999
  - Password: password123
- [ ] Submit
- [ ] New staff member should appear

#### 10.3 Edit Staff
- [ ] Click Edit on "Test Doctor"
- [ ] Change phone number
- [ ] Update role if needed
- [ ] Save changes
- [ ] Verify updates

#### 10.4 Delete Staff
- [ ] Click Delete on "Test Doctor"
- [ ] Confirm deletion
- [ ] Staff removed from list

---

### 11. Clinics Management (Admin) ✅

#### 11.1 View Clinics
- [ ] Login as `admin@medflow.com`
- [ ] Go to `/admin/clinics`
- [ ] Should see 3 clinics:
  - MedFlow Clinic (4 users, 6 patients)
  - City Health Center (3 users, 3 patients)
  - Elite Medical Center (3 users, 3 patients)

#### 11.2 View Clinic Details
- [ ] Click on "MedFlow Clinic"
- [ ] Should show:
  - Name, address, phone, email
  - Staff count: 4
  - Patient count: 6
  - Service count: 5
  - Appointment count: 8
  - Working hours
  - Settings (JSON)

#### 11.3 Edit Clinic
- [ ] Click Edit
- [ ] Update clinic info
- [ ] Change working hours
- [ ] Save changes
- [ ] Verify updates

---

### 12. Analytics Dashboard ✅

#### 12.1 View Analytics
- [ ] Login as `admin@medflow.com`
- [ ] Go to `/analytics`
- [ ] Should see:
  - Key metrics (4 cards):
    - Total Appointments: 245
    - Total Patients: 87
    - Total Revenue: $12,450
    - Average Rating: 4.8
  - Time range selector (Week/Month/Year)
  - Appointments by day (bar chart)
  - Revenue trend (bar chart)
  - Top services table
  - Quick stats (cancellation, no-show, wait time)

#### 12.2 Change Time Range
- [ ] Click "This Week"
- [ ] Data should update
- [ ] Click "This Year"
- [ ] Charts should refresh

---

### 13. Notifications System ✅

#### 13.1 View Notifications
- [ ] Login as any user
- [ ] Click bell icon (top right)
- [ ] Dropdown should show notifications
- [ ] Mix of read/unread
- [ ] Different types:
  - Appointment reminders
  - Payment reminders
  - System notifications

#### 13.2 Mark as Read
- [ ] Click unread notification
- [ ] Should mark as read
- [ ] Badge count decreases
- [ ] Background color changes

#### 13.3 View All Notifications
- [ ] Click "View All" at bottom
- [ ] Should go to `/notifications`
- [ ] See full notification list
- [ ] Can filter by type/status

---

### 14. Profile & Settings ✅

#### 14.1 View Profile
- [ ] Click profile picture (top right)
- [ ] Click "Profile"
- [ ] Should show user details
- [ ] Can update:
  - Name
  - Email
  - Phone
  - Profile picture

#### 14.2 Change Password
- [ ] In profile page
- [ ] Click "Change Password"
- [ ] Enter current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Save changes
- [ ] Should require login with new password

#### 14.3 Clinic Settings (Admin)
- [ ] Login as admin
- [ ] Go to `/admin/settings`
- [ ] Should see settings tabs:
  - General
  - Working Hours
  - Notifications
  - Email Templates
  - Integrations
- [ ] Update settings
- [ ] Save changes
- [ ] Verify applied

---

### 15. Search Functionality ✅

#### 15.1 Global Search
- [ ] Click search bar (header)
- [ ] Type "Lina"
- [ ] Should show results:
  - Patient: Lina Ben Ali
  - Related appointments
- [ ] Click result
- [ ] Should navigate to patient details

#### 15.2 Patient Search
- [ ] Go to `/patients`
- [ ] Search by name: "Ahmed"
- [ ] Search by phone: "+216 98"
- [ ] Search by email: "email.com"
- [ ] Verify results match

#### 15.3 Appointment Search
- [ ] Go to `/calendar`
- [ ] Use search/filter
- [ ] Filter by:
  - Date range
  - Doctor
  - Status
  - Patient name
- [ ] Verify filtered results

---

### 16. Mobile Responsiveness ✅

#### 16.1 Mobile Menu
- [ ] Resize browser to mobile width (<768px)
- [ ] Sidebar should collapse
- [ ] Hamburger menu should appear
- [ ] Click hamburger
- [ ] Menu slides out
- [ ] All links accessible

#### 16.2 Mobile Calendar
- [ ] Open calendar on mobile
- [ ] Should show compact view
- [ ] Swipe to navigate months
- [ ] Appointments display properly
- [ ] Modal opens correctly

#### 16.3 Mobile Forms
- [ ] Try creating appointment on mobile
- [ ] All fields accessible
- [ ] Dropdowns work
- [ ] Date/time pickers functional
- [ ] Submit button visible

---

### 17. Error Handling ✅

#### 17.1 404 Page
- [ ] Navigate to non-existent page
- [ ] Should show custom 404 page
- [ ] "Return Home" button works

#### 17.2 API Errors
- [ ] Disconnect network
- [ ] Try loading page
- [ ] Should show error message
- [ ] "Retry" button appears
- [ ] Error doesn't crash app

#### 17.3 Form Validation
- [ ] Try submitting empty form
- [ ] Should show validation errors
- [ ] Red highlights on invalid fields
- [ ] Error messages clear
- [ ] Can correct and resubmit

---

### 18. Performance ✅

#### 18.1 Page Load Times
- [ ] Dashboard loads in < 3s
- [ ] Calendar loads in < 3s
- [ ] Patient list loads in < 2s
- [ ] Navigation is instant (< 500ms)

#### 18.2 Data Updates
- [ ] Create appointment
- [ ] Should appear immediately
- [ ] Edit appointment
- [ ] Updates reflect instantly
- [ ] No page refresh needed

---

## 🎯 Critical Path Test (End-to-End)

### Complete Patient Journey
1. **Patient Registration**
   - [ ] Receptionist creates new patient
   - [ ] Patient receives welcome email (if configured)

2. **Appointment Booking**
   - [ ] Patient books appointment via portal
   - [ ] Or receptionist books on patient's behalf
   - [ ] Confirmation email sent

3. **Appointment Day**
   - [ ] Patient checks in (receptionist)
   - [ ] Doctor sees patient in dashboard
   - [ ] Doctor marks appointment as confirmed

4. **Consultation**
   - [ ] Doctor completes appointment
   - [ ] Creates consultation record
   - [ ] Records vital signs
   - [ ] Makes diagnosis

5. **Prescription**
   - [ ] Doctor creates prescription
   - [ ] Links to consultation
   - [ ] Patient can view in portal
   - [ ] Can download PDF

6. **Billing**
   - [ ] Invoice auto-generated
   - [ ] Receptionist processes payment
   - [ ] Invoice marked as paid
   - [ ] Patient receives receipt

7. **Follow-up**
   - [ ] Doctor schedules follow-up
   - [ ] Reminder notification sent
   - [ ] Patient confirms appointment

---

## ✅ Pass Criteria

### Must Pass (Critical)
- [ ] All authentication flows work
- [ ] Multi-tenant isolation verified
- [ ] CRUD operations functional
- [ ] No data leakage between clinics
- [ ] Calendar displays correctly
- [ ] Appointments can be created/edited
- [ ] Service field optional works
- [ ] Patient portal accessible
- [ ] No console errors
- [ ] Mobile responsive

### Should Pass (Important)
- [ ] All search functions work
- [ ] Filters apply correctly
- [ ] Notifications display
- [ ] PDF downloads work
- [ ] Forms validate properly
- [ ] Error messages clear
- [ ] Loading states show
- [ ] Success toasts appear

### Nice to Have (Enhancement)
- [ ] Animations smooth
- [ ] Dark mode (if implemented)
- [ ] Print functionality
- [ ] Export features
- [ ] Advanced filters

---

## 🐛 Bug Reporting Template

When you find a bug, document it:

```
**Bug**: [Short description]
**Steps to Reproduce**:
1. Login as...
2. Go to...
3. Click...
4. Observe...

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Severity**: Critical / High / Medium / Low
**Browser**: Chrome / Firefox / Safari
**Device**: Desktop / Mobile
**Screenshot**: [If applicable]
```

---

## 📊 Testing Results Summary

After completing all tests, fill this out:

### Summary
- **Total Tests**: 18 categories
- **Tests Passed**: ___ / ___
- **Tests Failed**: ___
- **Critical Issues**: ___
- **Medium Issues**: ___
- **Minor Issues**: ___

### Overall Status
- [ ] ✅ Ready for Production
- [ ] ⚠️ Ready with Minor Issues
- [ ] ❌ Not Ready - Critical Issues

### Next Steps
1. [ ] Fix critical bugs
2. [ ] Retest failed scenarios
3. [ ] Document known issues
4. [ ] Update user documentation
5. [ ] Deploy to staging
6. [ ] Final acceptance testing

---

**Testing Completed By**: ___________  
**Date**: ___________  
**Version Tested**: 1.0.0  
**Environment**: Development / Staging / Production
