# get target architecture
LOCAL_ARCH := $(shell uname -m)
ifeq ($(LOCAL_ARCH),x86_64)
	TARGET_ARCH_LOCAL=amd64
else ifeq ($(shell echo $(LOCAL_ARCH) | head -c 5),armv8)
	TARGET_ARCH_LOCAL=arm64
else ifeq ($(shell echo $(LOCAL_ARCH) | head -c 4),armv)
	TARGET_ARCH_LOCAL=arm
else ifeq ($(shell echo $(LOCAL_ARCH) | head -c 5),arm64)
	TARGET_ARCH_LOCAL=arm64
else ifeq ($(shell echo $(LOCAL_ARCH) | head -c 7),aarch64)
	TARGET_ARCH_LOCAL=arm64
else
	TARGET_ARCH_LOCAL=amd64
endif
export GOARCH ?= $(TARGET_ARCH_LOCAL)

# get docker tag
ifeq ($(GOARCH),amd64)
	LATEST_TAG?=latest
else
	LATEST_TAG?=latest-$(GOARCH)
endif

# get target os
LOCAL_OS := $(shell uname -s)
ifeq ($(LOCAL_OS),Linux)
   TARGET_OS_LOCAL = linux
else ifeq ($(LOCAL_OS),Darwin)
   TARGET_OS_LOCAL = darwin
   PATH := $(PATH):$(HOME)/go/bin/darwin_$(GOARCH)
else
   echo "Not Supported"
   TARGET_OS_LOCAL = windows
endif
export GOOS ?= $(TARGET_OS_LOCAL)

# Default docker container and e2e test target.
TARGET_OS ?= linux
TARGET_ARCH ?= amd64

OUT_DIR := ./dist

.DEFAULT_GOAL := all

ifneq ($(wildcard ./private/charts/nats-skeleton-spa),)
VALUES_PATH := ./private/charts/nats-skeleton-spa/values.yaml
else
VALUES_PATH := ./charts/nats-skeleton-spa/values.yaml
endif

DOCKER_REGISTRY ?= ghcr.io/jr200
IMAGE_NAME ?= nats-skeleton-spa
K8S_NAMESPACE ?= nats-skeleton-spa

################################################################################
# Target: docker-run                                                 #
################################################################################
.PHONY: docker-run
docker-run:
	podman run \
		--rm \
		--env-file .env.local \
		-p 5173:80 \
		$(IMAGE_NAME):debug

################################################################################
# Target: docker-debug
################################################################################
.PHONY: docker-debug
docker-debug:
	podman run \
		--rm \
		--env-file .env.local \
		-it \
		--entrypoint sh \
		-p 5173:80 \
		$(IMAGE_NAME):debug


################################################################################
# Target: docker-build                                                 #
################################################################################
.PHONY: docker-build
docker-build:
	podman build \
		-f docker/Dockerfile \
		-t $(IMAGE_NAME):debug \
		--layers=true \
		.

################################################################################
# Target: helm chart dependencies
################################################################################
.PHONY: chart-deps
chart-deps:
	helm dependency build charts/nats-skeleton-spa --skip-refresh
	kubectl create namespace $(K8S_NAMESPACE) || echo "OK"

################################################################################
# Target: helm chart install
################################################################################
.PHONY: chart-install
chart-install: chart-deps
	helm upgrade -n $(K8S_NAMESPACE) nats-skeleton-spa \
		--install \
		--set vault-actions.bootstrapToken=$(VAULT_TOKEN) \
		-f $(VALUES_PATH) \
		charts/nats-skeleton-spa

################################################################################
# Target: helm template
################################################################################
.PHONY: chart-template
chart-template: chart-deps
	helm template -n $(K8S_NAMESPACE) nats-skeleton-spa \
		--set vault-actions.bootstrapToken=$(VAULT_TOKEN) \
		-f $(VALUES_PATH) \
		--debug \
		charts/nats-skeleton-spa

################################################################################
# Target: helm template
################################################################################
.PHONY: chart-dry-run
chart-dry-run:
	helm install \
		-n $(K8S_NAMESPACE) 
		-f $(VALUES_PATH) \
		--generate-name \
		--dry-run \
		--debug \
		--set vault-actions.bootstrapToken=$(VAULT_TOKEN) \
		charts/nats-skeleton-spa
