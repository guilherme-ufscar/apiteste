import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import StudentsPage from './pages/Students'
import StudentDetail from './pages/Students/Detail'
import TeachersPage from './pages/Teachers'
import SubjectsPage from './pages/Subjects'
import PeriodsPage from './pages/Periods'
import EnrollmentsPage from './pages/Enrollments'
import GradesPage from './pages/Grades'
import ReportsPage from './pages/Reports'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="periods" element={<PeriodsPage />} />
          <Route path="enrollments" element={<EnrollmentsPage />} />
          <Route path="grades" element={<GradesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
