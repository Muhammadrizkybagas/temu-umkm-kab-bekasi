"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import Icon from "@mdi/react";
import { mdiStorefront } from "@mdi/js";

interface PartnerData {
  partnerName: string;
  totalUmkm: number;
}

export default function PartnerBarChart({ data }: { data: PartnerData[] }) {
  const sortedData = [...data].sort((a, b) => b.totalUmkm - a.totalUmkm);
  const totalPartnersCount = data.reduce((acc, curr) => acc + curr.totalUmkm, 0);

  const minDesktopWidth = Math.max(sortedData.length * 60, 600);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-light/25 text-primary flex items-center justify-center border border-teal-light/50 shrink-0">
            <Icon path={mdiStorefront} size={0.9} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Distribusi Kemitraan Ritel Modern</h2>
            <p className="text-[11px] text-slate-400">Jumlah UMKM yang telah bermitra dengan jaringan ritel (Diurutkan dari terbanyak)</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-light/20 text-primary font-semibold text-xs self-start sm:self-auto border border-teal-light/30 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Akumulasi: {totalPartnersCount} Mitra
        </span>
      </div>

      {/* Responsive */}
      <div className="w-full overflow-x-auto pb-2">
        <div style={{ minWidth: `${minDesktopWidth}px`, height: "320px" }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ top: 25, right: 15, left: -15, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="partnerName" 
                angle={-25} 
                textAnchor="end" 
                interval={0} 
                tick={{ fontSize: 11, fill: "#64748B", fontWeight: 500 }} 
                dy={5}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 11, fill: "#64748B" }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: "rgba(165, 233, 221, 0.15)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as PartnerData;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-700/50 text-xs space-y-1">
                        <p className="font-bold text-teal-light">{item.partnerName}</p>
                        <p className="text-slate-300">
                          Total UMKM: <span className="font-bold text-white">{item.totalUmkm}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="totalUmkm" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={36} 
                animationDuration={1200}
              >
                {sortedData.map((_, index) => {
                  const opacity = Math.max(0.35, 1 - (index * (0.65 / Math.max(sortedData.length - 1, 1))));
                  return <Cell key={`cell-${index}`} fill={`rgba(52, 144, 139, ${opacity})`} />;
                })}
                <LabelList 
                  dataKey="totalUmkm" 
                  position="top" 
                  style={{ fontSize: "11px", fill: "#475569", fontWeight: "600" }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}