FROM  node:22.12.0-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx ngcc --properties es2013 browser module main --first-only --create-ivy-entry-point
COPY . .
RUN npm run build
FROM  nginx:stable
COPY default.conf /etc/nginx/conf.d
COPY --from=build /app/dist/amued-frontend  usr/share/nginx/html
EXPOSE 80
