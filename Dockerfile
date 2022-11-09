FROM node:16-alpine3.16
WORKDIR /var/www/reviews
RUN apk update && apk upgrade && apk --no-cache add curl
# ADD package.json package.json
ADD . .
RUN npm install
ENV NODE_ENV=production
RUN npm run build
# RUN npm prune --production
EXPOSE 3000
CMD "npm" "start"