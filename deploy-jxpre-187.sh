#!/bin/bash
ssh root@jxpre "ssh root@45.63.109.187 'cd /root/wchatgpt-fe ; docker-compose pull ; docker-compose down ; docker-compose up -d'"
