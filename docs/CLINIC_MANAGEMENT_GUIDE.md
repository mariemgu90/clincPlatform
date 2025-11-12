# 🏥 Clinic Management System Guide

## 📋 Overview

This guide explains the clinic management system with two main pages and their relationship.

---

## 🗂️ Page Structure

### 1. **Global Clinic Settings** - `/admin/clinic-settings`
**Purpose:** System-wide default settings for all clinics

**Access:** Admin Dashboard → Quick Actions → "Clinic Settings" button

**Features:**
- ✅ General Information (clinic name, contact info, address)
- ✅ Operating Hours (default hours for all days)
- ✅ Appointment Settings (slot duration, booking policies)
- ✅ Billing Settings (currency, tax, payment methods)

**Use Case:** Set default configuration that applies globally

---

### 2. **Individual Clinic Details** - `/admin/clinics/[id]`
**Purpose:** View and manage specific clinic information

**Access:** Admin Dashboard → Sidebar → "Clinics" → Select clinic → "View Details"

**Features:**
- ✅ View clinic information (header card with status)
- ✅ Stats overview (Departments, Staff, Patients, Services)
- ✅ 4 Tabs:
  - **Overview:** Contact info and location
  - **Staff:** List of staff members with roles
  - **Services:** Available medical services
  - **Operating Hours:** Schedule (now editable!)
- ✅ Edit clinic details (button opens modal)
- ✅ Edit operating hours (toggle edit mode)

**Use Case:** Manage individual clinic-specific data

---

## 🔄 How Pages Relate

```
┌────────────────────────────────────────┐
│   /admin/clinic-settings               │
│   (Global System Settings)             │
│                                        │
│   - Default operating hours            │
│   - System-wide appointment rules      │
│   - Global billing configuration       │
└────────────────────────────────────────┘
                  ↓
        Used as defaults when creating
                  ↓
┌────────────────────────────────────────┐
│   /admin/clinics/[id]                  │
│   (Individual Clinic Details)          │
│                                        │
│   - Clinic-specific information        │
│   - Custom operating hours             │
│   - Assigned staff & services          │
└────────────────────────────────────────┘
```

**Relationship:**
- **Clinic Settings** = Template/defaults for new clinics
- **Clinic Details** = Customized data for each clinic

---

## 📝 How to Edit Clinic Information

### **Edit Basic Info (Name, Address, Phone, etc.)**

1. Navigate to `/admin/clinics/[id]`
2. Click the **"Edit Clinic"** button (top-right)
3. Modal opens with pre-filled form
4. Edit any fields:
   - Clinic Name
   - Description
   - Full Address (street, city, state, zip, country)
   - Contact (phone, email, website)
5. Click **"Save Changes"** or **"Cancel"**

**Fields Available:**
```javascript
{
  name: "MedFlow Medical Center",
  description: "Leading healthcare provider...",
  address: "123 Healthcare Ave",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "USA",
  phone: "+216 71 123 456",
  email: "contact@medflow.com",
  website: "www.medflow.com"
}
```

---

### **Edit Operating Hours**

#### **Method 1: From Clinic Details Page**

1. Navigate to `/admin/clinics/[id]`
2. Click **"Operating Hours"** tab
3. Click **"Edit Hours"** button (top-right of tab)
4. For each day:
   - ☑️ Check/uncheck to enable/disable the day
   - 🕐 Set opening time (dropdown)
   - 🕐 Set closing time (dropdown)
5. Click **"Save Changes"** or **"Cancel"**

**Example:**
```javascript
Monday:    [✓] Open: 09:00  Close: 17:00
Tuesday:   [✓] Open: 09:00  Close: 17:00
Wednesday: [✓] Open: 09:00  Close: 17:00
Thursday:  [✓] Open: 09:00  Close: 17:00
Friday:    [✓] Open: 09:00  Close: 17:00
Saturday:  [✓] Open: 10:00  Close: 14:00
Sunday:    [ ] Closed
```

#### **Method 2: From Global Settings**

1. Navigate to `/admin/clinic-settings`
2. Click **"Operating Hours"** tab
3. Same editing interface as above
4. Click **"Save Settings"** at bottom

---

## ➕ How to Add a New Clinic

### **Step 1: Navigate to Clinics Page**
- Go to Admin Dashboard → Sidebar → "Clinics"
- Or visit `/admin/clinics` directly

### **Step 2: Click "Add New Clinic"**
- Blue button in top-right corner

### **Step 3: Fill Required Fields**
Modal opens with form:
```
┌─────────────────────────────────────┐
│  Add New Clinic                     │
├─────────────────────────────────────┤
│  Clinic Name *                      │
│  [________________________________] │
│                                     │
│  Address *                          │
│  [________________________________] │
│                                     │
│  Phone *                            │
│  [________________________________] │
│                                     │
│  Email *                            │
│  [________________________________] │
│                                     │
│  [ Cancel ]  [ Add Clinic ]        │
└─────────────────────────────────────┘
```

