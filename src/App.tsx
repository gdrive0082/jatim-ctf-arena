import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Lab from './pages/Lab'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lab/:tool" element={<Lab />} />
    </Routes>
  )
}
