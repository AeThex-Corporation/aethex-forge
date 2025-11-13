# Backend Architecture & Systems Design

## Table of Contents

1. [Introduction to Systems Design](#introduction)
2. [Architectural Patterns](#patterns)
3. [Database Design](#databases)
4. [API Design](#apis)
5. [Caching Strategies](#caching)
6. [Microservices Architecture](#microservices)
7. [Scalability & Performance](#scalability)
8. [Deployment & DevOps](#deployment)

## Introduction to Systems Design

Systems design is about building large-scale systems that are scalable, reliable, and maintainable. This course covers the architecture decisions that shape successful backend systems.

### Key Concepts

**Scalability**: Can the system handle growth?
**Availability**: How reliable is the system?
**Consistency**: Is data accurate across all nodes?
**Partition Tolerance**: Works despite network failures?
**Latency**: How fast are responses?
**Throughput**: How many requests per second?

### Design Process

```
1. Understand Requirements
   - Functional (what it does)
   - Non-functional (performance, scale)

2. Estimate Scale
   - Users, data volume, traffic

3. Design High-Level Architecture
   - Components and their interactions

4. Identify Bottlenecks
   - Where will failures occur?

5. Optimize
   - Caching, databases, APIs
```

## Architectural Patterns

### Monolithic Architecture

Single unified application:

```
┌─────────────────────────┐
│   Web Server            │
├─────────────────────────┤
│   User Service          │
│   Product Service       │
│   Order Service         │
│   Payment Service       │
├─────────────────────────┤
│   Database              │
└─────────────────────────┘
```

**Advantages:**
- Simple to develop initially
- Easy to deploy as single unit
- Better performance (in-process calls)

**Disadvantages:**
- Scaling limited to vertical scaling
- Technology changes hard to implement
- Tight coupling

### Microservices Architecture

Decomposed into independent services:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ User Service │  │ Order Service│  │Payment Svc   │
├──────────────┤  ├──────────────┤  ├──────────────┤
│   User DB    │  │   Order DB   │  │ Payment DB   │
└──────────────┘  └──────────────┘  └──────────────┘
        ↓                ↓                  ↓
        └────── API Gateway ─────────┘
```

**Advantages:**
- Scale services independently
- Use different technologies per service
- Loose coupling
- Deploy independently

**Disadvantages:**
- Operational complexity
- Network latency
- Data consistency challenges
- Testing complexity

### Event-Driven Architecture

Services communicate via events:

```
User Service          Order Service         Payment Service
    │                      │                       │
    │ User Created         │                       │
    └──────────────────→ Message Queue ←───────────│
                           │                  Payment Processed
                           │
                         Event Processor
                           │
                    Stores event in log
```

## Database Design

### Relational Databases

Structured data with relationships:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

**Use Cases:**
- Complex relationships
- ACID transactions required
- Structured data
- Strong consistency

**Examples:** PostgreSQL, MySQL, Oracle

### NoSQL Databases

Flexible, distributed data stores:

```json
// Document DB (MongoDB)
{
    "_id": ObjectId("..."),
    "user_id": "user123",
    "items": [
        {"product_id": "prod1", "quantity": 2},
        {"product_id": "prod2", "quantity": 1}
    ],
    "total": 99.99
}
```

**Use Cases:**
- Unstructured data
- Horizontal scaling
- Flexible schema
- High throughput

**Examples:** MongoDB, DynamoDB, Cassandra

### Database Optimization

**Normalization** (Relational):
- Reduce redundancy
- Improve consistency
- Trade-off: More joins needed

**Denormalization** (NoSQL):
- Reduce queries
- Improve performance
- Trade-off: Data duplication

## API Design

### RESTful API Design

Resource-oriented architecture:

```
GET    /api/users              # List all users
GET    /api/users/:id          # Get specific user
POST   /api/users              # Create user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user

GET    /api/users/:id/orders   # Get user's orders
POST   /api/users/:id/orders   # Create order for user
```

### Versioning Strategy

Managing API changes:

```
// URL versioning
GET /api/v1/users
GET /api/v2/users (breaking change)

// Header versioning
GET /api/users
Header: Api-Version: 2

// Parameter versioning
GET /api/users?version=2
```

### Response Format

Consistent JSON structure:

```json
{
    "success": true,
    "data": {
        "id": "user123",
        "name": "Alice",
        "email": "alice@example.com"
    },
    "meta": {
        "timestamp": "2024-01-15T10:30:00Z"
    }
}
```

## Caching Strategies

### Cache Types

**Browser Caching**
- Cache headers in HTTP response
- Reduces server load

**CDN Caching**
- Distribute content globally
- Low latency from user location

**Application Caching**
- In-memory data store (Redis)
- Fast data access

**Database Caching**
- Query result caching
- Reduce database load

### Cache Invalidation

Strategies for keeping cache fresh:

**Time-based (TTL)**
```
Cache entry expires after 1 hour
Simple, but may serve stale data
```

**Event-based**
```
When user updates profile, invalidate cache
More accurate, but complex implementation
```

**Write-through**
```
Always write to cache and database together
Ensures consistency, higher latency on writes
```

### Redis Implementation

```python
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379)

# Store in cache
def get_user(user_id):
    # Check cache first
    cache_key = f"user:{user_id}"
    cached = redis_client.get(cache_key)
    
    if cached:
        return json.loads(cached)
    
    # Fetch from database
    user = db.query(User).filter(User.id == user_id).first()
    
    if user:
        # Store in cache for 1 hour
        redis_client.setex(cache_key, 3600, json.dumps(user.to_dict()))
    
    return user

# Invalidate cache
def update_user(user_id, data):
    user = db.query(User).filter(User.id == user_id).first()
    user.update(data)
    db.commit()
    
    # Invalidate cache
    redis_client.delete(f"user:{user_id}")
```

## Microservices Architecture

### Service Communication

**Synchronous (REST/gRPC)**
- Direct request-response
- Simple but tight coupling
- Latency addition

**Asynchronous (Message Queue)**
- Fire and forget
- Loose coupling
- Delayed processing

### Service Mesh

Managing service-to-service communication:

```
┌─────────────┐
│ User Svc    │
└─────────────┘
      │
      ↓ (managed by Istio/Linkerd)
┌─────────────┐    ┌──────────────┐
│  Proxy      │───→│ Order Svc    │
│  (Envoy)    │    │              │
└─────────────┘    └──────────────┘
   Features:
   - Load balancing
   - Circuit breaking
   - Retries
   - Monitoring
```

### Saga Pattern (Distributed Transactions)

Handling transactions across services:

```
User Service         Order Service        Payment Service
     │                    │                     │
     │ Create Order       │                     │
     │───────────────────→│                     │
     │                    │ Process Payment     │
     │                    │────────────────────→│
     │                    │ Payment Confirmed   │
     │                    │←────────────────────│
     │ Order Confirmed    │                     │
     │←───────────────────│                     │

If payment fails, compensating transactions 
cancel order and refund user
```

## Scalability & Performance

### Horizontal Scaling

Adding more servers:

```
     Load Balancer
            │
    ┌───┬───┬───┐
    ↓   ↓   ↓   ↓
   Svc Svc Svc Svc
    │   │   │   │
    └───┴───┴───┘
        Shared DB
```

**Load Balancing Strategies:**
- Round-robin: Equal distribution
- Least connections: Send to least busy
- IP hash: Same user always to same server

### Database Scaling

**Read Replicas**
```
      Master DB (Writes)
            │
    ┌───┬───┬───┐
    ↓   ↓   ↓   ↓
  Replica Replicas (Reads)
```

**Sharding (Horizontal Partitioning)**
```
User 1-500K → Shard 1 (DB 1)
User 500K-1M → Shard 2 (DB 2)
User 1M-1.5M → Shard 3 (DB 3)

Tradeoff: Data is partitioned but more complex querying
```

### Performance Optimization

```
1. Identify bottlenecks (profiling, monitoring)
2. Optimize database queries (indexes, query analysis)
3. Implement caching (Redis, CDN)
4. Use async processing (message queues)
5. Optimize code (algorithms, data structures)
6. Scale infrastructure (add servers, CDN)
```

## Deployment & DevOps

### Container Technology (Docker)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

### Orchestration (Kubernetes)

Managing containerized applications:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

### CI/CD Pipeline

Automated testing and deployment:

```
Code Commit
    ↓
Run Tests (Unit, Integration)
    ↓
Build Docker Image
    ↓
Push to Registry
    ↓
Deploy to Staging
    ↓
Run E2E Tests
    ↓
Deploy to Production
```

## Conclusion

Mastering backend systems design requires understanding:

- **Architecture patterns**: When to use monoliths vs microservices
- **Database design**: Choosing the right data store
- **API design**: Clear, versioned interfaces
- **Caching**: Reducing latency and load
- **Scalability**: Planning for growth
- **Operations**: Reliable deployment and monitoring

Study these principles, practice on real systems, and stay updated with evolving technologies. Great backend architecture enables great products.
