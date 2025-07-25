# -------- Base Stage --------
FROM node:20 AS base
WORKDIR /app
COPY package*.json ./

# -------- Dependencies Stage --------
FROM base AS deps
RUN npm install --production

# -------- Final Production Stage --------
FROM node:20 AS production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5000
CMD [ "node", "src/server.js" ]
