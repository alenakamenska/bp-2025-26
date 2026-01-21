import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Home/Home";
import { FrontLayout } from "./components/layout";
import "./colors.css"
import { Login } from "./Login/Login";
import { Logout } from "./Logout/Logout";
import {Register} from "./Register/Register"
import { Tips } from "./Tips/Tips";
import { AddTip } from "./Add-Tip/Add-tip";
import { TipDetail } from "./TipDetail/TipDetal";

function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<FrontLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/rady/:id" element={<FrontLayout />} >
            <Route index element={<TipDetail/>}/>
        </Route>
        <Route path="/sortiment" element={<FrontLayout />}>
        </Route>
        <Route path="/login" element={<FrontLayout />}>
          <Route index element={<Login />} />
        </Route>
         <Route path="/logout" element={<FrontLayout />}>
          <Route index element={<Logout />} />
        </Route>
        <Route path="/rady" element={<FrontLayout />}>
          <Route index element={<Tips />} />
        </Route>
        <Route path="/register" element={<FrontLayout />}>
          <Route index element={<Register/>} />
        </Route>
        <Route path="/pridat-radu" element={<FrontLayout />}>
          <Route index element={<AddTip/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
