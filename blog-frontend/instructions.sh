#!/usr/bin/env bash
#docker build --platform linux/amd64 -t gluonstream/execodex-fe:latest .
docker build --platform linux/amd64 -t gluonstream/blog-fe:latest .
docker push gluonstream/blog-fe:latest
kind load docker-image gluonstream/blog-fe:latest --name blog.s4v3
kubectl apply -k k8s
kubectl rollout restart deployment/blog-fe -n execodex
