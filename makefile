SHELL = /bin/sh


.PHONY: help
help:
	@cat HELP

clean:
	rm threatslayer.zip

all:
	zip -r threatslayer.zip source/
