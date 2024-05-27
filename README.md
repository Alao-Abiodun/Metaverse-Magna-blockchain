# TrackingAnalysis on Block
The project is implemented using the modular based architecture.


## Requirements
- NodeJS runtime
- Yarn
- Postgres 

## How to install from source
- Clone the repository - `git clone repo-link`
- `cd project-folder`
- You need to have valid mySQL or Postgres database connection
- Install dependencies - `yarn install`
- Setup environment variable - `cp .env.example .env`
- Run development server `yarn dev`
- Run test suite `yarn test`
- Run production server `yarn start`

## Using docker
- Clone the repository - `git clone repo-link`
- `cd project-folder`
- Setup environment variable - `cp .env.example .env`
- Start docker container - `docker-compose up -d`
- Run test suite `docker exec -it container-id yarn start`

## Format code with Prettier
- After writing code, you can format it with Prettier using `yarn format`
- You can update your prettier config in `.prettierrc` file, the default setting uses 4 spaces for indentation