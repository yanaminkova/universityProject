void call(Map params) {
    echo "Start - Extension for stage: ${params.stageName}"

    params.originalStage()

    def secrets = [
        [
            path: 'piper/PIPELINE-GROUP-881/PIPELINE-2471/foundationCredentials', 
            engineVersion: 2, 
            secretValues: [
                [envVar: 'CLIENT_ID',         vaultKey: params.config.vaultC4UFClientId],
                [envVar: 'CLIENT_SECRET',     vaultKey: params.config.vaultC4UFSecretId],
                [envVar: 'UI_CLIENT_ID',      vaultKey: params.config.vaultC4UFUIClientId],
                [envVar: 'UI_CLIENT_SECRET',  vaultKey: params.config.vaultC4UFUISecretId]
            ]
        ],
        [
            path: 'piper/PIPELINE-GROUP-881/PIPELINE-2471/featureFlagsCredentials', 
            engineVersion: 2, 
            secretValues: [
                [envVar: 'FF_USERNAME',   vaultKey: params.config.vaultFFUsername],
                [envVar: 'FF_PASSWORD',   vaultKey: params.config.vaultFFPassword]
            ]
        ],
        [
            path: 'piper/PIPELINE-GROUP-881/PIPELINE-2471/subscriptionBillingCredentials', 
            engineVersion: 2, 
            secretValues: [
                [envVar: 'SB_CLIENT_ID',       vaultKey: params.config.vaultSBClientId],
                [envVar: 'SB_CLIENT_SECRET',   vaultKey: params.config.vaultSBSecrettId]
            ]
        ],
        [
            path: 'piper/PIPELINE-GROUP-881/PIPELINE-2471/mcmCredentials', 
            engineVersion: 2, 
            secretValues: [
                [envVar: 'MCM_CLIENT_ID',       vaultKey: params.config.vaultMCMClientId],
                [envVar: 'MCM_CLIENT_SECRET',   vaultKey: params.config.vaultMCMSecretId]
            ]
        ],
        [
            path: 'piper/PIPELINE-GROUP-881/PIPELINE-2471/c4eCredentials', 
            engineVersion: 2, 
            secretValues: [
                [envVar: 'C4E_CLIENT_ID',       vaultKey: params.config.vaultC4EClientId],
                [envVar: 'C4E_CLIENT_SECRET',   vaultKey: params.config.vaultC4ESecretId]
            ]
        ],
                [
            path: 'piper/PIPELINE-GROUP-881/PIPELINE-2471/s4hcCredentials', 
            engineVersion: 2, 
            secretValues: [
                [envVar: 'S4HC_USERNAME',   vaultKey: params.config.vaultS4HCUsername],
                [envVar: 'S4HC_PASSWORD',   vaultKey: params.config.vaultS4HCPassword]
            ]
        ]
    ]

    def configuration = [
        $class: 'VaultConfiguration',
        vaultUrl: 'https://vault.tools.sap',
        vaultCredentialId: 'appRoleCredentials',
        vaultNamespace: 'ies/hyperspace/pipelines',
        engineVersion: 2
    ]

    withVault([configuration: configuration, vaultSecrets: secrets]) {

        if(env.BRANCH_NAME == 'develop') {

            echo "Start post-deployment test"

            newmanExecute(
                script: params.script,
                failOnError: true,
                newmanCollection: "**/edom_retailer_data_loss_prevention.postman_collection.json",
                newmanGlobals: params.config.newmanGlobals,
                newmanEnvironment: "test/postman/temp_env.postman_environment.json",
                stashContent: ['tests','newmanEnvironmentDLP'],
                runOptions: [
                        "run", "{{.NewmanCollection}}",
                        "--folder", "POST-DEPLOYMENT",
                        "--env-var", "uaa_client_id=${env.CLIENT_ID}",
                        "--env-var", "uaa_client_secret=${env.CLIENT_SECRET}",
                        "--env-var", "feature_flag_username=${env.FF_USERNAME}",
                        "--env-var", "feature_flag_password=${env.FF_PASSWORD}",
                        "--bail",
                ]
            )

            echo "End post-deployment test"

            // trigger extended-dev-pipeline
            build job: 'foundation-retailer-extended-dev-pipeline/main', propagate: false, wait: false

        }              

        echo "Start newman tests"

        newmanExecute(
            script: params.script,
            failOnError: true,
            newmanCollection: (env.BRANCH_NAME == 'develop' ? params.config.newmanCollection : params.config.newmanCollectionExtended),
            newmanGlobals: params.config.newmanGlobals,
            newmanEnvironment: params.config.newmanEnvironment,
            runOptions: [
                    "run", "{{.NewmanCollection}}",
                    "--environment", "{{.Config.NewmanEnvironment}}",
                    "--env-var", "uaa_client_id=${env.CLIENT_ID}",
                    "--env-var", "uaa_client_secret=${env.CLIENT_SECRET}",
                    "--env-var", "ui_client_id=${env.UI_CLIENT_ID}",
                    "--env-var", "ui_client_secret=${env.UI_CLIENT_SECRET}",
                    "--env-var", "feature_flag_username=${env.FF_USERNAME}",
                    "--env-var", "feature_flag_password=${env.FF_PASSWORD}",
                    "--env-var", "uaa_sb_client_id=${env.SB_CLIENT_ID}",
                    "--env-var", "uaa_sb_client_secret=${env.SB_CLIENT_SECRET}",
                    "--env-var", "clientid_MCM=${env.MCM_CLIENT_ID}",
                    "--env-var", "clientsecret_MCM=${env.MCM_CLIENT_SECRET}",
                    "--env-var", "clientid_C4E=${env.C4E_CLIENT_ID}",
                    "--env-var", "clientsecret_C4E=${env.C4E_CLIENT_SECRET}",
                    "--env-var", "s4hc_username=${env.S4HC_USERNAME}",
                    "--env-var", "s4hc_password=${env.S4HC_PASSWORD}",
                    "--reporters", "cli,junit",
                    "--reporter-junit-export", "target/newman/TEST-{{.CollectionDisplayName}}.xml",
            ]
        )

        echo "Publish results"

        testsPublishResults(
            script: params.script,
            junit: [
                pattern: "target/newman/TEST-*.xml",
                updateResults: true,
                allowEmptyResults: true,
                archive: true,
                active: true
            ]
        )

        if (env.BRANCH_NAME.startsWith('main')) {
            sapCumulusUpload script: this, version: params.script.commonPipelineEnvironment.artifactVersion, filePattern: "**/target/newman/TEST-*.xml",  stepResultType: "acceptance-test"
        }

    }

    echo "End - Extension for stage: ${params.stageName}"
}
return this
