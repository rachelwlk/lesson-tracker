const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = {
  async getStudents(){
    return (await fetch(`${BASE}/api/students`)).json()
  },
  async createStudent(body){
    return (await fetch(`${BASE}/api/students`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    })).json()
  },
  async updateStudent(id, payload){
    return (await fetch(`${BASE}/api/students/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })).json()
  },
  async purchase(body){
    return (await fetch(`${BASE}/api/purchases`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    })).json()
  },
  async checkin(body){
    return (await fetch(`${BASE}/api/checkins`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    })).json()
  },
  async dashboard(){
    return (await fetch(`${BASE}/api/dashboard`)).json()
  },
  async stats(id){
    return (await fetch(`${BASE}/api/stats/${id}`)).json()
  }
}
