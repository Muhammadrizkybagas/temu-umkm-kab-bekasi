import React from 'react';
import Link from 'next/link';
import Icon from '@mdi/react';
import { 
  mdiShieldCheckOutline, 
  mdiStore, 
  mdiAccountPlusOutline, 
  mdiOfficeBuildingOutline, 
  mdiTarget, 
  mdiDatabaseCheckOutline, 
  mdiHandshakeOutline, 
  mdiEyeOutline, 
  mdiFormatListChecks, 
  mdiCheck, 
  mdiAccountTie, 
  mdiAccount, 
  mdiPlusCircleOutline,
  mdiDomain,
  mdiPackageVariantClosed,
  mdiArrowRight,
  mdiTrendingUp,
  mdiHandshake
} from '@mdi/js';
import { db } from '@/db';
import { umkm, products } from '@/db/schema'; 
import { count, eq } from 'drizzle-orm';

export default async function TentangPage() {
  
  const [{ value: totalUmkm }] = await db.select({ value: count() }).from(umkm);
  const [{ value: totalProducts }] = await db.select({ value: count() }).from(products);
  const [{ value: totalNaikKelas }] = await db
    .select({ value: count() })
    .from(umkm)
    .where(eq(umkm.isNaikKelas, true));
  const [{ value: totalBermitra }] = await db
    .select({ value: count() })
    .from(umkm)
    .where(eq(umkm.status, "Bermitra"));

  const stats = [
    { title: "Total UMKM Terdaftar", value: totalUmkm, icon: mdiDomain },
    { title: "Total Katalog Produk", value: totalProducts, icon: mdiPackageVariantClosed },
    { title: "UMKM Naik Kelas", value: totalNaikKelas, icon: mdiTrendingUp },
    { title: "UMKM Bermitra", value: totalBermitra, icon: mdiHandshake },
  ];

  return (
    <div className="bg-surface text-[#2D3748] antialiased overflow-x-hidden font-sans">
      
      <section className="bg-linear-to-br from-[rgba(165,233,221,0.25)] to-[rgba(255,255,255,0.9)] py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute -top-25 -right-25 w-87.5 md:w-112.5 h-87.5 md:h-112.5 bg-[radial-gradient(circle,#A5E9DD_0%,rgba(255,255,255,0)_70%)] rounded-full z-0 opacity-70 pointer-events-none" />
        
        <div className="max-w-310 mx-auto px-6 relative z-10">
          <div className="text-center max-w-215 mx-auto">
            <div className="inline-flex items-center gap-2 bg-[rgba(111,190,178,0.15)] border border-[rgba(52,144,139,0.3)] text-primary px-4 md:px-5 py-1.5 rounded-full text-xs md:text-sm font-semibold mb-6">
              <Icon path={mdiShieldCheckOutline} size={0.8} /> Portal Resmi UMKM
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#194C49] leading-tight md:leading-tight mb-5 tracking-tight">
              Tentang <span className="bg-linear-to-r from-primary to-teal-medium bg-clip-text text-transparent">Direktori Digital</span>
            </h1>
            
            <p className="text-base md:text-lg text-[#64748B] mb-8 leading-relaxed font-normal">
              Pusat data, informasi, dan katalog digital resmi yang dikembangkan melalui kolaborasi strategis antara <strong className="text-[#194C49]">Dinas Koperasi & UMKM
              Kabupaten Bekasi</strong> bersama <strong className="text-[#194C49]">Mahasiswa Magang Institut Teknologi Sains Bandung (ITSB)</strong> guna mempercepat transformasi 
              digital dan memperluas jangkauan pasar bagi seluruh pelaku Usaha Mikro, Kecil, dan Menengah di Kabupaten Bekasi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
            <Link
              href="/katalog"
              className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-sm transform hover:-translate-y-0.5"
            >
              <span>Jelajahi Katalog Produk</span>
              <Icon path={mdiArrowRight} size={0.7} className="transition-transform group-hover:translate-x-1" />
            </Link>
            </div>
          </div>

          {/* Statistik Database */}
          <div className="-mt-6 md:-mt-12 relative z-10 pt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_30px_rgba(52,144,139,0.08)] border border-[rgba(165,233,221,0.4)]">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="group relative bg-surface hover:bg-white p-4 rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-teal-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-teal-light to-teal-medium text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon path={stat.icon} size={1.2} />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-light/40 text-primary border border-teal-light/60">
                      Live Data
                    </span>
                  </div>

                  <div>
                    <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">
                      {stat.value.toLocaleString("id-ID")}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
                      {stat.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Profil Platform */}
      <section className="py-16 md:py-24 max-w-310 mx-auto px-6">
        <div className="text-center max-w-175 mx-auto mb-12">
          <span className="text-xs md:text-[13px] font-bold text-primary uppercase tracking-[1.5px] mb-2 block">Profil Platform</span>
          <h2 className="text-2xl md:text-[32px] font-bold text-[#194C49] leading-snug">Peran Strategis Kami</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-[20px] p-8 md:p-10 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border border-[rgba(165,233,221,0.4)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_18px_40px_rgba(52,144,139,0.16)] hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 bg-linear-to-br from-teal-light to-teal-medium text-[#194C49] rounded-[14px] flex items-center justify-center text-2xl mb-6 shadow-xs">
                <Icon path={mdiOfficeBuildingOutline} size={1.2} />
              </div>
              <h3 className="text-xl md:text-[22px] font-bold text-[#194C49] mb-4">Latar Belakang</h3>
              <p className="text-sm md:text-[15px] text-[#64748B] leading-relaxed">
                Dinas Koperasi dan UMKM berkomitmen mendampingi pelaku usaha melalui pembinaan teknis, legalitas, hingga permodalan demi memperkuat ekonomi kerakyatan.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-8 md:p-10 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border border-[rgba(165,233,221,0.4)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_18px_40px_rgba(52,144,139,0.16)] hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 bg-linear-to-br from-teal-light to-teal-medium text-[#194C49] rounded-[14px] flex items-center justify-center text-2xl mb-6 shadow-xs">
                <Icon path={mdiTarget} size={1.2} />
              </div>
              <h3 className="text-xl md:text-[22px] font-bold text-[#194C49] mb-4">Tujuan Platform</h3>
              <p className="text-sm md:text-[15px] text-[#64748B] leading-relaxed">
                Menjadi sarana promosi resmi yang mengintegrasikan data UMKM guna mempermudah akses pasar yang lebih luas secara nasional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Portal */}
      <section className="py-16 md:py-24 bg-white border-t border-b border-[rgba(165,233,221,0.3)]">
        <div className="max-w-310 mx-auto px-6">
          <div className="text-center max-w-175 mx-auto mb-12">
            <span className="text-xs md:text-[13px] font-bold text-primary uppercase tracking-[1.5px] mb-2 block">Fitur Unggulan</span>
            <h2 className="text-2xl md:text-[32px] font-bold text-[#194C49] leading-snug">Mengapa Portal Ini?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-surface rounded-[20px] p-8 border border-[rgba(111,190,178,0.25)] transition-all duration-300 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(52,144,139,0.16)] hover:bg-white">
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-medium group-hover:bg-primary transition-all duration-300" />
              <div className="w-12.5 h-12.5 bg-[rgba(165,233,221,0.4)] text-primary rounded-[14px] flex items-center justify-center text-2xl mb-5">
                <Icon path={mdiDatabaseCheckOutline} size={1.1} />
              </div>
              <h4 className="text-lg md:text-[19px] font-bold text-[#194C49] mb-3">Direktori Terpadu</h4>
              <p className="text-sm md:text-[14.5px] text-[#64748B] leading-relaxed">Menghimpun ragam profil usaha dari berbagai wilayah secara transparan dan akurat.</p>
            </div>

            <div className="bg-surface rounded-[20px] p-8 border border-[rgba(111,190,178,0.25)] transition-all duration-300 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(52,144,139,0.16)] hover:bg-white">
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-medium group-hover:bg-primary transition-all duration-300" />
              <div className="w-12.5 h-12.5 bg-[rgba(165,233,221,0.4)] text-primary rounded-[14px] flex items-center justify-center text-2xl mb-5">
                <Icon path={mdiShieldCheckOutline} size={1.1} />
              </div>
              <h4 className="text-lg md:text-[19px] font-bold text-[#194C49] mb-3">Legalitas Usaha</h4>
              <p className="text-sm md:text-[14.5px] text-[#64748B] leading-relaxed">Membantu validasi kualifikasi guna meningkatkan standar mutu produk lokal.</p>
            </div>

            <div className="bg-surface rounded-[20px] p-8 border border-[rgba(111,190,178,0.25)] transition-all duration-300 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(52,144,139,0.16)] hover:bg-white">
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-medium group-hover:bg-primary transition-all duration-300" />
              <div className="w-12.5 h-12.5 bg-[rgba(165,233,221,0.4)] text-primary rounded-[14px] flex items-center justify-center text-2xl mb-5">
                <Icon path={mdiHandshakeOutline} size={1.1} />
              </div>
              <h4 className="text-lg md:text-[19px] font-bold text-[#194C49] mb-3">Kolaborasi Luas</h4>
              <p className="text-sm md:text-[14.5px] text-[#64748B] leading-relaxed">Menjadi jembatan komunikasi langsung antara pelaku UMKM dan calon mitra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 md:py-24 max-w-310 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-stretch">
          <div className="bg-linear-to-br from-primary to-[#194C49] text-white rounded-[20px] p-8 md:p-11 flex flex-col justify-center shadow-[0_10px_30px_rgba(52,144,139,0.08)] relative overflow-hidden">
            <div className="absolute -bottom-12.5 -right-12.5 w-50 h-50 bg-[rgba(165,233,221,0.15)] rounded-full pointer-events-none" />
            <h3 className="text-2xl md:text-[26px] font-bold mb-4 flex items-center gap-3">
              <Icon path={mdiEyeOutline} size={1.2} /> Visi Kami
            </h3>
            <p className="text-base md:text-lg leading-[1.8] opacity-95 font-light">
              &quot;Mewujudkan ekosistem digital UMKM yang mandiri, berdaya saing global, inovatif, dan menjadi penggerak utama perekonomian daerah.&quot;
            </p>
          </div>

          <div className="bg-white rounded-[20px] p-8 md:p-10 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border border-[rgba(165,233,221,0.4)]">
            <h3 className="text-xl md:text-[24px] font-bold text-[#194C49] mb-6 flex items-center gap-3">
              <Icon path={mdiFormatListChecks} size={1.1} className="text-primary" /> Misi Utama
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-teal-light text-primary flex items-center justify-center text-base shrink-0 mt-0.5">
                  <Icon path={mdiCheck} size={0.7} />
                </div>
                <div className="text-sm md:text-[15px] text-[#2D3748] leading-relaxed">Menyediakan basis data direktori UMKM yang akurat dan transparan.</div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-teal-light text-primary flex items-center justify-center text-base shrink-0 mt-0.5">
                  <Icon path={mdiCheck} size={0.7} />
                </div>
                <div className="text-sm md:text-[15px] text-[#2D3748] leading-relaxed">Memperluas jangkauan pasar produk lokal melalui platform digital.</div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-teal-light text-primary flex items-center justify-center text-base shrink-0 mt-0.5">
                  <Icon path={mdiCheck} size={0.7} />
                </div>
                <div className="text-sm md:text-[15px] text-[#2D3748] leading-relaxed">Memfasilitasi pembinaan dan perluasan jejaring kemitraan usaha.</div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      {/* <section className="py-16 md:py-24 max-w-310 mx-auto px-6">
        <div className="text-center max-w-175 mx-auto mb-12">
          <span className="text-xs md:text-[13px] font-bold text-primary uppercase tracking-[1.5px] mb-2 block">Tata Kelola</span>
          <h2 className="text-2xl md:text-[32px] font-bold text-[#194C49] leading-snug">Struktur Organisasi</h2>
        </div>

        <div className="overflow-x-auto py-5">
          <div className="flex flex-col items-center min-w-250">
            
            <div className="bg-white rounded-[14px] p-4 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border-[1.5px] border-teal-medium text-center w-60 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(52,144,139,0.16)] hover:border-primary">
              <div className="w-19 h-19 mx-auto mb-2.5 rounded-full p-0.75 bg-linear-to-br from-teal-light to-primary shadow-[0_4px_10px_rgba(52,144,139,0.2)]">
                <div className="w-full h-full rounded-full bg-[#E2E8F0] flex items-center justify-center text-primary">
                  <Icon path={mdiAccountTie} size={1.8} />
                </div>
              </div>
              <div className="text-sm font-bold text-[#194C49] leading-snug mb-1">KEPALA DINAS</div>
              <div className="text-[11px] font-semibold text-primary bg-[rgba(165,233,221,0.3)] px-2 py-0.5 rounded-[20px] inline-block leading-snug">Pimpinan Tertinggi</div>
            </div>

            <div className="w-0.5 h-7.5 bg-teal-medium" />
            
            <div className="bg-white rounded-[14px] p-4 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border-[1.5px] border-teal-medium text-center w-60 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(52,144,139,0.16)] hover:border-primary">
              <div className="w-19 h-19 mx-auto mb-2.5 rounded-full p-0.75 bg-linear-to-br from-teal-light to-primary shadow-[0_4px_10px_rgba(52,144,139,0.2)]">
                <div className="w-full h-full rounded-full bg-[#E2E8F0] flex items-center justify-center text-primary">
                  <Icon path={mdiAccount} size={1.8} />
                </div>
              </div>
              <div className="text-sm font-bold text-[#194C49] leading-snug mb-1">SEKRETARIS DINAS</div>
              <div className="text-[11px] font-semibold text-primary bg-[rgba(165,233,221,0.3)] px-2 py-0.5 rounded-[20px] inline-block leading-snug">Sekretariat</div>
            </div>

            <div className="w-0.5 h-10 bg-teal-medium" />


            <div className="flex gap-7.5 justify-center w-full">
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-[14px] p-4 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border-[1.5px] border-teal-medium text-center w-60">
                  <div className="w-19 h-19 mx-auto mb-2.5 rounded-full p-0.75 bg-linear-to-br from-teal-light to-primary">
                    <div className="w-full h-full rounded-full bg-[#E2E8F0] flex items-center justify-center text-primary">
                      <Icon path={mdiAccount} size={1.8} />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#194C49] leading-snug mb-1">KABID KELEMBAGAAN</div>
                  <div className="text-[11px] font-semibold text-primary bg-[rgba(165,233,221,0.3)] px-2 py-0.5 rounded-[20px]">Bidang I</div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-white rounded-[14px] p-4 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border-[1.5px] border-teal-medium text-center w-60">
                  <div className="w-19 h-19 mx-auto mb-2.5 rounded-full p-0.75 bg-linear-to-br from-teal-light to-primary">
                    <div className="w-full h-full rounded-full bg-[#E2E8F0] flex items-center justify-center text-primary">
                      <Icon path={mdiAccount} size={1.8} />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#194C49] leading-snug mb-1">KABID USAHA MIKRO</div>
                  <div className="text-[11px] font-semibold text-primary bg-[rgba(165,233,221,0.3)] px-2 py-0.5 rounded-[20px]">Bidang II</div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-white rounded-[14px] p-4 shadow-[0_10px_30px_rgba(52,144,139,0.08)] border-[1.5px] border-teal-medium text-center w-60">
                  <div className="w-19 h-19 mx-auto mb-2.5 rounded-full p-0.75 bg-linear-to-br from-teal-light to-primary">
                    <div className="w-full h-full rounded-full bg-[#E2E8F0] flex items-center justify-center text-primary">
                      <Icon path={mdiAccount} size={1.8} />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#194C49] leading-snug mb-1">KABID KOPERASI</div>
                  <div className="text-[11px] font-semibold text-primary bg-[rgba(165,233,221,0.3)] px-2 py-0.5 rounded-[20px]">Bidang III</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="py-16 md:py-24 max-w-310 mx-auto px-6">
        <div className="bg-linear-to-br from-primary to-[#194C49] rounded-[30px] p-10 md:p-14 text-white text-center relative overflow-hidden shadow-[0_20px_40px_rgba(52,144,139,0.25)]">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold mb-4">Punya Usaha UMKM di Kabupaten Bekasi?</h2>
          <p className="text-sm md:text-base opacity-90 max-w-162.5 mx-auto mb-8 font-light">Bergabunglah bersama ribuan pelaku usaha lokal lainnya. Daftarkan produk Anda ke Katalog Digital Resmi untuk menjangkau pasar yang lebih luas!</p>
          <Link
            href="/kontak"
            className="bg-teal-light hover:bg-white text-[#194C49] px-9 py-4 rounded-full text-base font-bold transition-all duration-300 inline-flex items-center gap-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1"
          >
            <Icon path={mdiPlusCircleOutline} size={1.1} /> Daftar Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}