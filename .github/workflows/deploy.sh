set -eu -o pipefail

echo "==> Generating Cloudron config"
yq -n '.cloudrons.default = strenv(CLOUDRON_FQDN) | .cloudrons[strenv(CLOUDRON_FQDN)].apiEndpoint = strenv(CLOUDRON_FQDN) | .cloudrons[strenv(CLOUDRON_FQDN)].token = strenv(CLOUDRON_TOKEN)' --output-format=json > ~/.cloudron.json

echo "==> Creating a Cloudron app backup before pushing new code"
cloudron backup create --app ${CLOUDRON_APP_ID}

# Updating cloudron to the docker image.
cloudron update --app ${CLOUDRON_APP_ID} --image ${DOCKER_IMAGE}