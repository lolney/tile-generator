echo "Rebuilding and reinstalling @tile-generator/common in react-app and server"

npx lerna run build --scope=@tile-generator/common

paths=(packages/react-app packages/server)

for i in "${paths[@]}"
do
    sed -E -i.bak 's/\"@tile-generator\/common\":.*$//' $i/package.json
    rm $i/package.json.bak
    rm -rf $i/node_modules/@tile-generator
done

npx lerna add @tile-generator/common --scope=@tile-generator/server --scope=@tile-generator/react-app