# 🚀 Checker App Store Submission Guide

This guide walks you through submitting Checker for App Store review.

---

## 📁 What's Included

```
appstore/
├── SUBMISSION_GUIDE.md      ← You are here
├── privacy-policy.md        ← Privacy policy (needs to be hosted online)
├── app-store-metadata.md    ← All text content for App Store Connect
└── screenshots/             ← Generated App Store screenshots
    ├── screenshot_main_calendar.png
    ├── screenshot_entry_modal.png
    ├── screenshot_analytics.png
    ├── screenshot_companies.png
    └── screenshot_security.png
```

---

## ⚠️ BEFORE YOU SUBMIT

### 1. Host Your Privacy Policy

Apple requires a **publicly accessible** privacy policy URL. Options:

**Option A: GitHub Pages (Free & Easy)**

1. Create a new public GitHub repo or use existing
2. Add the privacy policy content as `privacy.html` or use GitHub Pages
3. Your URL will be: `https://yourusername.github.io/repo/privacy`

**Option B: Your Own Website**

1. Upload to your domain at: `https://miksiklabs.com/checker/privacy`

**Option C: Notion (Quick)**

1. Create a Notion page with the privacy policy
2. Make it public and use the share link

### 2. Create a Support Page

Simple support page with:

- App name and description
- Contact email for support
- FAQ (optional)

---

## 📱 Step-by-Step Submission

### Step 1: Go to App Store Connect

1. Visit [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Sign in with your Apple Developer account
3. Click **My Apps** → Select **Checker**

### Step 2: App Information Tab

Fill in these fields:

| Field                  | Value                          |
| ---------------------- | ------------------------------ |
| **Name**               | Checker                        |
| **Subtitle**           | Work Hours & Earnings Tracker  |
| **Primary Category**   | Productivity                   |
| **Secondary Category** | Business                       |
| **Privacy Policy URL** | Your hosted privacy policy URL |
| **License Agreement**  | Use Apple's Standard EULA      |

### Step 3: Pricing and Availability

1. **Price**: Select **Free** (or your preferred price tier)
2. **Availability**: Select countries (recommend **All territories**)
3. **Pre-Order**: Leave unchecked for immediate release

### Step 4: Prepare for Submission (iOS App Section)

#### Version Information

Copy from `app-store-metadata.md`:

- **Description**: The full app description
- **Keywords**: `work hours,time tracker,hourly rate,freelance,timesheet,earnings,salary,invoice,productivity,clock`
- **Promotional Text**: Short promo text (can be changed without app update)
- **What's New**: Version release notes

#### Screenshots

Upload the screenshots from the `screenshots/` folder:

| Screenshot                   | Order | Caption                                             |
| ---------------------------- | ----- | --------------------------------------------------- |
| screenshot_main_calendar.png | 1     | Track your work hours with an elegant calendar view |
| screenshot_entry_modal.png   | 2     | Log hours with start/end times and break tracking   |
| screenshot_analytics.png     | 3     | View your earnings with beautiful analytics         |
| screenshot_companies.png     | 4     | Manage multiple companies or clients                |
| screenshot_security.png      | 5     | Protect your data with Face ID                      |

**Screenshot sizes needed:**

- 6.7" (iPhone 15 Pro Max): Required ✅
- 6.5" (iPhone 14 Plus): Optional but recommended
- iPad Pro: Required if `supportsTablet: true` ⚠️

> **Note**: For iPad screenshots, you can use the same images scaled, or take actual iPad screenshots from your simulator.

#### App Icon

Your 1024x1024 icon should auto-populate from the build.

### Step 5: App Review Information

#### Contact Info

Fill in your personal contact information:

- First Name
- Last Name
- Email
- Phone Number

#### Demo Account

Select **"Sign-in is not required"** - Checker works without any login.

#### Notes

Copy the reviewer notes from `app-store-metadata.md`. This tells the reviewer how to test your app.

### Step 6: Select Your Build

1. Click the **"+"** button next to "Build"
2. Select the build you uploaded to TestFlight
3. Wait for it to process if just uploaded

### Step 7: Age Rating

Click **Edit** next to Age Rating and answer:

- Answer **None** to all content questions
- No unrestricted web access
- Result: **4+** rating

### Step 8: Final Review

1. Check all sections show green checkmarks ✅
2. Click **Add for Review**
3. Answer export compliance: **No** (encryption already declared in app.json)
4. Click **Submit for Review**

---

## 📊 What to Expect

| Timeline         | Status                                |
| ---------------- | ------------------------------------- |
| **Immediately**  | Waiting for Review                    |
| **24-48 hours**  | In Review                             |
| **After review** | Approved ✅ or Rejected with feedback |

**First submission** typically takes 24-48 hours. Updates are usually faster.

---

## ❌ Common Rejection Reasons & Fixes

| Issue                                 | Solution                                                |
| ------------------------------------- | ------------------------------------------------------- |
| **Privacy Policy not accessible**     | Ensure URL loads without login                          |
| **Incomplete metadata**               | Fill all required fields                                |
| **Broken functionality**              | Test all features before submission                     |
| **Misleading screenshots**            | Screenshots must show actual app                        |
| **iPad support claim but no iPad UI** | Either disable `supportsTablet` or add iPad screenshots |

---

## 🎉 After Approval

Once approved, you can:

1. **Release immediately** or schedule a release date
2. **Enable phased release** (gradual rollout over 7 days)
3. **Set up App Analytics** to track downloads

---

## 📞 Need Help?

- **Apple Developer Support**: [developer.apple.com/contact](https://developer.apple.com/contact)
- **App Store Review Guidelines**: [developer.apple.com/app-store/review/guidelines](https://developer.apple.com/app-store/review/guidelines)

---

**Good luck with your submission! 🍀**