### **Step 4: Submit**
- Click **"Add Clinic"** button
- New clinic appears in the list
- Operating hours default to 09:00-17:00 (Mon-Fri)

---

## 🔧 Technical Details

### **Data Structure**

#### **Clinic Object:**
```javascript
{
  id: 1,
  name: "MedFlow Medical Center",
  address: "123 Healthcare Ave, Medical District",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "USA",
  phone: "+216 71 123 456",
  email: "contact@medflow.com",
  website: "www.medflow.com",
  status: "Active",
  description: "Leading healthcare provider...",
  departments: 5,
  staff: 7,
  patients: 5,
  operatingHours: {
    monday: "09:00 - 17:00",
    tuesday: "09:00 - 17:00",
    wednesday: "09:00 - 17:00",
    thursday: "09:00 - 17:00",
    friday: "09:00 - 17:00",
    saturday: "10:00 - 14:00",
    sunday: "Closed"
  },
  staffMembers: [...],
  services: [...]
}
```

#### **Operating Hours Format:**

**Display Format (stored in database):**
```javascript
{
  monday: "09:00 - 17:00",
  tuesday: "09:00 - 17:00",
  sunday: "Closed"
}
```

**Edit Format (used in forms):**
```javascript
{
  monday: { open: "09:00", close: "17:00", enabled: true },
  tuesday: { open: "09:00", close: "17:00", enabled: true },
  sunday: { open: "09:00", close: "17:00", enabled: false }
}
```

**Conversion happens automatically:**
- When loading for edit: `"09:00 - 17:00"` → `{ open: "09:00", close: "17:00", enabled: true }`
- When saving: `{ open: "09:00", close: "17:00", enabled: true }` → `"09:00 - 17:00"`
- Closed days: `enabled: false` → `"Closed"`

---

## 🎯 User Flow Examples

### **Example 1: Set Default Hours for All Clinics**
1. Go to `/admin/clinic-settings`
2. Click "Operating Hours" tab
3. Set Monday-Friday: 09:00-17:00
4. Set Saturday-Sunday: Closed
5. Click "Save Settings"
6. ✅ These become defaults for new clinics

### **Example 2: Create Custom Hours for One Clinic**
1. Go to `/admin/clinics/1` (specific clinic)
2. Click "Operating Hours" tab
3. Click "Edit Hours"
4. Change Saturday to: 10:00-14:00 (open)
5. Click "Save Changes"
6. ✅ Only this clinic has Saturday hours

### **Example 3: Update Clinic Address**
1. Go to `/admin/clinics/1`
2. Click "Edit Clinic" button
3. Update address fields
4. Click "Save Changes"
5. ✅ Clinic info updated

---

## 🚀 Quick Reference

| Action | Page | Button/Tab |
|--------|------|------------|
| View all clinics | `/admin/clinics` | Sidebar → "Clinics" |
| Add new clinic | `/admin/clinics` | "Add New Clinic" |
| View clinic details | `/admin/clinics/[id]` | "View Details" button |
| Edit clinic info | `/admin/clinics/[id]` | "Edit Clinic" button |
| Edit clinic hours | `/admin/clinics/[id]` | "Operating Hours" tab → "Edit Hours" |
| Set default settings | `/admin/clinic-settings` | Dashboard → "Clinic Settings" |

---

## 📌 Notes

- ⚠️ **All changes are currently local** (mock data) - API integration needed for persistence
- 🔒 **Admin role required** - Other users cannot access these pages
- 🎨 **Consistent UI** - Both pages use emerald-teal gradient theme
- ✅ **Form validation** - Required fields marked with asterisk (*)
- 💾 **Auto-save** - Changes apply immediately (in future with API)

---

## 🐛 Troubleshooting

**Q: I can't see the "Clinics" menu item**
- ✅ Make sure you're logged in as ADMIN role

**Q: Edit Hours button doesn't appear**
- ✅ Navigate to Operating Hours tab first
- ✅ Button appears in top-right of tab content

**Q: Changes don't persist after refresh**
- ✅ Currently using mock data - API integration needed
- ✅ In production, changes will be saved to database

**Q: How do I delete a clinic?**
- ✅ Go to `/admin/clinics`
- ✅ Click red "Delete" button on clinic card
- ✅ Confirm deletion

---

## 🎓 Summary

**Two Main Pages:**
1. **`/admin/clinic-settings`** - Global defaults/system settings
2. **`/admin/clinics/[id]`** - Individual clinic management

**Key Features:**
- ✅ View and edit clinic information
- ✅ Manage operating hours (with toggle edit mode)
- ✅ View staff and services
- ✅ Add/delete clinics
- ✅ Set system-wide defaults

**Operating Hours Can Be Edited:**
- ✅ Checkbox to enable/disable each day
- ✅ Time pickers for open/close times
- ✅ "Closed" status for disabled days
- ✅ Separate edit mode with Save/Cancel buttons

---

**Last Updated:** November 7, 2025  
**Version:** 1.0
