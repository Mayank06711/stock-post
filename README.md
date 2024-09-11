# Stock-Post Project Setup

## Overview

The `stock-post` project is a backend application with a deadline of 11/09/24. This document provides instructions on setting up and initiating the project.

## Prerequisites

- **Node.js** (version 16.x or later recommended)
- **npm** (version 10.x or later recommended)

## Project Setup

Follow these steps to set up the project:

### 1. Clone the Repository

Clone the repository from your version control system (e.g., GitHub, GitLab):

```bash
git clone https://github.com/Mayank06711/stock-post
cd stock-post
npm install
```
## Environment Variable Setup

Use the .envSample file to enter the required environment variables in your .env file, note that the environment variables without the environment variables this projec will not be fully functional.

## Cloudinary Environment Setup

### Log in to Cloudinary:

Go to the Cloudinary website and log in to your account.

### Navigate to the Dashboard:

Once logged in, navigate to your Cloudinary dashboard.

### Access API Keys:

In the dashboard, go to the "Settings" section.
Under “Settings”, find the “API Keys” tab. Here, you will see your CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.

### Copy the Credentials:

Copy the CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET from this section. These are the credentials you will use to configure your Cloudinary integration.

## Starting Server

### Starting Server

```bash
npm run dev # for starting in development
npm start   # for starting in production
```

## Swagger API Documentation

Explore the detailed API documentation by clicking the link below:

### 🔗 Swagger API Docs

Simply copy and paste the link into your browser to get started!
```bash
http://localhost:7056/api-docs/
```

