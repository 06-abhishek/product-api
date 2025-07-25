# 🛠️ Node.js Product API with MongoDB & Redis

This is a RESTful Product API built with **Node.js**, **Express**, **MongoDB**, and **Redis**, containerized using **Docker**.

It supports:
- Product creation
- Fetching products by category (with Redis caching)
- Scalable, production-grade Docker setup (multi-stage build)

---

## 🧱 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (v6.0)
- **Cache**: Redis (v7.2)
- **Containerization**: Docker, Docker Compose

---

## 📁 Folder Structure

```

├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/06-abhishek/product-api.git
cd product-api
````

---

### 2. Setup `.env` File

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://mongo:27017/product-db
REDIS_URL=redis://redis:6379
```

---

### 3. Build & Start Using Docker

```bash
docker compose build --no-cache
docker compose up -d
```

To stop:

```bash
docker compose down -v --remove-orphans
```

---

## 📦 API Endpoints

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/products?category=Shoes` | Get products by category |
| POST   | `/products`                | Create a new product     |

---

## 🐳 Dockerized Services

* **Backend**: `node:20`
* **Database**: `mongo:6.0`
* **Cache**: `redis:7.2`

---

## ✅ Health Check

```bash
curl http://localhost:5000/products?category=Apparel
```

---

## 🧪 Test Redis Caching

1. First request fetches from MongoDB
2. Second request (same category) fetches from Redis

---

## 👨‍💻 Author

**Abhishek Patil**

* GitHub: [@06-abhishek](https://github.com/06-abhishek)
* LinkedIn: [linkedin.com/in/abhishekpatil](https://www.linkedin.com/in/abhishek-patil-27759630b/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

