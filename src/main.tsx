import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Main app entry point
createRoot(document.getElementById("root")!).render(
	<App />
);
