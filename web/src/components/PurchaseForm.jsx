import React, { useState, useEffect } from 'react'
import { api } from '../api'
const SINGLE_PRICE = 155, PACKAGE_PRICE = 1240, PACKAGE_SIZE = 8
export default function PurchaseForm(){
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [type, setType] = useState('package')
  const [quantity, setQuantity] = useState(1)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  useEffect(()=>{ api.getStudents().then(setStudents) },[])
  const addStudent = async ()=>{
    if(!newName.trim()) return
    const s = await api.createStudent({ name: newName.trim(), phone: newPhone || null })
    setStudents(prev => [s, ...prev]); setStudentId(String(s.id)); setNewName(''); setNewPhone('')
  }

  const amount = type==='package' ? PACKAGE_PRICE*quantity : SINGLE_PRICE*quantity
  const classes = type==='package' ? PACKAGE_SIZE*quantity : 1*quantity

  const submit = async ()=>{
    if(!studentId) return alert('請先選擇學生或建立學生')
    const ok = await api.purchase({ studentId:Number(studentId), type, quantity:Number(quantity) })
    if (ok.error) return alert(ok.error)
    alert(`已購買：+${classes} 堂；金額 $${amount}`)
  }

  return (<div className="p-4 bg-white rounded-2xl shadow">
    <h2 className="text-xl font-semibold mb-3">購買課堂</h2>
    <div className="mb-3">
      <label className="block text-sm mb-1">選擇學生</label>
      <select className="w-full border rounded p-2" value={studentId} onChange={e=>setStudentId(e.target.value)}>
        <option value="">— 請選擇 —</option>
        {students.map(s => <option key={s.id} value={s.id}>{s.name} {s.phone?`(${s.phone})`:''}</option>)}
      </select>
    </div>
    <div className="flex gap-2 mb-2">
      <input placeholder="新增學生姓名" value={newName} onChange={e=>setNewName(e.target.value)} className="flex-1 border rounded p-2"/>
      <input placeholder="電話（可選）" value={newPhone} onChange={e=>setNewPhone(e.target.value)} className="w-44 border rounded p-2"/>
      <button onClick={addStudent} className="px-3 py-2 bg-gray-900 text-white rounded">新增</button>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm mb-1">類型</label>
        <select className="w-full border rounded p-2" value={type} onChange={e=>setType(e.target.value)}>
          <option value="package">Package（8堂 / $1240）</option>
          <option value="single">單堂（$155）</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">份數</label>
        <input type="number" className="w-full border rounded p-2" value={quantity} min={1} onChange={e=>setQuantity(Number(e.target.value)||1)}/>
      </div>
    </div>
    <div className="mt-3 text-sm">
      <div>將會增加課堂：<b>{classes}</b> 堂</div>
      <div>應付金額：<b>${amount}</b></div>
    </div>
    <button onClick={submit} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">確認購買</button>
  </div>)
}