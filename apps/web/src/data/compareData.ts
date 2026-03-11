import type { CompareData } from '@/ts/Interfaces'

const getCompareData = (): CompareData => ({
    competitors: [
        {
            id: 'clawhost',
            nameKey: 'compare.competitorClawHost',
            highlighted: true
        },
        {
            id: 'lobsterfarm',
            nameKey: 'compare.competitorLobsterFarm',
            highlighted: false
        },
        {
            id: 'simpleclaw',
            nameKey: 'compare.competitorSimpleClaw',
            highlighted: false
        },
        {
            id: 'myclawai',
            nameKey: 'compare.competitorMyClawAi',
            highlighted: false
        },
        {
            id: 'quickclaw',
            nameKey: 'compare.competitorQuickClaw',
            highlighted: false
        }
    ],
    categories: [
        {
            id: 'infrastructure',
            nameKey: 'compare.categoryInfrastructure',
            features: [
                {
                    nameKey: 'compare.featureServerOwnership',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.dedicatedVps'
                        },
                        lobsterfarm: {
                            status: 'yes',
                            detailKey: 'compare.dedicatedVps'
                        },
                        simpleclaw: {
                            status: 'partial',
                            detailKey: 'compare.sharedContainers'
                        },
                        myclawai: {
                            status: 'partial',
                            detailKey: 'compare.isolatedContainers'
                        },
                        quickclaw: {
                            status: 'no',
                            detailKey: 'compare.cloudWorkspaces'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureProviderChoice',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.threeProviders'
                        },
                        lobsterfarm: {
                            status: 'no',
                            detailKey: 'compare.singleProvider'
                        },
                        simpleclaw: {
                            status: 'no',
                            detailKey: 'compare.singleProvider'
                        },
                        myclawai: {
                            status: 'no',
                            detailKey: 'compare.singleProvider'
                        },
                        quickclaw: {
                            status: 'no',
                            detailKey: 'compare.singleProvider'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureDedicatedResources',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.fullyDedicated'
                        },
                        lobsterfarm: {
                            status: 'yes',
                            detailKey: 'compare.fullyDedicated'
                        },
                        simpleclaw: {
                            status: 'no',
                            detailKey: 'compare.shared'
                        },
                        myclawai: { status: 'no', detailKey: 'compare.shared' },
                        quickclaw: { status: 'no', detailKey: 'compare.shared' }
                    }
                },
                {
                    nameKey: 'compare.featureRootAccess',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.fullRootSsh'
                        },
                        lobsterfarm: {
                            status: 'partial',
                            detailKey: 'compare.sshOnRequest'
                        },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureServerLocations',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.thirtyPlusLocations'
                        },
                        lobsterfarm: {
                            status: 'partial',
                            detailKey: 'compare.fourLocations'
                        },
                        simpleclaw: {
                            status: 'partial',
                            detailKey: 'compare.limitedLocations'
                        },
                        myclawai: {
                            status: 'partial',
                            detailKey: 'compare.limitedLocations'
                        },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureLocationSelection',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'yes' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureSubdomainAccess',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                }
            ]
        },
        {
            id: 'pricing',
            nameKey: 'compare.categoryPricing',
            features: [
                {
                    nameKey: 'compare.featureStartingPrice',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.fromTwentyFiveMonth'
                        },
                        lobsterfarm: {
                            status: 'yes',
                            detailKey: 'compare.nineteenMonth'
                        },
                        simpleclaw: {
                            status: 'partial',
                            detailKey: 'compare.aboutFortyFourMonth'
                        },
                        myclawai: {
                            status: 'partial',
                            detailKey: 'compare.fromNineteenMonth'
                        },
                        quickclaw: {
                            status: 'partial',
                            detailKey: 'compare.creditBased'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureTransparentPricing',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.clearSpecsPricing'
                        },
                        lobsterfarm: {
                            status: 'yes',
                            detailKey: 'compare.clearSpecsPricing'
                        },
                        simpleclaw: {
                            status: 'no',
                            detailKey: 'compare.unclearPricing'
                        },
                        myclawai: {
                            status: 'partial',
                            detailKey: 'compare.fixedTiers'
                        },
                        quickclaw: {
                            status: 'partial',
                            detailKey: 'compare.creditBased'
                        }
                    }
                },
                {
                    nameKey: 'compare.featurePowerfulServers',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                }
            ]
        },
        {
            id: 'deployment',
            nameKey: 'compare.categoryDeployment',
            features: [
                {
                    nameKey: 'compare.featureSetupTime',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.minutes'
                        },
                        lobsterfarm: {
                            status: 'yes',
                            detailKey: 'compare.thirtySeconds'
                        },
                        simpleclaw: {
                            status: 'yes',
                            detailKey: 'compare.underOneMinute'
                        },
                        myclawai: {
                            status: 'yes',
                            detailKey: 'compare.thirtySeconds'
                        },
                        quickclaw: {
                            status: 'yes',
                            detailKey: 'compare.instant'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureTechnicalSkill',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.noneRequired'
                        },
                        lobsterfarm: {
                            status: 'yes',
                            detailKey: 'compare.noneRequired'
                        },
                        simpleclaw: {
                            status: 'yes',
                            detailKey: 'compare.noneRequired'
                        },
                        myclawai: {
                            status: 'yes',
                            detailKey: 'compare.minimal'
                        },
                        quickclaw: {
                            status: 'yes',
                            detailKey: 'compare.noneRequired'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureOneClickDeploy',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'yes' },
                        simpleclaw: { status: 'yes' },
                        myclawai: { status: 'yes' },
                        quickclaw: { status: 'yes' }
                    }
                }
            ]
        },
        {
            id: 'management',
            nameKey: 'compare.categoryManagement',
            features: [
                {
                    nameKey: 'compare.featureMultipleInstances',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.unlimited'
                        },
                        lobsterfarm: {
                            status: 'no',
                            detailKey: 'compare.singleInstance'
                        },
                        simpleclaw: {
                            status: 'no',
                            detailKey: 'compare.singleInstance'
                        },
                        myclawai: {
                            status: 'no',
                            detailKey: 'compare.singleInstance'
                        },
                        quickclaw: {
                            status: 'no',
                            detailKey: 'compare.singleInstance'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureMultipleAgents',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.unlimited'
                        },
                        lobsterfarm: {
                            status: 'no',
                            detailKey: 'compare.singleInstance'
                        },
                        simpleclaw: {
                            status: 'no',
                            detailKey: 'compare.singleInstance'
                        },
                        myclawai: {
                            status: 'no',
                            detailKey: 'compare.singleInstance'
                        },
                        quickclaw: {
                            status: 'no',
                            detailKey: 'compare.singleInstance'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureSkillsMarketplace',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.fiveThousandSkills'
                        },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureChannelSupport',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.allChannels'
                        },
                        lobsterfarm: {
                            status: 'partial',
                            detailKey: 'compare.telegramGmailWhatsapp'
                        },
                        simpleclaw: {
                            status: 'partial',
                            detailKey: 'compare.telegramDiscord'
                        },
                        myclawai: {
                            status: 'partial',
                            detailKey: 'compare.discordGithubSlack'
                        },
                        quickclaw: {
                            status: 'no',
                            detailKey: 'compare.appOnly'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureAgentConfig',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.fullConfig'
                        },
                        lobsterfarm: {
                            status: 'partial',
                            detailKey: 'compare.limitedConfig'
                        },
                        simpleclaw: {
                            status: 'partial',
                            detailKey: 'compare.limitedConfig'
                        },
                        myclawai: {
                            status: 'partial',
                            detailKey: 'compare.limitedConfig'
                        },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureDirectChat',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.builtInChat'
                        },
                        lobsterfarm: {
                            status: 'partial',
                            detailKey: 'compare.viaTelegram'
                        },
                        simpleclaw: { status: 'no' },
                        myclawai: {
                            status: 'partial',
                            detailKey: 'compare.appOnly'
                        },
                        quickclaw: {
                            status: 'partial',
                            detailKey: 'compare.appOnly'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureOneClickVersion',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureWebTerminal',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.builtInTerminal'
                        },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                }
            ]
        },
        {
            id: 'security',
            nameKey: 'compare.categorySecurity',
            features: [
                {
                    nameKey: 'compare.featureDataOwnership',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'yes' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'partial' },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureDataExport',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.zipExport'
                        },
                        lobsterfarm: {
                            status: 'yes',
                            detailKey: 'compare.serverTransfer'
                        },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureBackups',
                    values: {
                        clawhost: { status: 'no' },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: {
                            status: 'yes',
                            detailKey: 'compare.dailyBackups'
                        },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureSecurityHardening',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: {
                            status: 'yes',
                            detailKey: 'compare.managed'
                        },
                        simpleclaw: { status: 'no' },
                        myclawai: {
                            status: 'yes',
                            detailKey: 'compare.managed'
                        },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureSslTls',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'yes' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'yes' },
                        quickclaw: { status: 'yes' }
                    }
                },
                {
                    nameKey: 'compare.featureOpenSource',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                }
            ]
        },
        {
            id: 'monitoring',
            nameKey: 'compare.categoryMonitoring',
            features: [
                {
                    nameKey: 'compare.featureAutoUpdates',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'yes' },
                        simpleclaw: {
                            status: 'no',
                            detailKey: 'compare.manual'
                        },
                        myclawai: { status: 'yes' },
                        quickclaw: {
                            status: 'yes',
                            detailKey: 'compare.appStore'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureDiagnostics',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.liveMonitoring'
                        },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureLogStreaming',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.liveLogs'
                        },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureRepairTools',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.oneClickRepair'
                        },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                }
            ]
        },
        {
            id: 'support',
            nameKey: 'compare.categorySupport',
            features: [
                {
                    nameKey: 'compare.featureSupportChannels',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.emailGithub'
                        },
                        lobsterfarm: {
                            status: 'yes',
                            detailKey: 'compare.humanSupport'
                        },
                        simpleclaw: {
                            status: 'partial',
                            detailKey: 'compare.communityOnly'
                        },
                        myclawai: {
                            status: 'yes',
                            detailKey: 'compare.prioritySupport'
                        },
                        quickclaw: {
                            status: 'partial',
                            detailKey: 'compare.appSupport'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureMultiLanguage',
                    values: {
                        clawhost: {
                            status: 'yes',
                            detailKey: 'compare.fourLanguages'
                        },
                        lobsterfarm: {
                            status: 'no',
                            detailKey: 'compare.englishOnly'
                        },
                        simpleclaw: {
                            status: 'no',
                            detailKey: 'compare.englishOnly'
                        },
                        myclawai: {
                            status: 'no',
                            detailKey: 'compare.englishOnly'
                        },
                        quickclaw: {
                            status: 'no',
                            detailKey: 'compare.englishOnly'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureThemes',
                    values: {
                        clawhost: { status: 'yes' },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                },
                {
                    nameKey: 'compare.featureMobileApp',
                    values: {
                        clawhost: {
                            status: 'partial',
                            detailKey: 'compare.comingSoon'
                        },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: {
                            status: 'yes',
                            detailKey: 'compare.iosMacOs'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureDesktopApp',
                    values: {
                        clawhost: {
                            status: 'partial',
                            detailKey: 'compare.comingSoon'
                        },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: {
                            status: 'partial',
                            detailKey: 'compare.macOsOnly'
                        }
                    }
                },
                {
                    nameKey: 'compare.featureSocials',
                    values: {
                        clawhost: {
                            status: 'partial',
                            detailKey: 'compare.comingSoon'
                        },
                        lobsterfarm: { status: 'no' },
                        simpleclaw: { status: 'no' },
                        myclawai: { status: 'no' },
                        quickclaw: { status: 'no' }
                    }
                }
            ]
        }
    ]
})

export default getCompareData