# 🔗 Clinic Pages Relationship Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                            │
│                   /admin/dashboard                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Quick Actions:                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Manage Users │  │ Manage Staff │  │Clinic Settings│        │
│  └──────────────┘  └──────────────┘  └──────┬───────┘        │
│                                              │                  │
└──────────────────────────────────────────────┼──────────────────┘
                                               │
                          ┌────────────────────┼──────────────────┐
                          │                    │                  │
                          ▼                    ▼                  ▼
        ┏━━━━━━━━━━━━━━━━━━━━━┓    ┏━━━━━━━━━━━━━━━━━━━━━┓
        ┃  CLINIC SETTINGS    ┃    ┃  CLINICS LIST       ┃
        ┃  /admin/clinic-     ┃    ┃  /admin/clinics     ┃
        ┃       settings      ┃    ┃                     ┃
        ┗━━━━━━━━━━━━━━━━━━━━━┛    ┗━━━━━━━━━━━━━━━━━━━━━┛
                  │                            │
                  │                            │
        ┌─────────┴────────────┐               │
        │                      │               │
        ▼                      ▼               ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   General    │    │  Operating   │    │ Clinic Cards │
│ Information  │    │    Hours     │    │  (Add/View)  │
└──────────────┘    └──────────────┘    └──────┬───────┘
┌──────────────┐    ┌──────────────┐           │
│ Appointments │    │   Billing    │           │ Click "View Details"
└──────────────┘    └──────────────┘           │
                                               ▼
                                    ┏━━━━━━━━━━━━━━━━━━━━━┓
                                    ┃  CLINIC DETAILS     ┃
                                    ┃  /admin/clinics/[id]┃
                                    ┗━━━━━━━━━━━━━━━━━━━━━┛
                                               │
                          ┌────────────────────┼────────────────────┐
                          │                    │                    │
                          ▼                    ▼                    ▼
                   ┌─────────────┐      ┌─────────────┐     ┌─────────────┐
                   │  Overview   │      │   Staff     │     │  Services   │
                   │     Tab     │      │    Tab      │     │     Tab     │
                   └─────────────┘      └─────────────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ Operating   │
                   │  Hours Tab  │◄─────── NOW EDITABLE!
                   └─────────────┘
                          │
                   ┌──────┴──────┐
                   │             │
                   ▼             ▼
            ┌──────────┐  ┌──────────┐
            │   View   │  │   Edit   │
            │   Mode   │  │   Mode   │
            └──────────┘  └──────────┘
```

---

## 🔄 Data Flow

### **When Adding a New Clinic:**

```
User Action
    │
    ▼
/admin/clinics
    │
    ├─► Click "Add New Clinic" button
    │
    ▼
Modal Opens
    │
    ├─► Fill: Name, Address, Phone, Email
    │
    ▼
Submit Form
    │
    ├─► API Call: POST /api/clinics
    │
    ▼
New Clinic Created
    │
    ├─► Default operating hours applied
    │   (from clinic-settings)
    │
    ▼
Redirect to Clinic Details
    │
    └─► /admin/clinics/[new-id]
```

### **When Editing Clinic Info:**

```
/admin/clinics/[id]
    │
    ▼
Click "Edit Clinic"
    │
    ▼
Modal Opens (pre-filled)
    │
    ├─► formData populated from clinic
    │
    ▼
User Modifies Fields
    │
    ▼
Click "Save Changes"
    │
    ├─► handleEditClinic() called
    │
    ▼
Clinic State Updated
    │
    ├─► API Call: PUT /api/clinics/[id]
    │
    └─► Modal Closes
```

### **When Editing Operating Hours:**

```
/admin/clinics/[id] → Operating Hours Tab
    │
    ▼
View Mode (Read-Only)
    │
    ├─► Display: "09:00 - 17:00" or "Closed"
    │
    ▼
Click "Edit Hours"
    │
    ├─► setIsEditingHours(true)
    │
    ▼
Edit Mode (Editable)
    │
    ├─► Convert: "09:00 - 17:00" → { open: "09:00", close: "17:00", enabled: true }
    │
    ▼
User Modifies Times
    │
    ├─► Checkboxes, time pickers
    │
    ▼
