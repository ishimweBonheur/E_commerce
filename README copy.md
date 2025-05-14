# DOB ecommerce Frontend

[![CI for ecomm-project for Dynamite](https://github.com/atlp-rwanda/DOB-ecomm-fe/actions/workflows/application.yml/badge.svg)](https://github.com/atlp-rwanda/DOB-ecomm-fe/actions/workflows/application.yml)

[![codecov](https://codecov.io/gh/atlp-rwanda/DOB-ecomm-fe/graph/badge.svg?token=32TGKWZBBV)](https://codecov.io/gh/atlp-rwanda/DOB-ecomm-fe)

## Overview

Welcome to DOB frontend application! This project provides an appealing user interface for the DOB e-commerce application. It allows users to browse products, place orders, manage their account, and perform other e-commerce-related activities.

## Installation

To get started with the DOB frontend app, follow these simple steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/atlp-rwanda/DOB-ecomm-fe.git
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## Testing

- Run tests

  ```bash
  npm run test
  ```

- Run tests with coverage

  ```bash
  npm run test:ci
  ```

## Docker

Before you run that commands you must have docker installed in your PC

1. **Build the Docker Image:**
   ```sh
   docker build -t <image_name> .
   ```
2. **Run the container**
   ```sh
   docker run -p 8080:8080 <image_name>
   ```

## Authors
