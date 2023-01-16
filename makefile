SHELL = /bin/sh


clean:
	rm threatslayer.zip

all:
	zip -r threatslayer.zip source/
