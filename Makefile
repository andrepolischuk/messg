
default: test

test: build
	@open test/index.html

clean:
	@rm -rf build.js messg.js messg.min.js components node_modules

build: $(wildcard test/*.js)
	@duo --development --stdout test/test.js > build.js

bundle: index.js
	@duo --standalone messg --stdout index.js > messg.js
	@uglifyjs messg.js --mangle --compress --output messg.min.js

.PHONY: clean test
