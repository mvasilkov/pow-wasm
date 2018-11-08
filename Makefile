EMCC_OPTIONS := -s EXPORTED_FUNCTIONS="['_get_buf', '_solve']" \
	-s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
	-s INVOKE_RUN=0 \
	-s MODULARIZE=1

pow/solve.js: BLAKE2/blake2b-ref.c pow/solve.c
	emcc -O2 $(EMCC_OPTIONS) -o $@ $^
