import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SingleAnalyzerPage from './pages/SingleAnalyzerPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar />
        <Routes>
          <Route path="/" element={<SingleAnalyzerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
