
rm -rf connection models configs && \
nodemon --ignore models/ \
--ignore connection/ \
--ignore configs/ \
index.js \
--type api \
--name user \
--schema ./samples/user.json
