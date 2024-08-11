<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Plena Backend

## Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/tharsh95/nest-ms.git
```

### Step 2: Install Dependency
### Using npm
```bash
npm install
```
### Using yarn
```bash
yarn
```
### Step 3: Add env
```bash
Add .env file to the root of the backend directory, 
Copy the key-value from .env.example and fill it
```
### Step 4:Run the docker instance(Make sure docker is installed)
```bash
docker compose up dev-db -d
```
### Step 5:Migrate the db
```bash
npx prisma migrate dev
```
#### To open the the prisma client to see db content
```bash
npx prisma studio
```
### Step 6:Run the application
```bash
yarn start:dev
```

## Postman Collection

https://api.postman.com/collections/13355927-f1616cb8-b6b0-4967-a20b-272502704a71?access_key=PMAT-01J50Q06Y8C2F0YMKVMPDW8V6B

### Make sure to read the collection docs