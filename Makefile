SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build
LIB_DIR = lib

PREFIX = .
OUT_DIR = ..

BASE_FILES = ${SRC_DIR}/core.js\
	${SRC_DIR}/entity.js\
	${SRC_DIR}/component.js\
	${SRC_DIR}/components.js\
	${SRC_DIR}/gfx.js\
	${SRC_DIR}/canvas.js\
	${SRC_DIR}/helpers.js

MODULES = license.txt\
	${SRC_DIR}/prologue.js\
	${SRC_DIR}/class.js\
	${BASE_FILES}\
	${SRC_DIR}/polyfills.js\
	${SRC_DIR}/selector.js\
	${SRC_DIR}/exports.js\
	${SRC_DIR}/epilogue.js

VERSION = $(shell cat version.txt)
DATE = $(shesll git log -1 --pretty=format:%ai)
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

${SRC_DIR}/selector.js: ${LIB_DIR}/sizzle/sizzle.js
	@@echo "Building selector code from Sizzle"
	@@sed '/EXPOSE/r src/sizzle-maracuja.js' ${LIB_DIR}/sizzle/sizzle.js | grep -v window.Sizzle > ${SRC_DIR}/selector.js

clean:
	@@echo "Removing out file: " ${MC}
	@@rm ${MC}
