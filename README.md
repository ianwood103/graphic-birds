# Graphic Birds

Graphic Birds is a web application designed to visualize bird collision data, providing insights into bird species affected by collisions in various regions. The application allows users to upload CSV files containing bird data, view graphical representations of the data, and easily download polished graphics that are dynamically generated based on uploaded data.

## Table of Contents

- [Example Graphics](#example-graphics)
- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Example Graphics
![image](https://github.com/user-attachments/assets/68c15f78-f8fa-4166-bf88-7ae37f0dd7d3)

![image](https://github.com/user-attachments/assets/49e63817-34a8-47ef-9d46-7396cb55d378)

## Getting Started

To get started with Graphic Birds, follow the instructions below to set up the development environment.

### First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Data Upload**: Users can upload CSV files containing bird collision data.
- **Data Visualization**: The application provides various graphical representations of the data, including bar charts and maps.
- **Dynamic Instructions**: Users can access step-by-step instructions for downloading CSV bird data (given that you have ArcGIS access).

## Technologies Used

- **Frontend**:

  - Next.js
  - TypeScript
  - Rewind UI
  - Tailwind CSS
  - Chart.js for data visualization
  - Leaflet for map rendering

- **Backend**:

  - Next.js
  - TypeScript
  - Serverless App Router Handlers
  - Redis deployed on Upstash (or other Redis deployment) for caching data
  - AWS S3 for storing uploaded files

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ianwood103/graphic-birds.git
cd graphic-birds
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables. Create a `.env.local` file in the root directory and add the following variables:

```
REDIS_URL=your_upstash_redis_url
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_access_key
AWS_REGION=your_aws_region
NEXT_PUBLIC_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Usage

1. Navigate to the application in your browser at [http://localhost:3000](http://localhost:3000).
2. Use the upload button to upload your CSV files containing bird collision data.
3. View the visualizations and download relevant graphics for both monthly and seasonal data.
4. Download all types of graphics at once for different time frames using settings.
