SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
OUT_DIR = ${PREFIX}/out

BASE_FILES = ${SRC_DIR}/core.js

MODULES = license.txt\
	${SRC_DIR}/prologue.js\
	${BASE_FILES}\
	${SRC_DIR}/epilogue.js

VERSION = $(shell cat version.txt)
DATE = $(shell git log -1 --pretty=format:%ai)
YEAR = $(shell date +%Y)
MC = ${OUT_DIR}/maracuja.js

all: core

core: maracuja

${OUT_DIR}:
	@@mkdir -p ${OUT_DIR}

maracuja: ${MC}

${MC}: ${MODULES} | ${OUT_DIR}
	@@echo "Building " ${MC}
	@@cat ${MODULES} | \
		sed 's/@DATE/'"${DATE}"'/' | \
		sed 's/@YEAR/'"${YEAR}"'/' | \
		sed 's/@VERSION/'"${VERSION}"'/' \
		> ${MC};

clean:
	@@echo "Removing out directory: " ${OUT_DIR}
	@@rm -rf ${OUT_DIR}
