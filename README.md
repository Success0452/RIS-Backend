# Serverless Retail Store Application

![Serverless](https://img.shields.io/badge/serverless-aws-orange)
![Nodejs](https://img.shields.io/badge/nodejs-18.x-green)
![Typescript](https://img.shields.io/badge/typescript-4.x-blue)
![MySQL](https://img.shields.io/badge/mysql-8.0-blue)
![Yarn](https://img.shields.io/badge/yarn-3.6.4-blue)

This is a serverless simplified multi-platform retail store application built with AWS Lambda, Node.js, and Typescript. The application uses MySQL for the database and is managed using the Serverless Framework. The package manager used is Yarn.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Testing the Application](#testing-the-application)
- [Endpoints](#endpoints)
    - [User Routes](#user-routes)
    - [Product Routes](#product-routes)
    - [Category Routes](#category-routes)
- [Scripts](#scripts)

## Prerequisites

- Node.js (18.x)
- Yarn (3.6.4)
- Serverless Framework
- AWS CLI
- MySQL

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Success0452/RIS-Backend.git
   cd RIS-Backend

2. **Install dependencies**
   ```bash
   yarn install

3. **Setup environment variables**
   Store your environment variables in AWS Systems Manager Parameter Store (SSM). Example variables include:
   `DB_HOST`
   `DB_USER`
   `DB_PASSWORD`
   `DB_NAME`
  Use the AWS CLI to set these variables:
   ```
   aws ssm put-parameter --name "/env/DB_HOST" --value "your-db-host" --type "String"
   aws ssm put-parameter --name "/env/DB_USER" --value "your-db-user" --type "String"
   aws ssm put-parameter --name "/env/DB_PASSWORD" --value "your-db-password" --type "String"
   aws ssm put-parameter --name "/env/DB_NAME" --value "your-db-name" --type "String"
   aws ssm put-parameter --name "/env/JWT_SECRET" --value "your-db-name" --type "String"
   ```
## Running the Application

   ***To run the application locally:***
   ```bash
   yarn dev
   ```
   
This command uses the Serverless Offline plugin to emulate AWS Lambda and API Gateway on your local machine.

## Running the Application

To run tests:
  ```bash 
  yarn test
  ```
This will run all tests located in the test folder.

## Endpoints
### User Routes
##### Register Route
- `Method: POST`
- `Endpoint: /register`
- `Authorization: None`
- `Request Body:`

```
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```

##### Login Route
- `Method: POST`
- `Endpoint: /login`
- `Authorization: None`
- `Request Body:`

```
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```

##### Logout Route
- `Method: POST`
- `Endpoint: /logout`
- `Authorization: Bearer token required`
- `Request Body:None`

### Product Routes
##### Add Product Route
- `Method: POST`
- `Endpoint: /products`
- `Authorization: Bearer token required`
- `Request Body:`

```
{
  "name": "productName",
  "description": "productDescription",
  "quantity": 10,
  "price": 99.99,
  "categoryId": "categoryId"
}
```
##### Get All Products Route
- `Method: GET`
- `Endpoint: /products`
- `Authorization: Bearer token required`
- `Request Body:None`

##### Delete Product Route
- `Method: DELETE`
- `Endpoint: /products`
- `Authorization: Bearer token required`
- `Request Body:`

```
{
  "productId": "productId"
}
```

##### Update Product Route
- `Method: DELETE`
- `Endpoint: /products`
- `Authorization: Bearer token required`
- `Request Body:`

```
{
  "productId": "productId",
  "name": "updatedName",
  "description": "updatedDescription",
  "quantity": 5,
  "price": 79.99,
  "categoryId": "newCategoryId"
}
```
### Category Routes
##### Add Category Route
- `Method: POST`
- `Endpoint: /categories`
- `Authorization: Bearer token required`
- `Request Body:`

```
{
  "name": "categoryName"
}
```
##### Get All Category Route
- `Method: GET`
- `Endpoint: /categories`
- `Authorization: Bearer token required`
- `Request Body:None`

## Scripts

Runs the application locally.
 ```bash
   yarn dev
```

Deploys the application to AWS.
 ```bash
   yarn push
```

Runs the test suite.
 ```bash
   yarn test
```
