# Stage 1: Build
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Compile TypeScript code
RUN npm run build

# Stage 2: Run
FROM node:18

WORKDIR /app
COPY --from=build /app/dist /app
COPY package*.json ./
RUN npm install --omit=dev
COPY ./src/private-key.pem ./src/
COPY ./src/certificate.pem ./src/

EXPOSE 3002
CMD ["npx", "nodemon", "src/index.ts"]
