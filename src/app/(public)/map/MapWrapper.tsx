"use client";

import dynamic from "next/dynamic";
import { DistrictMapData } from "./MapClient";

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-150 rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center text-xs text-gray-400">
      Memuat Peta Spasial Kabupaten Bekasi...
    </div>
  ),
});

export default function MapWrapper({ dataKecamatan }: { dataKecamatan: DistrictMapData[] }) {
  return <MapClient dataKecamatan={dataKecamatan} />;
}