Click "Save Changes"
    │
    ├─► handleSaveOperatingHours() called
    │
    ▼
Convert Back to Display Format
    │
    ├─► { open: "09:00", close: "17:00", enabled: true } → "09:00 - 17:00"
    │
    ▼
Update Clinic State
    │
    ├─► API Call: PUT /api/clinics/[id]/hours
    │
    └─► Back to View Mode
```

---

## 🎯 State Management

### **Clinic Details Page States:**

```javascript
const [clinic, setClinic] = useState(null);
// Main clinic object with all data

const [loading, setLoading] = useState(true);
// Loading state for data fetching

const [activeTab, setActiveTab] = useState('overview');
// Current tab: 'overview' | 'staff' | 'services' | 'hours'

const [showEditModal, setShowEditModal] = useState(false);
// Controls Edit Clinic modal visibility

const [formData, setFormData] = useState({...});
// Form data for editing clinic info

const [operatingHours, setOperatingHours] = useState({...});
// Editable format of operating hours

const [isEditingHours, setIsEditingHours] = useState(false);
// Toggle between view/edit mode for hours
```

### **Operating Hours State Transformation:**

```javascript
// STORED IN DATABASE (clinic.operatingHours):
{
  monday: "09:00 - 17:00",
  tuesday: "09:00 - 17:00",
  sunday: "Closed"
}

// CONVERTED TO EDITABLE FORMAT (operatingHours):
{
  monday: { open: "09:00", close: "17:00", enabled: true },
  tuesday: { open: "09:00", close: "17:00", enabled: true },
  sunday: { open: "09:00", close: "17:00", enabled: false }
}

// Conversion Logic:
useEffect(() => {
  const parsedHours = {};
  Object.entries(clinic.operatingHours).forEach(([day, timeStr]) => {
    if (timeStr === 'Closed') {
      parsedHours[day] = { open: '09:00', close: '17:00', enabled: false };
    } else {
      const [open, close] = timeStr.split(' - ');
      parsedHours[day] = { open, close, enabled: true };
    }
  });
  setOperatingHours(parsedHours);
}, [clinic]);
```

---

## 🔐 Access Control

```
User Roles
    │
    ├─► ADMIN
    │   ├─► /admin/clinic-settings ✅
    │   ├─► /admin/clinics ✅
    │   ├─► /admin/clinics/[id] ✅
    │   ├─► Edit Clinic ✅
    │   └─► Edit Hours ✅
    │
    ├─► DOCTOR
    │   ├─► /admin/clinic-settings ❌
    │   ├─► /admin/clinics ❌ (read-only if needed)
    │   ├─► /admin/clinics/[id] ❌ (read-only if needed)
    │   ├─► Edit Clinic ❌
    │   └─► Edit Hours ❌
    │
    └─► RECEPTIONIST / PATIENT
        └─► All clinic management pages ❌
```

---

## 📱 UI Components Hierarchy

```
ClinicDetails Component
│
├─► Header
│   ├─► Sidebar
│   └─► User Menu
│
├─► Back Button
│   └─► onClick: router.push('/admin/clinics')
│
├─► Clinic Header Card
│   ├─► Clinic Name
│   ├─► Status Badge
│   ├─► Description
│   ├─► Location Icon + Address
│   ├─► Phone Icon + Number
│   └─► Edit Clinic Button
│
├─► Stats Grid
│   ├─► StatCard (Departments)
│   ├─► StatCard (Staff Members)
│   ├─► StatCard (Patients)
│   └─► StatCard (Services)
│
├─► Tabs Navigation
│   ├─► Overview Tab Button
│   ├─► Staff Tab Button
│   ├─► Services Tab Button
│   └─► Operating Hours Tab Button
│
├─► Tab Content
│   │
│   ├─► Overview Tab
│   │   ├─► Contact Information Section
│   │   └─► Location Section
│   │
│   ├─► Staff Tab
│   │   └─► Staff Member Cards
│   │
│   ├─► Services Tab
│   │   └─► Service Cards
│   │
│   └─► Operating Hours Tab
│       ├─► Header with Title + Edit/Save Buttons
│       │
│       ├─► View Mode (isEditingHours = false)
│       │   └─► Read-only display rows
│       │
│       └─► Edit Mode (isEditingHours = true)
│           └─► Editable form rows
│               ├─► Checkbox (enable/disable day)
│               ├─► Time Input (open time)
│               └─► Time Input (close time)
│
└─► Edit Clinic Modal (showEditModal = true)
    ├─► Modal Backdrop
    ├─► Modal Content
    │   ├─► Title + Close Button
    │   ├─► Form Fields
    │   │   ├─► Clinic Name
    │   │   ├─► Description
    │   │   ├─► Address
    │   │   ├─► City + State
    │   │   ├─► ZIP Code + Country
    │   │   ├─► Phone + Email
    │   │   └─► Website
    │   └─► Action Buttons
    │       ├─► Cancel
    │       └─► Save Changes
    └─► onClick Backdrop: Close Modal
