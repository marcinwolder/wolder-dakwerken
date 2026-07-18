import "flag-icons/css/flag-icons.min.css";
import "./index.css";
import "./i18n.js";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import Landing from "./screens/Landing";
import Main from "./screens/Main.js";
import Form from "./screens/Quotation.js";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route element={<Main />}>
                    <Route index element={<Landing />} />
                    <Route path="/quotation" element={<Form />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
