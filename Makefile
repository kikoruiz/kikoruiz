.PHONY: lib
OWNER=Kiko Ruiz <hola@kikoruiz.es>

SHELL := /bin/bash
.DEFAULT_GOAL := help

save:
	node --import 'data:text/javascript,import{register}from"node:module";import{pathToFileURL}from"node:url";register("ts-node/esm", pathToFileURL("./"));' ./bin/$(FILE).mts

save_placeholders:
	FILE=image/placeholders make save

save_metadata:
	FILE=pictures/metadata make save

save_content:
	FILE=search/content make save

help: ## show help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
