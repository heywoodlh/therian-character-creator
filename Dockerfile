FROM docker.io/library/nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx \
  index.html styles.css app.js sw.js manifest.webmanifest \
  icon.svg icon-180.png icon-192.png icon-512.png icon-maskable.png \
  /usr/share/nginx/html/

EXPOSE 8080
