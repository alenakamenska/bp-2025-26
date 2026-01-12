import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Home/Home";
import { FrontLayout } from "./components/layout";
import "./colors.css"
import { Login } from "./Login/Login";
import { Logout } from "./Logout/Logout";
import {Register} from "./Register/Register"


function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<FrontLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/sortiment" element={<FrontLayout />}>
        </Route>
        <Route path="/login" element={<FrontLayout />}>
          <Route index element={<Login />} />
        </Route>
         <Route path="/logout" element={<FrontLayout />}>
          <Route index element={<Logout />} />
        </Route>
        <Route path="/register" element={<FrontLayout />}>
          <Route index element={<Register/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
