import React, { useEffect, useState } from 'react'
import { api } from '../api'
export default function Dashboard(){
  const [rows, setRows] = useState([])
  const load = async ()=> setRows(await api.dashboard())
  useEffect(()=>{ load() },[])
  return (<div className="p-4 bg-white rounded-2xl shadow">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-semibold">學生餘額 Dashboard</h2>
      <button className="px-3 py-1 border rounded" onClick={load}>刷新</button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left bg-gray-100">
          <tr><th className="p-2">學生</th><th className="p-2">電話</th><th className="p-2">已購</th><th className="p-2">已簽到</th><th className="p-2">剩餘</th><th className="p-2">狀態</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (<tr key={r.id} className="border-b">
            <td className="p-2">{r.name}</td>
            <td className="p-2">{r.phone||'-'}</td>
            <td className="p-2">{r.purchased}</td>
            <td className="p-2">{Math.abs(r.attended)}</td>
            <td className={`p-2 font-semibold ${r.remaining<=0?'text-red-600':r.remaining<=2?'text-amber-600':'text-emerald-700'}`}>{r.remaining}</td>
            <td className="p-2">{r.status}</td>
          </tr>))}
          {rows.length===0 && (<tr><td className="p-2 text-gray-500" colSpan={6}>暫無資料</td></tr>)}
        </tbody>
      </table>
    </div>
  </div>)
}