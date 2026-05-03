import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { TutorPreviewProvider } from "./components/TutorPreviewProvider";
import { AuthProvider } from "./context/AuthContext";
import { tutorsById } from "./data/tutors";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TutorPreviewProvider tutors={tutorsById}>
          <App />
        </TutorPreviewProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
