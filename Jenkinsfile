state.init(this)

state.set('dockerfile.postcommands', [
  'npm run install-client',
  'npm run lint',
  'npm run build-client',
  'npm run build-server',
  'ln -s /app/bin/aws-iam-authenticator /usr/local/bin/aws-iam-authenticator',
])

CheckoutAndDecrypt() {
  BoscoDependencies()

  GenerateDockerfile()
  BuildDockerfile()

}
