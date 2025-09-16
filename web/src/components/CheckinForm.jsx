import React, { useEffect, useState } from 'react'
import { api } from '../api'
export default function CheckinForm(){
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [remaining, setRemaining] = useState(null)
  useEffect(()=>{ api.getStudents().then(setStudents) },[])
  useEffect(()=>{ if(!studentId) return setRemaining(null); api.stats(studentId).then(s=>setRemaining(s.remaining)) },[studentId])
  const submit = async ()=>{
    if(!studentId) return alert('請選擇學生')
    const ok = await api.checkin({ studentId:Number(studentId), classDate:date })
    if (ok.error) return alert(ok.error)
    alert('已簽到：-1 堂')
    setRemaining(prev => (prev!=null ? prev-1 : prev))
  }
  return (<div className="p-4 bg-white rounded-2xl shadow">
    <h2 className="text-xl font-semibold mb-3">簽到扣課</h2>
    <div className="mb-3">
      <label className="block text-sm mb-1">學生</label>
      <select className="w-full border rounded p-2" value={studentId} onChange={e=>setStudentId(e.target.value)}>
        <option value="">— 請選擇 —</option>
        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      {remaining!=null && (
        <div className={`mt-2 text-sm ${remaining<=0?'text-red-600':remaining<=2?'text-amber-600':'text-gray-600'}`}>
          剩餘堂數：<b>{remaining}</b> {remaining<=0?'（已用完）':remaining<=2?'（快用完）':''}
        </div>
      )}
    </div>
    <div className="mb-3">
      <label className="block text-sm mb-1">上課日期</label>
      <input type="date" className="w-full border rounded p-2" value={date} onChange={e=>setDate(e.target.value)}/>
    </div>
    <button onClick={submit} className="px-4 py-2 bg-indigo-600 text-white rounded">簽到</button>
  </div>)
}