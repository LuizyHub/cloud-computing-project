import React, { useEffect, useState } from "react";

const CasePage = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // API 호출
        fetch("/api/cases")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch cases");
                }
                return response.json();
            })
            .then((data) => {
                setCases(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-6 text-gray-700">
            <h1 className="text-3xl font-bold mb-6 text-center">클라우드 컴퓨팅 사례</h1>
            <div className="space-y-4">
                {cases.map((c) => (
                    <div key={c.id} className="border p-4 rounded shadow-sm">
                        <h2 className="text-xl font-bold mb-2">{c.title}</h2>
                        <p className="mb-2">{c.preview}</p>
                        <a
                            href={c.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            자세히 보기
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CasePage;