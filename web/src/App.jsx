import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import PurchasePage from './pages/PurchasePage.jsx'
import CheckinPage from './pages/CheckinPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

function Nav(){
  const link='px-4 py-2 rounded-lg border'; const active='bg-gray-900 text-white'
  return (<nav className="max-w-5xl mx-auto flex gap-3 p-4">
    <NavLink to="/purchase" className={({isActive})=>`${link} ${isActive?active:''}`}>購買課堂</NavLink>
    <NavLink to="/checkin" className={({isActive})=>`${link} ${isActive?active:''}`}>簽到扣課</NavLink>
    <NavLink to="/dashboard" className={({isActive})=>`${link} ${isActive?active:''}`}>Dashboard</NavLink>
  </nav>)
}

export default function App(){
  return (<BrowserRouter>
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4"><h1 className="text-2xl font-bold">Lesson Tracker（Free版）</h1></div>
      <Nav/>
    </header>
    <main className="py-4">
      <Routes>
        <Route path="/" element={<PurchasePage/>}/>
        <Route path="/purchase" element={<PurchasePage/>}/>
        <Route path="/checkin" element={<CheckinPage/>}/>
        <Route path="/dashboard" element={<DashboardPage/>}/>
      </Routes>
    </main>
  </BrowserRouter>)
}