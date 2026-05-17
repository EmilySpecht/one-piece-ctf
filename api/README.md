Docker development setup

Prerequisites

- Docker and Docker Compose installed on your machine.

Quick start (development)

1. Copy example env and edit if necessary:

```bash
cp .env.example .env
# edit .env to set secure passwords before production
```

2. Build and start services:

```bash
docker compose up -d --build
```

3. Check logs:

```bash
docker compose logs -f app
```

4. Open the API docs:

http://localhost:3001/api-docs

Notes

- The app expects the database host to be available at the hostname set in `MYSQL_IP`. When using Docker Compose the `db` service is reachable as `db` (the `.env.example` uses this).
- The `tmp/uploads-cert` directory is mounted into the container so uploaded files persist on the host.
