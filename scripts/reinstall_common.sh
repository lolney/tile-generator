echo "Rebuilding and reinstalling @tile-generator/common, @tile-generator/app-engine in react-app and server"

npx lerna run build --scope=@tile-generator/common --scope=@tile-generator/app-engine

paths=(packages/react-app packages/server)

for i in "${paths[@]}"
do
    sed -E -i.bak 's/\"@tile-generator\/(common|app-engine)\":.*$//' $i/package.json
    rm $i/package.json.bak
    rm -rf $i/node_modules/@tile-generator
done

npx lerna add @tile-generator/common --scope=@tile-generator/server --scope=@tile-generator/react-app
npx lerna add @tile-generator/app-engine --scope=@tile-generator/server