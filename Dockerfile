FROM node:13-stretch

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV TZ="Australia/Melbourne"
ENV MESSAGE_INTERVAL 28800
ENV ROOM_NAME "nothing"

RUN npm update && \
  npm i -g typescript ts-node 

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

ADD . /usr/src/app

CMD [ "npm", "start" ]
