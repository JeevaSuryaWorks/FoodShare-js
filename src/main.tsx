import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { validateSystemIntegrity, startSecurityWatchdog } from "./lib/identity";

// Critical system integrity check
validateSystemIntegrity();
startSecurityWatchdog();

createRoot(document.getElementById("root")!).render(<App />);
