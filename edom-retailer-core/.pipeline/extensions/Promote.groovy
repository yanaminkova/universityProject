void call(Map params) {
    echo "Start - Extension for stage: ${params.stageName}"

    //execute original stage as defined in the template
    params.originalStage()

    // create pull request only if it is master branch
    if ( env.BRANCH_NAME == 'main') {
        createAutoPR(params)
    }
    echo "End - Extension for stage: ${params.stageName}"
}

// create PR for foundation-retailer-pipeline-release
private void createAutoPR(Map params)
{

    println "Create Auto PR..."
 
    if( !(params.config.releasePipeline.releaseRepository && 
        params.config.releasePipeline.releaseBaseBranch && 
        params.config.releasePipeline.releasePRBranch &&
        params.config.releasePipeline.githubCredentialsID)) {
            println "Skip creating pull request for release pipline. To enable please configure following parameters:"
            println "releaseRepository: repository for release pipeline."
            println "releaseBaseBranch: base branch name from which the PR branch is cloned, default to 'main'."
            println "releasePRBranch  : pull request branch name, default to 'pr-branch'."
            println "githubCredentialsID: credentials for github access"
            return
    }

    println "Release Version..."
    def releaseVersion = this.globalPipelineEnvironment.getArtifactVersion()
    releaseVersion = releaseVersion.substring(0, releaseVersion.lastIndexOf("-"))

    def gitRepoUrl = params.config.releasePipeline.releaseRepository
    def branchName = params.config.releasePipeline.releaseBaseBranch ?: "main"
    def releasePRBranch = params.config.releasePipeline.releasePRBranch ?: "pr-branch"
    def prBranch = "${releasePRBranch}-${releaseVersion}" ?: "pr-branch-${releaseVersion}"
    def credentialsId = params.config.releasePipeline.githubCredentialsID

    String gitOrgAndRepoName = gitRepoUrl.minus("https://github.wdf.sap.corp/").minus(".git")
    String gitRepoApiUrl = 'https://github.wdf.sap.corp/api/v3/repos/' + gitOrgAndRepoName
    String workingDir = pwd()
    String cloneDir = "${workingDir}/" + gitOrgAndRepoName.tokenize('/')[0].toString()// extend path with orgName
    String targetDir = "${workingDir}/${gitOrgAndRepoName}"
    String pullRequestTitle = '🤖 AUTO PR by C4U foundation Retailer'
    String pullRequestBody = "This pull request is created by [pipeline job](${env.BUILD_URL})."

    sh "mkdir -p \"${targetDir}\""

    println "Ongoing PR for '${gitOrgAndRepoName}' branch '${branchName}' in work dir '${targetDir}'"

    // 1. clone repo             
    withCredentials([usernamePassword(credentialsId: credentialsId, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
        def tempGitURL = gitRepoUrl.minus("https://")
        sh "git -C \"${cloneDir}\" clone -b ${branchName} https://'$GIT_USERNAME:$GIT_PASSWORD'@${tempGitURL}"
    }

    // 2. close all existing pull requests
    withCredentials([usernamePassword(credentialsId: credentialsId, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
        closeAllOpenedPRs(gitRepoApiUrl, credentialsId)
    }

    // 3. delete all remote branches that contains pattern
    println "Delete all remote branches that contains '${releasePRBranch}'"
    sh ("""
        if [ `git -C \"${targetDir}\" branch -r --list --format='%(refname:lstrip=3)' */${releasePRBranch}-*` ]
        then
            git -C \"${targetDir}\" branch -r --list --format='%(refname:lstrip=3)' */${releasePRBranch}-* | xargs git -C \"${targetDir}\" push origin --delete
        fi
        """)   

    // 4. checkout a new branch
    println "Create a new branch"
    sh "git -C \"${targetDir}\" checkout -b ${prBranch}"

    // 5. create and commit latest_build.json file
    println "Create a new commit to a newly created branch"
    def nexusDownloadUrl = globalPipelineEnvironment.nexusLastDownloadUrl
    def jsonbody = [ 
                'mtarNexusDownloadUrl' : "${nexusDownloadUrl}", 
                'mtarBuildJobUrl' : "${env.BUILD_URL}"    
               ]
    println "Write latest_build.json file"
    writeJSON file: "${targetDir}/latest_build.json", json: jsonbody, pretty: 4

    println "Unstash and write postman collections and environments"
    unstash "tests"
    def jsonNewmanCollection = readJSON file: "${params.config.newmanCollectionsForRelease}"
    def jsonNewmanEnvironmentStaging = readJSON file: "${params.config.newmanEnvironmentForStaging}"
    def jsonNewmanEnvironmentProd = readJSON file: "${params.config.newmanEnvironmentForProd}"
    writeJSON file: "${targetDir}/${params.config.newmanCollectionsForRelease}", json: jsonNewmanCollection
    writeJSON file: "${targetDir}/${params.config.newmanEnvironmentForStaging}", json: jsonNewmanEnvironmentStaging
    writeJSON file: "${targetDir}/${params.config.newmanEnvironmentForProd}", json: jsonNewmanEnvironmentProd

    sh "git -C \"${targetDir}\" add -A"
    sh "git -C \"${targetDir}\" commit -m 'New Version Release ${releaseVersion}'"   

    // 6. create a new PR
    withCredentials([usernamePassword(credentialsId: credentialsId, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
        
        // push update to branch
        println "Push commit to a branch"     
        sh ("git -C \"${targetDir}\" push -u https://${GIT_USERNAME}:${GIT_PASSWORD}@github.wdf.sap.corp/${gitOrgAndRepoName} ${prBranch}")

        // open a new pull request
        def postData = "{\"title\":\"${pullRequestTitle} ${releaseVersion}\",\"body\":\"${pullRequestBody}\",\"head\":\"${prBranch}\",\"base\":\"${branchName}\"}"
        createPR(gitRepoApiUrl, credentialsId, gitOrgAndRepoName, postData)

    }

}

private String getShellOutput(shellCMD) {
  try {
    return sh (script: "${shellCMD}", returnStdout: true).toString()
  } catch(err) {
    println "Error in shell: ${err} for cmd '${shellCMD}'"
    return null
  }
}

private String[] getOpenPRNumberByBranch(String gitRepoApiUrl, String prBranch, String credentialsId)
{
    withCredentials([usernamePassword(credentialsId: credentialsId, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
        def command = "curl --fail -k  -u '$GIT_USERNAME:$GIT_PASSWORD' -X GET  $gitRepoApiUrl/pulls?state=open%26head=$prBranch"
        def response = sh(returnStdout: true, script: command).trim()
        def json =  readJSON( text: response)
        return json['number'] // extract Pull request number from Github Pull-Request API
    }
}

private void createPR(String gitRepoApiUrl, String credentialsId, String gitOrgAndRepoName, String postData)
{
    withCredentials([usernamePassword(credentialsId: credentialsId, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
        println "\n\n###########\n Creating new Pull Request for ${gitOrgAndRepoName}\n###########\n\n"
        getShellOutput("curl --fail -k -u '$GIT_USERNAME:$GIT_PASSWORD' -H 'Content-Type: application/json' -X POST --data '${postData}' ${gitRepoApiUrl}/pulls")
        println "\n\n#########\n Finished new Pull Request\n######\n\n"
    }    
}

private void closeAllOpenedPRs(String gitRepoApiUrl, String credentialsId)
{
    withCredentials([usernamePassword(credentialsId: credentialsId, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
        def command = "curl --fail -k  -u '$GIT_USERNAME:$GIT_PASSWORD' -X GET  $gitRepoApiUrl/pulls?state=open"
        def response = sh(returnStdout: true, script: command).trim()
        def json =  readJSON( text: response)
        json?.each{ pr ->
            println "Closing pull request - ${pr.title} #${pr.number}"
            def postData = "{\"state\":\"closed\"}"
            getShellOutput("curl --fail -k -u '$GIT_USERNAME:$GIT_PASSWORD' -H 'Content-Type: application/json' -X PATCH --data '${postData}' ${pr.url}")
        }
    }  
}

return this