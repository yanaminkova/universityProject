void call(Map params) {
  echo "Start - Extension for stage: ${params.stageName}"
  echo "Current stage config: ${params.config}"

  // execute original stage as defined in the pipeline template
  params.originalStage()

  // - calls the 'dwcStageRelease' script, see https://github.wdf.sap.corp/deploy-with-confidence/piper-lib-dwc/blob/master/vars/dwcStageRelease.groovy
  // - depending on the upload type, the script calls the 'uploadServiceToDwc', 'uploadUiToDwc' script etc.
  // - the 'STAGE_NAME' environment variable must be set, passing the stage name as parameter does not work
  // - the 'STAGE_NAME' must not be 'Release', this leads to some kind of recursive execution of this stage
  withEnv(["STAGE_NAME=Release dwc-trial"]) {
    dwcStageRelease script: this, dwcUploadType: 'service', watchDeployments: true
  }

  echo "End - Extension for stage: ${params.stageName}"
}
return this
