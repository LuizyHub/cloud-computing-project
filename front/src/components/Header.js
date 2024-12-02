import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-blue-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link to="/">Cloud Computing</Link>
                </h1>
                <nav>
                    <Link to="/" className="mr-4 hover:underline">Home</Link>
                    <Link to="/articles" className="hover:underline">Articles</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;