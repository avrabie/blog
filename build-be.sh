#!/usr/bin/env bash

# Use docker buildx for cross-compilation from ARM to AMD64
docker build --platform linux/amd64 -t gluonstream/blog-be:latest .

# Push the image to the registry
docker push gluonstream/blog-be:latest

# Optional: Load the image if using a local kind cluster
# kind load docker-image gluonstream/blog-be:latest --name blog.s4v3

# Restart the deployment to pick up the new image
kubectl apply -k k8s/overlays/hetzner/
kubectl rollout restart deployment.apps/blog-be -n blog-namespace
#kubectl rollout restart deployment.apps/blog-fe -n blog-namespace
