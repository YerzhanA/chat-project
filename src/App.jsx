import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Regsiter from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import Start from "./pages/StartPage";

function App() {
  return (
    <div className="main-chat bg-black  flex items-center justify-center ">
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Regsiter />} />
          <Route exact path="/chats" element={<Home />} />
          <Route exact path="/" element={<Start />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
