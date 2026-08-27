"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

export interface DistrictMapData {
  name: string;
  lat: number;
  lng: number;
  totalUmkm: number;
}

interface MapClientProps {
  dataKecamatan: DistrictMapData[];
}

const createCustomIcon = (total: number) => {
  
  const hasUmkm = total > 0;
  const bgColor = hasUmkm ? "#34908B" : "#94A3B8"; 

  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="
        background-color: ${bgColor}; 
        color: #ffffff;
        min-width: 34px; 
        height: 34px; 
        padding: 0 6px;
        border-radius: 20px; 
        border: 2px solid #ffffff; 
        box-shadow: 0 6px 15px rgba(52,144,139,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 12px;
        white-space: nowrap;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <span>${total}</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
};

export default function MapClient({ dataKecamatan }: MapClientProps) {
  
  const bekasiCenter: [number, number] = [-6.3200, 107.1500];

  return (
    <div className="w-full h-112.5 sm:h-137.5 lg:h-155 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(52,144,139,0.12)] border border-teal-medium/30 relative z-10 bg-white">
      <MapContainer
        center={bekasiCenter}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {dataKecamatan.map((kec, index) => (
          <Marker 
            key={index} 
            position={[kec.lat, kec.lng]} 
            icon={createCustomIcon(kec.totalUmkm)}
          >
            <Popup>
              <div className="p-3 text-center space-y-2 min-w-45 font-sans">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold block">
                    Kecamatan
                  </span>
                  <h4 className="font-extrabold text-[#194C49] text-base">{kec.name}</h4>
                </div>
                
                <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary">
                  <span className="bg-teal-light/30 text-[#194C49] px-3 py-1 rounded-full font-bold text-sm">
                    {kec.totalUmkm}
                  </span>
                  <span>UMKM Terdaftar</span>
                </div>

                <Link
                  href={`/katalog?district=${encodeURIComponent(kec.name)}`}
                  className="w-full mt-2 bg-primary hover:bg-[#194C49] text-white! text-xs font-medium py-2.5 px-3 rounded-full transition-colors inline-block text-center shadow-sm no-underline"
                  style={{ color: "#ffffff !important" }}
                >
                  Lihat Direktori Wilayah
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}