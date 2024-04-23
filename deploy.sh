if (( $# != 1 )); then
    >&2 echo "usage: deploy <deploy-branch>"
    exit
fi

deployBranch=$1

set -e pipefail

echo "Increment build number..."

json=`cat package.json`

re="\"(version)\": \"([^\"]*)\""
if [[ $json =~ $re ]]; then
    version="${BASH_REMATCH[2]}"
fi

re="([0-9]+)\.([0-9]+)\.([0-9]+)"
if [[ $version =~ $re ]]; then
    major="${BASH_REMATCH[1]}"
    minor="${BASH_REMATCH[2]}"
    build="${BASH_REMATCH[3]}"
fi

build=$(($build + 1))
newVersion="$major.$minor.$build"

json=${json/\"version\": \"$version\"/\"version\": \"$newVersion\"}

echo "$json" > package.json

echo ""
echo "Build version $newVersion..."

npm run build
git add package.json
git commit -m "Deploy v$newVersion"

echo ""
echo "Deploy on branch '$deployBranch'..."
echo ""

git checkout $deployBranch
git pull origin $deployBranch

rm -r _app/
cp -r build/* .

git add .
git commit -m "Deploy v$newVersion"
git push origin $deployBranch

git checkout main

echo "Deploy successful"
