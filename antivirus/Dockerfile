FROM ubuntu:22.04

# Обновление и установка необходимых пакетов
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    lsb-release \
    apt-transport-https \
    clamav-daemon \
    clamav-freshclam \
    supervisor \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Обновление прав доступа
RUN mkdir /var/run/clamav && \
    chown clamav:clamav /var/run/clamav && \
    chmod 750 /var/run/clamav

# Конфигурация ClamAV для прослушивания на порту 3310
RUN sed -i 's/^Foreground .*$/Foreground true/g' /etc/clamav/clamd.conf && \
    echo "TCPSocket 3310" >> /etc/clamav/clamd.conf && \
    sed -i 's/^Foreground .*$/Foreground true/g' /etc/clamav/freshclam.conf

# Использование freshclam для автоматического обновления баз данных ClamAV
RUN freshclam --quiet

# Копирование конфигурации для supervisord
COPY ./config/supervisor.conf /etc/supervisor/conf.d/supervisord.conf

# Открытие порта 3310 для ClamAV
EXPOSE 3310

# Запуск supervisord
CMD ["/usr/bin/supervisord", "-n"]
