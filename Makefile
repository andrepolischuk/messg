
default: bundle

clean:
	@rm -rf build components node_modules

bundle: index.js index.css
	@duo index.js index.css

.PHONY: clean bundle
