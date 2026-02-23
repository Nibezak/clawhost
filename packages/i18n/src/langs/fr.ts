import type { Translations } from '../types'

const fr: Translations = {
    common: {
        loading: 'Chargement...',
        save: 'Enregistrer',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        delete: 'Supprimer',
        deleting: 'Suppression...',
        back: 'Retour',
        create: 'Créer',
        done: 'Terminé',
        copy: 'Copier',
        copied: 'Copié.',
        copiedWithLabel: '{{label}} copié.',
        show: 'Afficher',
        hide: 'Masquer',
        tryAgain: 'Réessayer',
        addKey: 'Ajouter une clé',
        close: 'Fermer',
        none: 'Aucun',
        all: 'Tout',
        unknown: 'Inconnu',
        pageNotFound: 'Page introuvable',
        closeNotification: 'Fermer la notification',
        beta: 'Bêta',
        brandName: 'ClawHost',
        legalEmail: 'legal@clawhost.cloud'
    },
    setup: {
        welcomeTitle: 'Bienvenue sur ClawHost Go',
        welcomeDescription: 'Configurez votre profil pour commencer.',
        whatsYourName: 'Comment vous appelez-vous ?',
        namePlaceholder: 'Entrez votre nom',
        nameHint: 'Vous pouvez toujours le définir plus tard.',
        getStarted: 'Commencer'
    },
    language: {
        en: 'English',
        fr: 'Français',
        es: 'Español',
        de: 'Deutsch',
        switchLanguage: 'Langue'
    },
    theme: {
        light: 'Clair',
        dark: 'Sombre',
        system: 'Système',
        toggleTheme: 'Changer le thème'
    },
    nav: {
        claws: 'Claws',
        playground: 'Playground',
        sshKeys: 'Clés SSH',
        account: 'Compte',
        billing: 'Facturation',
        signOut: 'Se déconnecter',
        admin: 'Admin',
        login: 'Connexion',
        deploy: 'Déployer',
        deployOpenClaw: 'Déployer OpenClaw',
        mainNavigation: 'Navigation principale',
        toggleMenu: 'Ouvrir le menu'
    },
    footer: {
        website: 'Site web',
        copyright: 'ClawHost. Tous droits réservés.',
        termsOfService: "Conditions d'utilisation",
        privacyPolicy: 'Politique de confidentialité',
        getInTouch: 'Nous contacter',
        brandDescription:
            'Déployez OpenClaw sur votre propre VPS en un clic. Confidentialité totale, ressources dédiées, aucune infrastructure partagée.',
        builtBy: 'Créé par',
        supportedBy: 'Soutenu par',
        product: 'Produit',
        howItWorks: 'Processus',
        features: 'Fonctions',
        pricing: 'Tarifs',
        faq: 'Questions',
        blog: 'Blog',
        changelog: 'Journal des modifications',
        featureRequests: 'Demandes de fonctionnalités',
        compare: 'Comparaison complète',
        legalAndMore: 'Autres',
        documentation: 'Documentation',
        productDescription:
            "Infrastructure prête pour la production avec déploiement OpenClaw en un clic, géré de bout en bout — construisez, livrez et avancez plus vite avec l'IA."
    },
    errors: {
        somethingWentWrong: 'Une erreur est survenue !',
        couldNotLoadData:
            'Impossible de charger les données. Veuillez réessayer !',
        notFound: 'Page introuvable !',
        pageNotFoundDescription:
            "La page que vous recherchez n'existe pas ou a été déplacée.",
        goToHomepage: "Aller à l'accueil",
        failedToLoadClaws: 'Échec du chargement des claws !',
        failedToLoadClawsDescription:
            'Impossible de charger vos Claws. Veuillez vérifier votre connexion et réessayer !',
        failedToLoadSSHKeys: 'Échec du chargement des clés SSH !',
        failedToLoadSSHKeysDescription:
            'Impossible de charger vos clés SSH. Veuillez vérifier votre connexion et réessayer !',
        failedToUpdateProfile: 'Échec de la mise à jour du profil !',
        failedToAddSSHKey: "Échec de l'ajout de la clé SSH !",
        failedToCreateClaw: 'Échec de la création du claw !',
        failedToLoadLocations:
            'Échec du chargement des emplacements. Veuillez réessayer.',
        failedToLoadPlans:
            'Échec du chargement des offres. Veuillez réessayer.',
        invalidPlan: 'Offre sélectionnée invalide !',
        invalidLocation: 'Veuillez sélectionner un emplacement !',
        failedToGenerateKeyPair:
            'Échec de la génération de la paire de clés. Veuillez générer les clés localement !',
        unableToLoadPricing:
            'Impossible de charger les tarifs. Veuillez réessayer plus tard !',
        noPasswordAvailable: 'Aucun mot de passe disponible pour ce claw !',
        clawLimitReached:
            'Vous avez atteint la limite de 50 claws. Veuillez contacter le support pour augmenter cette limite !',
        sshKeyLimitReached:
            'Vous avez atteint la limite de 50 clés SSH. Veuillez contacter le support pour augmenter cette limite !'
    },
    api: {
        missingRequiredFields: 'Champs obligatoires manquants !',
        clawNotFound: 'Claw introuvable !',
        clawRenamed: 'Claw renommé avec succès !',
        invalidClawName:
            'Le nom du claw doit contenir entre 1 et 50 caractères !',
        userNotFound: 'Utilisateur introuvable !',
        sshKeyNotFound: 'Clé SSH introuvable !',
        pendingClawNotFound: 'Claw en attente introuvable !',
        clawNotScheduledForDeletion:
            "Ce claw n'est pas programmé pour la suppression !",
        clawLimitReached:
            'Vous avez atteint la limite de 50 claws. Veuillez contacter le support pour augmenter cette limite !',
        sshKeyLimitReached:
            'Vous avez atteint la limite de 50 clés SSH. Veuillez contacter le support pour augmenter cette limite !',
        volumeSizeInvalid:
            'La taille du volume doit être comprise entre 10 et 10240 Go !',
        paymentNotConfigured:
            "Le paiement n'est pas configuré pour cette offre !",
        invalidSshKeyFormat: 'Format de clé publique SSH invalide !',
        sshKeyInUse:
            'Cette clé SSH est actuellement utilisée par un ou plusieurs claws !',
        inputTooLong: 'La saisie dépasse la longueur maximale autorisée !',
        invalidEnvVars:
            "Noms ou valeurs de variables d'environnement invalides !",
        invalidEmailFormat: "Format d'email invalide !",
        plusAddressingNotAllowed:
            "L'adressage avec le signe + n'est pas autorisé pour la connexion par email !",
        invalidRedirectUrl: 'URL de redirection invalide !',
        fileTooLarge:
            'Le contenu du fichier dépasse la taille maximale autorisée !',
        nameAndKeyRequired: 'Le nom et la clé publique sont requis !',
        nameTooLong: 'Le nom doit contenir 100 caractères ou moins !',
        noBillingAccount: 'Aucun compte de facturation trouvé !',
        orderIdRequired: "L'identifiant de commande est requis !",
        orderNotFound: 'Commande introuvable !',
        emailRequired: "L'email est requis !",
        redirectUrlRequired: "L'URL de redirection est requise !",
        invalidWebhook: 'Webhook invalide !',
        failedToStartClaw: 'Échec du démarrage du claw !',
        failedToStopClaw: "Échec de l'arrêt du claw !",
        failedToRestartClaw: 'Échec du redémarrage du claw !',
        failedToDeleteClaw: 'Échec de la suppression du claw !',
        failedToCreateClaw: 'Échec de la création du claw !',
        invalidProvider: 'Fournisseur invalide !',
        invalidPlan: 'Offre sélectionnée invalide !',
        planBelowMinimumMemory:
            'Cette offre ne satisfait pas la mémoire minimale requise !',
        invalidLocation: 'Emplacement sélectionné invalide !',
        failedToSyncClaw: 'Échec de la synchronisation du statut du serveur !',
        failedToProvisionClaw: 'Échec du provisionnement du claw !',
        failedToInitiatePurchase: "Échec de l'initiation de l'achat !",
        failedToCancelDeletion: "Échec de l'annulation de la suppression !",
        failedToHardDeleteClaw: 'Échec de la suppression définitive du claw !',
        failedToCancelScheduledDeletion:
            "Échec de l'annulation de la suppression programmée !",
        failedToCreateSshKey: 'Échec de la création de la clé SSH !',
        failedToDeleteSshKey: 'Échec de la suppression de la clé SSH !',
        failedToUpdateProfile: 'Échec de la mise à jour du profil !',
        failedToGetProfile: 'Échec de la récupération du profil !',
        failedToGetInvoice: 'Échec de la récupération de la facture !',
        failedToGetCustomerPortal:
            'Échec de la récupération du portail client !',
        failedToGetBillingHistory:
            "Échec de la récupération de l'historique de facturation !",
        failedToGetStats: 'Échec de la récupération des statistiques !',
        failedToFetchLocations: 'Échec de la récupération des emplacements !',
        failedToFetchPlans: 'Échec de la récupération des offres !',
        failedToFetchVolumePricing:
            'Échec de la récupération des tarifs de volume !',
        failedToFetchPlanAvailability:
            'Échec de la récupération de la disponibilité des offres !',
        failedToSendEmail: "Échec de l'envoi de l'email !",
        failedToGetVersion: 'Échec de la récupération de la version.',
        failedToGetVersions: 'Impossible de récupérer les versions.',
        failedToInstallVersion: "Impossible d'installer la version.",
        installVersionSuccess: 'Version installée avec succès.',
        invalidVersion: 'Format de version invalide.',
        outdatedVersion:
            'Cette version est obsolète et ne peut pas être installée.',
        failedToGetDiagnostics: "Échec de la connexion à l'instance !",
        failedToGetDiagnosticsDescription:
            "Impossible de récupérer les diagnostics. L'instance est peut-être hors ligne ou en cours de démarrage.",
        failedToGetLogs: 'Échec du chargement des journaux.',
        failedToGetLogsDescription:
            'Impossible de récupérer les journaux pour cette instance. Veuillez réessayer plus tard.',
        failedToRepairClaw: "Échec de la réparation de l'instance !",
        repairSuccess: 'Instance réparée avec succès.',
        repairGatewayNotResponding:
            'Réparation appliquée mais la passerelle ne répond pas encore. Elle peut avoir besoin de plus de temps pour démarrer.',
        failedToReinstallClaw: "Échec de la réinstallation de l'instance !",
        reinstallSuccess: 'Instance réinstallée avec succès.',
        reinstallGatewayNotResponding:
            'Réinstallation terminée mais la passerelle ne répond pas encore. Elle peut avoir besoin de plus de temps pour démarrer.',
        failedToExportClaw: "Échec de l'exportation des données du claw !",
        clawNotReady: "Le claw n'est pas prêt pour l'exportation !",
        exportRateLimited:
            'Ce claw a été exporté récemment. Veuillez patienter avant de réexporter.',
        failedToListFiles: "Échec de la liste des fichiers de l'instance !",
        failedToReadFile: 'Échec de la lecture du fichier !',
        failedToUpdateFile: "Échec de l'enregistrement du fichier !",
        invalidFilePath: 'Chemin de fichier invalide !',
        fileNotEditable: 'Ce type de fichier ne peut pas être modifié !',
        invalidJsonConfig: 'JSON invalide !',
        fileSaveSuccess: 'Fichier enregistré.',
        rateLimitExceeded:
            'Veuillez patienter avant de demander un nouveau code.',
        otpExpiredOrNotFound:
            'Code expiré ou introuvable. Veuillez en demander un nouveau.',
        otpMaxAttemptsReached:
            'Trop de tentatives échouées. Veuillez demander un nouveau code.',
        otpInvalidCode: 'Code invalide. Veuillez réessayer.',
        internalServerError: 'Une erreur interne est survenue.',
        invalidCredentials: 'Identifiants invalides !',
        accountLinked: 'Compte lié avec succès.',
        webhookProcessingFailed: 'Échec du traitement du webhook !',
        adminAccessDenied: 'Accès administrateur requis !',
        clawsFetched: 'Claws récupérés avec succès.',
        clawFetched: 'Claw récupéré avec succès.',
        clawSynced: 'Claw synchronisé avec succès.',
        clawStarted: 'Claw démarré avec succès.',
        clawStopped: 'Claw arrêté avec succès.',
        clawRestarted: 'Claw redémarré avec succès.',
        clawCreated: 'Claw créé avec succès.',
        clawDeleted: 'Claw supprimé avec succès.',
        clawDeletionScheduled: 'Suppression du claw programmée.',
        clawDeletionCancelled: 'Suppression du claw annulée.',
        clawHardDeleted: 'Claw supprimé définitivement.',
        clawPurchaseInitiated: 'Achat initié avec succès.',
        sshKeysFetched: 'Clés SSH récupérées avec succès.',
        sshKeyCreated: 'Clé SSH créée avec succès.',
        sshKeyDeleted: 'Clé SSH supprimée avec succès.',
        profileFetched: 'Profil récupéré avec succès.',
        profileUpdated: 'Profil mis à jour avec succès.',
        statsFetched: 'Statistiques récupérées avec succès.',
        billingHistoryFetched:
            'Historique de facturation récupéré avec succès.',
        invoiceFetched: 'Facture récupérée avec succès.',
        customerPortalFetched: 'URL du portail client récupérée avec succès.',
        plansFetched: 'Offres récupérées avec succès.',
        locationsFetched: 'Emplacements récupérés avec succès.',
        volumePricingFetched: 'Tarifs de volume récupérés avec succès.',
        planAvailabilityFetched:
            'Disponibilité des offres récupérée avec succès.',
        agentsFetched: 'Agents récupérés avec succès.',
        agentsFetchFailed:
            "Impossible de joindre l'instance pour récupérer les agents.",
        agentConfigFetched: "Configuration de l'agent récupérée avec succès.",
        agentConfigUpdated: "Configuration de l'agent mise à jour avec succès.",
        agentConfigUpdateFailed:
            "Impossible de mettre à jour la configuration de l'agent.",
        agentCreated: 'Agent créé avec succès.',
        agentCreateFailed: "Impossible de créer l'agent sur l'instance.",
        agentDeleted: 'Agent supprimé avec succès.',
        agentDeleteFailed: "Impossible de supprimer l'agent de l'instance.",
        cannotDeleteMainAgent:
            'Impossible de supprimer le dernier agent restant.',
        agentNameInvalid:
            "Le nom de l'agent ne doit contenir que des lettres, des chiffres et des tirets.",
        agentNameDuplicate: 'Un agent avec ce nom existe déjà.',
        diagnosticsFetched: 'Diagnostics récupérés avec succès.',
        logsFetched: 'Journaux récupérés avec succès.',
        filesFetched: 'Fichiers récupérés avec succès.',
        fileFetched: 'Fichier récupéré avec succès.',
        otpSent: 'Code envoyé avec succès.',
        otpVerified: 'Code vérifié avec succès.',
        webhookReceived: 'Webhook reçu.',
        unauthorized: 'Non autorisé.',
        invalidToken: 'Jeton invalide.',
        notFound: 'Introuvable.',
        healthOk: "L'API fonctionne.",
        channelsFetched: 'Canaux récupérés avec succès.',
        channelsUpdated: 'Canaux mis à jour avec succès.',
        channelsUpdateFailed: 'Impossible de mettre à jour les canaux.',
        channelsFetchFailed: 'Impossible de récupérer les canaux.',
        channelMissingRequired:
            'Champs obligatoires manquants pour le canal activé.',
        whatsappPairStarted: 'Couplage WhatsApp démarré.',
        whatsappPairFailed: 'Échec du couplage WhatsApp.',
        whatsappAlreadyPaired: 'WhatsApp est déjà couplé.',
        whatsappUnsupported:
            'Cette instance ne prend pas encore en charge le couplage WhatsApp.',
        bindingsFetched: 'Liaisons récupérées avec succès.',
        bindingsFetchFailed: 'Impossible de récupérer les liaisons.',
        bindingsUpdated: 'Liaisons mises à jour avec succès.',
        bindingsUpdateFailed: 'Impossible de mettre à jour les liaisons.',
        bindingsInvalidFormat: 'Format de liaison invalide.',
        bindingsInvalidChannel: 'Canal non pris en charge dans la liaison.',
        bindingsDuplicateChannel:
            "Un canal ne peut être lié qu'à un seul agent.",
        skillsFetched: 'Compétences récupérées avec succès.',
        skillsUpdated: 'Compétences mises à jour avec succès.',
        skillsUpdateFailed: 'Impossible de mettre à jour les compétences.',
        skillsFetchFailed: 'Impossible de récupérer les compétences.',
        agentSkillsFetched: "Compétences de l'agent récupérées avec succès.",
        agentSkillsUpdated: "Compétences de l'agent mises à jour avec succès.",
        agentSkillsUpdateFailed:
            "Impossible de mettre à jour les compétences de l'agent.",
        agentSkillsFetchFailed:
            "Impossible de récupérer les compétences de l'agent.",
        invalidSkillName:
            'Le nom de la compétence ne doit contenir que des lettres, des chiffres, des tirets et des underscores.',
        skillNotFound: 'Compétence introuvable.',
        clawHubSearchSuccess: 'Recherche ClawHub terminée.',
        clawHubSearchFailed: 'Impossible de rechercher sur ClawHub.',
        clawHubFetched: 'Compétences ClawHub récupérées.',
        clawHubFetchFailed: 'Impossible de récupérer les compétences ClawHub.',
        clawHubInstalled: 'Compétence installée depuis ClawHub.',
        clawHubInstallFailed:
            "Impossible d'installer la compétence depuis ClawHub !",
        clawHubRemoved: 'Compétence ClawHub supprimée.',
        clawHubRemoveFailed: 'Impossible de supprimer la compétence ClawHub !',
        clawHubUpdated: 'Compétence mise à jour.',
        clawHubUpdateFailed:
            'Impossible de mettre à jour la compétence ClawHub !',
        clawHubUpdatesFetched: 'Vérification des mises à jour terminée.',
        clawHubUpdatesFailed: 'Impossible de vérifier les mises à jour.',
        invalidAuthMethod: "Méthode d'authentification invalide !",
        authMethodNotConnected:
            "Cette méthode d'authentification n'est pas connectée !",
        authMethodConnected:
            "Méthode d'authentification connectée avec succès.",
        authMethodDisconnected:
            "Méthode d'authentification déconnectée avec succès.",
        failedToConnectAuthMethod:
            "Échec de la connexion de la méthode d'authentification !",
        failedToDisconnectAuthMethod:
            "Échec de la déconnexion de la méthode d'authentification !",
        featureRequestsFetched:
            'Demandes de fonctionnalités récupérées avec succès.',
        featureRequestCreated: 'Demande de fonctionnalité créée avec succès.',
        featureRequestUpvoted: 'Vote mis à jour.',
        featureRequestStatusUpdated: 'Statut de la demande mis à jour.',
        featureRequestDeleted: 'Demande de fonctionnalité supprimée.',
        failedToCreateFeatureRequest: 'Échec de la création de la demande !',
        failedToUpvoteFeatureRequest: 'Échec de la mise à jour du vote !',
        failedToUpdateFeatureRequestStatus:
            'Échec de la mise à jour du statut !',
        failedToDeleteFeatureRequest: 'Échec de la suppression de la demande !',
        featureRequestNotFound: 'Demande de fonctionnalité introuvable !',
        featureRequestLimitReached:
            'Vous avez atteint le maximum de {{limit}} demandes ouvertes !',
        featureRequestTotalLimitReached:
            'Le tableau de demandes est plein ({{limit}} demandes). Veuillez attendre que les demandes existantes soient résolues !',
        featureRequestTitleRequired: 'Le titre est requis !',
        featureRequestDescriptionRequired: 'La description est requise !',
        featureRequestTitleTooShort:
            'Le titre doit contenir au moins {{min}} caractères !',
        featureRequestTitleTooLong:
            'Le titre doit contenir {{max}} caractères ou moins !',
        featureRequestDescriptionTooShort:
            'La description doit contenir au moins {{min}} caractères !',
        featureRequestDescriptionTooLong:
            'La description doit contenir {{max}} caractères ou moins !',
        featureRequestInvalidStatus: 'Statut invalide !',
        featureRequestUpdated: 'Demande de fonctionnalité mise à jour.',
        failedToUpdateFeatureRequest: 'Échec de la mise à jour de la demande !',
        noChangesProvided: 'Aucune modification fournie !',
        platformRequired: 'Au moins une plateforme est requise !',
        invalidPlatform: 'Valeur de plateforme invalide !',
        featureRequestImplementationLimitReached:
            'Cet utilisateur a déjà {{limit}} demandes de fonctionnalités en cours !'
    },
    emails: {
        otpSubject: 'Votre code de connexion ClawHost',
        otpPreview: 'Votre code de connexion ClawHost : {{code}}',
        otpHeading: 'Votre code de connexion est :',
        otpExpiry:
            "Le code expire dans 10 minutes. Si ce n'était pas vous, ignorez cet email."
    },
    auth: {
        signIn: 'Se connecter',
        signInDescription:
            'Connectez-vous à votre compte ClawHost pour gérer vos instances OpenClaw.',
        signingIn: 'Connexion en cours...',
        verifyCode: 'Vérifier le code',
        checkYourEmail: 'Vérifiez votre email',
        checkYourEmailHeading: 'Vérifiez votre email',
        codeSentTo: 'Nous avons envoyé un code à 6 chiffres à',
        signInToDeployOpenClaw:
            'Connectez-vous pour gérer et déployer des instances OpenClaw.',
        emailAddress: 'Adresse email',
        emailPlaceholder: 'exemple@clawhost.cloud',
        continueWithEmail: "Continuer avec l'email",
        otpDescription:
            'Nous vous enverrons un code pour vous connecter. Aucun mot de passe nécessaire.',
        welcomeBack: 'Bon retour.',
        resendIn: 'Renvoyer dans {{seconds}}s',
        resendCode: 'Renvoyer le code',
        changeEmail: "Changer d'email",
        invalidCode: 'Code invalide',
        invalidEmailFormat: 'Veuillez entrer une adresse email valide !',
        plusAddressingNotAllowed:
            "L'adressage avec le signe + n'est pas autorisé pour la connexion par email !",
        or: 'ou',
        continueWithGoogle: 'Continuer avec Google',
        continueWithGithub: 'Continuer avec GitHub',
        agreementNotice: 'En continuant, vous acceptez nos',
        termsOfService: "Conditions d'utilisation",
        andWord: 'et',
        privacyPolicy: 'Politique de confidentialité'
    },
    account: {
        title: 'Compte',
        description:
            'Gérez les paramètres de votre compte ClawHost et vos informations de profil.',
        accountSettings: 'Compte',
        manageYourAccount:
            'Gérez votre profil et les paramètres de votre compte.',
        profileInformation: 'Informations du profil',
        profileDescription:
            "Vos informations personnelles et votre nom d'affichage.",
        noNameSet: 'Aucun nom défini',
        joined: 'Inscrit le',
        claws: 'claws',
        sshKeys: 'clés',
        displayName: "Nom d'affichage",
        enterYourName: 'Entrez votre nom',
        emailAddress: 'Adresse email',
        emailNotEditable: "L'email n'est pas modifiable. Contactez le support.",
        profileUpdatedSuccessfully: 'Profil mis à jour avec succès.',
        billingHistory: 'Historique de facturation',
        billingDescription: 'Votre historique de paiements et factures',
        date: 'Date',
        product: 'Produit',
        amount: 'Montant',
        status: 'Statut',
        statusPaid: 'Payé',
        statusPending: 'En attente',
        statusRefunded: 'Remboursé',
        statusPartiallyRefunded: 'Partiellement remboursé',
        billingReasonPurchase: 'Achat',
        billingReasonSubscriptionCreate: 'Nouvel abonnement',
        billingReasonSubscriptionCycle: 'Renouvellement',
        billingReasonSubscriptionUpdate: "Mise à jour d'abonnement",
        noBillingHistory: 'Aucune facturation',
        noBillingHistoryDescription:
            "Vous n'avez aucun historique de paiement. Une fois votre premier claw déployé, vos facturations apparaîtront ici.",
        failedToLoadBilling:
            "Échec du chargement de l'historique de facturation !",
        viewInvoice: 'Voir la facture',
        failedToLoadInvoice: 'Échec du chargement de la facture !',
        couponApplied: 'Coupon : {{name}}',
        manageBilling: 'Gérer la facturation',
        failedToLoadPortal: "Échec de l'ouverture du portail de facturation !",
        connectedAccounts: 'Comptes connectés',
        connectedAccountsDescription:
            'Gérez les méthodes de connexion liées à votre compte.',
        authEmail: 'Email',
        authGoogle: 'Google',
        authGithub: 'GitHub',
        authConnected: 'Connecté',
        authConnect: 'Connecter',
        authDisconnect: 'Déconnecter',
        emailCannotBeDisconnected:
            "L'email est toujours connecté en tant que méthode de connexion principale.",
        providerConnected: '{{provider}} connecté avec succès.',
        providerDisconnected: '{{provider}} déconnecté avec succès.',
        providerEmailMismatch:
            'Vous ne pouvez connecter que des comptes utilisant la même adresse e-mail !',
        settings: 'Paramètres',
        settingsDescription: 'Gérez les préférences de votre tableau de bord.',
        showAllClaws: 'Afficher tous les claws de tous les utilisateurs',
        openLinksWindowed: 'Ouvrir les liens dans une vue fenêtrée',
        openLinksWindowedDescription: 'Lorsque cette option est activée, les liens externes s\'ouvrent dans l\'application au lieu du navigateur système.'
    },
    billing: {
        title: 'Facturation',
        description:
            'Consultez votre historique de paiements et gérez votre facturation.',
        billingHistory: 'Facturation',
        manageYourBilling:
            'Consultez votre historique de paiements et gérez vos factures.',
        billingDescription: 'Votre historique de paiements et factures',
        date: 'Date',
        product: 'Produit',
        amount: 'Montant',
        status: 'Statut',
        statusPaid: 'Payé',
        statusPending: 'En attente',
        statusRefunded: 'Remboursé',
        statusPartiallyRefunded: 'Partiellement remboursé',
        billingReasonPurchase: 'Achat',
        billingReasonSubscriptionCreate: 'Nouvel abonnement',
        billingReasonSubscriptionCycle: 'Renouvellement',
        billingReasonSubscriptionUpdate: "Mise à jour d'abonnement",
        noBillingHistory: 'Aucune facturation',
        noBillingHistoryDescription:
            "Vous n'avez aucun historique de paiement. Une fois votre premier claw déployé, vos facturations apparaîtront ici.",
        failedToLoadBilling:
            "Échec du chargement de l'historique de facturation !",
        failedToLoadBillingDescription:
            'Impossible de charger votre historique de facturation. Veuillez vérifier votre connexion et réessayer !',
        viewInvoice: 'Voir la facture',
        failedToLoadInvoice: 'Échec du chargement de la facture !',
        couponApplied: 'Coupon : {{name}}',
        manageBilling: 'Gérer la facturation',
        failedToLoadPortal: "Échec de l'ouverture du portail de facturation !"
    },
    dashboard: {
        title: 'Claws',
        description:
            'Consultez et gérez vos instances OpenClaw déployées. Démarrez, arrêtez, redémarrez et surveillez vos serveurs VPS.',
        claw: 'claw',
        clawsPlural: 'claws',
        clawCountLabel: '{{count}} claws',
        clawCountLabelSingular: '{{count}} claw',
        newClaw: 'Nouveau Claw',
        noClawsYet: 'Aucun Claw',
        noClawsDescription:
            "Aucun claw déployé n'a été trouvé. Mais vous pouvez déployer votre premier claw à tout moment à partir de 10$/mois. Lancez-vous avec l'IA.",
        deleteClaw: 'Supprimer le Claw',
        deleteClawConfirmation: 'Êtes-vous sûr de vouloir supprimer',
        deleteClawWarning:
            "Votre abonnement sera annulé et le serveur sera supprimé à la fin de votre période de facturation actuelle. Vous pouvez continuer à l'utiliser jusque-là.",
        actionCannotBeUndone: 'Cette action est irréversible.',
        start: 'Démarrer',
        stop: 'Arrêter',
        restart: 'Redémarrer',
        stopClaw: 'Arrêter le Claw',
        stopClawConfirmation:
            "Êtes-vous sûr de vouloir arrêter le serveur ? Cela arrêtera tout ce qui est en cours d'exécution, y compris OpenClaw, mais vous pouvez redémarrer à tout moment. L'arrêt ne stoppe pas la facturation — supprimez le serveur pour ne plus être facturé.",
        restartClaw: 'Redémarrer le Claw',
        restartClawConfirmation:
            "Êtes-vous sûr de vouloir redémarrer le serveur ? Cela arrêtera tout ce qui est en cours d'exécution, y compris OpenClaw.",
        copyPassword: 'Copier le mot de passe',
        copySshWithKey: 'Copier SSH (avec clé)',
        copySshWithPassword: 'Copier SSH (avec mot de passe)',
        connect: 'Copier la commande SSH',
        sshCommandCopied: 'Commande SSH copiée.',
        sshCommandWithPasswordCopied: 'Commande SSH avec mot de passe copiée.',
        passwordCopiedToClipboard: 'Mot de passe copié dans le presse-papiers.',
        plan: 'Serveur',
        location: 'Emplacement',
        ip: 'IP',
        domain: 'Domaine',
        ipAddress: 'Adresse IP',
        port: 'Port',
        monthlyCost: 'Coût mensuel',
        serverId: 'ID du serveur',
        created: 'Créé le',
        sshKey: 'Clé SSH',
        storage: 'Stockage',
        provider: 'Fournisseur',
        nextBilling: 'Prochaine facturation',
        lastBilling: 'Dernière facturation',
        version: 'Version',
        gatewayToken: 'Jeton de passerelle',
        gatewayTokenDescription:
            'Utilisez ce jeton pour vous authentifier auprès de votre passerelle',
        scheduledForDeletion: 'Suppression programmée',
        scheduledDeletionShort: 'Suppression le {{date}}',
        deletionDate: 'Ce claw sera supprimé le {{date}}',
        deletionTooltip:
            'Suppression programmée le {{date}}. Pour annuler, utilisez le menu.',
        cancelDeletion: 'Annuler la suppression',
        deletionCancelled: 'Suppression annulée.',
        scheduleDeletion: 'Programmer la suppression',
        hardDelete: 'Suppression immédiate',
        hardDeleteClaw: 'Suppression immédiate',
        hardDeleteConfirmation:
            'Êtes-vous sûr de vouloir supprimer ce claw immédiatement ? Vous perdrez le temps restant sur votre période de facturation actuelle. Cette action est irréversible.',
        diagnostics: 'Diagnostics',
        diagnosticsDescription:
            "Vérifiez l'état de santé de votre instance OpenClaw.",
        diagnosticsStatus: 'Statut',
        diagnosticsLogs: 'Journaux',
        diagnosticsRepair: 'Réparer',
        diagnosticsRepairDescription:
            'Supprime les limites de mémoire, applique la dernière configuration de service et redémarre la passerelle. Cela corrige la plupart des problèmes courants.',
        diagnosticsRepairSuccess: 'Instance réparée avec succès.',
        diagnosticsRepairFailed:
            'Réparation appliquée mais la passerelle ne répond pas encore.',
        diagnosticsLoading: "Connexion à l'instance...",
        diagnosticsNoLogs:
            'Aucun journal disponible. Démarrez votre instance pour générer des journaux.',
        diagnosticsIssueDetected:
            'Un problème a été détecté sur votre instance.',
        diagnosticsHealthy: 'Votre instance fonctionne normalement.',
        diagnosticsPort: 'Port 18789',
        diagnosticsMemory: 'Mémoire',
        logsDescription:
            'Les 100 dernières lignes du journal de votre passerelle, actualisées automatiquement.',
        scrollToBottom: 'Défiler vers les nouveaux journaux',
        fileExplorer: 'Explorateur de fichiers',
        fileExplorerRoot: 'openclaw',
        fileExplorerDescription:
            'Parcourez et modifiez les fichiers de configuration OpenClaw sur votre instance.',
        fileExplorerWarning:
            'Des modifications incorrectes peuvent endommager votre instance. Modifiez avec prudence.',
        fileExplorerSelectFile:
            'Sélectionnez un fichier pour afficher son contenu.',
        fileExplorerReadOnly: 'Lecture seule',
        fileExplorerSave: 'Enregistrer',
        fileExplorerSaved: 'Fichier enregistré.',
        fileExplorerInvalidJson:
            "JSON invalide. Veuillez corriger les erreurs de syntaxe avant d'enregistrer.",
        fileExplorerNoFiles: 'Aucun fichier trouvé',
        updateInstance: "Mettre à jour l'instance",
        updateInstanceSuccess: 'Instance mise à jour avec succès.',
        updateInstanceFailed: "Échec de la mise à jour de l'instance !",
        startFailed: 'Échec du démarrage du claw !',
        renameSuccess: 'Claw renommé avec succès.',
        renameFailed: 'Échec du renommage du claw !',
        renameInvalidChars:
            'Seuls les lettres, chiffres et tirets sont autorisés.',
        reinstallInstance: "Réinstaller l'instance",
        reinstallClaw: "Réinstaller l'instance",
        reinstallClawConfirmation:
            'Cela réinstallera OpenClaw et réinitialisera toutes les configurations de cette instance. Vos données et votre serveur seront préservés, mais tous les services seront redémarrés. Continuer ?',
        reinstallInstanceSuccess: 'Instance réinstallée avec succès.',
        reinstallInstanceFailed: "Échec de la réinstallation de l'instance !",
        exportData: 'Exporter le Claw (.zip)',
        exportStarted:
            "Préparation de l'exportation, cela peut prendre un moment...",
        exportFailed: "Échec de l'exportation des données du claw !",
        exportRateLimited:
            'Vous pourrez exporter à nouveau dans {{minutes}} minutes.',
        exportRateLimitedSeconds:
            'Vous pourrez exporter à nouveau dans {{seconds}} secondes.',
        configuringTooltip:
            "Cela peut prendre un certain temps. Cela dépend d'OpenClaw, de l'emplacement du serveur et du DNS Cloudflare.",
        paymentSuccess:
            'Votre claw est en cours de création et de configuration.',
        dnsSetupBanner: 'Configurez le DNS local pour accéder à vos claws via sous-domaine.clawhost.',
        dnsSetupButton: 'Configurer DNS',
        dnsSetupSuccess: 'Résolveur DNS configuré avec succès.',
        dnsSetupError: 'Échec de la configuration du résolveur DNS !',
        chatTab: 'Chat',
        playgroundTab: 'Playground',
        userTab: 'Utilisateur',
        adminTab: 'Admin',
        adminTitle: 'Admin',
        adminDescription: 'Gérez tous les claws de la plateforme.',
        adminNoClaws: 'Aucun claw sur la plateforme pour le moment.',
        adminAccessDenied:
            "Vous n'avez pas la permission d'accéder à cette page.",
        owner: 'Propriétaire',
        status: {
            running: 'En cours',
            stopped: 'Arrêté',
            off: 'Éteint',
            starting: 'Démarrage',
            stopping: 'Arrêt en cours',
            creating: 'Création',
            configuring: 'Configuration',
            initializing: 'Mise en place',
            migrating: 'Migration',
            rebuilding: 'Reconstruction',
            restarting: 'Redémarrage',
            unreachable: 'Injoignable',
            deleting: 'Suppression',
            scheduledDeletion: 'Suppression programmée',
            awaitingPayment: 'En attente de paiement',
            unknown: 'Inconnu',
            checking: 'Vérification'
        }
    },
    chat: {
        explorer: 'Explorateur',
        selectAgent: 'Sélectionnez un agent',
        selectAgentDescription:
            'Choisissez un agent dans la barre latérale pour commencer à discuter',
        noAgents: 'Aucun agent disponible',
        noAgentsDescription:
            'Déployez un claw pour commencer à discuter avec les agents',
        openSidebar: 'Ouvrir la barre latérale',
        clawNotReady: "Le claw n'est pas encore prêt",
        notConfigured: 'Non configuré',
        addAgent: 'Ajouter un agent'
    },
    createClaw: {
        title: 'Déployer OpenClaw',
        description:
            "Configurez votre serveur et commencez à construire avec l'IA.",
        clawName: 'Nom',
        clawNamePlaceholder: 'ex : cozy-panda',
        clawNameInvalidChars:
            'Seuls les lettres, chiffres et tirets sont autorisés.',
        provider: 'Fournisseur',
        providerHetzner: 'Hetzner',
        providerDigitalOcean: 'DigitalOcean',
        providerVultr: 'Vultr',
        providerLocal: 'Local',
        providerAws: 'AWS',
        comingSoon: 'Bientôt',
        location: 'Emplacement',
        locationUnavailable: 'Indisponible',
        locationUnavailableForPlan: 'Indisponible',
        plan: 'Serveur',
        planUnavailable: 'Indisponible',
        providerAtCapacity:
            "En raison d'une forte demande, nous sommes temporairement à court de serveurs chez ce fournisseur. Nous travaillons activement à résoudre ce problème.",
        advancedOptions: 'Options avancées facultatives',
        rootPassword: 'Mot de passe root',
        rootPasswordPlaceholder: 'Entrez un mot de passe ou générez-en un',
        autoGeneratePasswordHint:
            'Laissez vide pour générer automatiquement un mot de passe sécurisé.',
        regeneratePassword: 'Régénérer le mot de passe',
        sshKeyOptional: 'Clé SSH',
        noSshKeyPasswordOnly: 'Pas de clé SSH (mot de passe uniquement)',
        noSshKeysConfigured: 'Aucune clé SSH configurée',
        addSshKeyForPasswordlessLogin:
            'Ajoutez une clé SSH pour une connexion sans mot de passe',
        additionalStorageOptional: 'Stockage supplémentaire',
        volumeStorage: 'Volume de stockage',
        vpsServer: 'Serveur VPS',
        openClawPreinstalled: 'OpenClaw préinstallé',
        storageWithSize: 'Stockage',
        totalMonthly: 'Total mensuel',
        creating: 'Création...',
        proceedToPayment: 'Payer {{amount}}$ pour déployer',
        selectServerToContinue: 'Sélectionnez un serveur pour continuer',
        selectLocationToContinue: 'Sélectionnez un emplacement pour continuer',
        clawCreated: 'Claw créé.',
        assigning: 'Attribution...',
        rootPasswordSaveThis: 'Mot de passe root (conservez-le !)',
        sshCommandUsingKey: 'Commande SSH (avec votre clé)',
        sshCommandWithPassword: 'Commande SSH (avec mot de passe)',
        passwordCopied: 'Mot de passe copié.',
        planSpec: '{{cpu}} vCPU / {{memory}} Go RAM / {{disk}} Go SSD',
        volumeUnit: 'Go',
        volumeMin: '0 Go',
        volumeMax: '500 Go'
    },
    sshKeys: {
        title: 'Clés SSH',
        description:
            'Gérez vos clés SSH pour un accès sécurisé sans mot de passe à vos instances OpenClaw.',
        key: 'clé ssh',
        keys: 'clés ssh',
        addSshKey: 'Ajouter une clé SSH',
        howSshKeysWork: 'Comment connecter une clé SSH ?',
        step1: 'Générez une paire de clés SSH sur votre ordinateur (ou utilisez-en une existante).',
        step2: 'Ajoutez la clé publique ici.',
        step3: "Sélectionnez la clé lors de la création d'une nouvelle instance.",
        step4: 'Connectez-vous avec',
        step4Command: 'ssh root@your-server-ip',
        step4Suffix: '- aucun mot de passe nécessaire.',
        noSshKeysYet: 'Aucune clé SSH',
        noSshKeysDescription:
            'Aucune clé SSH ajoutée sur votre compte. Vous pouvez en ajouter à tout moment et vous connecter à vos claws déployés.',
        deleteConfirmation:
            'Êtes-vous sûr de vouloir supprimer cette clé SSH ?',
        deleteKey: 'Supprimer la clé SSH',
        deleteKeyConfirmation: 'Êtes-vous sûr de vouloir supprimer',
        sshKeyAddedSuccessfully: 'Clé SSH ajoutée avec succès.',
        addSshKeyModalTitle: 'Ajouter une clé SSH',
        addSshKeyModalDescription:
            'Ajoutez une clé SSH pour une authentification sans mot de passe',
        iHaveAnSshKey: 'Clé existante',
        generateNewKey: 'Créer une nouvelle',
        name: 'Nom',
        namePlaceholder: 'ex : mon-macbook',
        publicKey: 'Clé publique',
        publicKeyPlaceholder: 'ssh-rsa AAAA... ou ssh-ed25519 AAAA...',
        publicKeyHint: 'Trouvez votre clé publique dans',
        publicKeyPath1: '~/.ssh/id_ed25519.pub',
        publicKeyPathOr: 'ou',
        publicKeyPath2: '~/.ssh/id_rsa.pub',
        important: 'Important :',
        dontHaveSshKey: "Vous n'avez pas de clé SSH ? Générez-en une :",
        sshKeygenCommand: 'ssh-keygen -t ed25519 -C "your-email@example.com"',
        keyName: 'Nom de la clé',
        keyNamePlaceholder: 'Ma clé générée',
        importantAfterGenerating:
            'Après la génération, vous devez télécharger et sauvegarder votre clé privée. Nous ne pouvons pas la récupérer si vous la perdez !',
        generateKeyPair: 'Générer la paire de clés',
        orGenerateLocallyRecommended: 'Ou générez localement (recommandé)',
        runThisInYourTerminal: 'Exécutez ceci dans votre terminal :',
        thenSwitchToIHave:
            'Puis passez à "Clé existante" et collez la clé publique.',
        savePrivateKeyNow:
            'Sauvegardez votre clé privée MAINTENANT ! Téléchargez-la avant de fermer cette fenêtre. Vous ne pourrez plus la voir.',
        privateKeyKeepSecret: 'Clé privée (gardez-la secrète !)',
        downloadPrivateKey: 'Télécharger la clé privée',
        publicKeyWillBeSaved: 'Clé publique (sera enregistrée)',
        savePublicKey: 'Enregistrer la clé publique'
    },
    landing: {
        title: "Déployez OpenClaw. Un clic. C'est fait.",
        description:
            'Déployez OpenClaw sur votre propre VPS en un clic. Hébergement cloud auto-hébergeable avec accès root complet, emplacements mondiaux et tarifs transparents.',
        badge: 'OpenClaw simplifié',
        tutorialBadge: 'Regarde. Déploie.',
        heroTitle1: 'Déployez OpenClaw.',
        heroTitle2: "Un clic. C'est fait.",
        heroDescription:
            "Infrastructure prête pour la production avec déploiement OpenClaw en un clic, géré de bout en bout — construisez, livrez et avancez plus vite avec l'IA.",
        goToClaws: 'Voir les Claws',
        selfHost: 'Open Source',
        startingPrice: 'À partir de',
        locations: 'Emplacements',
        servers: 'Serveurs',
        zeroCount: 'Zéro',
        zeroConfig: 'Zéro config',
        dashboardPreviewTitle: 'Claws',
        dashboardPreviewSubtitle: '5 claws ajoutés',
        deployNew: 'Déployer',
        running: 'En cours',
        latency: 'latence',
        howItWorks: 'Processus',
        threeStepsToPrivacy: 'Trois étapes vers OpenClaw',
        howItWorksDescription:
            'De zéro à un OpenClaw entièrement déployé, utilisable 24h/24 avec accès complet.',
        step1Title: 'Choisir un serveur',
        step1Description:
            'Choisissez parmi plus de 30 emplacements mondiaux chez trois fournisseurs. Nous déployons un VPS dédié pour vous en quelques secondes.',
        step2Title: 'Installation automatique',
        step2Description:
            'OpenClaw est préinstallé avec un lien direct et les détails du VPS. Aucune configuration nécessaire.',
        step3Title: "C'est à vous",
        step3Description:
            'Accès complet à OpenClaw et au VPS, sans limites sur ce que vous pouvez accomplir.',
        features: 'Fonctions',
        whyClawHost: 'Fonctions tout-en-un',
        featuresDescription:
            "Pourquoi nous valons le coup d'essayer, les fonctionnalités parlent d'elles-mêmes.",
        zeroConfigDescription:
            "Évitez des heures de configuration de serveur et d'OpenClaw. Tout est préinstallé et prêt en quelques minutes.",
        ownedData: 'Données 100% à vous',
        ownedDataDescription:
            'Votre propre serveur, vos données. Aucune infrastructure partagée, aucun journal, aucun tiers. En ligne 24h/24.',
        fullSpeed: 'Pleine vitesse',
        fullSpeedDescription:
            'Des ressources VPS dédiées signifient aucune limitation, pleine bande passante et internet ultra-rapide.',
        globalLocations: 'Emplacements mondiaux',
        globalLocationsDescription:
            "Déployez OpenClaw dans plus de 30 régions mondiales sur Hetzner, DigitalOcean ou Vultr et choisissez l'emplacement le plus proche de vous.",
        fullSshAccess: 'Accès SSH complet',
        fullSshAccessDescription:
            'Accès root complet à votre serveur. Vous en êtes propriétaire, installez ce que vous voulez et personnalisez tout.',
        secure: 'Sécurisé',
        secureDescription:
            'Protégé par défaut contre les vulnérabilités SSL, les logiciels malveillants et les menaces de sécurité courantes.',
        payAsYouGo: 'Tarifs simples',
        payAsYouGoDescription:
            'Tarification basée sur vos besoins. Pas de factures élevées imposées pour des serveurs de mauvaise qualité. Annulez à tout moment.',
        customSubdomains: 'Accès en ligne',
        customSubdomainsDescription:
            "Oubliez les réseaux locaux. Accédez à votre OpenClaw en toute sécurité depuis n'importe où avec un sous-domaine.",
        autoUpdates: 'Mises à jour automatiques',
        autoUpdatesDescription:
            'Oubliez les mises à jour et les correctifs de sécurité. Le serveur et OpenClaw sont automatiquement maintenus à jour.',
        testimonials: 'Témoignages',
        whatPeopleSay: 'Ce que les gens disent',
        testimonialsDescription:
            "Ne nous croyez pas sur parole. Découvrez comment d'autres déploient OpenClaw.",
        testimonial1Quote:
            "Enfin, mon propre serveur d'IA. L'installation a pris 30 secondes et je l'utilise depuis des mois sans problème.",
        testimonial1Author: 'Alex Chen',
        testimonial1Role: 'Développeur logiciel',
        testimonial2Quote:
            "Plus besoin de partager des ressources avec d'autres. Mon instance OpenClaw gère tout ce que je lui demande.",
        testimonial2Author: 'Maria Santos',
        testimonial2Role: 'Nomade numérique',
        testimonial3Quote:
            "Le déploiement en un clic est vraiment efficace. Je ne suis pas du tout technique mais j'ai lancé mon OpenClaw en moins d'une minute.",
        testimonial3Author: 'James Wilson',
        testimonial3Role: 'Freelance',
        testimonial4Quote:
            "J'adore pouvoir voir exactement ce qui tourne sur mon serveur. Contrôle total sur ma configuration IA.",
        testimonial4Author: 'Sophie Kim',
        testimonial4Role: "Passionnée d'IA",
        pricing: 'Tarifs',
        simpleTransparentPricing: 'Tarifs simples et transparents',
        pricingDescription:
            'Choisissez parmi plus de 45 serveurs chez nos fournisseurs selon vos besoins.',
        planColumn: 'Serveur',
        vCpuColumn: 'vCPU',
        ramColumn: 'RAM',
        storageColumn: 'Stockage',
        monthlyColumn: 'Prix',
        tierShared: 'vCPU partagé',
        tierDedicated: 'vCPU dédié',
        tierArm: 'Ampere (ARM)',
        tierRegular: 'Performance standard',
        tierHighPerformance: 'Haute performance',
        tierHighFrequency: 'Haute fréquence',
        recommended: 'Recommandé',
        perMonth: '/mois',
        deploy: 'Déployer',
        select: 'Sélectionner',
        openClawPreinstalled: 'OpenClaw préinstallé',
        unlimitedBandwidth: 'Bande passante illimitée',
        rootSshAccess: 'Accès root SSH complet',
        onlineAllDay: 'En ligne 24h/24',
        highQualityInternet: 'Internet de haute qualité',
        faqTitle: 'Questions',
        frequentlyAskedQuestions: 'Questions fréquentes',
        faqDescription:
            'Toutes les questions fréquemment posées, avec leurs réponses.',
        faq1Question: "Qu'est-ce que ClawHost ?",
        faq1Answer:
            "ClawHost est une plateforme conçue pour rendre OpenClaw accessible à tous. Elle permet aux utilisateurs non techniques comme aux développeurs d'utiliser OpenClaw sans gérer d'infrastructure. Nous gérons les serveurs, la disponibilité, la sécurité et la maintenance — vous utilisez simplement OpenClaw.",
        faq2Question: "Qu'est-ce qu'OpenClaw ?",
        faq2Answer:
            "OpenClaw est une couche d'accès sécurisée auto-hébergée pour vos outils et services d'IA. Elle est préconfigurée pour la sécurité et les performances, vous pouvez donc la déployer et vous connecter instantanément.",
        faq3Question:
            "En quoi est-ce différent des autres outils d'IA ou plateformes hébergées ?",
        faq3Answer:
            "Contrairement aux outils d'IA hébergés, ClawHost vous offre un vrai serveur avec OpenClaw installé. Vous possédez l'infrastructure, contrôlez tout et n'êtes pas limité par une plateforme partagée ou un modèle.",
        faq4Question: 'Ai-je besoin de connaissances techniques ?',
        faq4Answer:
            "Non. Nous gérons toute l'infrastructure, l'installation et la maintenance. Vous pouvez configurer et gérer OpenClaw via son interface, vous connecter aux canaux et personnaliser l'utilisation — sans toucher aux serveurs ou à l'infrastructure.",
        faq5Question: 'Quels emplacements sont disponibles ?',
        faq5Answer:
            "Nous proposons plus de 30 emplacements de serveurs dans le monde entier via Hetzner, DigitalOcean et Vultr, incluant les États-Unis, l'Europe, l'Asie et plus encore. Vous pouvez déployer OpenClaw sur plusieurs serveurs dans différentes régions si nécessaire.",
        faq6Question: 'Combien ça coûte ?',
        faq6Answer:
            "Les tarifs dépendent du serveur que vous sélectionnez. Avec plus de 45 options de serveurs allant de l'entrée de gamme à la haute performance chez trois fournisseurs, vous choisissez ce qui correspond à vos besoins et votre budget.",
        faq7Question: 'Puis-je accéder directement à mon serveur ?',
        faq7Answer:
            "Oui. En plus de l'accès à OpenClaw via un sous-domaine, vous avez un accès complet au serveur et à son infrastructure sous-jacente, vous donnant une liberté totale pour personnaliser et exécuter tout ce dont vous avez besoin.",
        faq8Question: 'Où sont hébergés les serveurs ?',
        faq8Answer:
            'Tous les serveurs sont hébergés sur Hetzner Cloud, DigitalOcean et Vultr, des fournisseurs cloud de confiance reconnus pour leur matériel haute performance et leur excellente disponibilité, utilisés par des infrastructures à grande échelle.',
        comparison: 'Comparaison',
        comparisonTitle: 'Ce qui nous distingue',
        comparisonDescription:
            "Il n'existe qu'une seule plateforme comparable, et notre approche se concentre sur de vrais serveurs et la pleine propriété plutôt que sur des limitations.",
        others: 'Autres',
        comparisonOpenClawUs: 'Accès complet à OpenClaw',
        comparisonOpenClawOthers: 'Uniquement le chat, pas de gestion',
        comparisonPricingUs: 'Tarifs transparents, spécifications claires',
        comparisonPricingOthers: 'Spécifications cachées, tarifs flous',
        comparisonOwnershipUs:
            'Vous êtes pleinement propriétaire de votre serveur',
        comparisonOwnershipOthers: 'Vous ne possédez rien',
        comparisonSubdomainUs: 'Accès via sous-domaine',
        comparisonSubdomainOthers: 'Accès uniquement via les canaux sociaux',
        comparisonInfraUs: 'Infrastructure à la demande',
        comparisonInfraOthers: 'Serveurs limités',
        comparisonDataUs: 'Vos données vous appartiennent',
        comparisonDataOthers: 'Vos données ne vous appartiennent pas',
        comparisonMultipleUs: 'Plusieurs OpenClaw, un seul Claw',
        comparisonMultipleOthers: 'Un seul OpenClaw',
        comparisonAgentsUs: 'Plusieurs agents par Claw',
        comparisonAgentsOthers: 'Un seul agent',
        comparisonOpenSourceUs: 'Entièrement open source',
        comparisonOpenSourceOthers: 'Code source fermé',
        comparisonExportUs: 'Exportez votre OpenClaw où vous voulez',
        comparisonExportOthers: 'Verrouillage fournisseur',
        comparisonProvidersUs: 'Plusieurs fournisseurs de serveurs',
        comparisonProvidersOthers: 'Un seul fournisseur',
        comparisonSocialsUs: 'Présence sur les réseaux sociaux',
        comparisonSocialsOthers: 'Pas de réseaux sociaux',
        seeFullComparison: 'Voir la comparaison complète',
        comparisonCtaText:
            'Nous comparons avec SimpleClaw, MyClaw.ai et plus — fonctionnalité par fonctionnalité.',
        readyToOwnYourPrivacy: 'Prêt à déployer OpenClaw ?',
        ctaDescription:
            'Obtenez un serveur dédié avec OpenClaw préinstallé. Accès root complet, emplacements mondiaux et prêt en quelques minutes. Vous en êtes propriétaire à tout moment. À partir de 10 $.',
        deployOpenClawNow: 'Déployer OpenClaw',
        selfHostInstead: 'Auto-héberger à la place',
        noCreditCardRequired: 'Installation instantanée',
        deployIn60Seconds: 'Sécurisé',
        demoClawStarted: 'Claw démarré.',
        demoClawStopped: 'Claw arrêté.',
        demoClawRestarting: 'Redémarrage du claw...',
        demoClawRestarted: 'Claw redémarré.',
        demoClawDeleted: 'Claw supprimé.',
        demoStatus: '{{running}} en cours, {{total}} au total'
    },
    blog: {
        title: 'Blog',
        description:
            "Guides, tutoriels et actualités sur OpenClaw et l'infrastructure auto-hébergée.",
        readingTime: '{{minutes}} min de lecture',
        publishedOn: 'Publié le {{date}}',
        writtenBy: 'Par {{author}}',
        backToBlog: 'Retour au blog',
        noPosts: 'Aucun article',
        noPostsDescription:
            'Les articles de blog arrivent bientôt. Revenez plus tard.',
        ctaTitle: 'Déployez OpenClaw en un clic',
        ctaDescription: 'Obtenez un serveur dédié avec OpenClaw préinstallé. Accès root complet, emplacements mondiaux et prêt en quelques minutes. Vous en êtes propriétaire à tout moment. À partir de 10 $.',
        ctaDeploy: 'Déployer OpenClaw',
        ctaGitHub: 'Voir sur GitHub'
    },
    changelog: {
        title: 'Journal des modifications',
        description:
            'Suivez les mises à jour, nouvelles fonctionnalités et améliorations de ClawHost.',
        subtitle:
            'Toutes les mises à jour, nouvelles fonctionnalités et améliorations de ClawHost.',
        upcomingRelease: 'En cours',
        upcomingReleaseTitle: 'Mobile, Bureau & Plus',
        upcomingReleaseDescription:
            "Gérez vos instances OpenClaw depuis n'importe où. Applications natives mobiles et bureau, plus des améliorations continues de la plateforme.",
        upcomingReleaseFeature1:
            'Application mobile native pour surveiller et gérer vos instances OpenClaw en déplacement',
        upcomingReleaseFeature2:
            'Application bureau locale pour auto-héberger OpenClaw sur macOS, Windows et Linux',
        upcomingReleaseFeature3: 'Support des thèmes sombre et clair',
        upcomingReleaseFeature4:
            'Améliorations de performance, stabilité et réactivité',
        upcomingReleaseFeature5:
            'Support multilingue avec anglais, français, espagnol et allemand',
        upcomingReleaseFeature6:
            'Pages de comparaison avec des analyses complètes face aux concurrents',
        upcomingReleaseFeature7:
            'Refactorisation de la structure des fonctionnalités du playground et simplifications',
        upcomingReleaseFeature8:
            'Demandes de fonctionnalités automatiquement gérées et publiées par les agents OpenClaw',
        release10Date: '22 février 2026',
        release10Title: 'Demandes de fonctionnalités, explorateur de fichiers & corrections',
        release10Description:
            'Demandes de fonctionnalités communautaires, support élargi de l\'édition de fichiers et diverses corrections.',
        release10Feature1:
            'Demandes de fonctionnalités automatiquement gérées et publiées par les agents OpenClaw',
        release10Feature2:
            "Correction des compétences échouant parfois à s'installer depuis le marketplace ClawHub",
        release10Feature3:
            'Correction du changement de fournisseur de modèle ne se reflétant pas et utilisant toujours le modèle initial',
        release10Feature4:
            'Plusieurs améliorations et corrections de bugs sur la plateforme',
        release10Feature5:
            'Les fichiers TypeScript, Markdown et texte brut sont maintenant modifiables dans l\'explorateur de fichiers',
        release9Date: '21 février 2026',
        release9Title: 'Comparaisons, refactorisation du playground & plus',
        release9Description:
            'Pages de comparaison avec les concurrents, restructuration des fonctionnalités du playground, support multilingue et améliorations globales de performance.',
        release9Feature1: 'Support des thèmes sombre et clair',
        release9Feature2:
            'Support multilingue avec anglais, français, espagnol et allemand',
        release9Feature3:
            'Pages de comparaison avec des analyses complètes face aux concurrents',
        release9Feature4:
            "Versions OpenClaw, mettez à jour en un clic ou installez n'importe quelle version instantanément",
        release9Feature5:
            'Refactorisation de la structure des fonctionnalités du playground et simplifications',
        release9Feature6:
            'Améliorations de performance, stabilité et réactivité',
        release8Date: '18 février 2026',
        release8Title: 'Thème clair, Performance & Stabilité',
        release8Description:
            "Support du thème clair, améliorations de performance et d'expérience, et améliorations de stabilité et de réactivité.",
        release8Feature1: 'Modes de thème clair, sombre et système',
        release8Feature2: "Améliorations de performance et d'expérience",
        release8Feature3: 'Améliorations de stabilité et de réactivité',
        release7Date: '16 février 2026',
        release7Title: 'Refonte du chat & Saisie vocale',
        release7Description:
            'Améliorations majeures du chat et du playground avec interaction vocale, marketplace de compétences ClawHub et pièces jointes pour les agents.',
        release7Feature1:
            'Refonte du chat et du playground pour une expérience plus fluide et réactive',
        release7Feature2:
            'Interaction vocale avec les chats, enregistrement et transcription de la parole directement dans le navigateur',
        release7Feature3:
            'Intégration de compétences ClawHub avec plus de 5 000 compétences disponibles à installer et gérer',
        release7Feature4:
            "Affichage et utilisation des pièces jointes pour les agents, envoi d'images et de documents dans le chat",
        release6Date: '16 février 2026',
        release6Title: "Canaux, Compétences & Chat d'agent",
        release6Description:
            'Contrôle total de vos canaux, compétences et agents OpenClaw. Gérez et discutez avec tout directement depuis le tableau de bord.',
        release6Feature1:
            'Gestion directe des canaux, ajout, suppression et configuration des canaux sans toucher au serveur',
        release6Feature2:
            "Gestion directe des compétences, installation, mise à jour et organisation des compétences d'agent depuis le tableau de bord",
        release6Feature3:
            "Discutez avec vos agents depuis le playground, interagissez avec n'importe quel agent en temps réel",
        release6Feature4:
            'Connexion avec Google ou GitHub, authentification rapide et sécurisée sans codes par email',
        release1Date: '8 février 2026',
        release1Title: 'Version initiale',
        release1Description:
            'La première version officielle de ClawHost. Déployez OpenClaw sur votre propre VPS en un clic.',
        release1Feature1: "Déploiement d'OpenClaw en un clic sur Hetzner Cloud",
        release1Feature2:
            'Tableau de bord pour gérer les claws : démarrer, arrêter, redémarrer et supprimer des instances',
        release1Feature3:
            '18 offres de serveurs Hetzner avec vCPU dédié, RAM et options de stockage',
        release1Feature4:
            '6 emplacements de serveurs Hetzner aux États-Unis, en Europe et en Asie',
        release1Feature5:
            'Gestion des clés SSH pour un accès serveur sans mot de passe',
        release1Feature6:
            "Support de stockage supplémentaire par volume jusqu'à 10 To",
        release1Feature7:
            'Authentification par lien magique, aucun mot de passe nécessaire',
        release1Feature8:
            'Accès en ligne à OpenClaw via des sous-domaines sécurisés',
        release1Feature9:
            'Intégration de paiement avec tarification transparente par serveur',
        release1Feature10: 'Historique de facturation et gestion des factures',
        release1Feature11:
            'Provisionnement automatique avec OpenClaw préinstallé et configuré',
        release2Date: '8 février 2026',
        release2Title: 'DigitalOcean & Plus',
        release2Description:
            'Infrastructure multi-fournisseur et une nouvelle façon de rester informé sur ClawHost.',
        release2Feature1: 'DigitalOcean comme second fournisseur cloud',
        release2Feature2:
            '7 offres de serveurs DigitalOcean avec vCPU dédié, RAM et options de stockage',
        release2Feature3:
            '10+ emplacements de serveurs DigitalOcean aux États-Unis, en Europe, en Asie et plus',
        release2Feature4:
            'Page de journal des modifications pour suivre toutes les mises à jour et versions de la plateforme',
        release3Date: '10 février 2026',
        release3Title: 'Aperçus serveur',
        release3Description:
            'Plus de visibilité et de contrôle sur vos serveurs, directement depuis le tableau de bord.',
        release3Feature1:
            'Journaux serveur en temps réel diffusés directement dans le tableau de bord',
        release3Feature2:
            'Diagnostics serveur avec réparation automatisée en un clic pour les problèmes de service',
        release3Feature3:
            'Explorateur de fichiers intégré et éditeur JSON pour les fichiers de configuration du serveur',
        release4Date: '11 février 2026',
        release4Title: 'Fournisseur Vultr',
        release4Description:
            'Vultr comme troisième fournisseur cloud avec 22 offres de serveurs et plus de 30 emplacements mondiaux.',
        release4Feature1: 'Vultr comme troisième fournisseur cloud',
        release4Feature2:
            '22 offres de serveurs Vultr en catégories Standard, Haute performance et Haute fréquence',
        release4Feature3:
            '30+ emplacements de serveurs Vultr aux États-Unis, en Europe, en Asie et plus',
        release5Date: '14 février 2026',
        release5Title: 'Agents & Exportation de données',
        release5Description:
            "Playground d'agents, gestion multi-agents et exportation portable des données pour vos instances OpenClaw.",
        release5Feature1:
            "Playground d'agents en un clic et vue d'ensemble, ajout et gestion de plusieurs agents",
        release5Feature2:
            "Exportez votre OpenClaw sous forme d'archive zip portable",
        release5Feature3:
            'Playground interactif avec visualisation graphique des Claws et des agents',
        release5Feature4:
            "Suppression de la bascule vue grille/liste au profit d'une mise en page unifiée du tableau de bord"
    },
    playground: {
        title: 'Playground',
        description:
            'Visualisez vos Claws et leurs agents dans un graphe interactif.',
        subtitle: 'Topologie des agents à travers votre infrastructure',
        noClawsYet: 'Aucun Claw',
        noClawsDescription: 'Déployez votre premier Claw pour interagir avec.',
        loadingAgents: 'Agents',
        unreachable: 'Injoignable',
        offline: 'Hors ligne',
        noAgents: 'Aucun agent',
        agentCount: '{{count}} agent',
        agentCountPlural: '{{count}} agents',
        agentModel: 'Modèle',
        zoomLabel: '{{percent}}%',
        fitView: 'Centrer',
        nodesOutOfView: 'Claws hors du champ',
        nodeOutOfView: 'Claw hors du champ',
        addAgent: 'Ajouter un agent',
        closeDetails: 'Fermer',
        tabInfo: 'Info',
        tabLogs: 'Journaux',
        tabDiagnostics: 'Santé',
        tabDisabledConfiguring: 'Disponible une fois la configuration de l\'instance terminée.',
        loadingTip1:
            "Saviez-vous que vous pouvez exécuter plusieurs agents au sein d'un même OpenClaw ?",
        loadingTip2: "Saviez-vous qu'OpenClaw est open source ?",
        loadingTip3:
            "ClawHost est le tout premier projet permettant l'hébergement d'OpenClaw en un clic.",
        tabChat: 'Chat',
        tabConfiguration: 'Configuration',
        tabSettings: 'Paramètres',
        tabEnvs: 'Envs',
        agentOnClaw: 'sur {{clawName}}',
        cannotDeleteDefaultAgent:
            "L'agent par défaut ne peut pas être supprimé",
        configurationModel: 'Modèle',
        configurationModelPlaceholder: 'Sélectionnez un modèle',
        configurationModelDescription:
            "Le modèle d'IA utilisé par cet agent. Changer de modèle peut nécessiter de définir la clé API correspondante.",
        configurationEnvVars: "Variables d'environnement",
        configurationEnvVarsDescription:
            "Clés API et variables d'environnement stockées dans ~/.openclaw/.env sur l'instance.",
        configurationAddEnvVar: 'Ajouter une variable',
        configurationKeyPlaceholder: 'NOM_VARIABLE',
        configurationValuePlaceholder: 'valeur',
        configurationSave: 'Enregistrer',
        configurationSaving: 'Enregistrement...',
        configurationSaved: "Configuration de l'agent enregistrée.",
        configurationSaveFailed:
            "Échec de l'enregistrement de la configuration de l'agent !",
        configurationLoading: 'Chargement de la configuration...',
        configurationLoadFailed:
            "Échec du chargement de la configuration de l'agent.",
        configurationLoadFailedDescription:
            'Impossible de récupérer la configuration de cet agent. Veuillez réessayer plus tard.',
        configurationRemoveVar: 'Supprimer',
        configurationApiKey: 'Clé API',
        configurationApiKeyDescription:
            "Requise pour {{modelName}}. Cette clé est stockée dans ~/.openclaw/.env sur l'instance.",
        configurationApiKeyPlaceholder: 'Entrez votre clé API',
        tabVariables: 'Variables',
        variablesDescription:
            "Variables d'environnement stockées dans ~/.openclaw/.env sur cette instance.",
        variablesEmpty: "Aucune variable d'environnement trouvée.",
        variablesAddVariable: 'Ajouter une variable',
        variablesSave: 'Enregistrer les variables',
        variablesSaving: 'Enregistrement...',
        variablesSaved: "Variables d'environnement enregistrées.",
        variablesSaveFailed:
            "Échec de l'enregistrement des variables d'environnement !",
        variablesLoading: 'Chargement des variables...',
        variablesLoadFailed:
            "Échec du chargement des variables d'environnement.",
        variablesLoadFailedDescription:
            'Impossible de récupérer les variables pour cette instance. Veuillez réessayer plus tard.',
        variablesInvalidKey: 'Lettres, chiffres et underscores uniquement.',
        variablesEmptyValue: 'La valeur ne peut pas être vide.',
        variablesDuplicateKey: 'Nom de variable en double.',
        variablesDeleteTitle: 'Supprimer la variable',
        variablesDeleteDescription:
            "Êtes-vous sûr de vouloir supprimer {{key}} ? Cela la supprimera immédiatement de l'instance.",
        variablesDeleteConfirm: 'Supprimer',
        variablesDontAskAgain: 'Ne plus demander lors de la suppression de variables cette session',
        variablesDeleted: 'Variable supprimée.',
        variablesOperationPending: "Désactivé pendant qu'une opération précédente se termine.",
        addAgentTitle: 'Ajouter un agent',
        addAgentDescription: 'Ajouter un nouvel agent à {{clawName}}.',
        addAgentName: 'Nom',
        addAgentNamePlaceholder: "Entrez le nom de l'agent",
        addAgentModel: 'Modèle',
        addAgentModelPlaceholder: 'Sélectionnez un modèle (optionnel)',
        addAgentApiKey: 'Clé API',
        addAgentApiKeyPlaceholder: 'Entrez votre clé API (optionnel)',
        addAgentApiKeyConfigured:
            "{{envVar}} déjà configuré. Modifiable dans l'onglet Variables après ajout.",
        addAgentSubmit: "Ajouter l'agent",
        addAgentSuccess: 'Agent ajouté avec succès.',
        addAgentFailed: "Échec de l'ajout de l'agent !",
        deleteAgent: "Supprimer l'agent",
        deleteAgentTitle: "Supprimer l'agent",
        deleteAgentDescription:
            'Êtes-vous sûr de vouloir supprimer l\'agent "{{agentName}}" ? Cette action est irréversible. Les variables d\'environnement ne seront pas supprimées.',
        deleteAgentConfirm: 'Supprimer',
        agentDontAskAgain: 'Ne plus demander lors de la suppression d\'agents cette session',
        deleteAgentDeleting: 'Suppression...',
        deleteAgentSuccess: 'Agent supprimé avec succès.',
        deleteAgentFailed: "Échec de la suppression de l'agent !",
        configurationName: 'Nom',
        configurationNamePlaceholder: "Entrez le nom de l'agent",
        configurationNameDescription: 'Lettres, chiffres et tirets uniquement.',
        agentNameRequired: "Le nom de l'agent est requis.",
        agentNameInvalidChars:
            'Seuls les lettres, chiffres et tirets sont autorisés.',
        agentNameDuplicate: 'Un agent avec ce nom existe déjà.',
        chatConnecting: 'Connexion...',
        chatAuthenticating: 'Authentification...',
        chatDisconnected: 'Déconnecté',
        chatError: 'Erreur de connexion',
        chatConnected: 'Connecté',
        chatInputPlaceholder: 'Écrivez un message...',
        chatInputDisabled: 'Connectez-vous pour discuter avec cet agent',
        chatSend: 'Envoyer',
        chatAbort: 'Arrêter',
        chatLoadingHistory: 'Chargement des messages...',
        chatNoMessages: 'Aucun message pour le moment.',
        chatNoMessagesDescription:
            'Envoyez un message pour démarrer une conversation avec cet agent.',
        chatErrorMessage:
            'Une erreur est survenue lors de la génération de la réponse.',
        chatAbortedMessage: 'La réponse a été arrêtée.',
        chatReadOnlyPlaceholder: 'Chat disponible sur vos propres Claws.',
        chatReadOnlyUser:
            "Bonjour ! Pouvez-vous m'aider à configurer un projet Node.js ?",
        chatReadOnlyAssistant:
            'Bien sûr ! Je peux vous aider à initialiser un nouveau projet Node.js. Souhaitez-vous que je crée un package.json avec quelques dépendances courantes ?',
        chatConnectionFailed: 'Échec de la connexion à cet agent.',
        chatConnectionFailedDescription:
            "Assurez-vous que le Claw est en cours d'exécution et joignable.",
        chatNotConfigured: 'Agent non configuré.',
        chatNotConfiguredDescription:
            "Sélectionnez un modèle et définissez une clé API dans l'onglet Configuration pour commencer à discuter.",
        chatConfigureButton: "Configurer l'agent",
        chatToday: "Aujourd'hui",
        chatYesterday: 'Hier',
        chatExpandFullscreen: 'Agrandir le chat',
        chatAttachFile: 'Joindre un fichier',
        chatDropFiles: 'Déposez des fichiers à joindre',
        chatDropFilesDescription: "Images, PDF et fichiers texte jusqu'à 5 Mo.",
        chatVoiceInput: 'Saisie vocale',
        chatVoiceListening: 'Écoute en cours...',
        chatVoiceNotSupported:
            "La saisie vocale n'est pas supportée dans ce navigateur.",
        chatAttachmentNotSupported:
            "Ce type de fichier n'est pas supporté. Utilisez des images, PDF ou fichiers texte.",
        chatNoPreview: 'Aucun aperçu disponible.',
        chatDownloadFile: 'Télécharger le fichier',
        chatScrollToBottom: 'Défiler vers le bas',
        tabChannels: 'Canaux',
        channelsDescription:
            'Configurez les canaux de messagerie pour cette instance. Les messages sont acheminés vers les agents via des liaisons.',
        channelsWhatsApp: 'WhatsApp',
        channelsWhatsAppPairDevice: 'Associer un appareil',
        channelsWhatsAppPairing: 'En attente du code QR...',
        channelsWhatsAppScanQr:
            'Scannez ce code QR avec WhatsApp pour associer votre appareil.',
        channelsWhatsAppScanInstructions:
            'Ouvrez WhatsApp > Paramètres > Appareils connectés > Connecter un appareil',
        channelsWhatsAppPaired: 'WhatsApp associé avec succès.',
        channelsWhatsAppPairFailed: 'Échec du couplage. Veuillez réessayer.',
        channelsWhatsAppAlreadyPaired: 'WhatsApp est déjà associé.',
        channelsWhatsAppUnpair: 'Dissocier',
        channelsWhatsAppUnsupported:
            "Le couplage WhatsApp n'est pas disponible sur cette instance. Mettez à jour OpenClaw pour l'activer.",
        channelsTelegram: 'Telegram',
        channelsDiscord: 'Discord',
        channelsSlack: 'Slack',
        channelsSignal: 'Signal',
        channelsEnabled: 'Activé',
        channelsAccount: 'Numéro de téléphone du compte',
        channelsAccountPlaceholder: '+33612345678',
        channelsBotToken: 'Jeton du bot',
        channelsBotTokenPlaceholder: 'Entrez le jeton du bot',
        channelsAppToken: "Jeton de l'application",
        channelsAppTokenPlaceholder: "Entrez le jeton de l'application",
        channelsToken: 'Jeton du bot',
        channelsTokenPlaceholder: 'Entrez le jeton du bot',
        channelsSigningSecret: 'Secret de signature',
        channelsSigningSecretPlaceholder: 'Entrez le secret de signature',
        channelsDmPolicy: 'Politique de messages privés',
        channelsDmPolicyOpen: 'Ouvert',
        channelsDmPolicyPairing: 'Appariement',
        channelsDmPolicyAllowlist: 'Liste autorisée',
        channelsDmPolicyDisabled: 'Désactivé',
        channelsAllowFrom: 'Autoriser depuis',
        channelsAllowFromPlaceholder: 'IDs autorisés, séparés par des virgules',
        channelsSave: 'Enregistrer',
        channelsSaved: 'Canaux mis à jour avec succès.',
        channelsSaveFailed: 'Échec de la mise à jour des canaux !',
        channelsLoading: 'Chargement des canaux...',
        channelsLoadFailed: 'Échec du chargement des canaux.',
        channelsLoadFailedDescription:
            'Impossible de récupérer la configuration des canaux. Veuillez réessayer.',
        channelsNoChanges: 'Aucune modification à enregistrer.',
        bindingsDescription:
            'Assignez des canaux de messagerie à cet agent. Chaque canal ne peut être routé que vers un seul agent à la fois.',
        bindingsNoChannels: 'Aucun canal activé.',
        bindingsNoChannelsDescription:
            "Activez des canaux dans les paramètres de l'instance d'abord, puis assignez-les aux agents ici.",
        bindingsSaving: 'Enregistrement...',
        bindingsSaved: 'Liaisons mises à jour avec succès.',
        bindingsSaveFailed: 'Échec de la mise à jour des liaisons !',
        tabSkills: 'Compétences',
        skillsDescription:
            'Gérez les compétences partagées disponibles pour tous les agents sur cette instance.',
        skillsSearch: 'Rechercher des compétences...',
        skillsNoResults: 'Aucune compétence ne correspond à votre recherche.',
        skillsEmpty: 'Aucun Skill',
        skillsSave: 'Enregistrer les compétences',
        skillsSaved: 'Compétences mises à jour avec succès.',
        skillsSaveFailed: 'Échec de la mise à jour des compétences !',
        skillsLoading: 'Chargement des compétences...',
        skillsLoadFailed: 'Échec du chargement des compétences.',
        skillsLoadFailedDescription:
            'Impossible de récupérer la configuration des compétences. Veuillez réessayer.',
        agentSkillsDescription:
            "Compétences installées dans l'espace de travail de cet agent.",
        agentSkillsInstalling: 'Installation...',
        agentSkillsInstalled: 'Compétence installée avec succès.',
        agentSkillsInstallFailed: "Échec de l'installation de la compétence !",
        agentSkillsRemoving: 'Suppression...',
        agentSkillsRemoved: 'Compétence supprimée avec succès.',
        agentSkillsRemoveFailed: 'Échec de la suppression de la compétence !',
        agentSkillsEmpty: 'Aucune compétence installée.',
        agentSkillsEmptyDescription:
            'Installez une compétence pour étendre les capacités de cet agent.',
        agentSkillsNamePlaceholder: 'Nom de la compétence',
        agentSkillsConfirmRemove: 'Supprimer la compétence "{{skillName}}" ?',
        agentSkillsConfirmRemoveDescription:
            "Cela supprimera la compétence de l'espace de travail de l'agent.",
        skillsBundledTab: 'Intégrées',
        skillsClawHubTab: 'ClawHub',
        clawHubSearch: 'Rechercher des compétences ClawHub...',
        clawHubNoResults: 'Aucune compétence trouvée sur ClawHub.',
        clawHubEmpty: 'Aucune compétence ClawHub installée.',
        clawHubEmptyDescription:
            'Recherchez et installez des compétences depuis la marketplace ClawHub.',
        clawHubInstall: 'Installer',
        clawHubInstalled: 'Compétence installée depuis ClawHub.',
        clawHubInstallFailed:
            "Échec de l'installation de la compétence depuis ClawHub !",
        clawHubRemove: 'Supprimer',
        clawHubRemoved: 'Compétence ClawHub supprimée.',
        clawHubRemoveFailed:
            'Échec de la suppression de la compétence ClawHub !',
        clawHubUpdate: 'Mettre à jour',
        clawHubUpdated: 'Compétence mise à jour depuis ClawHub.',
        clawHubUpdateFailed:
            'Échec de la mise à jour de la compétence ClawHub !',
        clawHubUpdateAvailable: 'v{{version}} disponible',
        clawHubBy: 'par {{author}}',
        clawHubDownloads: '{{count}} téléchargements',
        clawHubVersion: 'v{{version}}',
        clawHubLoadFailed: 'Échec du chargement de ClawHub.',
        clawHubLoadFailedDescription:
            'Impossible de se connecter à la marketplace ClawHub. Veuillez réessayer.',
        tabVersions: 'Versions',
        versionsSearch: 'Rechercher des versions...',
        versionsEmpty: 'Aucune version trouvée',
        versionsEmptyDescription:
            'Aucune version ne correspond à votre recherche.',
        versionsErrorDescription: 'Impossible de charger les versions.',
        versionsChangelog: 'Voir les changelogs sur npm',
        versionCurrent: 'Actuelle',
        versionLatest: 'Dernière',
        versionInstall: 'Installer',
        versionInstalling: 'Installation...',
        versionInstallSuccess: 'Version {{version}} installée avec succès.',
        versionInstallFailed: "Impossible d'installer la version !",
        versionDownloads: '{{count}} téléchargements',
        versionChangelog: 'Changelog',
        versionOutdated: 'Obsolète',
        settingsName: 'Nom',
        settingsNamePlaceholder: 'Entrez le nom du claw',
        settingsNameDescription: 'Lettres, chiffres et tirets uniquement.',
        subdomain: 'Sous-domaine',
        subdomainPlaceholder: 'Entrez le sous-domaine',
        subdomainDescription: 'Lettres minuscules et chiffres, 3-20 caractères.',
        subdomainInvalid: 'Utilisez 3-20 lettres minuscules et chiffres uniquement.',
        subdomainUpdated: 'Sous-domaine mis à jour avec succès.',
        subdomainUpdateFailed: 'Échec de la mise à jour du sous-domaine !',
        subdomainInUse: 'Ce sous-domaine est utilisé par un autre claw !',
        settingsSave: 'Enregistrer',
        settingsSaving: 'Enregistrement...'
    },
    privacy: {
        title: 'Politique de confidentialité',
        description:
            'Découvrez comment ClawHost collecte, utilise et protège vos données personnelles.',
        lastUpdated: 'Dernière mise à jour : 17 février 2026',
        introTitle: '1. Introduction',
        introText:
            "ClawHost (« nous », « notre ») s'engage à protéger votre vie privée. Cette Politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre Service.",
        authTitle: '2. Authentification',
        authText:
            "ClawHost utilise Google Firebase Authentication pour gérer les comptes utilisateurs. Vous pouvez vous connecter avec un email, Google ou GitHub. En utilisant ces méthodes de connexion, vous acceptez leurs conditions et politiques de confidentialité respectives. Ces fournisseurs peuvent collecter des données de base telles que votre adresse email, votre nom et les informations de votre appareil. Nous ne stockons que votre adresse email et votre nom d'affichage.",
        collectTitle: '3. Informations que nous collectons',
        collectText:
            'Nous collectons des informations de la manière suivante :',
        personalInfoTitle: 'Informations personnelles',
        personalInfoEmail:
            'Adresse email (pour la création de compte et la communication)',
        personalInfoName: 'Nom (optionnel, pour la personnalisation)',
        personalInfoPayment:
            'Informations de paiement (traitées de manière sécurisée par des prestataires tiers)',
        serverInfoTitle: 'Informations sur le serveur',
        serverInfoConfig:
            'Configuration et statut du serveur (hébergé sur Hetzner Cloud)',
        serverInfoIp: 'Adresse IP et emplacement du serveur',
        serverInfoResources: 'Allocation des ressources (CPU, RAM, stockage)',
        useTitle: '4. Comment nous utilisons vos informations',
        useText: 'Nous utilisons les informations collectées pour :',
        useProvide: 'Fournir et maintenir notre Service',
        useTransactions:
            'Traiter les transactions et envoyer les informations de facturation',
        useNotices: 'Envoyer des avis importants et des mises à jour',
        useSupport: 'Répondre aux demandes de support client',
        useAnalyze:
            "Surveiller et analyser les habitudes d'utilisation pour améliorer notre Service",
        useFraud: 'Détecter et prévenir la fraude ou les abus',
        sharingTitle: '5. Partage et divulgation des données',
        sharingText:
            'Nous ne vendons pas vos informations personnelles. Nous pouvons partager des informations avec :',
        sharingProviders:
            "Les prestataires de services qui nous aident à exploiter notre Service (ex. : fournisseurs d'infrastructure cloud)",
        sharingLegal:
            "Les autorités légales lorsque la loi l'exige ou pour protéger nos droits",
        sharingBusiness:
            "Les partenaires commerciaux en cas de fusion, acquisition ou vente d'actifs",
        securityTitle: '6. Sécurité des données',
        securityText:
            "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction. Cela inclut le chiffrement, des serveurs sécurisés et des évaluations de sécurité régulières.",
        retentionTitle: '7. Conservation des données',
        retentionText:
            'Nous conservons vos informations personnelles aussi longtemps que votre compte est actif ou que nécessaire pour vous fournir des services. Nous pouvons conserver certaines informations selon les exigences légales ou pour des besoins commerciaux légitimes.',
        rightsTitle: '8. Vos droits',
        rightsText: 'Selon votre localisation, vous pouvez avoir le droit de :',
        rightsAccess: 'Accéder à vos données personnelles',
        rightsCorrect: 'Corriger les données inexactes',
        rightsDelete: 'Demander la suppression de vos données',
        rightsObject: 'Vous opposer au traitement de vos données',
        rightsPortability: 'Portabilité des données',
        rightsWithdraw: 'Retirer votre consentement à tout moment',
        cookiesTitle: '9. Cookies et suivi',
        cookiesText:
            "Nous n'utilisons pas de cookies. L'authentification est gérée par Firebase et ne repose pas sur des cookies stockés dans votre navigateur.",
        transfersTitle: '10. Transferts internationaux de données',
        transfersText:
            'Vos informations peuvent être transférées et traitées dans des pays autres que le vôtre. Nous veillons à ce que des garanties appropriées soient en place pour protéger vos données conformément à cette Politique de confidentialité.',
        eligibilityTitle: '11. Éligibilité',
        eligibilityText:
            "Notre Service est accessible à tous. Il n'y a aucune restriction d'âge pour utiliser ClawHost.",
        changesTitle: '12. Modifications de cette politique',
        changesText:
            'Nous pouvons mettre à jour cette Politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle Politique de confidentialité sur cette page et en mettant à jour la date de « Dernière mise à jour ».',
        contactTitle: '13. Nous contacter',
        contactText:
            'Si vous avez des questions concernant cette Politique de confidentialité ou souhaitez exercer vos droits, veuillez nous contacter à'
    },
    terms: {
        title: "Conditions d'utilisation",
        description:
            "Lisez les termes et conditions d'utilisation des services ClawHost.",
        lastUpdated: 'Dernière mise à jour : 17 février 2026',
        acceptanceTitle: '1. Acceptation des conditions',
        acceptanceText:
            "En accédant et en utilisant ClawHost (« Service »), vous acceptez d'être lié par les termes et dispositions de cet accord. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre Service.",
        serviceTitle: '2. Description du Service',
        serviceText:
            "ClawHost fournit un déploiement d'OpenClaw en un clic sur des serveurs dédiés. Nous permettons aux utilisateurs de déployer, gérer et accéder à des instances OpenClaw préconfigurées avec un accès root complet et des ressources dédiées.",
        authTitle: '3. Authentification',
        authText:
            'ClawHost utilise Google Firebase Authentication pour gérer la connexion. Vous pouvez vous authentifier avec un email, Google ou GitHub. En utilisant ces méthodes, vous acceptez les conditions et politiques de confidentialité respectives de Google et GitHub. Ces fournisseurs peuvent collecter des informations de base telles que votre adresse email, votre nom et les données de votre appareil.',
        responsibilitiesTitle: "4. Responsabilités de l'utilisateur",
        responsibilitiesText: 'Vous vous engagez à :',
        responsibilitiesAccurate:
            "Fournir des informations d'inscription exactes et complètes",
        responsibilitiesSecurity:
            'Maintenir la sécurité de vos identifiants de compte',
        responsibilitiesCompliance:
            'Utiliser le Service en conformité avec toutes les lois applicables',
        responsibilitiesLegal:
            'Ne pas utiliser le Service à des fins illégales ou non autorisées',
        responsibilitiesAccess:
            "Ne pas tenter d'obtenir un accès non autorisé à des systèmes ou réseaux",
        prohibitedTitle: '5. Utilisations interdites',
        prohibitedText: 'Vous ne pouvez pas utiliser notre Service pour :',
        prohibitedMalware:
            'Distribuer des logiciels malveillants, virus ou tout logiciel nuisible',
        prohibitedDos:
            'Mener des attaques par déni de service ou abus de réseau',
        prohibitedSpam: 'Envoyer du spam ou des communications non sollicitées',
        prohibitedIllegal: 'Héberger ou distribuer du contenu illégal',
        prohibitedIp:
            'Violer les droits de tiers, y compris la propriété intellectuelle',
        prohibitedMining: 'Miner des cryptomonnaies',
        prohibitedOther:
            'Toute autre activité illicite ou nuisible que nous pourrions juger inappropriée à notre discrétion',
        paymentTitle: '6. Paiement et facturation',
        paymentText:
            "Les services sont facturés sur une base mensuelle fixe. Tous les paiements sont non remboursables. Lorsque vous payez pour un serveur, vous y avez accès pour toute la période de facturation. Si vous annulez, l'annulation prend effet à la fin de la période de facturation en cours. Les prix sont susceptibles de changer moyennant un préavis raisonnable. Le défaut de paiement peut entraîner la suspension ou la résiliation de votre compte.",
        availabilityTitle: '7. Disponibilité du Service',
        availabilityText:
            'Nous nous efforçons de maintenir une haute disponibilité mais ne garantissons pas un accès ininterrompu au Service. Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie du Service à tout moment, avec ou sans préavis.',
        liabilityTitle: '8. Limitation de responsabilité',
        liabilityText:
            "Dans la mesure maximale permise par la loi, ClawHost ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ni de toute perte de profits ou de revenus, qu'ils soient subis directement ou indirectement.",
        terminationTitle: '9. Résiliation',
        terminationText:
            "Nous pouvons résilier ou suspendre votre compte et l'accès au Service immédiatement, sans préavis, pour tout comportement que nous estimons contraire à ces Conditions ou nuisible à d'autres utilisateurs, à nous-mêmes ou à des tiers, ou pour toute autre raison.",
        changesToTermsTitle: '10. Modifications des conditions',
        changesToTermsText:
            "Nous nous réservons le droit de modifier ces conditions à tout moment. Nous informerons les utilisateurs de tout changement important par email ou via le Service. L'utilisation continue du Service après de telles modifications constitue l'acceptation des conditions mises à jour.",
        contactTitle: '11. Coordonnées',
        contactText:
            'Si vous avez des questions concernant ces Conditions, veuillez nous contacter à'
    },
    mobile: {
        messages: 'Messages',
        settings: 'Paramètres',
        comingSoon: 'Bientôt disponible',
        messagesPlaceholder: 'Les messages et notifications apparaîtront ici.',
        settingsPlaceholder:
            'Les paramètres du compte et les préférences apparaîtront ici.',
        signIn: 'Se connecter',
        signInDescription: 'Connectez-vous pour gérer vos instances OpenClaw.',
        enterEmail: 'Adresse email',
        emailPlaceholder: 'exemple@clawhost.cloud',
        continueWithEmail: "Continuer avec l'email",
        otpDescription:
            'Nous vous enverrons un code pour vous connecter. Aucun mot de passe nécessaire.',
        sending: 'Envoi...',
        checkYourEmail: 'Vérifiez votre email',
        codeSentTo: 'Nous avons envoyé un code à 6 chiffres à',
        enterCode: 'Entrez le code reçu par email',
        resendCode: 'Renvoyer le code',
        resendIn: 'Renvoyer dans {{seconds}}s',
        changeEmail: "Changer d'email",
        invalidCode: 'Code invalide',
        codeExpired: 'Code expiré. Veuillez en demander un nouveau.',
        signingIn: 'Connexion en cours...',
        signOut: 'Se déconnecter',
        signedInAs: 'Connecté en tant que',
        loadMore: 'Charger plus',
        chatWithYourClaw: 'Discutez avec votre Claw',
        deployClaw: 'Déployer un Claw',
        deployYourFirstClaw: 'Déployez votre premier Claw'
    },
    productHunt: {
        liveOn: 'En direct sur',
        productHunt: 'Product Hunt',
        celebrate: 'Soutenez-nous & profitez de',
        discount: '10% de réduction',
        yourFirstMonth: 'sur votre premier mois',
        upvoteNow: 'Votez pour nous'
    },
    featureRequests: {
        title: 'Demandes de fonctionnalités',
        description:
            'Votez pour des fonctionnalités et suggérez-en de nouvelles.',
        subtitle:
            "Contribuez à façonner l'avenir d'OpenClaw en demandant et en votant pour des fonctionnalités.",
        submitRequest: 'Soumettre une demande',
        noRequestsYet: 'Aucune demande',
        noRequestsDescription: "Aucune demande de fonctionnalité n'a encore été soumise. Soyez le premier à partager vos idées.",
        statusAwaitingApproval: "En attente d'approbation",
        statusRequested: 'Demandée',
        statusMarkedForImplementation: 'Marquée pour implémentation',
        statusImplemented: 'Implémentée',
        sortByUpvotes: 'Plus votées',
        sortByNewest: 'Plus récentes',
        sortByStatus: 'Par statut',
        upvote: 'Voter',
        upvoted: 'Voté',
        signInToUpvote: 'Connectez-vous pour voter.',
        signInToSubmit: 'Connectez-vous pour soumettre une demande.',
        requestedBy: 'Demandée par',
        submitModalTitle: 'Soumettre une demande de fonctionnalité',
        submitModalDescription:
            'Décrivez la fonctionnalité souhaitée. Nos agents IA examineront et implémenteront les demandes approuvées.',
        featureTitle: 'Titre',
        featureTitlePlaceholder: 'Titre de la fonctionnalité',
        featureTitleMinLength:
            'Le titre doit contenir au moins {{min}} caractères.',
        featureTitleMaxLength:
            'Le titre doit contenir {{max}} caractères ou moins.',
        featureDescription: 'Description',
        featureDescriptionPlaceholder:
            "Décrivez la fonctionnalité souhaitée, le problème qu'elle résout et comment vous l'imaginez.",
        featureDescriptionMinLength:
            'La description doit contenir au moins {{min}} caractères.',
        featureDescriptionMaxLength:
            'La description doit contenir {{max}} caractères ou moins.',
        submitting: 'Envoi en cours...',
        submitted: 'Demande de fonctionnalité soumise.',
        failedToSubmit: 'Échec de la soumission de la demande !',
        requestLimitReached:
            'Vous avez atteint le maximum de {{limit}} demandes ouvertes.',
        agentBannerTitle: 'Propulsé par les agents OpenClaw',
        agentBannerDescription:
            'Les demandes sont examinées et développées par les agents OpenClaw hébergés sur ClawHost. Votez pour les fonctionnalités que vous souhaitez le plus.',
        changeStatus: 'Changer le statut',
        deleteRequest: 'Supprimer la demande',
        deleteConfirmation:
            'Êtes-vous sûr de vouloir supprimer cette demande ?',
        statusUpdated: 'Statut de la demande mis à jour.',
        failedToUpdateStatus: 'Échec de la mise à jour du statut !',
        deleted: 'Demande de fonctionnalité supprimée.',
        failedToDelete: 'Échec de la suppression !',
        upvoteToggled: 'Vote mis à jour.',
        failedToUpvote: 'Échec de la mise à jour du vote !',
        editModalTitle: 'Modifier la demande',
        editModalDescription:
            'Mettre à jour les détails et le statut de la demande.',
        updated: 'Demande de fonctionnalité mise à jour.',
        failedToUpdate: 'Échec de la mise à jour de la demande !',
        status: 'Statut',
        dontAskAgain: 'Ne plus demander lors de la suppression de demandes cette session',
        platforms: 'Plateformes',
        platformDesktop: 'Bureau',
        platformMobile: 'Mobile',
        platformWeb: 'Web',
        platformRequired: 'Sélectionnez au moins une plateforme'
    },
    compare: {
        title: 'Comparaison complète',
        description:
            "Découvrez comment ClawHost se compare aux autres plateformes d'hébergement OpenClaw.",
        badge: 'Comparaison',
        feature: 'Plateforme',
        lastUpdated: 'Dernière mise à jour : février 2026',
        competitorClawHost: 'ClawHost',
        competitorSimpleClaw: 'SimpleClaw',
        competitorMyClawAi: 'MyClaw.ai',
        categoryInfrastructure: 'Infrastructure',
        categoryPricing: 'Tarification & Facturation',
        categoryDeployment: 'Déploiement & Configuration',
        categoryManagement: 'Gestion OpenClaw',
        categorySecurity: 'Données & Sécurité',
        categoryMonitoring: 'Surveillance & Maintenance',
        categorySupport: 'Support & Plateforme',
        featureServerOwnership: 'Propriété du serveur',
        featureProviderChoice: 'Choix du fournisseur cloud',
        featureDedicatedResources: 'Ressources dédiées',
        featureRootAccess: 'Accès root/SSH complet',
        featureServerLocations: 'Emplacements des serveurs',
        featureStartingPrice: 'Prix de départ',
        featureTransparentPricing: 'Tarification transparente',
        featurePowerfulServers: 'Serveurs puissants, prix réduit',
        featureLocationSelection: "Choisir l'emplacement du serveur",
        featureSubdomainAccess: 'Accès par sous-domaine',
        featureThemes: 'Thèmes clair et sombre',
        featureSetupTime: 'Temps de configuration',
        featureTechnicalSkill: 'Compétences techniques requises',
        featureOneClickDeploy: 'Déploiement en un clic',
        featureMultipleInstances: 'Instances multiples',
        featureMultipleAgents: 'Agents multiples par instance',
        featureSkillsMarketplace: 'Marketplace de compétences',
        featureChannelSupport: 'Support des canaux',
        featureAgentConfig: 'Configuration des agents',
        featureDataOwnership: 'Propriété complète des données',
        featureDataExport: 'Export des données',
        featureBackups: 'Sauvegardes',
        featureSecurityHardening: 'Renforcement de la sécurité',
        featureSslTls: 'SSL/TLS',
        featureOpenSource: 'Open source',
        featureAutoUpdates: 'Mises à jour automatiques',
        featureDiagnostics: 'Diagnostics en temps réel',
        featureLogStreaming: 'Streaming des journaux',
        featureRepairTools: 'Outils de réparation',
        featureSupportChannels: 'Canaux de support',
        featureMultiLanguage: 'Interface multilingue',
        featureMobileApp: 'Application mobile',
        featureDesktopApp: 'Application de bureau',
        featureSocials: 'Réseaux sociaux',
        dedicatedVps: 'VPS dédié',
        sharedContainers: 'Conteneurs partagés',
        isolatedContainers: 'Conteneurs isolés',
        threeProviders: 'Hetzner, DigitalOcean, Vultr',
        singleProvider: 'Fournisseur unique',
        fullyDedicated: 'Entièrement dédié',
        shared: 'Partagé',
        fullRootSsh: 'Root + SSH complet',
        noAccess: "Pas d'accès",
        thirtyPlusLocations: '30+ emplacements',
        limitedLocations: 'Limité',
        fromTenMonth: 'À partir de 10 $/mois',
        aboutFortyFourMonth: '~44 $/mois en moyenne',
        fromNineteenMonth: '19–79 $/mois',
        clearSpecsPricing: 'Spécifications et prix clairs',
        unclearPricing: 'Tarification floue',
        fixedTiers: '3 niveaux fixes',
        minutes: 'Minutes',
        underOneMinute: "Moins d'une minute",
        thirtySeconds: '30 secondes',
        noneRequired: 'Aucune',
        minimal: 'Minimal',
        unlimited: 'Illimité',
        singleInstance: 'Unique',
        fiveThousandSkills: '5 000+ compétences (ClawHub)',
        noMarketplace: 'Pas de marketplace',
        allChannels: 'WhatsApp, Telegram, Discord, Slack, Signal',
        telegramDiscord: 'Telegram, Discord',
        discordGithubSlack: 'Discord, GitHub, Slack',
        fullConfig: 'Configuration complète',
        limitedConfig: 'Limitée',
        zipExport: 'Export ZIP',
        noExport: "Pas d'export",
        volumeStorage: 'Stockage en volumes',
        noBackups: 'Pas de sauvegardes',
        dailyBackups: 'Sauvegardes quotidiennes',
        included: 'Inclus',
        notIncluded: 'Non inclus',
        managed: 'Géré',
        manual: 'Manuel',
        liveMonitoring: 'Surveillance en direct',
        liveLogs: 'Journaux en direct',
        oneClickRepair: 'Réparation en un clic',
        emailGithub: 'Email, GitHub',
        communityOnly: 'Communauté uniquement',
        prioritySupport: 'Support 24/7 (Pro+)',
        fourLanguages: '4 langues',
        englishOnly: 'Anglais uniquement',
        available: 'Disponible',
        comingSoon: 'Bientôt disponible',
        notAvailable: 'Non disponible',
        disclaimer: 'Quelque chose a changé ou est incorrect ? Écrivez-nous à',
        disclaimerOr: 'ou ouvrez une pull request sur',
        github: 'GitHub',
        ctaTitle: 'Prêt à voir la différence ?',
        ctaDescription:
            'Déployez OpenClaw sur votre propre serveur dédié. Propriété complète, tarification transparente et prêt en minutes.'
    }
} as const

export default fr
