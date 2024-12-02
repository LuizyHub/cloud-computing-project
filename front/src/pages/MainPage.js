import React from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
    return (
        <div className="container mx-auto p-6 text-gray-700">
            <h1 className="text-3xl font-bold text-center mb-6">클라우드 컴퓨팅 과목 소개</h1>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">교과목 개요</h2>
                <p>
                    클라우드 컴퓨팅은 확장 가능한 관리형 웹응용 서비스를 구축하는 표준 방법으로,
                    AWS, Azure, GCP를 활용하여 실습과 웹 애플리케이션 구축을 목표로 합니다.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">주차별 주요 내용</h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left border border-gray-200">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">주차</th>
                            <th className="px-4 py-2 border">강의 주제 및 내용</th>
                            <th className="px-4 py-2 border">핵심 키워드</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[
                            { week: "1주", topic: "강의 소개, AWS 계정 가입", keywords: "AWS 계정 가입, 강의 소개" },
                            { week: "2주", topic: "클라우드 정의, 역사, 서비스 모델(IaaS, PaaS, SaaS), 가상화 기술", keywords: "IaaS, PaaS, SaaS, 가상화" },
                            { week: "3주", topic: "AWS 주요 서비스(EC2, S3, IAM 등)", keywords: "EC2, S3, IAM, RDS" },
                            { week: "4주", topic: "IAM 및 VPC 설정", keywords: "IAM, VPC, MFA 설정" },
                            { week: "5주", topic: "EC2 및 S3 상세 실습", keywords: "EC2, S3, 정적 사이트" },
                            { week: "6주", topic: "LAMP 설치, Auto Scaling, Load Balancing", keywords: "LAMP, Auto Scaling, Load Balancing" },
                            { week: "7주", topic: "Cloud Formation 및 Cloud Front 실습", keywords: "Cloud Formation, Cloud Front" },
                            { week: "8주", topic: "중간고사", keywords: "중간고사" },
                            { week: "9주", topic: "Elastic Beanstalk 및 Lambda", keywords: "Elastic Beanstalk, Lambda" },
                            { week: "10주", topic: "RDS 서비스 이해 및 실습", keywords: "RDS, 데이터베이스" },
                            { week: "11주", topic: "웹 애플리케이션 배포 및 CI/CD 설정", keywords: "웹 배포, CI/CD" },
                            { week: "12주", topic: "Azure 주요 서비스", keywords: "Azure, VMs, Blob Storage" },
                            { week: "13주", topic: "GCP 주요 서비스 및 데이터 분석", keywords: "GCP, BigQuery, Compute Engine" },
                            { week: "14주", topic: "클라우드 사례 분석, 웹 애플리케이션 구축", keywords: "클라우드 사례, 웹 애플리케이션" },
                            { week: "15주", topic: "기말고사", keywords: "기말고사" },
                        ].map((row, index) => (
                            <tr key={index} className="border">
                                <td className="px-4 py-2 border">{row.week}</td>
                                <td className="px-4 py-2 border">{row.topic}</td>
                                <td className="px-4 py-2 border">{row.keywords}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="text-center mt-6">
                <Link
                    to="/articles"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                    클라우드 컴퓨팅 관련 기사 보러가기
                </Link>
            </div>
        </div>
    );
};

export default MainPage;