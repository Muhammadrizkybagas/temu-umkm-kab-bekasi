"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import Icon from "@mdi/react";
import { mdiChartBar } from "@mdi/js";

interface CategoryData {
  categoryName: string;
  totalProducts: number;
}

export default function CategoryBarChart({ data }: { data: CategoryData[] }) {
  // Urutkan dari jumlah produk terbanyak ke tersedikit
  const sortedData = [...data].sort((a, b) => b.totalProducts - a.totalProducts);
  const totalProductsCount = data.reduce((acc, curr) => acc + curr.totalProducts, 0);
  
  // Lebar minimum agar di HP tidak gepeng dan bisa di-scroll, di desktop melebar penuh
  const minDesktopWidth = Math.max(sortedData.length * 60, 600);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs relative overflow-hidden flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-light/25 text-primary flex items-center justify-center border border-teal-light/50 shrink-0">
            <Icon path={mdiChartBar} size={0.9} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Sebaran Kategori Produk</h2>
            <p className="text-[11px] text-slate-400">Jumlah produk terdaftar pada setiap kategori (Diurutkan dari terbanyak)</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-light/20 text-primary font-semibold text-xs self-start sm:self-auto border border-teal-light/30 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Akumulasi: {totalProductsCount} Produk
        </span>
      </div>

      {sortedData.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs font-medium">Belum ada data kategori</div>
      ) : (
        <div className="w-full overflow-x-auto pb-2 custom-scroll">
          <div style={{ minWidth: `${minDesktopWidth}px`, height: "300px" }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedData} margin={{ top: 25, right: 15, left: -15, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="categoryName" 
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
                      const item = payload[0].payload as CategoryData;
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-700/50 text-xs space-y-1">
                          <p className="font-bold text-teal-light">{item.categoryName}</p>
                          <p className="text-slate-300">
                            Total Produk: <span className="font-bold text-white">{item.totalProducts}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="totalProducts" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={36} 
                  animationDuration={1200}
                >
                  {sortedData.map((_, index) => {
                    const opacity = Math.max(0.35, 1 - (index * (0.65 / Math.max(sortedData.length - 1, 1))));
                    return <Cell key={`cell-${index}`} fill={`rgba(52, 144, 139, ${opacity})`} />;
                  })}
                  <LabelList 
                    dataKey="totalProducts" 
                    position="top" 
                    style={{ fontSize: "11px", fill: "#475569", fontWeight: "600" }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}