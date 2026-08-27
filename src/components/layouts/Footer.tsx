import Link from "next/link";
import Image from "next/image"; 
import Icon from "@mdi/react";
import {
  mdiMapMarkerOutline,
  mdiEmailOutline,
  mdiPhoneOutline,
  mdiInstagram,
  mdiFacebook,
  mdiYoutube,
  mdiClockOutline,
} from "@mdi/js";
import { getSettings } from "@/app/admin/settings/actions";

export default async function Footer() {
  // Fetch settings DB
  const settings = await getSettings();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
          <div className="w-30 h-30 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden p-1.5">
            <Image 
              src="/logo.svg" 
              alt="Logo TEMU" 
              width={150} 
              height={150} 
              className="object-contain w-full h-full"
            />
          </div>
            <div className="font-bold text-base text-gray-800 leading-tight">
              {settings.siteName}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            {settings.siteDescription}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-sm">Navigasi</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/katalog" className="hover:text-primary transition-colors">
                Katalog UMKM
              </Link>
            </li>
            <li>
              <Link href="/map" className="hover:text-primary transition-colors">
                Peta Sebaran UMKM
              </Link>
            </li>
            <li>
              <Link href="/berita" className="hover:text-primary transition-colors">
                Berita & Informasi
              </Link>
            </li>
          </ul>
        </div>

        {/* Official Contact */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-sm">Kontak Resmi</h4>
          <ul className="space-y-3 text-xs text-gray-500">
            <li className="flex items-start gap-2.5">
              <Icon path={mdiMapMarkerOutline} size={0.7} className="text-primary shrink-0 mt-0.5" />
              <span className="leading-relaxed">{settings.officeAddress}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon path={mdiPhoneOutline} size={0.65} className="text-primary shrink-0" />
              <span>{settings.contactPhone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon path={mdiEmailOutline} size={0.65} className="text-primary shrink-0" />
              <span>{settings.contactEmail}</span>
            </li>
          </ul>
        </div>

        {/* Service Hours & Socials */}
        <div className="space-y-5">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-1.5">
              <Icon path={mdiClockOutline} size={0.65} className="text-primary" />
              <span>Jam Layanan</span>
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Senin - Jumat: 08:00 - 16:00 WIB<br />
              Sabtu - Minggu: Libur
            </p>
          </div>

          {/* Social Media */}
          {(settings.instagramUrl || settings.facebookUrl || settings.youtubeUrl) && (
            <div>
              <h5 className="text-xs font-semibold text-gray-800 mb-2.5">Media Sosial</h5>
              <div className="flex items-center gap-2">
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-gray-50 hover:bg-teal-light hover:text-primary rounded-xl text-gray-600 transition-all shadow-2xs"
                    title="Instagram"
                  >
                    <Icon path={mdiInstagram} size={0.7} />
                  </a>
                )}
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-gray-50 hover:bg-teal-light hover:text-primary rounded-xl text-gray-600 transition-all shadow-2xs"
                    title="Facebook"
                  >
                    <Icon path={mdiFacebook} size={0.7} />
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-gray-50 hover:bg-teal-light hover:text-primary rounded-xl text-gray-600 transition-all shadow-2xs"
                    title="YouTube"
                  >
                    <Icon path={mdiYoutube} size={0.7} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </div>
    </footer>
  );
}