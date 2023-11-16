SHELL = /bin/sh


.PHONY: help
help:
	@cat HELP

clean:
	rm -rf dist

all:
	npm run build
	cp -r src/extension/* dist

deploy:
	npm run build
	cp -r src/extension/* dist
	zip -r threatslayer.zip dist/