```

---

## 🎨 Visual States

### **Operating Hours Tab - View Mode:**
```
┌─────────────────────────────────────────────┐
│ Operating Hours          [ Edit Hours ]     │
├─────────────────────────────────────────────┤
│ Monday            09:00 - 17:00             │
│ Tuesday           09:00 - 17:00             │
│ Wednesday         09:00 - 17:00             │
│ Thursday          09:00 - 17:00             │
│ Friday            09:00 - 17:00             │
│ Saturday          10:00 - 14:00             │
│ Sunday            Closed                    │
└─────────────────────────────────────────────┘
```

### **Operating Hours Tab - Edit Mode:**
```
┌──────────────────────────────────────────────────────────┐
│ Operating Hours    [ Cancel ] [ Save Changes ]           │
├──────────────────────────────────────────────────────────┤
│ [✓] Monday     Open: [09:00 ▼]  Close: [17:00 ▼]       │
│ [✓] Tuesday    Open: [09:00 ▼]  Close: [17:00 ▼]       │
│ [✓] Wednesday  Open: [09:00 ▼]  Close: [17:00 ▼]       │
│ [✓] Thursday   Open: [09:00 ▼]  Close: [17:00 ▼]       │
│ [✓] Friday     Open: [09:00 ▼]  Close: [17:00 ▼]       │
│ [✓] Saturday   Open: [10:00 ▼]  Close: [14:00 ▼]       │
│ [ ] Sunday     Closed                                    │
└──────────────────────────────────────────────────────────┘
```

---

## 🚦 User Journey

### **Journey 1: View Clinic Information**
```
Start → Admin Dashboard → Click "Clinics" in Sidebar → View clinics list
→ Click "View Details" on clinic card → See clinic details page
→ Browse tabs (Overview, Staff, Services, Operating Hours) → Done
```

### **Journey 2: Edit Clinic Basic Info**
```
Start → Go to /admin/clinics/[id] → Click "Edit Clinic" button
→ Modal opens with form → Edit fields → Click "Save Changes"
→ Modal closes, clinic updated → Done
```

### **Journey 3: Edit Operating Hours**
```
Start → Go to /admin/clinics/[id] → Click "Operating Hours" tab
→ Click "Edit Hours" button → Modify days and times
→ Click "Save Changes" → Back to view mode → Done
```

### **Journey 4: Add New Clinic**
```
Start → Go to /admin/clinics → Click "Add New Clinic" button
→ Fill required fields (name, address, phone, email)
→ Click "Add Clinic" → New clinic appears in list
→ Click "View Details" → Customize hours if needed → Done
```

---

## 📚 Quick Reference Table

| Feature | Clinic Settings Page | Clinic Details Page |
|---------|---------------------|---------------------|
| **URL** | `/admin/clinic-settings` | `/admin/clinics/[id]` |
| **Purpose** | Global defaults | Individual clinic |
| **Scope** | All clinics | Single clinic |
| **Operating Hours** | Default template | Specific schedule |
| **Edit Mode** | Always editable | Toggle edit mode |
| **Save Button** | Bottom of page | Top of tab |
| **Tabs** | 4 tabs (fixed) | 4 tabs (dynamic) |
| **Info Displayed** | System-wide | Clinic-specific |

---

**Created:** November 7, 2025  
**Last Updated:** November 7, 2025  
**Version:** 1.0
