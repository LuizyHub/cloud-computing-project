# cloud-computing-project


## 요구사항
---
- AWS에서 Apache Web Server + RDS 이용 
- /var/www/html = document root 
- index.html = 초기 화면 
- 컨텐츠를 DB에 보관


## 보고서 내용
---
1. 접속 url (end point) 
2. 선택 option 
3. 자신의 웹 사이트 구조 
4. 구축 과정: 상세하게 (다시 만들 수 있도록)
	-  VPC, subnet, 보안 그룹 등 모든 정보를 포함 
5. 화면 모습 
6. 제공하는 기사/정보의 분량 (갯수)


# 보고서

## 1. 접속 url
---
[http://43.203.179.108/](http://43.203.179.108/)

## 2.선택 option
---
Option 2

## 3. 자신의 웹 사이트 구조
---


## 4. 구축 과정
---

### a) VPC
위 웹사이트 구조처럼 퍼블릿 서브넷에 인스턴스 1개, 프라이빗 서브넷에 인스턴스 1개만 사용할 예정.
따라서, 256IP 만 사용하도록 CIDR 블록 수정.
가용 영역 또한 과제를 위해 1개만 사용

![[./Pasted image 20241202125937.png]]


퍼블릭 서브넷, 프라이빗 서브넷 각각 1개씩만 사용.
각각 서브넷이 16개의 IP 만 사용 가능하도록 CIDR 블록 수정.
보통 NAT 게이트웨이를 활성화하여 프라이빗 서브넷에서도 패키지 업데이트와 같은 인터넷 사용이 가능하도록 하겠지만 RDS 서비스를 사용할 예정이라 비활성화.
S3 사용 예정도 없어 S3 게이트웨이 비활성화.
![[./Pasted image 20241202130149.png]]


생성된 VPC
![[./Pasted image 20241202130558.png]]

### b) EC2

새로운 키페어 pjj 생성
![[./Pasted image 20241202131204.png]]

키페어 접근권한을 안전하게 설정
```bash
chmod 400 pjj.pem
```


현재 프리티어가 타 프로젝트에 의해 이미 사용중이라, arm 기반 가장 저렴한 인스턴스 
t4g.nano: 2 vCPU, 0.5GiB mem 
선택 후 OS 이미지는 Amazon Linux 2023 선택

![[./Pasted image 20241202131347.png]]


서버 조작과 ssh 터널링으로 데이터베이스 접근이 가능하도록 22번 포트 ssh 허용
HTTPS 계획은 없어 443 포트 비활성화
웹 서버로서의 HTTP 통신을 위한 80 포트 활성화
![[./Pasted image 20241202131701.png]]


파일 저장이 목적이 아니지만, 부족한 메모리를 보완하기 위해 가상메모리 공간을 고려한 저장공간 부여
![[./Pasted image 20241202132054.png]]


### c) 인스턴스 초기 설정

1. 스왑 영역 부여
보다 편한 파일 관리와 접속을 위해 Visual Studio Code > Remote - SSH 플러그인 사용 
[Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)

![[Pasted image 20241202133027.png]]


가상메모리 활성화를 위해 swap 공간 부여
필요한 리소스를 설치하는과정에서 프로세스가 죽지 않게 하기 위한 조치임
절대적인 부족한 메모리를 해결하는 방법은 아님

아래 절차를 따르되 스왑공간을 2GB 정도만 부여
[AWS -re:Post) How do I allocate memory to work as a swap file in an Amazon EC2 instance?](https://repost.aws/knowledge-center/ec2-memory-swap-file)

t4g.nano 인스턴스는 기본적으로 512 MB 정도 스왑이 기본적으로 제공되니 1.5 GB 만 추가
![[Pasted image 20241202134207.png]]

```bash
sudo dd if=/dev/zero of=/swapfile bs=128M count=12
```

```bash
sudo chmod 600 /swapfile
```

```bash
sudo mkswap /swapfile
```
    
```bash
sudo swapon /swapfile
```
    
    
```bash
sudo swapon -s
```
    
To start the swap file at boot time, edit the **/etc/fstab** file. Open the file in the editor, and then run the following command:
```bash
sudo vi /etc/fstab
```

Add the following new line at the end of the file:
```
/swapfile swap swap defaults 0 0
```

![[Pasted image 20241202134435.png]]
![[Pasted image 20241202134414.png]]


성공적으로 스왑 영역 부여
![[Pasted image 20241202134454.png]]


2. Apache Web Server 설치

아래 가이드에 따라서 Apache Web Server 만 설치
[튜토리얼: AL2 023에 LAMP 서버 설치](https://docs.aws.amazon.com/ko_kr/linux/al2023/ug/ec2-lamp-amazon-linux-2023.html)


```bash
sudo dnf upgrade -y
```

```bash
sudo dnf install -y httpd
```


```bash
sudo systemctl start httpd
```


```bash
sudo systemctl enable httpd
```


```bash
sudo systemctl is-enabled httpd
```


![[Pasted image 20241202135122.png]]


3.  소유권 변경
위 가이드에는 'ec2-user' 를 apache 그룹에 추가하는 벙법으로 안내하지만, 단순히 html 디렉터리 소유권을 'ec2-user' 로 변경 
```bash
sudo chown ec2-user /var/www/html
```


### c) RDS

0. DB 서브넷 그룹 생성
내가 원하는 프라이빗 서브넷 아래 데이터베이스가 존재할 수 있도록 설정
![[Pasted image 20241202173145.png]]

1. 생성
표준 생성 방식으로 MySQL 생성

가장 최신 버전인 8.4.3 으로 생성

RDS 확장 지원 활성화 옵션은 비 활성화
-> 과제용으로 사용 후 삭제 예정이라 추가 지원이 필요없음
![[Pasted image 20241202142143.png]]


프리티어 템플릿을 사용하여 생성

사용자 이름과 암호 설정

![[Pasted image 20241202142251.png]]

인스턴스는 선택가능한 옵션 중 가장 성능이 좋은 t4g.micro
스토리지는 최소용량 20GB 선택
![[Pasted image 20241202150550.png]]

EC2 연결은 직접 설정할거라 설정 X
퍼블릭 엑세스도 제한
VPC 는 직전에 만들었던 pjj-vpc 사용
가용영역은 EC2 인스턴스와 물리적으로 같은 가용영역 2a 설정
![[Pasted image 20241202150906.png]]


3306 포트를 사용하고, 암호 인증옵션으로 생성.
추가적으로 단순 과제만 수행을 위해 백업 옵션은 제거
![[Pasted image 20241202151047.png]]

RDS를 사용하기 위해서는 최소 2개의 가용영역이 필요해서 새로운 가용영역에 새로운 서브넷 추가
![[Pasted image 20241202151714.png]]

같은 vpc 내부에서 접근 가능하도록 인바운드 규칙 허용
![[Pasted image 20241202192156.png]]


생성 완료
![[./Pasted image 20241202170050.png]]


2. 연결
데이터베이스는 퍼블릭 엑세스가 불가능하므로, 퍼블릭 서브넷에 만들었던 EC2 를 바스티온 서버로 활용해서 **ssh 터널링**을 사용해서 접속
ssh 터널링 방법은 여러가지 있지만, Jetbrain의 DataGrip IDE를 통해서 접속

MySQL로 데이터 소스 선택
![[./Pasted image 20241202170538.png]]

ssh 터널을 진행할 인스턴스 접속 정보 설정


![[Pasted image 20241202170932.png]]

데이터베이스 연결 정보 설정
![[Pasted image 20241202192829.png]]

연결 성공


### API 서버 개발

1. reverse proxy 활성화

```bash
sudo systemctl restart httpd
```

/etc/httpd/conf.d/default.conf 파일을 아래와 같이 추가

```conf
<VirtualHost *:80>
    # ServerName 생략
    # 요청을 Reverse Proxy로 처리
    ProxyPass "/api" "http://localhost:8080/api"
    ProxyPassReverse "/api" "http://localhost:8080/api"

    # 정적 파일 경로 설정
    DocumentRoot /var/www/html
</VirtualHost>
```


2. api 서버 개발
t4g.nano로 사양이 많이 부족한 인스턴스이며, 수행해야할 동작이 데이터베이스 조회 이외의 동작이 없으므로 컴파일 언어인 go 로 개발

main.go
```go
package main  
  
import (  
    "database/sql"  
    "encoding/json"    "log"    "net/http"  
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
  
    // 서버 실행  
    log.Println("Server is running on http://localhost:8080")  
    log.Fatal(http.ListenAndServe(":8080", nil))  
}  
  
// getArticlesHandler는 모든 기사를 반환합니다.  
func getArticlesHandler(w http.ResponseWriter, r *http.Request) {  
    w.Header().Set("Content-Type", "application/json")  
  
    // 데이터베이스에서 기사 조회  
    rows, err := db.Query("SELECT id, title, content FROM articles")  
    if err != nil {  
       http.Error(w, "Failed to fetch articles", http.StatusInternalServerError)  
       log.Printf("Query error: %v", err)  
       return  
    }  
    defer rows.Close()  
  
    var articles []Article  
  
    for rows.Next() {  
       var article Article  
       if err := rows.Scan(&article.ID, &article.Title, &article.Content); err != nil {  
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
```


현재 인스턴스에 맞게 컴파일
Amazon Linux 2023, arm 

```bash
GOOS=linux GOARCH=arm64 go build -o server main.go
```

컴파일 된 실행파일을 서버로 이동
rsync 나, scp 없이 Visual Studio Code의 Remote - SSH 를 사용해서 간단히 드래그 앤 드랍

![[Pasted image 20241202204542.png]]


실행 권한 부여
```bash
chmod +x server
```

실행
```bash
nohup ./server &
```


3. 데이터 베이스 서버 설정

```sql
create database pjj;  
  
use database pjj;  
  
CREATE TABLE IF NOT EXISTS articles (  
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- 기본 키 및 자동 증가  
    title VARCHAR(255) NOT NULL,       -- 제목 필드  
    content TEXT NOT NULL             -- 내용 필드  
);
```

![[Pasted image 20241202203028.png]]


## 5. 화면 모습
---


## 6. 제공하는 기사/정보의 분량 (갯수)
---


