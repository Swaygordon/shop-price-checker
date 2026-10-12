import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'
import Admin from '@/pages/Admin'
import Home from '@/pages/Home'
import Login from '@/pages/Login'

export default function App() {
  const { pathname } = useLocation()
  const isLogin = pathname === '/login'

  return (
    <>
      <Navbar />
      <main
        className={
          isLogin
            ? 'grid flex-1 place-items-start justify-items-center px-4 pb-16 pt-4'
            : 'flex-1 rounded-t-4xl bg-background px-4 pb-16 pt-6 md:px-12 md:pt-10'
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster />
    </>
  )
}
