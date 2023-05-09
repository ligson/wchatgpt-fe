FROM nginx:alpine
ADD ./dist/ /usr/share/nginx/html/wchatgpt-fe/
COPY ./default.conf /etc/nginx/conf.d/
