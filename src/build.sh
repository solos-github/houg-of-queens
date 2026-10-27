#!/bin/sh
# Baut index.html aus src/head.html + src/js/*.js + models/*.glb (als Base64 eingebettet)
cd "$(dirname "$0")"
{ cat head.html; echo '<script>'; echo "(function(){'use strict';"
  for n in houg connie archie dean spike benny; do
    U=$(echo $n | tr a-z A-Z)
    printf 'const %s_B64="' "$U"; base64 -w0 ../models/$n.glb; echo '";'
  done
  for f in 01-core 02a-shell 02b-ground 02c-upper 02d-outside 02e-garage 03a-items 03-state 04-events 05-tv 07-dish 08-shop 09-models 10-day 11-doors 12-voice 13-needs 14-social 15-nachbarschaft 16-gamepad 17-arbeit 18-boopers 19-save 20-date 21-dinner 22-connie 23-turm 24-archie 25-car 26-inv 06-main; do cat js/$f.js; echo; done
  echo "})();"; echo '</script>'; } > ../index.html
