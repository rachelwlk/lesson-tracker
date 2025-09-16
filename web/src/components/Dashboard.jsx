// web/src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { api } from '../api'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Dashboard(){
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '' })

  const load = async () => {
    setLoading(true)
    try{
      const data = await (await fetch(`${API_BASE}/api/dashboard`)).json()
      setRows(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])

  const startEdit = (row) => {
    setEditingId(row.id)
    setForm({ name: row.name, phone: row.phone ?? '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name:'', phone:'' })
  }

  const save = async (id) => {
    const payload = { name: form.name.trim(), phone: form.phone.trim() || null }
    if (!payload.name) { alert('姓名不能空白'); return }
    const res = await api.updateStudent(id, payload)
    if (res?.error) { alert(res.error); return }
    await load()
    cancelEdit()
  }

  return (
    <div className="bg-white rounded-2xl shadow">
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="text-xl font-semibold">學生餘額 Dashboard</h2>
        <button type="button" onClick={load} className="px-3 py-1 rounded bg-slate-200">刷新</button>
      </div>

      <table className="w-full table-fixed">
        <thead>
          <tr className="text-left border-b bg-gray-50">
            <th className="p-3 w-10">#</th>
            <th className="p-3">學生</th>
            <th className="p-3">電話</th>
            <th className="p-3 w-24 text-right">已購</th>
            <th className="p-3 w-24 text-right">已簽到</th>
            <th className="p-3 w-24 text-right">剩餘</th>
            <th className="p-3 w-40">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const isEditing = editingId === r.id
            return (
              <tr key={r.id} className="border-b">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">
                  {isEditing
                    ? <input
                        className="border rounded p-1 w-full"
                        value={form.name}
                        onChange={e=>setForm(f=>({...f, name:e.target.value}))}
                      />
                    : r.name}
                </td>
                <td className="p-3">
                  {isEditing
                    ? <input
                        className="border rounded p-1 w-full"
                        value={form.phone}
                        onChange={e=>setForm(f=>({...f, phone:e.target.value}))}
                        placeholder="電話（可留空）"
                      />
                    : (r.phone ?? '—')}
                </td>
                <td className="p-3 text-right tabular-nums">{r.purchased}</td>
                <td className="p-3 text-right tabular-nums">{r.attended}</td>
                <td className="p-3 text-right font-semibold tabular-nums">{r.remaining}</td>
                <td className="p-3">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={()=>startEdit(r)}
                      className="px-3 py-1 rounded bg-slate-200"
                    >
                      編輯
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={()=>save(r.id)}
                        className="px-3 py-1 rounded bg-emerald-600 text-white"
                      >
                        儲存
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1 rounded bg-slate-200"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
          {rows.length === 0 && !loading && (
            <tr><td className="p-6 text-center text-slate-500" colSpan={7}>未有學生資料</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
