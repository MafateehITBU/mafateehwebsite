FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_BASE_URL=https://api.mafateehgroup.com/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM nginx:1.27-alpine
# node is needed at runtime to regenerate blog/route HTML shells from the live API
RUN apk add --no-cache nodejs

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

# Minimal sources for scripts/generate-route-html.mjs
COPY --from=builder /app/scripts/generate-route-html.mjs /app/scripts/generate-route-html.mjs
COPY --from=builder /app/src/seo /app/src/seo
COPY --from=builder /app/src/content/pages.js /app/src/content/pages.js
COPY --from=builder /app/src/content/home.js /app/src/content/home.js
COPY --from=builder /app/src/content/cookiePolicy.js /app/src/content/cookiePolicy.js
COPY --from=builder /app/src/content/accessibilityStatement.js /app/src/content/accessibilityStatement.js
# ESM imports in generate-route-html require "type": "module"
RUN printf '%s\n' '{"type":"module"}' > /app/package.json
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

WORKDIR /app

ENV HTML_DIST=/usr/share/nginx/html
ENV VITE_API_BASE_URL=http://backend:4000/api
ENV ROUTE_HTML_REFRESH_SECONDS=120

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
