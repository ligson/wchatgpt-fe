#!/bin/bash
ssh root@jxpre "ssh root@149.28.98.249 'cd /root/wchatgpt-fe ; docker-compose pull ; docker-compose down ; docker-compose up -d'"