state.init(this)

state.set('dockerfile.postcommands', [
  'npm run install-client',
  'npm run lint',
  'npm run build-client',
  'npm run build-server',
  'mv /app/bin/aws-iam-authenticator /usr/local/bin/',
])

CheckoutAndDecrypt() {
  BoscoDependencies()

  GenerateDockerfile()
  BuildDockerfile()

}
