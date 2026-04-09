import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Home/Home";
import { FrontLayout } from "./components/layout";
import "./colors.css";
import { Login } from "./Login/Login";
import { Logout } from "./Logout/Logout";
import {Register} from "./Register/Register"
import { Tips } from "./Tips/Tips";
import { AddTip } from "./Add-Tip/Add-tip";
import { TipDetail } from "./TipDetail/TipDetal";
import {UserPage} from "./UserPage/UserPage"
import { Business } from "./Businesses/Businesses";
import { BusinessDetail } from "./BusinessDetail/BusinessDetail";
import { Products } from "./Products/Products";
import { BusinessSettings } from "./BusinessSettings/BusinessSettings";
import { ProductDetail } from "./ProductDetail/ProductDetail";
import { ProductUpdate } from "./ProductUpdate/ProductUpdate";
import { EditTip } from "./EditTip/EditTip";
import { ProtectedRoute } from "./ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotFound } from "./NotFound/NotFound";
import { Unauthorize } from "./Unauthorize/Unauthorize";
import { ForgotPassword } from "./ForgotPassword/ForgotPassword";
import { ResetPassword } from "./ResetPassword/ResetPassword";
import { PrivacyPolicy } from "./PrivacyPolicy/PrivacyPolicy";

function App() {
  return (
    <BrowserRouter> 
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" /> 
      <Routes>
        <Route path="/" element={<FrontLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/uzivatel" element={<FrontLayout />}>
          <Route index element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
        </Route>
        <Route path="/rady/:id" element={<FrontLayout />} >
            <Route index element={<TipDetail/>}/>
        </Route>
        <Route path="/sortiment" element={<FrontLayout />}>
            <Route index element={<Products/>}/>
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
          <Route index element={<ProtectedRoute><AddTip/></ProtectedRoute>} />
        </Route>
        <Route path="/podniky" element={<FrontLayout />}>
          <Route index element={<Business/>} />
        </Route>
         <Route path="/podnik/:id" element={<FrontLayout />}>
          <Route index element={<BusinessDetail/>} />
        </Route>
        <Route path="/sprava-podniku/:id" element={<FrontLayout />}>
          <Route index element={<BusinessSettings/>} />
        </Route>
        <Route path="/produkt/:id" element={<FrontLayout />}>
          <Route index element={<ProductDetail/>} />
        </Route>
         <Route path="/upravit-produkt/:id" element={<FrontLayout />}>
          <Route index element={<ProductUpdate/>} />
        </Route>
        <Route path="/upravit-radu/:id" element={<FrontLayout />}>
          <Route index element={<EditTip/>} />
        </Route>
        <Route path="/pristup-odmitnut" element={<FrontLayout />}>
          <Route index element={<Unauthorize/>} />
        </Route>
         <Route path="/ochrana-soukromi" element={<FrontLayout />}>
          <Route index element={<PrivacyPolicy/>} />
        </Route>
       <Route path="/zapomenute-heslo" element={<FrontLayout />}>
          <Route index element={<ForgotPassword/>} />
        </Route>
        <Route path="/reset-hesla" element={<FrontLayout />}>
          <Route index element={<ResetPassword/>} />
        </Route>
        <Route path="*" element={<FrontLayout />}>
          <Route path="*" element={<NotFound/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
