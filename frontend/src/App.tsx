import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import InvestorDetailPage from './pages/InvestorDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/investor/:url" element={<InvestorDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
