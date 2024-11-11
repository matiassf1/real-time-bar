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

EXPOSE 3004
CMD ["npx", "nodemon", "src/index.ts"]
