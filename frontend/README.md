## Running the Project with Docker

This project includes a production-ready Docker setup for running the Next.js TypeScript application. Below are the key details and instructions specific to this project:

### Requirements & Versions
- **Node.js version:** 22.13.1 (as specified in the Dockerfile)
- **No external services** (e.g., databases) are required by default.

### Environment Variables
- The application supports environment variables via a `.env.local` file.
- To use your own environment variables, create a `.env.local` file in the project root and uncomment the `env_file` line in `docker-compose.yml`:
  ```yaml
  # env_file: ./.env.local
  ```

### Build and Run Instructions
1. **Build and start the app:**
   ```sh
   docker compose up --build
   ```
   This will build the Docker image and start the Next.js app in production mode.

2. **Access the app:**
   - The app will be available at [http://localhost:3000](http://localhost:3000)

### Ports
- **3000:** Exposed by the `typescript-app` service for the Next.js application.

### Special Configuration
- The Dockerfile uses a multi-stage build for optimized production images and runs the app as a non-root user for security.
- No persistent volumes or custom networks are required unless you add additional services.

---

_If you add services like a database, update `docker-compose.yml` accordingly and define any required networks or volumes._
