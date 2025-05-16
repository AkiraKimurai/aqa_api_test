FROM grafana/k6:latest

USER root

# Устанавливаем только необходимые зависимости
RUN apk add --no-cache jq curl

WORKDIR /app
COPY . .
RUN chmod +x /app/tests/performance/api/docker/run-tests.sh

ENTRYPOINT ["/app/tests/performance/api/docker/run-tests.sh"]
