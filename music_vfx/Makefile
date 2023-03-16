
TOOLS=../../eeditor/tools
LOG_LEVEL=debug
TARGET?=ALL

BUILD_:
	node ${TOOLS}/builder --target=${TARGET} --log=${LOG_LEVEL}

ALL:
	make BUILD_ TARGET=$@

ATLAS:
	make BUILD_ TARGET=$@

SOUNDS:
	make BUILD_ TARGET=$@

ICONS:
	make BUILD_ TARGET=$@

PREVIEWS:
	make BUILD_ TARGET=$@

DATA:
	make BUILD_ TARGET=$@

JSMINIFY:
	make BUILD_ TARGET=$@

PRODUCTION:
	make BUILD_ TARGET=$@

PROJECTFILE:
	make BUILD_ TARGET=$@

LUA:
	make BUILD_ TARGET=$@
	
LUA_TEST:
	make BUILD_ TARGET=$@

XGEN:
	make BUILD_ TARGET=$@
