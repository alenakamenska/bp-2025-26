import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Home/Home";
import { FrontLayout } from "./components/layout";
import "./colors.css"


function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/" element={<FrontLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/sortiment" element={<FrontLayout />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
