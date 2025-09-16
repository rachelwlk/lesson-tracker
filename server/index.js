import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'node:path'
import fs from 'node:fs'
import XLSX from 'xlsx'


dotenv.config()

// DB (lowdb JSON file)
const DB_FILE = path.join(process.cwd(), 'db.json')
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ students: [], purchases: [], checkins: [] }, null, 2))
}
const adapter = new JSONFile(DB_FILE)
const db = new Low(adapter, { students: [], purchases: [], checkins: [] })
await db.read()

const app = express()
app.use(cors())
app.use(express.json())

const SINGLE_PRICE = 155
const PACKAGE_PRICE = 1240
const PACKAGE_SIZE = 8

const now = () => new Date().toISOString()
const nextId = (arr) => (arr.length ? Math.max(...arr.map(r => r.id || 0)) + 1 : 1)
const sumPurchases = (sid) => db.data.purchases.filter(p => p.studentId === sid).reduce((a,b)=>a+b.class_change,0)
const sumCheckins  = (sid) => db.data.checkins .filter(c => c.studentId === sid).reduce((a,b)=>a+b.class_change,0)

app.get('/', (_req,res)=>res.json({ok:true}))

app.post('/api/students', async (req,res)=>{
  const { name, phone } = req.body || {}
  if (!name) return res.status(400).json({ error: 'name required' })
  const it = { id: nextId(db.data.students), name, phone: phone ?? null, created_at: now() }
  db.data.students.unshift(it); await db.write()
  res.json(it)
})
app.get('/api/students', (_req,res)=>res.json(db.data.students))

app.post('/api/purchases', async (req,res)=>{
  const { studentId, type, quantity = 1 } = req.body || {}
  const sid = Number(studentId)
  if (!sid) return res.status(400).json({ error: 'studentId required' })
  const student = db.data.students.find(s => s.id === sid)
  if (!student) return res.status(404).json({ error: 'student not found' })
  if (!['single','package'].includes(type)) return res.status(400).json({ error: 'type must be single|package' })
  const qty = Number(quantity) || 1
  const class_change = type === 'package' ? PACKAGE_SIZE * qty : 1 * qty
  const amount = type === 'package' ? PACKAGE_PRICE * qty : SINGLE_PRICE * qty
  const rec = { id: nextId(db.data.purchases), studentId: sid, type, quantity: qty, class_change, amount, created_at: now() }
  db.data.purchases.push(rec); await db.write()
  res.json(rec)
})

app.post('/api/checkins', async (req,res)=>{
  const { studentId, classDate } = req.body || {}
  const sid = Number(studentId)
  if (!sid) return res.status(400).json({ error: 'studentId required' })
  const student = db.data.students.find(s => s.id === sid)
  if (!student) return res.status(404).json({ error: 'student not found' })
  const remaining = sumPurchases(sid) + sumCheckins(sid)
  if (remaining <= 0) return res.status(400).json({ error: 'no remaining classes' })
  const rec = { id: nextId(db.data.checkins), studentId: sid, class_date: classDate || new Date().toISOString().slice(0,10), class_change: -1, created_at: now() }
  db.data.checkins.push(rec); await db.write()
  res.json(rec)
})

app.get('/api/stats/:studentId', (req,res)=>{
  const id = Number(req.params.studentId)
  const student = db.data.students.find(s => s.id === id)
  if (!student) return res.status(404).json({ error: 'student not found' })
  const purchased = sumPurchases(id)
  const attended  = sumCheckins(id)
  res.json({ student, purchased, attended, remaining: purchased + attended })
})

app.get('/api/dashboard', (_req, res) => {
  const rows = db.data.students
    .map(s => {
      const purchased = sumPurchases(s.id)
      const attended  = sumCheckins(s.id)
      const remaining = purchased + attended
      return {
        id: s.id,
        name: s.name,
        phone: s.phone ?? null,
        purchased,
        attended,
        remaining,
        status: remaining <= 0 ? '已用完' : (remaining <= 2 ? '快用完' : '正常')
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
  res.json(rows)
})

// ⭐ 匯出 Excel（students / purchases / checkins）
app.get('/api/export.xlsx', async (_req, res) => {
  await db.read()
  const { students = [], purchases = [], checkins = [] } = db.data || {}

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(students),  'students')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(purchases), 'purchases')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(checkins),  'checkins')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition','attachment; filename="lesson-data.xlsx"')
  res.send(buf)
})

const PORT = process.env.PORT || 4000
// 更新學生資料（name / phone 任意其一）
app.patch('/api/students/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { name, phone } = req.body || {}

  const s = db.data.students.find(x => x.id === id)
  if (!s) return res.status(404).json({ error: 'student not found' })

  if (typeof name === 'string' && name.trim()) s.name = name.trim()
  if (phone === null || typeof phone === 'string') s.phone = phone ?? null

  await db.write()
  res.json(s)
})

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
