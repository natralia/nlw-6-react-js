import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext'
import { Home } from "./pages/Home";
import { Room } from './pages/Room';

import { NewRoom } from "./pages/NewRoom";
import { Toaster } from 'react-hot-toast';
import { AdminRoom } from './pages/AdminRoom';


function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Toaster />
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />

          <Route path="/admin/rooms/:id" element={<AdminRoom />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
