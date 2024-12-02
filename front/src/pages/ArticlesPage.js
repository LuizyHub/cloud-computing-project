import React, { useEffect, useState } from "react";
import ArticleList from "../components/ArticleList";

const ArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/articles")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch articles");
                }
                return response.json();
            })
            .then((data) => {
                setArticles(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">클라우드 컴퓨팅 관련 기사</h1>
            <ArticleList articles={articles} />
        </div>
    );
};

export default ArticlesPage;