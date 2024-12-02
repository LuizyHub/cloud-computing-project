package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

// 상수 정의
const (
	DB_HOST     = "pjj-rds.cz0e0yk408er.ap-northeast-2.rds.amazonaws.com"
	DB_PORT     = "3306"
	DB_USER     = "pjj"
	DB_PASSWORD = "1991148pjj"
	DB_NAME     = "pjj"
)

// Article 뉴스 기사의 구조체
type Article struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Date    string `json:"date"`
}

type Keyword struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

type Case struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Preview string `json:"preview"`
	Link    string `json:"link"`
}

// DB 연결 설정
var db *sql.DB

func main() {
	var err error
	// MySQL 데이터베이스 연결
	//dsn := "username:password@tcp(127.0.0.1:3306)/news_db"
	dsn := DB_USER + ":" + DB_PASSWORD + "@tcp(" + DB_HOST + ":" + DB_PORT + ")/" + DB_NAME
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// DB 연결 테스트
	if err := db.Ping(); err != nil {
		log.Fatalf("Database ping failed: %v", err)
	}

	// 라우터 설정
	http.HandleFunc("/api/articles", getArticlesHandler)
	http.HandleFunc("/api/keywords", getKeywordsHandler)
	http.HandleFunc("/api/cases", getCasesHandler)
	// 서버 실행
	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// getArticlesHandler는 모든 기사를 반환합니다.
func getArticlesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 데이터베이스에서 기사 조회
	rows, err := db.Query("SELECT id, title, content, date FROM articles")
	if err != nil {
		http.Error(w, "Failed to fetch articles", http.StatusInternalServerError)
		log.Printf("Query error: %v", err)
		return
	}
	defer rows.Close()

	var articles []Article

	for rows.Next() {
		var article Article
		if err := rows.Scan(&article.ID, &article.Title, &article.Content, &article.Date); err != nil {
			http.Error(w, "Failed to parse articles", http.StatusInternalServerError)
			log.Printf("Row scan error: %v", err)
			return
		}
		articles = append(articles, article)
	}

	// JSON 응답
	if err := json.NewEncoder(w).Encode(articles); err != nil {
		http.Error(w, "Failed to encode articles", http.StatusInternalServerError)
		log.Printf("JSON encode error: %v", err)
	}
}

func getKeywordsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.Query("SELECT id, title, content FROM keywords")
	if err != nil {
		http.Error(w, "Failed to fetch keywords", http.StatusInternalServerError)
		log.Printf("Query error: %v", err)
		return
	}
	defer rows.Close()

	var keywords []Keyword
	for rows.Next() {
		var keyword Keyword
		if err := rows.Scan(&keyword.ID, &keyword.Title, &keyword.Content); err != nil {
			http.Error(w, "Failed to parse keywords", http.StatusInternalServerError)
			log.Printf("Row scan error: %v", err)
			return
		}
		keywords = append(keywords, keyword)
	}

	if err := json.NewEncoder(w).Encode(keywords); err != nil {
		http.Error(w, "Failed to encode keywords", http.StatusInternalServerError)
		log.Printf("JSON encode error: %v", err)
	}
}

func getCasesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.Query("SELECT id, title, preview, link FROM cases")
	if err != nil {
		http.Error(w, "Failed to fetch cases", http.StatusInternalServerError)
		log.Printf("Query error: %v", err)
		return
	}
	defer rows.Close()

	var cases []Case
	for rows.Next() {
		var c Case
		if err := rows.Scan(&c.ID, &c.Title, &c.Preview, &c.Link); err != nil {
			http.Error(w, "Failed to parse cases", http.StatusInternalServerError)
			log.Printf("Row scan error: %v", err)
			return
		}
		cases = append(cases, c)
	}

	if err := json.NewEncoder(w).Encode(cases); err != nil {
		http.Error(w, "Failed to encode cases", http.StatusInternalServerError)
		log.Printf("JSON encode error: %v", err)
	}
}
