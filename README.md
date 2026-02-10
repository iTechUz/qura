
# EduCup Tournament Manager MVP

O'quv markazlari uchun futbol musobaqalarini boshqarish tizimi. 

## 🚀 Texnologiyalar
- **React + Vite + TypeScript**
- **Zustand**: State management (KISS)
- **Tailwind CSS**: Dashboard UI
- **Local Storage**: Ma'lumotlarni saqlash (Persistence)
- **Lucide React**: Ikonkalar

## ⚽️ Knockout Progression Logic
1. **Round 1**: Random Shuffle (Fisher-Yates) orqali pairing qilinadi. Jamoalar soni toq bo'lsa (masalan 7), bitta jamoa "BYE" holatida avtomatik o'tadi.
2. **Keyingi Round**: Faqat hamma g'oliblar aniqlangandan keyin generatsiya qilinadi.
3. **Downstream Reset**: Agar 1-bosqich natijasi o'zgartirilsa va keyingi bosqichlar mavjud bo'lsa, tizim ogohlantirish beradi va keyingi bosqichlarni reset qiladi.
4. **Tied Matches**: Agar hisob teng bo'lsa, tizim "Select Winner" dropdownini majburiy qilib qo'yadi.

## 📱 Telegram Export
- Har bir bosqich uchun maxsus formatlangan O'zbek tilidagi matnlar.
- **Copy**: Bir klik bilan clipboardga nusxalash.
- **Share**: To'g'ridan-to'g'ri Telegram share linki orqali yuborish.
- **Formatting**: Emoji bilan bezatilgan professional turnir xabarlari.

## 🛠 O'rnatish va Ishga tushirish
```bash
npm install
npm run dev
```

## 💾 LocalStorage Kalitlari
- `educup-storage`: Hamma turnir, jamoa va bosqichlar ma'lumotlari.

## 🔮 Kelajakdagi rejalar
- Group Stage + Knockout qo'shish.
- PDF jadval generatsiyasi.
- Jamoa logolarini yuklash.
