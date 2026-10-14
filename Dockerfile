FROM cgr.dev/chainguard/nginx:latest

COPY index.html styles.css app.js /usr/share/nginx/html/

EXPOSE 8080