# SDWA Administrator User Manual

Welcome to the **Salem District Weightlifting Association (SDWA)** Content Management System (CMS). This guide provides step-by-step instructions for managing website content without technical assistance.

---

## 1. Accessing the Admin Portal

1. Navigate to: `https://sdwa.in/admin/login` (or `/admin/login` on your domain).
2. Enter your authorized administrator email and password.
3. Click **Sign In to Dashboard**.
4. Upon successful login, you will arrive at the **Admin Dashboard Overview**.

---

## 2. Managing Tournaments & Championships

### A. Creating a New Tournament
1. In the sidebar, click **Tournaments** → **Create Tournament** (`/admin/tournaments/new`).
2. Fill in the tournament details:
   - **Championship Title**: e.g., *Salem District Senior Weightlifting Championship 2026*
   - **Venue / Arena**: e.g., *District Sports Complex, Salem*
   - **Start & End Dates**: Competition timeline.
   - **Registration URL**: Paste the external Google Form link where lifters apply.
   - **Registration Status**: Set to `Open` (Accepting Entries).
   - **Registration Deadline**: Set the cut-off date. *(After this date, the public site automatically locks entries and marks the event as Deadline Passed).*
   - **Official Poster**: Upload the event poster (Cloudinary).
   - **Weight Divisions & Classes**: Check the applicable age/weight brackets.
3. Toggle **Publish on public site**.
4. Click **Create Tournament**.

### B. Closing Registration Manually
1. Go to **Tournaments** and click **Edit** on the tournament.
2. Change **Registration Status** to `CLOSED`.
3. Click **Save Changes**. The public website will immediately display **Registration Closed**.

---

## 3. Managing Achievements & Podium Records

### A. Adding an Achievement Record
1. Click **Achievements** → **Create Achievement** (`/admin/achievements/new`).
2. Enter:
   - **Achievement Title**: e.g., *Gold Medal in 73kg Senior Men Division*
   - **Event / Meet Name**: e.g., *Tamil Nadu State Senior Championship 2025*
   - **Category**: Select division (Senior / Junior / Youth).
   - **Competition Level**: Select District, State, National, or International.
   - **Season Years**: Enter Start Year (e.g. `2025`) and End Year (e.g. `2026`).
   - **Venue**: e.g., *Chennai Stadium*
   - **Description**: Summary of medal tally or lift statistics.
   - **Photographs**: Upload podium or medal ceremony pictures.
3. Toggle **Featured on homepage** if this is a premier milestone.
4. Toggle **Publish on public site** and click **Create Achievement**.

---

## 4. Managing the Photo Gallery

### A. Creating a New Album
1. Click **Gallery** → **Create Album** (`/admin/gallery`).
2. Enter the **Album Title** (e.g., *District Championship 2026 Highlights*), date, and brief description.
3. Upload the **Cover Image**.
4. Click **Create Album**.

### B. Adding Photos to an Album
1. Click on the album in the gallery list to open its photo manager.
2. Use the **Upload Photos** dropzone to select and upload high-resolution images.
3. Enter optional captions for key photos.
4. Changes appear on the public gallery immediately.

---

## 5. Managing Affiliated Academies & Gyms

1. Click **Institutions** (`/admin/institutions`).
2. Click **Add Institution**.
3. Fill in:
   - **Institution Name**: e.g., *Isha Gym Weightlifting Sports Academy*
   - **Organization Type**: Choose Gym, Sports Academy, or Educational Institution.
   - **Head Coach**: Name of the lead trainer.
   - **Contact Phone & Email**: Official contact details.
   - **Address**: Gym address in Salem district.
   - **Logo / Crest**: Upload the academy emblem.
4. Click **Save Institution**.

---

## 6. Updating Executive Committee Office Bearers

1. Click **Committee** (`/admin/committee`).
2. To add a new member: click **Add Member**, enter name, designation (e.g., *President*, *General Secretary*, *Treasurer*), display order, and upload a portrait photograph.
3. To edit an existing officer: click **Edit** on their card, adjust information or photo, and save.
4. To remove an officer: click **Delete** and confirm.

---

## 7. Association Secretariat Settings & Working Hours

1. Click **Settings** (`/admin/settings`).
2. Here you can update:
   - **Official Phone & Email**: Updates the navbar, footer, and contact page.
   - **Headquarters Address**: Updates footer and secretariat display.
   - **Registration Number**: Association legal registration info.
   - **Operating & Training Hours**: Set daily opening and closing hours for Salem headquarters.
   - **Social Media Links**: Enter official URLs for Instagram, Facebook, and YouTube. *(If left blank, social icons remain hidden on the website).*
3. Click **Save Settings**.

---

## 8. Security & Account Best Practices

- **Never share your administrator login credentials.**
- **Log out** when using shared computers or mobile devices.
- Images should be clean, high-resolution JPEG, PNG, or WebP formats.
- For emergency technical support, contact your designated web engineering team.
