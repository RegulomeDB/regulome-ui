FROM node:18.16.1-bookworm-slim

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update

RUN apt-get install -y python3 build-essential

WORKDIR /docker

COPY ./docker/nextjs/entrypoint.sh .

RUN chmod +x ./entrypoint.sh

WORKDIR /regulome-ui

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["/docker/entrypoint.sh"]

CMD ["npm", "run", "start"]
