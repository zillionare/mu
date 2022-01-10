import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.less';
import JieyuHeader from './components/JieyuHeader';
import FundPage from './pages/Fund';
import FundDetailPage from './pages/FundDetail';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import StockPage from './pages/Stock';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <JieyuHeader isLoggid={true} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/funds" element={<FundPage />} />
          <Route path="/funds/detail" element={<FundDetailPage />} />
          <Route path="/stocks" element={<StockPage />} />
          <Route path="/login" element={<LoginPage />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
