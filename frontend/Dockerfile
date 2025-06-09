# frontend/Dockerfile
FROM node:18

WORKDIR /app
COPY . .
RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 3000
CMD ["pnpm", "run", "dev"]