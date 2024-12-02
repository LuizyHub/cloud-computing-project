import React, { useEffect, useState } from "react";

const TechPage = () => {
    const [keywords, setKeywords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // API 호출
        fetch("/api/keywords")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch keywords");
                }
                return response.json();
            })
            .then((data) => {
                setKeywords(data);
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
            {/* 클라우드 컴퓨팅 개요 */}
            <section className="mb-6">
                <h1 className="text-3xl font-bold text-center mb-4">클라우드 컴퓨팅 기술 설명</h1>
                <p className="text-lg">
                    클라우드 컴퓨팅은 인터넷(클라우드)을 통해 서버, 스토리지, 네트워크, 데이터베이스, 소프트웨어, 분석 등의 IT
                    리소스를 제공하는 기술입니다. 사용자는 필요에 따라 리소스를 유연하게 사용할 수 있으며, 물리적 인프라를 구축할
                    필요 없이 비용 효율적이고 확장 가능한 방식으로 활용할 수 있습니다.
                </p>
            </section>

            {/* 키워드 설명 */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">핵심 키워드 설명</h2>
                <div className="space-y-4">
                    {keywords.map((keyword) => (
                        <div key={keyword.id} className="border p-4 rounded shadow-sm">
                            <h3 className="text-xl font-bold mb-2">{keyword.title}</h3>
                            <p>{keyword.content}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TechPage;