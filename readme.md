# WintrChess

The WintrChess repository is a monorepo made up of three packages:

#### `client`
The frontend for the website built with React and TypeScript.

#### `server`
The backend for the website where the website content is served, and where any API endpoints will live.

#### `shared`
Libraries, types and common logic is stored here and can be accessed by both the frontend and backend.

### 🚀 Deploying locally

- Install dependencies with `npm i`
- Create `.env` file at root project directory
- Add environment variables. Related documentation in `docs/environment.md`
- Compile packages with `npm run build`
- Start the backend web server with `npm start`
- Connect to website at `localhost:` followed by the port specified in `.env` or `8080`