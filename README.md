
# TEMU (Terintegrasi UMKM Kabupaten Bekasi)

> Platform digital terintegrasi untuk mendukung, mengelola, dan memajukan Usaha Mikro, Kecil, dan Menengah (UMKM) di Kabupaten Bekasi.

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

---

## Tentang Proyek

**TEMU** adalah platform berbasis web yang dirancang khusus untuk menjembatani pelaku UMKM, pemerintah daerah (Dinas UMKM Kabupaten Bekasi), dan masyarakat luas. Sistem ini menyediakan direktori produk UMKM, informasi berita & kegiatan terkini, manajemen mitra, serta panel administrasi terpadu untuk mengelola seluruh ekosistem digital UMKM secara transparan dan efisien.

---

## Fitur Utama

### Sisi Publik (Frontend)
* **Katalog & Direktori UMKM**: Pencarian produk dan profil UMKM lokal dengan filter kategori.
* **Berita & Agenda Kegiatan**: Informasi seputar pelatihan, pameran, dan pengumuman penting bagi pelaku UMKM.
* **Peta UMKM**: Visualisasi persebaran lokasi UMKM di Kabupaten Bekasi.
* **Halaman Kontak Interaktif**: Formulir pengaduan dan layanan bantuan yang terhubung langsung ke sistem admin.

### Panel Administrasi (Dashboard Admin)
* **Manajemen Peran (Role-Based Access Control)**: Pengaturan hak akses untuk *Super Admin*, *Admin*, dan *Kontributor Berita*.
* **Manajemen Data**: Pengelolaan Kategori, UMKM, Produk, Mitra, dan Banner secara real-time.
* **Kotak Masuk (Invoices/Messages)**: Fitur pengelolaan pesan masuk dari pengguna dengan indikator badge notifikasi unread.
* **Log Aktivitas & Pengaturan Situs**: Memantau rekam jejak aktivitas admin serta konfigurasi situs web.

---

## Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Ikon**: [@mdi/react](https://materialdesignicons.com/) (Material Design Icons)
* **Notifikasi & UI Alert**: [SweetAlert2](https://sweetalert2.github.io/)
* **Database & ORM**: Turso SQLite

---

## Panduan Instalasi & Menjalankan Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal di komputer Anda:

1. **Clone repository ini**
 ```bash
   git clone repo ini
```

2. **Installdependencies**
```bash
npm install
# atau
yarn install
```

3. **Konfigurasi Environment Variables**
Buat file bernama `.env.local` di root folder project, lalu sesuaikan konfigurasi berikut:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

```

4. **Jalankan server pengembangan (Development Server)**
```bash
npm run dev
# atau
yarn dev

```

5. Buka browser Anda dan akses [http://localhost:3000](http://localhost:3000).

---

## Lisensi

Hak Cipta © 2026 **Pemerintah Kabupaten Bekasi / Tim Sains Data ITSB**. Seluruh hak cipta dilindungi undang-undang.
