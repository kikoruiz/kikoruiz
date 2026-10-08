.PHONY: lib
OWNER=Kiko Ruiz <hola@kikoruiz.es>

SHELL := /bin/bash
.DEFAULT_GOAL := help

export NODE_ENV ?= development

build:
	npm run lint
	npm test
	npm run save:inventory
	npm run save:digital
	npm run build

save:
	node --import tsx --env-file-if-exists=.env.local ./bin/$(FILE).mts $(ARGS)

save_optimized:
	FILE=pictures/optimize make save

save_placeholders:
	FILE=image/placeholders make save

save_metadata:
	FILE=pictures/metadata make save

save_content:
	FILE=search/content make save

save_inventory: ## sync Stripe prints · ARGS="--dry-run --min-rating=N --limit=N --only=<pictureId> --prune"
	FILE=store/inventory make save

save_digital: ## sync Stripe downloads · ARGS="--dry-run --min-rating=N --limit=N --only=<pictureId> --prune"
	FILE=store/digital make save

upload_downloads: ## upload the files on sale to R2 · ARGS="--dry-run --force --min-rating=N --limit=N --only=<pictureId>"
	FILE=store/upload-downloads make save

audit_content:
	FILE=gallery/audit-content make save

add_display_names:
	FILE=components/display-names make save

help: ## show help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
