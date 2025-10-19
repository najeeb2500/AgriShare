import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Community from './pages/Community';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import LandManagement from "./pages/LandManagement";
import ListingDetail from './pages/ListingDetail';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import Signup from './pages/Signup';
// import NotFound from './pages/NotFound'; // Adjust path as needed

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/:role" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ListingDetail />} />
        <Route path="/community" element={<Community />} />
       <Route path="/lands" element={<LandManagement />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;