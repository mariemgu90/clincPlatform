
"use client";
import React from "react";

export default function StatCard({
  icon = "👥",
  title = "Staff",
  value = "0",
  valueColor = "text-emerald-600",
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-slate-200 p-4 flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-blue-500 text-3xl">{icon}</div>
        <h3 className="text-slate-600 font-semibold">{title}</h3>
      </div>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}