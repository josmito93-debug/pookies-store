#!/bin/bash
# 1. Run the build
npm run build:dev # Use build:dev to see if it generates more helpful output, or just build

# 2. Find assets
JS_FILE=$(ls dist/client/assets/index-*.js | sort -r | head -n 1)
CSS_FILE=$(ls dist/client/assets/styles-*.css | head -n 1)

JS_NAME=$(basename $JS_FILE)
CSS_NAME=$(basename $CSS_FILE)

# 3. Create index.html
cat <<EOF > dist/client/index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pookies · Galletas Artesanales en Caracas</title>
  <link rel="stylesheet" href="/assets/$CSS_NAME">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/$JS_NAME"></script>
</body>
</html>
EOF

# 4. Create 404.html as a fallback for SPA routing
cp dist/client/index.html dist/client/404.html

echo "Generated dist/client/index.html and 404.html pointing to $JS_NAME and $CSS_NAME"
