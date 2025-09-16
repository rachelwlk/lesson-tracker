// web/src/pages/DashboardPage.jsx
import React from 'react'
import Dashboard from '../components/Dashboard.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function DashboardPage(){
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">學生餘額 Dashboard</h1>
        <a
          href={`${API_BASE}/api/export.xlsx`}
          className="px-3 py-2 rounded bg-emerald-600 text-white"
        >
          下載 Excel
        </a>
      </div>
      <Dashboard/>
    </div>
  )
}
