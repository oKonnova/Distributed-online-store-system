# Distributed Online Store System

This project is a distributed e-commerce system built using a microservices architecture. It demonstrates a fully functional online store with services for managing products, carts, orders, and notifications, along with a user-friendly frontend interface. The system is designed to be scalable and includes monitoring tools for performance tracking.

---

## Overview

The **Distributed Online Store System** consists of several microservices that communicate with each other to provide a seamless shopping experience. The frontend allows users to browse products, add them to a cart, adjust quantities, and checkout. The backend services handle product catalog management, cart operations, order processing, and notifications. Monitoring is implemented using **Prometheus** and **Grafana**.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js (Express.js)  
- **Database**: MongoDB  
- **Message Queue**: RabbitMQ  
- **Containerization**: Docker, Docker Compose  
- **Monitoring**: Prometheus, Grafana  
---

## Prerequisites

- Docker and Docker Compose (latest stable version recommended)  
- Node.js (v20.x recommended for frontend development)  
- Git (for cloning the repository)  
- Ubuntu (or WSL on Windows) for local development
---

## Project Structure

- `frontend/`: Frontend application (HTML, CSS, JavaScript).
- `catalog/`: Catalog Service for managing products (connected to MongoDB).
- `cart/`: Cart Service for managing shopping carts (connected to MongoDB, scaled to 3 instances).
- `order/`: Order Service for processing orders (connected to MongoDB, scaled to 3 instances).
- `notification/`: Notification Service for sending messages via RabbitMQ.
- `prometheus/`: Prometheus configuration for metrics collection.
- `grafana/`: Grafana configuration for visualizing metrics.
- `docker-compose.yml`: Defines the multi-container setup.

---

## Features

- **Product Browsing**: View available products in the catalog.
- **Cart Management**: Add products to the cart, adjust quantities using "+" and "−" buttons, and remove items.
- **Order Processing**: Complete purchases with a checkout process and receive an order confirmation.
- **Scalability**: Load-balanced Cart and Order services with multiple instances.
- **Monitoring**: Real-time metrics visualization using Prometheus and Grafana.
- **Continuous Integration**: Automated CI pipeline using GitHub Actions.

---

## Monitoring with Grafana

- Access Grafana at [http://localhost:3000](http://localhost:3000).
- Use the default credentials: `admin/admin`.
- Create or view dashboards to monitor metrics such as HTTP request counts for Cart and Order services.
- Example PromQL query for Cart Service requests:
  ```promql
  http_requests_total{job="cart"}

