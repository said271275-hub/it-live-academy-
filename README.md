# IT LIVE Academy - CRM & Admin Dashboard

"IT LIVE Academy" zamonaviy o'quv markazlari uchun mo'ljallangan to'liq ishlaydigan, keng ko'lamli CRM va boshqaruv tizimi (Admin Dashboard).

---

## 🚀 Ishga tushirish (Getting Started)

Loyiha papkasida quyidagi buyruqlar orqali dasturni ishga tushirishingiz mumkin:

```bash
# Paketlarni o'rnatish
npm install

# Dasturni ishlab chiquvchi rejimida ishga tushirish
npm run dev

# Production uchun yig'ish (Build)
npm run build
```

Ishga tushgach, brauzerda `http://localhost:3000` manzilini oching.

---

## 🔑 Demo Kirish Hisoblari (Authentication & Roles)

Tizimda 3 ta alohida rol mavjud va har biri o'ziga xos sahifalar va ruxsatlarga ega:

| Rol | Email | Parol | Ruxsatlar |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@itlive.uz` | `admin123` | Barcha sahifalar, o'qituvchilar, tahlil va to'liq boshqaruv |
| **Manager** | `manager@itlive.uz` | `manager123` | O'quvchilar, guruhlar, to'lovlar, leadlar va davomat |
| **Teacher** | `teacher@itlive.uz` | `teacher123` | O'z guruhlari, dars jadvali, davomat va sozlamalar |

*Eslatma:* Login sahifasida pastdagi "Tezkor demo login" tugmalarini bosib, bir zumda kirish mumkin. Shuningdek, tizim ichida Topbar dagi profil menyusidan rolni bir marta bosish bilan almashtirib ko'rish imkoniyati mavjud.

---

## 🛠 Texnologiyalar Staki

- **Asosiy**: React 18, Vite, JavaScript (JSX)
- **Styling**: Tailwind CSS v3 (To'liq Dark va Light mavzusi qo'llab-quvvatlangan)
- **Marshrutlash**: React Router v6 (Protected routes, Nested layout)
- **Holat boshqaruvi**: React Context API (`AuthContext`, `UIContext`, `DataContext`)
- **Grafiklar & Diagrammalar**: Recharts (BarChart, AreaChart, PieChart donut)
- **Ikonkalar**: Lucide React
- **Sana bilan ishlash**: date-fns
- **Ma'lumotlar saqlanishi**: Realistik mock data (150+ talaba, 12+ kurs, 10+ ustoz, 20+ guruh, 40+ lead, 300+ to'lov) va `localStorage` ga to'liq sinxronlash (`src/services/api.js`).

---

## 📋 Tizim Funksiyalari va Sahifalar

### 1. Dashboard (Boshqaruv paneli)
- 4 ta real hisoblanadigan KPI stat kartalar (Total Students, Courses, Revenue, Completion Rate)
- Oylik o'quvchilar o'sishi bar-charti
- Kurslar yo'nalishlari donut diagrammasi
- Tushumlar dinamikasi (oylik va haftalik toggle bilan area-chart)
- Bugungi darslar ro'yxati, Top-5 qarzdorlar ro'yxati va so'nggi to'lovlar
- Tezkor amallar: yangi o'quvchi qo'shish, to'lov qabul qilish, lead ochish

### 2. Students (O'quvchilar boshqaruvi)
- Ko'p parametrli qidiruv va filter (kurs, guruh, status, to'lov holati)
- Saralash (sorting) va pagination (10/25/50)
- Bulk amallar: bir vaqtning o'zida bir nechtasini tanlab o'chirish yoki statusini o'zgartirish
- O'quvchi qo'shish va tahrirlash modali (+998 formati bilan)
- CSV export va CSV import imkoniyati
- **Student Detail sahifasi**: Tablar (Profil, To'lovlar tarixi, Davomat, Baholar, Izohlar), guruhga ko'chirish va kursni muzlatish/faollashtirish

### 3. Leads (Sotuv voronkasi - Kanban doskasi)
- 6 bosqichli Kanban: *Yangi → Aloqada → Sinov darsi → To'lov kutilmoqda → O'quvchi bo'ldi / Rad etildi*
- Drag & Drop orqali kartalarni bosqichlar orasida ko'chirish
- Lead qo'shish (manbalar: Instagram, Telegram, Tavsiya, Sayt)
- "O'quvchiga aylantirish" tugmasi: leadni avtomatik ravishda Students bazasiga qo'shadi va tanlangan guruhga biriktiradi

### 4. Courses (O'quv kurslari)
- Katak (Grid) va Ro'yxat (List) ko'rinishi
- Kurs kartasi: nomi, kategoriya, oylik narxi, davomiyligi, biriktirilgan mentor, to'lish darajasi
- To'liq CRUD (qo'shish, tahrirlash, o'chirish) va kategoriyalar bo'yicha filter

### 5. Teachers (O'qituvchilar va Mentorlar)
- Mentorlar kartalari, mutaxassislik, telefon, biriktirilgan guruhlar va o'quvchilar soni
- Maosh hisob-kitobi: Foiz ulushi (%) yoki Fiksatlangan oylik summa bo'yicha avtomatik hisoblash
- Qo'shish, tahrirlash, o'chirish

### 6. Groups (Guruhlar boshqaruvi)
- Guruh nomi, kurs, ustoz, kunlar va vaqt, xona, sig'im va boshlanish sanalari
- Guruh to'lish darajasi (progress bar)
- Guruh ichidagi o'quvchilar ro'yxatini alohida modalda ko'rish

### 7. Attendance (Davomat)
- Guruh va sana tanlash
- Har bir o'quvchiga status berish: *Keldi / Kelmadi / Sababli / Kechikdi*
- Barcha o'quvchilarni bir tugma bilan "Hammasi keldi" / "Hammasi kelmadi" qilish
- 3 dars ketma-ket qoldirgan o'quvchilarga ogohlantiruvchi signal (Warning badge)
- Saqlash tugmasi orqali localStorage ga yozish

### 8. Payments (Moliya va To'lovlar)
- Tushumlar jadvali, to'lov usullari (Payme, Click, Naqd, Karta)
- To'lov qabul qilish modali: chegirma va keyingi to'lov sanasini kiritish
- Qarzdorlar alohida tab: qarz summasi va kechikkan kunlar hisobi
- **Kvitansiya (Chek) chiqarish**: Rasmiy chek modali va `window.print()` orqali printerdan chop etish / PDF ga saqlash
- CSV ga eksport qilish

### 9. Schedule (Dars jadvali)
- Haftalik kalendar jadvali (Dushanba - Yakshanba)
- Xonalar va o'qituvchilar bo'yicha filter
- Yangi dars qo'shishda **to'qnashuvlarni (conflict) tekshirish**: bir xil vaqtda bitta xona yoki o'qituvchiga dars qo'yilsa, xatolik beradi

### 10. Analytics (Tahliliy hisobotlar)
- Lead konversiyasi va Churn rate (o'quvchilar chiqib ketish foizi)
- Eng mashhur kurslar reytingi
- O'sish dinamikasi grafigi (o'quvchilar va leadlar nisbati)
- O'qituvchilar samaradorligi
- Davr filteri (7 kun, 30 kun, 1 yil) va matnli tahliliy hisobotni yuklab olish

### 11. Settings (Tizim sozlamalari)
- Markaz ma'lumotlari: nomi, telefon, manzil, veb-sayt
- Ko'rinish: Dark theme va Light theme o'rtasida almashtirish (tanlov saqlanadi)
- Valyuta (UZS / USD) va til (O'zbekcha / Inglizcha) sozlamalari
- Profil tahriri va parolni yangilash
- **Zaxira nusxalash (Backup & Restore)**: Ma'lumotlarni JSON fayl sifatida eksport qilish va fayldan qayta tiklash
- **Reset Demo Data**: barcha ma'lumotlarni dastlabki toza demo holatiga qaytarish

---

## 📂 Papkalar Strukturasi

```
uyga fazifa/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── common/         # StatCard, Badge, Avatar, Modal, ConfirmDialog, Tabs, Toast, Skeleton, EmptyState
    │   ├── dashboard/      # QuickModals (Tezkor qo'shish)
    │   ├── layout/         # Sidebar, Topbar
    │   ├── payments/       # ReceiptModal (Chop etiladigan kvitansiya)
    │   └── students/       # StudentFormModal, StudentImportModal
    ├── data/
    │   └── mockData.js     # 150+ talaba, 12+ kurs, 10+ ustoz, guruhlar, leadlar, to'lovlar
    ├── hooks/
    │   ├── useLocalStorage.js
    │   ├── useDebounce.js
    │   └── useTable.js     # Filter, sort, pagination, bulk selection
    ├── layouts/
    │   └── MainLayout.jsx
    ├── pages/              # Dashboard, Students, StudentDetail, Leads, Courses, Teachers, Groups, Attendance, Payments, Schedule, Analytics, Settings, Login, NotFound
    ├── routes/
    │   ├── AppRoutes.jsx
    │   └── ProtectedRoute.jsx
    ├── services/
    │   └── api.js          # Mock API layer localStorage bilan sinxronlashgan
    ├── store/
    │   ├── AuthContext.jsx # Autentifikatsiya va rollar
    │   ├── UIContext.jsx   # Mavzu, bildirishnomalar (toasts), sozlamalar
    │   └── DataContext.jsx # Barcha ob'ektlar global do'koni
    └── utils/
        ├── cn.js
        └── formatters.js   # Valyuta, sana, telefon formatlagichlari
```
