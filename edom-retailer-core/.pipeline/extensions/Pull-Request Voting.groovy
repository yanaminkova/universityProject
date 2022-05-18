void call(Map params) {
    echo "Start - Extension for stage: ${params.stageName}"

    //execute original stage as defined in the template
    params.originalStage()

    // run newman tests as part of PR build of releases to main
    if(env.CHANGE_BRANCH.startsWith('release') && env.CHANGE_TARGET == 'main') {
        // trigger extended-dev-pipeline
        build job: 'foundation-retailer-extended-dev-pipeline/main', propagate: true, wait: true
    }
        
    echo "End - Extension for stage: ${params.stageName}"
}

return this