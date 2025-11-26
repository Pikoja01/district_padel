import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element. Ensure index.html contains <div id='root'></div>");
}
createRoot(rootElement).render(<App />);