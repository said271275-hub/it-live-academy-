# IT Live Academy — Login/Logout va Rol Menyusi Tizimi

Ushbu loyiha IT Live Academy kursi doirasidagi **"Login/Logout va Rol menyusini qo'shish, 3 commit bilan push qilish"** mustaqil amaliy uy vazifasi uchun tayyorlangan.

Loyiha to'liq **React + Vite + TypeScript + Tailwind CSS** texnologiyalarida yaratilgan. Tizimda backend yo'q, barcha kirish va foydalanuvchi ma'lumotlari **soxta (mock data)** bo'lib, o'rganish maqsadida yaratilgan. Holat sahifani yangilaganda (F5) ham `localStorage` da saqlanadi.

---

## 📌 Asosiy Xususiyatlar

1. **5 xil holat (rol)**:
   - **Guest**: Tizimga kirmagan mehmon foydalanuvchi.
   - **Student**: Talaba (kurslar va vazifalar bilan ishlaydi).
   - **Mentor**: Ustoz (guruhlarni boshqaradi va vazifalarni tekshiradi).
   - **Admin**: Administrator (foydalanuvchilar, rollar va statistikani ko'radi).
   - **Blocked**: Bloklangan hisob (barcha funksiyalar yopiq, faqat ogohlantirish va chiqish tugmasi mavjud).

2. **Dinamik Rol Menyusi (`RoleMenu`)**:
   - Har bir rolga mos tugmalar bitta ma'lumotlar konfiguratsiyasidan (`ROLE_MENU_CONFIG`) o'qiladi.
   - JSX ichida qattiq yozilmagan.

3. **User Cabinet kartasi (`UserCabinet`)**:
   - Amaliy vazifa rasmidagi kabi "User Cabinet" oynasi.
   - Joriy foydalanuvchi ismi, maxsus rangli rol nishoni (badge) va rol tavsifi.
   - 5 ta rolning interaktiv xaritasi va faol roldagi yashil tasdiq belgisi.

4. **Kirish formasi (`LoginForm`)**:
   - Login va parol tekshiruvi.
   - Noto'g'ri kiritilganda o'zbekcha aniq xatolik xabari.
   - Demo foydalanuvchilarni bitta tugma bilan tezkor to'ldirish imkoniyati.

5. **Chiqish (`Logout`)**:
   - Tizimdan chiqilganda darhol `Guest` holatiga qaytadi va `localStorage` tozalanadi.

6. **Avtomatik testlar (`Vitest` + `React Testing Library`)**:
   - Barcha 5 ta holat, login, xatolik, logout va F5 saqlanishi 100% testlar bilan qoplangan.

---

## 👥 Demo Foydalanuvchilar (Soxta hisoblar)

> ⚠️ **Eslatma:** Ushbu tizim faqat o'quv maqsadida yaratilgan soxta (mock) tizimdir. Hech qanday haqiqiy parol yoki tashqi server ishlatilmaydi.

| Foydalanuvchi nomi (`username`) | Demo Parol | Roli (`role`) | Ko'rinadigan Menyu |
| :--- | :--- | :--- | :--- |
| *(Kirmagan holda)* | — | **Guest** | `Bosh sahifa`, `Kurslar`, `Kirish` |
| `student` | `123` | **Student** | `Bosh sahifa`, `Mening kurslarim`, `Vazifalar`, `Profil`, `Chiqish` |
| `mentor` | `123` | **Mentor** | `Bosh sahifa`, `Guruhlarim`, `Vazifalarni tekshirish`, `Profil`, `Chiqish` |
| `admin` | `123` | **Admin** | `Bosh sahifa`, `Foydalanuvchilar`, `Rollar`, `Statistika`, `Chiqish` |
| `blocked` | `123` | **Blocked** | *Menyu yo'q* (faqat "Akkaunt bloklangan" va Chiqish) |

---

## 📋 5 Holat Uchun Tekshiruv Jadvali

| # | Holat / Rol | Tekshirish Qadami | Kutilgan Natija | Holati |
|---|---|---|---|---|
| 1 | **Guest** | Dastur ilk marta ochilganda | Navbar: `Bosh sahifa`, `Kurslar`, `Kirish`. UserCabinet: "Mehmon". | ✅ Tasdiqlangan |
| 2 | **Student** | Login: `student`, Parol: `123` | Navbar: `Bosh sahifa`, `Mening kurslarim`, `Vazifalar`, `Profil`, `Chiqish`. Badge: Ko'k (Student). | ✅ Tasdiqlangan |
| 3 | **Mentor** | Login: `mentor`, Parol: `123` | Navbar: `Bosh sahifa`, `Guruhlarim`, `Vazifalarni tekshirish`, `Profil`, `Chiqish`. Badge: Yashil (Mentor). | ✅ Tasdiqlangan |
| 4 | **Admin** | Login: `admin`, Parol: `123` | Navbar: `Bosh sahifa`, `Foydalanuvchilar`, `Rollar`, `Statistika`, `Chiqish`. Badge: Binafsharang (Admin). | ✅ Tasdiqlangan |
| 5 | **Blocked** | Login: `blocked`, Parol: `123` | Navigatsiya menyusi ko'rinmaydi. Ekranda "Akkaunt bloklangan" xabari va qizil "Tizimdan chiqish" tugmasi chiqadi. | ✅ Tasdiqlangan |
| 6 | **Logout** | "Chiqish" tugmasini bosish | Tizim darhol Guest holatiga qaytadi, `localStorage` tozalanadi. | ✅ Tasdiqlangan |
| 7 | **F5 Saqlanish** | Kirilgan holda brauzerda F5 bosish | Sahifa yangilansa ham kiritilgan rol o'zgarmasdan saqlanib turadi. | ✅ Tasdiqlangan |

---

## 🚀 Loyihani Ishga Tushirish

1. **Kutubxonalarni o'rnatish** (agar hali o'rnatilmagan bo'lsa):
   ```bash
   npm install
   ```

2. **Dasturni rivojlantirish (dev) rejimida ishga tushirish**:
   ```bash
   npm run dev
   ```
   Brauzeringizda `http://localhost:5173` manzilini oching.

3. **Avtomatlashtirilgan testlarni ishga tushirish**:
   ```bash
   npm test
   ```

4. **Production uchun yig'ish (build)**:
   ```bash
   npm run build
   ```

---

## 📦 Tavsiya etiladigan 3 Commit Rejasi

Vazifa talabi: **"3 commit bilan push qiling"**. O'zingiz saqlashingiz uchun qulay commit ketma-ketligi:

### 1-Commit: Asosiy sozlamalar, turlar va ma'lumotlar konfiguratsiyasi
```bash
git add package.json tsconfig.json vite.config.ts tailwind.config.js postcss.config.js index.html .gitignore src/types/ src/data/ src/index.css
git commit -m "feat: loyiha bazasi, TypeScript turlari va rol ma'lumotlari konfiguratsiyasini yaratish"
```

### 2-Commit: UI komponentlar va asosiy autentifikatsiya oqimi
```bash
git add src/components/ src/App.tsx src/main.tsx
git commit -m "feat: LoginForm, RoleMenu, UserCabinet, BlockedNotice komponentlari va App holatini ulash"
```

### 3-Commit: Avtomatik testlar va to'liq hujjatlashtirish
```bash
git add src/test/ src/App.test.tsx README.md
git commit -m "test: 5 ta rol holati va autentifikatsiya testlarini qo'shish hamda README tayyorlash"
```

Push qilish:
```bash
git push origin main
```
