void call(Map params) {
    echo "Start - Extension for stage: ${params.stageName}"

    params.originalStage()

    if(env.BRANCH_NAME == 'develop') {

        echo "Start data load step"

        def secrets = [
            [
                path: 'piper/PIPELINE-GROUP-881/PIPELINE-2471/foundationCredentials', 
                engineVersion: 2, 
                secretValues: [
                    [envVar: 'CLIENT_ID',         vaultKey: params.config.vaultC4UFClientId],
                    [envVar: 'CLIENT_SECRET',     vaultKey: params.config.vaultC4UFSecretId]
                ]
            ],
            [
                path: 'piper/PIPELINE-GROUP-881/PIPELINE-2471/featureFlagsCredentials', 
                engineVersion: 2, 
                secretValues: [
                    [envVar: 'FF_USERNAME',   vaultKey: params.config.vaultFFUsername],
                    [envVar: 'FF_PASSWORD',   vaultKey: params.config.vaultFFPassword]
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

        withVault([configuration: configuration, vaultSecrets: secrets])
        {
            newmanExecute(
                script: params.script,
                failOnError: true,
                newmanCollection: '**/edom_retailer_data_loss_prevention.postman_collection.json',
                newmanGlobals: params.config.newmanGlobals,
                newmanEnvironment: "test/postman/c4uconsumerdevawsDLP.postman_environment.json",
                runOptions: [
                        'run', '{{.NewmanCollection}}',
                        "--folder", "PRE-DEPLOYMENT",
                        "--env-var", "uaa_client_id=${env.CLIENT_ID}",
                        "--env-var", "uaa_client_secret=${env.CLIENT_SECRET}",
                        "--env-var", "feature_flag_username=${env.FF_USERNAME}",
                        "--env-var", "feature_flag_password=${env.FF_PASSWORD}",
                        "--export-environment", "test/postman/temp_env.postman_environment.json",
                ]
            )

            stash includes: 'test/postman/temp_env.postman_environment.json', name: 'newmanEnvironmentDLP'

            echo "Finalize data load step"

        }
    }

    echo "End - Extension for stage: ${params.stageName}"
}
return this
