import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ArticlesPage from "./pages/ArticlesPage";
import Layout from "./components/Layout";
import TechPage from "./pages/TechPage";
import CasePage from "./pages/CasePage";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/tech" element={<TechPage />} />
                    <Route path="/cases" element={<CasePage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;