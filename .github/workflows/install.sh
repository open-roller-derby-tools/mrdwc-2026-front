set -eu -o pipefail

echo "==> Generating Cloudron config"
yq -n '.cloudrons.default = strenv(CLOUDRON_FQDN) | .cloudrons[strenv(CLOUDRON_FQDN)].apiEndpoint = strenv(CLOUDRON_FQDN) | .cloudrons[strenv(CLOUDRON_FQDN)].token = strenv(CLOUDRON_TOKEN)' --output-format=json > ~/.cloudron.json

echo "==> Installing Cloudron app"
cloudron install --image ${DOCKER_IMAGE}
