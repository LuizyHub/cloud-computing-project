import React from "react";

const ArticleList = ({ articles }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
                <div
                    key={article.id}
                    className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-lg font-bold">{article.title}</h2>
                    <a
                        href={article.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        자세히 보기
                    </a>
                </div>
            ))}
        </div>
    );
};

export default ArticleList;