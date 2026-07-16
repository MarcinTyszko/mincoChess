FROM node:22-alpine

# Official AVX2 build; the apk package is a plain SSE2 build which is
# several times slower at NNUE inference. gcompat lets the glibc-linked
# official binary run on musl.
RUN apk add --no-cache gcompat libstdc++ \
    && wget -q https://github.com/official-stockfish/Stockfish/releases/download/sf_17.1/stockfish-ubuntu-x86-64-avx2.tar \
        -O /tmp/stockfish.tar \
    && tar -xf /tmp/stockfish.tar -C /tmp \
    && mv /tmp/stockfish/stockfish-ubuntu-x86-64-avx2 /usr/local/bin/stockfish \
    && rm -rf /tmp/stockfish.tar /tmp/stockfish

WORKDIR /app
COPY . .

RUN npm i
RUN npm run build -w shared
RUN npm run build -w server

# The client build bakes .env values into the bundle, but .env is part
# of the build context, so it can happen here rather than at container
# startup - a production webpack build is far too heavy to run on a
# live host (it has frozen machines before)
RUN npm run build -w client

EXPOSE 8080

CMD ["npm", "start"]