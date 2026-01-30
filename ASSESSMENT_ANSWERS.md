# Vanguard HR Portal - Technical Assessment Submission
**Candidate:** Khensani Ntulo  
**Date:** January 30, 2026  

---

## 🧠 SECTION A: Core Concepts (Personal Summary)

### 1. Navigating the Zoho Ecosystem
*   **Zoho Creator:** This is my primary tool for building bespoke applications. It gives us a blank canvas to design data structures and automated flows that a standard CRM simply can't handle.
*   **Zoho CRM:** This is purpose-built for the sales pipeline. While I can build a CRM in Creator, Zoho CRM comes pre-configured for lead management and sales forecasting, making it the better choice for standard sales teams.
*   **Zoho Analytics:** When my application data grows complex, I use Analytics to find the "story" in the numbers. It provides advanced visualization and cross-functional reporting that goes far beyond a basic list view.

### 2. The Role of Deluge
**Deluge** is essentially the nervous system of any Zoho app I build. It’s what transforms a static form into a living business process. I use it to automate the boring stuff, like sending notifications or syncing data between different apps, so the users can focus on their actual jobs.

### 3. Application Building Blocks
*   **Forms:** The entry point. I treat forms as the source of truth for all data entry.
*   **Reports:** The visibility layer. This is how I ensure managers have the right data at the right time.
*   **Workflows:** My automation engine. It handles the "if-this-then-that" logic that runs behind the scenes.
*   **Functions:** My library of reusable logic. I write these once and call them whenever I need a complex task performed across different parts of the app.

---

## 💻 SECTION B: Practical Automation

### Question 1 – Form Safeguards (Validation)
**Logic:**
My goal is to stop "bad data" from ever reaching the database.
1. First, I check if the `ID_Number` is present. If it's missing, I block the save and tell the user why.
2. Second, I run the `Email_Address` through a pattern check to ensure it's formatted correctly before accepting it.

**My Deluge Script:**
```javascript
// Validating input before submission
if (input.ID_Number == null || input.ID_Number == "") {
    alert "An ID Number is required for this record.";
    cancel submit;
}

// Ensure the email follows a valid structure
if (!input.Email_Address.matches("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$")) {
    alert "The email format is incorrect. Please double-check it.";
    cancel submit;
}
```

### Question 2 – Auto-Notifications
**Logic:** I calculate the time between the start and end dates. If that gap is more than 3 days, I trigger an immediate email alert to the HR team.

**My Deluge Script:**
```javascript
// Triggering an alert for extended leave
leave_length = input.Start_Date.daysBetween(input.End_Date);

if (leave_length > 3) {
    sendmail
    [
        from: zoho.adminuserid
        to: "hr_alerts@vanguard.co.za"
        subject: "Extended Leave Alert: " + input.Employee_Name
        message: "Notice: " + input.Employee_Name + " has applied for " + leave_length + " days of leave."
    ]
}
```

---

## 🗂️ SECTION C: Vanguard HR System Design

I have designed and implemented a working version of this system for **Vanguard HR**.

*   **Structure:** I used a centralized **Employee Master** form which connects to individual logs for Leave, Discipline, and Training. This ensures that when you look up an employee, you see their entire history in one place.
*   **Security:** I follow the "need to know" principle. Employees see their own data; managers see their department; HR admins see everything.
*   **Future Growth:** My design is modular, meaning we can add a "Payroll" or "Performance Review" module later without breaking the current setup.

---

## 🔌 SECTION D: Integration & Maintenance

*   **Financial Sync:** For Zoho Books, I use a trigger that automatically adds a new hire as a contact so they can immediately start submitting expense claims.
*   **External Links:** For payroll, I use an API bridge. When HR clicks "Approve" on a leave form, that data is pushed directly to the payroll system via a secure webhook.
*   **Clean Data:** I set the system to block duplicate ID numbers at the door. If you try to add someone who is already in the system, it will simply say "already exists."

---

## ⚠️ SECTION E: Solving Problems

When something breaks, I don't guess—I investigate:
1. I start with the **Script Logs** to find the exact line where the logic failed.
2. I check **User Permissions** to see if it's a code bug or just a settings issue.
3. I walk through the process myself as a test user to see exactly where the "hiccup" happens.

---

## 🤝 SECTION F: My Professional Standard

*   **Managing Deadlines:** I break big tasks into small, daily wins. I’d rather deliver a perfect small piece on time than a broken large piece late.
*   **Clear Documentation:** I write my code and my notes for the person who will have to maintain this system in two years.
*   **Handling Changes:** If a user changes their mind, I listen first, then explain how it affects the project, and then we agree on the best way forward together.
*   **System Integrity:** Security isn't an afterthought. I build it into the very first form I create.
