import { createRoot } from "react-dom/client";
import "./main.css";
import Demo from "./pages/Demo";
import ProFile from "./pages/ProFile";

createRoot(document.getElementById('root')).render(
  <>
  <ProFile/>
  {/* <Demo/>  */}
  </>
)
