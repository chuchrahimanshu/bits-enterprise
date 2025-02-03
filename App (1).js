import { lazy } from "react";
import { Route, Routes } from "react-router";
import MainForm from "./pages/MainForm/MainForm";
const SideDrawer = lazy(() => import("./layout/MainLayout/SideDrawer"));
const TestApi = lazy(() => import("./pages/testApi/TestApi"));
function App() {
  return (
    <SideDrawer>
      <Routes>
        {/* <Route path="/" element={<SideDrawer />} /> */}
        <Route path="/testapi" element={<TestApi />} />
        <Route path="/forms/getForm" element={<MainForm />} />
      </Routes>
    </SideDrawer>
  );
}

export default App;
