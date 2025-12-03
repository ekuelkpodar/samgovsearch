FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app .
EXPOSE 3000
CMD ["npm", "run", "start"]
