import React from "react";

// 날짜 포맷 함수
const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
};

const ArticleList = ({ articles }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
                <div
                    key={article.id}
                    className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-lg font-bold mb-2">{article.title}</h2>
                    <a
                        href={article.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mb-2 block"
                    >
                        자세히 보기
                    </a>
                    <p className="text-sm text-gray-500">
                        작성일: {formatDate(article.date)}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ArticleList;