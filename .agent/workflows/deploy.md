---
description: Steps to deploy the project to an EC2 instance using Docker
---

# Deployment Workflow

1. SSH into the EC2 instance.
2. Ensure Docker is installed.
3. Navigate to the `javafullstack` directory.
4. Pull the latest changes from the repository.
4. Run the following command:
// turbo
```bash
docker-compose up -d --build
```
5. Check logs to ensure services are running:
```bash
docker-compose logs -f
```
