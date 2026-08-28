"use client";


import React, { useState } from "react";
import Icon from "@mdi/react";
import { 
  mdiAccountGroupOutline, 
  mdiStoreOutline, 
  mdiFileCertificateOutline, 
  mdiDatabaseSyncOutline, 
  mdiCashFast, 
  mdiSchoolOutline, 
  mdiChartLine, 
  mdiClipboardCheckOutline, 
  mdiBullhornOutline, 
  mdiAccountDetailsOutline, 
  mdiFileDocumentEditOutline, 
  mdiBankOutline, 
  mdiSeal, 
  mdiLightbulbOnOutline, 
  mdiLaptop, 
  mdiHumanMaleBoard, 
  mdiHandshakeOutline, 
  mdiChartTimelineVariant, 
  mdiTrophyOutline, 
  mdiShieldSearch, 
  mdiCheckCircle, 
  mdiOpenInNew 
} from "@mdi/js";

export default function LayananPage() {
  
  const [activeTab, setActiveTab] = useState<"koperasi" | "umkm">("koperasi");

  
  const koperasiServices = [
    {
      title: "Pendaftaran Sertifikat NIK & Legalisasi Koperasi",
      category: "Kelembagaan",
      description: "Layanan penerbitan Nomor Induk Koperasi (NIK) dan verifikasi legalitas status badan hukum koperasi agar diakui secara resmi oleh negara.",
      icon: mdiFileCertificateOutline,
      features: [
        "Verifikasi berkas pendirian koperasi",
        "Penerbitan Sertifikat NIK resmi",
        "Legalisasi status badan hukum"
      ]
    },
    {
      title: "Pendataan & Pemutakhiran Data Koperasi",
      category: "Pendataan",
      description: "Integrasi dan pembaruan database profil kelembagaan, keanggotaan, serta aktivitas operasional koperasi secara terpadu di Kabupaten Bekasi.",
      icon: mdiDatabaseSyncOutline,
      features: [
        "Pembaruan profil kelembagaan",
        "Validasi data keanggotaan aktif",
        "Pelaporan kinerja berkala"
      ]
    },
    {
      title: "Fasilitasi Akses Pembiayaan Koperasi",
      category: "Pembiayaan",
      description: "Menghubungkan koperasi dengan lembaga keuangan formal, serta pendampingan prosedur izin pembukaan kantor cabang simpan pinjam.",
      icon: mdiCashFast,
      features: [
        "Akses modal lembaga keuangan",
        "Izin pembukaan cabang simpan pinjam",
        "Asistensi manajemen permodalan"
      ]
    },
    {
      title: "Pelatihan & Pengembangan SDM Koperasi",
      category: "Kapasitas SDM",
      description: "Bimbingan teknis untuk pengurus, pengawas, dan anggota guna meningkatkan keahlian tata kelola serta akuntabilitas koperasi.",
      icon: mdiSchoolOutline,
      features: [
        "Pelatihan manajemen akuntansi",
        "Bimbingan teknis pengurus & pengawas",
        "Workshop kepemimpinan koperasi"
      ]
    },
    {
      title: "Pendampingan Pengembangan Koperasi",
      category: "Pendampingan",
      description: "Konsultasi teknis lapangan dan pendampingan bisnis secara langsung untuk mendorong transformasi koperasi yang mandiri dan sehat.",
      icon: mdiChartLine,
      features: [
        "Mentoring operasional lapangan",
        "Strategi diversifikasi usaha",
        "Penyehatan tata kelola internal"
      ]
    },
    {
      title: "Pengawasan & Evaluasi Koperasi",
      category: "Pengawasan",
      description: "Pemeriksaan rutin kesehatan finansial, pemantauan kepatuhan terhadap perundang-undangan, serta evaluasi Rapat Anggota Tahunan (RAT).",
      icon: mdiClipboardCheckOutline,
      features: [
        "Pemeriksaan kesehatan usaha",
        "Monitoring pelaksanaan RAT",
        "Evaluasi kepatuhan regulasi"
      ]
    },
    {
      title: "Promosi & Pemasaran Produk Koperasi",
      category: "Pemasaran",
      description: "Fasilitasi perluasan jaringan pemasaran produk unggulan koperasi melalui pameran, expo daerah, dan integrasi rantai pasok.",
      icon: mdiBullhornOutline,
      features: [
        "Keikutsertaan event/pameran",
        "Publikasi produk koperasi",
        "Temu usaha & kemitraan pasar"
      ]
    },
  ];

  
  const umkmServices = [
    {
      title: "Pendataan & Pemutakhiran Data UMKM",
      category: "Data UMKM",
      description: "Layanan pendataan resmi bagi pelaku usaha untuk terdaftar secara sah pada Direktori Terpadu Dinas Koperasi & UMKM Kabupaten Bekasi.",
      icon: mdiAccountDetailsOutline,
      features: [
        "Pendaftaran direktori digital",
        "Verifikasi lokasi & bidang usaha",
        "Pembaruan status aktivitas bisnis"
      ]
    },
    {
      title: "Pembuatan NIB (Nomor Induk Berusaha)",
      category: "Legalitas Usaha",
      description: "Layanan asistensi pembuatan legalitas formal bisnis melalui sistem OSS (Online Single Submission) agar memiliki identitas hukum terdaftar.",
      icon: mdiFileDocumentEditOutline,
      features: [
        "Pembuatan akun OSS RBA",
        "Penerbitan NIB instan & legal",
        "Klasifikasi KBLI yang sesuai"
      ]
    },
    {
      title: "Fasilitasi Akses Pembiayaan & Permodalan",
      category: "Permodalan",
      description: "Menghubungkan UMKM potensial dengan program Kredit Usaha Rakyat (KUR), perbankan, serta lembaga keuangan penyedia modal usaha.",
      icon: mdiBankOutline,
      features: [
        "Asistensi pengajuan KUR",
        "Akses dana bergulir / perbankan",
        "Pendampingan kelayakan finansial"
      ]
    },
    {
      title: "Pendampingan Sertifikasi Halal",
      category: "Gratis / Fasilitasi",
      description: "Membantu para pelaku usaha dalam proses pengajuan sertifikasi halal produk (khusus makanan & minuman) agar dipercaya konsumen luas.",
      icon: mdiSeal,
      features: [
        "Pengecekan kehalalan bahan baku",
        "Pendampingan input data SIHALAL",
        "Konsultasi jalur self-declare / reguler"
      ]
    },
    {
      title: "Fasilitasi Hak Kekayaan Intelektual (HAKI)",
      category: "Perlindungan HAKI",
      description: "Pendampingan pendaftaran Hak Merek Dagang dan Hak Cipta produk untuk melindungi aset intelektual identitas bisnis dari pemalsuan.",
      icon: mdiLightbulbOnOutline,
      features: [
        "Penelusuran penamaan merek",
        "Fasilitasi pendaftaran ke DJKI",
        "Perlindungan hak cipta logo & produk"
      ]
    },
    {
      title: "Transformasi & Pelatihan Digital",
      category: "Peningkatan Kapasitas",
      description: "Program bimbingan teknis bagi pelaku usaha untuk mengadopsi teknologi digital dalam pemasaran, pencatatan keuangan, hingga manajemen online.",
      icon: mdiLaptop,
      features: [
        "Pelatihan e-commerce & sosmed",
        "Strategi foto produk menarik",
        "Edukasi aplikasi keuangan digital"
      ]
    },
    {
      title: "Pendampingan & Konsultasi Usaha",
      category: "Konsultasi Bisnis",
      description: "Layanan klinik konsultasi 1-on-1 bersama tim pendamping profesional untuk solusi berbagai hambatan operasional dan manajerial bisnis.",
      icon: mdiHumanMaleBoard,
      features: [
        "Konsultasi manajemen operasional",
        "Solusi permasalahan kemasan",
        "Bimbingan standarisasi mutu"
      ]
    },
    {
      title: "Publikasi Berita & Media Promosi",
      category: "Branding & Eksposur",
      description: "Sarana publikasi profil usaha, liputan kegiatan, dan katalog produk melalui portal resmi untuk mendongkrak visibilitas brand UMKM.",
      icon: mdiBullhornOutline,
      features: [
        "Liputan profil usaha pilihan",
        "Penyebaran informasi event / bazar",
        "Katalog produk terpusat"
      ]
    },
    {
      title: "Fasilitasi Kemitraan Strategis",
      category: "Perluasan Pasar",
      description: "Menghubungkan UMKM potensial dengan jaringan ritel modern, pasar digital, BUMN, maupun korporasi swasta untuk memperluas rantai pasok.",
      icon: mdiHandshakeOutline,
      features: [
        "Kurasi produk siap pasar",
        "Pameran & bazar tematik",
        "Business matching B2B"
      ]
    },
    {
      title: "Pengukuran & Pengembangan Omzet",
      category: "Pengembangan Usaha",
      description: "Pemantauan skala usaha serta analisis pertumbuhan pendapatan bulanan guna menentukan strategi eskalasi bisnis yang presisi.",
      icon: mdiChartTimelineVariant,
      features: [
        "Evaluasi tren penjualan bulanan",
        "Pendampingan strategi penetapan harga",
        "Monitoring efisiensi biaya"
      ]
    },
    {
      title: "Seleksi Tenant & Apresiasi UMKM",
      category: "Inkubasi & Kompetisi",
      description: "Program inkubasi intensif bagi wirausaha lokal pilihan untuk mendapatkan mentoring bisnis, akses permodal, dan penghargaan motivatif.",
      icon: mdiTrophyOutline,
      features: [
        "Mentoring bisnis 1-on-1",
        "Pitching ke investor / perbankan",
        "Fasilitas co-working & galeri"
      ]
    },
    {
      title: "Pengawasan & Evaluasi Usaha Mikro",
      category: "Monitoring Usaha",
      description: "Program pengawasan berkala guna memastikan kesesuaian izin operasional, standar kebersihan, serta perlindungan bagi konsumen lokal.",
      icon: mdiShieldSearch,
      features: [
        "Monitoring ketaatan legalitas",
        "Evaluasi kelayakan lokasi produksi",
        "Pendataan keluhan & masukan konsumen"
      ]
    },
  ];

  return (
    <div className="bg-surface text-[#2D3748] antialiased min-h-screen flex flex-col font-sans">
 
      <section className="bg-linear-to-br from-[rgba(165,233,221,0.3)] to-[rgba(255,255,255,0.9)] py-12 md:py-16 text-center">
        <div className="max-w-310 mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#194C49] mb-3">
            Program & Layanan Dinas
          </h1>
          <p className="text-sm md:text-base text-[#64748B] max-w-195 mx-auto leading-relaxed">
            Dinas Koperasi dan Usaha Kecil Menengah Kabupaten Bekasi menghadirkan berbagai program pendampingan, legalitas formal, serta fasilitas pengembangan usaha untuk memperkuat sektor ekonomi daerah.
          </p>
        </div>
      </section>


      <section className="py-12 md:py-20 grow">
        <div className="max-w-310 mx-auto px-6">
          
          
          <div className="flex justify-center mb-10">
            <div className="inline-flex flex-col sm:flex-row bg-white p-2 ps-3 pe-3 rounded-[40px] border border-teal-medium/30 shadow-[0_10px_30px_rgba(52,144,139,0.08)] gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("koperasi")}
                className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                  activeTab === "koperasi"
                    ? "bg-primary text-white shadow-[0_4px_14px_rgba(52,144,139,0.3)]"
                    : "text-[#64748B] hover:text-primary bg-transparent"
                }`}
              >
                <Icon path={mdiAccountGroupOutline} size={1} /> Layanan Koperasi
              </button>
              
              <button
                onClick={() => setActiveTab("umkm")}
                className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                  activeTab === "umkm"
                    ? "bg-primary text-white shadow-[0_4px_14px_rgba(52,144,139,0.3)]"
                    : "text-[#64748B] hover:text-primary bg-transparent"
                }`}
              >
                <Icon path={mdiStoreOutline} size={1} /> Layanan Usaha Mikro & UMKM
              </button>
            </div>
          </div>


          {activeTab === "koperasi" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {koperasiServices.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[20px] p-6 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border border-teal-light/40 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(52,144,139,0.16)] hover:border-teal-medium group"
                >
                  <div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11.5 h-11.5 bg-teal-light/30 text-primary rounded-[14px] flex items-center justify-center">
                        <Icon path={item.icon} size={1.1} />
                      </div>
                      <span className="bg-teal-light/25 text-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#194C49] mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-[13.5px] text-[#64748B] leading-relaxed mb-4">
                      {item.description}
                    </p>


                    <ul className="list-none mb-6 pt-3 border-t border-teal-medium/20 space-y-2">
                      {item.features.map((feat, fIndex) => (
                        <li key={fIndex} className="text-xs md:text-[13px] text-[#2D3748] flex items-start gap-2">
                          <span className="text-primary shrink-0 mt-0.5">
                            <Icon path={mdiCheckCircle} size={0.7} />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>


                  <a
                    href="/kontak"
                    className="w-full bg-surface text-primary border border-teal-medium py-2.5 rounded-full text-xs md:text-[13.5px] font-semibold text-center transition-all duration-300 inline-flex items-center justify-center gap-1.5 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
                  >
                    Konsultasikan Layanan <Icon path={mdiOpenInNew} size={0.7} />
                  </a>
                </div>
              ))}
            </div>
          )}


          {activeTab === "umkm" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {umkmServices.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[20px] p-6 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border border-teal-light/40 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(52,144,139,0.16)] hover:border-teal-medium group"
                >
                  <div>
                    {/* Header card */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11.5 h-11.5 bg-teal-light/30 text-primary rounded-[14px] flex items-center justify-center">
                        <Icon path={item.icon} size={1.1} />
                      </div>
                      <span className="bg-teal-light/25 text-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#194C49] mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-[13.5px] text-[#64748B] leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Feature list */}
                    <ul className="list-none mb-6 pt-3 border-t border-teal-medium/20 space-y-2">
                      {item.features.map((feat, fIndex) => (
                        <li key={fIndex} className="text-xs md:text-[13px] text-[#2D3748] flex items-start gap-2">
                          <span className="text-primary shrink-0 mt-0.5">
                            <Icon path={mdiCheckCircle} size={0.7} />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>


                  <a
                    href="/kontak"
                    className="w-full bg-surface text-primary border border-teal-medium py-2.5 rounded-full text-xs md:text-[13.5px] font-semibold text-center transition-all duration-300 inline-flex items-center justify-center gap-1.5 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
                  >
                    Konsultasikan Layanan <Icon path={mdiOpenInNew} size={0.7} />
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}