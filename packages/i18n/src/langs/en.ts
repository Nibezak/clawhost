export const en = {
    common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        create: 'Create',
        done: 'Done',
        copy: 'Copy',
        copied: 'Copied!',
        copiedWithLabel: '{{label}} copied!',
        tryAgain: 'Try again',
        addKey: 'Add Key',
        close: 'Close',
        none: 'None',
        unknown: 'Unknown'
    },
    nav: {
        claws: 'Claws',
        sshKeys: 'SSH Keys',
        account: 'Account',
        signOut: 'Sign out',
        login: 'Login',
        deployOpenClaw: 'Deploy OpenClaw'
    },
    footer: {
        copyright: 'ClawHost. All rights reserved.',
        termsOfService: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
        getInTouch: 'Get in Touch',
        brandDescription:
            'Deploy OpenClaw on your own VPS with one click. Full privacy, dedicated resources, no shared infrastructure.',
        builtBy: 'Built by',
        supportedBy: 'Supported by',
        product: 'Product',
        howItWorks: 'How it Works',
        features: 'Features',
        pricing: 'Pricing',
        faq: 'FAQ',
        legalAndMore: 'Legal & More',
        documentation: 'Documentation'
    },
    errors: {
        somethingWentWrong: 'Something went wrong',
        couldNotLoadData: "We couldn't load the data. Please try again.",
        notFound: 'Page not found',
        pageNotFoundDescription:
            "The page you're looking for doesn't exist or has been moved.",
        goToHomepage: 'Go to Homepage',
        failedToLoadClaws: 'Failed to load claws',
        failedToLoadClawsDescription:
            "We couldn't load your Claws. Please check your connection and try again.",
        failedToLoadSSHKeys: 'Failed to load SSH keys',
        failedToLoadSSHKeysDescription:
            "We couldn't load your SSH keys. Please check your connection and try again.",
        failedToUpdateProfile: 'Failed to update profile.',
        failedToAddSSHKey: 'Failed to add SSH key.',
        failedToCreateClaw: 'Failed to create claw.',
        failedToGenerateKeyPair:
            'Failed to generate key pair. Please generate keys locally instead.',
        unableToLoadPricing: 'Unable to load pricing. Please try again later.',
        noPasswordAvailable: 'No password available for this claw.'
    },
    auth: {
        signIn: 'Sign In',
        signingIn: 'Signing In',
        signingYouIn: 'Signing you in',
        loggingInAs: 'Logging in as',
        checkYourEmail: 'Check Your Email',
        checkYourEmailHeading: 'Check your email',
        sentLoginLink: 'We sent a login link to',
        clickLinkToSignIn:
            'Click the link in the email to sign in. You can close this tab.',
        signInToDeployOpenClaw: 'Sign in to deploy OpenClaw',
        emailAddress: 'Email address',
        emailPlaceholder: 'you@example.com',
        continueWithEmail: 'Continue with Email',
        sending: 'Sending...',
        magicLinkDescription:
            "We'll send you a magic link to sign in. No password needed.",
        welcomeBack: 'Welcome back.'
    },
    account: {
        title: 'Account',
        accountSettings: 'Account Settings',
        manageYourAccount: 'Manage your account information',
        profileInformation: 'Profile Information',
        noNameSet: 'No name set',
        joined: 'Joined',
        claws: 'claws',
        displayName: 'Display Name',
        enterYourName: 'Enter your name',
        profileUpdatedSuccessfully: 'Profile updated successfully!'
    },
    dashboard: {
        title: 'Claws',
        claw: 'claw',
        clawsPlural: 'claws',
        newClaw: 'New Claw',
        noClawsYet: 'No Claws yet',
        noClawsDescription:
            'Deploy OpenClaw on your first VPS and start browsing securely',
        deleteClaw: 'Delete Claw',
        deleteClawConfirmation: 'Are you sure you want to delete',
        actionCannotBeUndone: 'This action cannot be undone.',
        deleting: 'Deleting...',
        start: 'Start',
        stop: 'Stop',
        restart: 'Restart',
        copyPassword: 'Copy Password',
        copySshWithKey: 'Copy SSH (with key)',
        copySshWithPassword: 'Copy SSH (with password)',
        connect: 'Connect',
        sshCommandCopied: 'SSH command copied!',
        sshCommandWithPasswordCopied: 'SSH command with password copied!',
        passwordCopiedToClipboard: 'Password copied to clipboard!',
        plan: 'Plan',
        location: 'Location',
        ip: 'IP',
        domain: 'Domain',
        ipAddress: 'IP Address',
        monthlyCost: 'Monthly Cost',
        serverId: 'Server ID',
        created: 'Created',
        sshKey: 'SSH Key',
        storage: 'Storage',
        gatewayToken: 'Gateway Token',
        gatewayTokenDescription:
            'Use this token to authenticate with your gateway',
        status: {
            running: 'Running',
            stopped: 'Stopped',
            off: 'Off',
            starting: 'Starting...',
            stopping: 'Stopping...',
            creating: 'Creating...',
            initializing: 'Setting up...',
            migrating: 'Migrating...',
            rebuilding: 'Rebuilding...',
            deleting: 'Deleting...',
            unknown: 'Unknown'
        }
    },
    createClaw: {
        title: 'Create New Claw',
        description: 'Deploy OpenClaw on your own VPS',
        clawName: 'Claw Name',
        clawNamePlaceholder: 'my-server',
        location: 'Location',
        plan: 'Plan',
        advancedOptions: 'Advanced Options',
        rootPassword: 'Root Password',
        rootPasswordPlaceholder: 'Enter password or generate one',
        autoGeneratePasswordHint:
            'Leave empty to auto-generate a secure password',
        sshKeyOptional: 'SSH Key (Optional)',
        noSshKeyPasswordOnly: 'No SSH key (password only)',
        noSshKeysConfigured: 'No SSH keys configured',
        addSshKeyForPasswordlessLogin: 'Add an SSH key for passwordless login',
        additionalStorageOptional: 'Additional Storage (Optional)',
        volumeStorage: 'Volume Storage',
        vpsServer: 'VPS Server',
        openClawPreinstalled: 'OpenClaw Pre-installed',
        storageWithSize: 'Storage',
        totalMonthly: 'Total monthly',
        creating: 'Creating...',
        clawCreated: 'Claw Created!',
        assigning: 'Assigning...',
        rootPasswordSaveThis: 'Root Password (save this!)',
        sshCommandUsingKey: 'SSH Command (using your key)',
        sshCommandWithPassword: 'SSH Command (with password)',
        passwordCopied: 'Password copied!'
    },
    sshKeys: {
        title: 'SSH Keys',
        description: 'Manage SSH keys for passwordless login to your instances',
        addSshKey: 'Add SSH Key',
        howSshKeysWork: 'How SSH keys work',
        step1: 'Generate an SSH key pair on your computer (or use an existing one)',
        step2: 'Add the public key here',
        step3: 'Select the key when creating a new instance',
        step4: 'Connect with',
        step4Command: 'ssh root@your-server-ip',
        step4Suffix: '- no password needed!',
        noSshKeysYet: 'No SSH keys yet',
        noSshKeysDescription:
            'Add an SSH key to enable passwordless login to your instances',
        deleteConfirmation: 'Are you sure you want to delete this SSH key?',
        sshKeyAddedSuccessfully: 'SSH key added successfully!',
        addSshKeyModalTitle: 'Add SSH Key',
        addSshKeyModalDescription:
            'Add an SSH key for passwordless authentication',
        iHaveAnSshKey: 'I have an SSH key',
        generateNewKey: 'Generate new key',
        name: 'Name',
        namePlaceholder: 'My MacBook',
        publicKey: 'Public Key',
        publicKeyPlaceholder: 'ssh-rsa AAAA... or ssh-ed25519 AAAA...',
        publicKeyHint: 'Find your public key at',
        publicKeyPath1: '~/.ssh/id_ed25519.pub',
        publicKeyPath2: '~/.ssh/id_rsa.pub',
        dontHaveSshKey: "Don't have an SSH key? Generate one:",
        sshKeygenCommand: 'ssh-keygen -t ed25519 -C "your-email@example.com"',
        adding: 'Adding...',
        keyName: 'Key Name',
        keyNamePlaceholder: 'My Generated Key',
        importantAfterGenerating:
            'After generating, you must download and save your private key. We cannot recover it if you lose it!',
        generateKeyPair: 'Generate Key Pair',
        orGenerateLocallyRecommended: 'Or generate locally (recommended)',
        runThisInYourTerminal: 'Run this in your terminal:',
        thenSwitchToIHave:
            'Then switch to "I have an SSH key" and paste the public key.',
        savePrivateKeyNow:
            'Save your private key NOW! Download it before closing this dialog. You will not be able to see it again.',
        privateKeyKeepSecret: 'Private Key (keep secret!)',
        downloadPrivateKey: 'Download Private Key',
        publicKeyWillBeSaved: 'Public Key (will be saved)',
        savePublicKey: 'Save Public Key',
        saving: 'Saving...'
    },
    landing: {
        badge: '100+ OpenClaw instances Deployed',
        heroTitle1: 'Deploy OpenClaw.',
        heroTitle2: 'One click. Done.',
        heroDescription:
            'Production-ready infrastructure with one-click OpenClaw deployment, handled end to end — build, ship, and move faster with AI.',
        goToClaws: 'Go to Claws',
        selfHost: 'Open Source',
        startingPrice: 'Starting',
        locations: 'Locations',
        zeroConfig: 'Zero Config',
        dashboardPreviewTitle: 'Claws',
        dashboardPreviewSubtitle: '4 added claws',
        deployNew: 'Deploy New',
        running: 'Running',
        latency: 'latency',
        howItWorks: 'How it Works',
        threeStepsToPrivacy: 'Three steps to privacy',
        howItWorksDescription:
            'From zero to fully encrypted connection in under a minute',
        step1Title: 'Choose your VPS',
        step1Description:
            'Pick from 10+ global locations. We spin up a dedicated VPS just for you in seconds.',
        step2Title: 'We configure OpenClaw',
        step2Description:
            'OpenClaw is automatically installed and configured. No manual setup required.',
        step3Title: 'Configure & Use',
        step3Description:
            'Access OpenClaw via your custom subdomain, configure it how you want, and start using it.',
        features: 'Features',
        whyClawHost: 'Why ClawHost over self-hosting?',
        featuresDescription:
            'All the benefits of your own VPN, without the hassle of manual server configuration.',
        zeroConfig: 'Zero Config',
        zeroConfigDescription:
            'Skip hours of server setup. OpenClaw is pre-installed and ready in under 60 seconds.',
        ownedData: '100% Owned Data',
        ownedDataDescription:
            'Your own VPS, your data. No shared infrastructure, no logs, no third parties.',
        fullSpeed: 'Full Speed',
        fullSpeedDescription:
            'Dedicated VPS resources mean no throttling. Get the full bandwidth of your server.',
        globalLocations: 'Global Locations',
        globalLocationsDescription:
            'Deploy OpenClaw in 10+ regions. Choose the location that works best for you.',
        fullSshAccess: 'Full SSH Access',
        fullSshAccessDescription:
            'Root access to your VPS. Install anything, customize everything.',
        secure: 'Secure',
        secureDescription:
            'Protected against SSL vulnerabilities, malware, and common security threats by default.',
        payAsYouGo: 'Pay As You Go',
        payAsYouGoDescription:
            'Hourly billing means you only pay for what you use. No contracts, cancel anytime.',
        customSubdomains: 'Custom Subdomains',
        customSubdomainsDescription:
            'Access your OpenClaw from anywhere with your own custom subdomain.',
        autoUpdates: 'Auto-Updates',
        autoUpdatesDescription:
            'We handle all updates and maintenance. Your OpenClaw stays secure and up-to-date automatically.',
        testimonials: 'Testimonials',
        whatPeopleSay: 'What people say',
        testimonialsDescription:
            "Join thousands who've taken control of their privacy",
        testimonial1Quote:
            "Finally, a VPN I actually own. Setup took 30 seconds and I've been running it for months without issues.",
        testimonial1Author: 'Alex Chen',
        testimonial1Role: 'Software Developer',
        testimonial2Quote:
            "Switched from NordVPN. Way faster speeds since I'm not sharing with thousands of other users.",
        testimonial2Author: 'Maria Santos',
        testimonial2Role: 'Digital Nomad',
        testimonial3Quote:
            "The one-click deploy is legit. I'm not technical at all but got my VPN running in under a minute.",
        testimonial3Author: 'James Wilson',
        testimonial3Role: 'Freelancer',
        testimonial4Quote:
            "Love that I can see exactly what's running on my server. Total transparency, unlike commercial VPNs.",
        testimonial4Author: 'Sophie Kim',
        testimonial4Role: 'Privacy Advocate',
        pricing: 'Pricing',
        simpleTransparentPricing: 'Simple, transparent pricing',
        pricingDescription:
            'Pay only for what you use. All plans include OpenClaw pre-installed',
        planColumn: 'Plan',
        vCpuColumn: 'vCPU',
        ramColumn: 'RAM',
        storageColumn: 'Storage',
        hourlyColumn: 'Hourly',
        monthlyColumn: 'Monthly',
        recommended: 'Recommended',
        perHour: '/hr',
        perMonth: '/mo',
        deploy: 'Deploy',
        select: 'Select',
        openClawPreinstalled: 'OpenClaw pre-installed',
        unlimitedBandwidth: 'Unlimited bandwidth',
        rootSshAccess: 'Root SSH access',
        hourlyBilling: 'Hourly billing',
        cancelAnytime: 'Cancel anytime',
        faqTitle: 'FAQ',
        frequentlyAskedQuestions: 'Frequently asked questions',
        faqDescription: 'Everything you need to know about deploying OpenClaw',
        faq1Question: 'What is ClawHost?',
        faq1Answer:
            'ClawHost lets you deploy OpenClaw — a pre-configured VPN — onto your own dedicated VPS with one click. Pick a location, and your OpenClaw server is live and ready to connect in under 60 seconds.',
        faq2Question: 'What is OpenClaw?',
        faq2Answer:
            "OpenClaw is a plug-and-play VPN solution built on WireGuard. It's pre-configured for security and performance, so you don't need to manually set up anything. Just deploy and connect.",
        faq3Question: 'How is this different from NordVPN or ExpressVPN?',
        faq3Answer:
            'Commercial VPNs share servers with thousands of users. With ClawHost, you deploy OpenClaw on your own VPS — dedicated resources, full control, no logs, no third parties.',
        faq4Question: 'Do I need technical knowledge?',
        faq4Answer:
            "Not at all. Just click deploy, pick a location, and we handle everything. You'll get a WireGuard config file that works with any WireGuard client on any device — just import and connect.",
        faq5Question: 'What locations are available?',
        faq5Answer:
            'We offer 10+ VPS locations worldwide including US, Europe, Asia, and more. You can deploy OpenClaw on multiple servers in different regions if needed.',
        faq6Question: 'How much does it cost?',
        faq6Answer:
            "Pricing starts at $25/month which includes the VPS cost plus the $20 OpenClaw pre-installation fee. You're billed hourly so you only pay for what you use. Destroy your server anytime.",
        faq7Question: 'Can I access my server directly?',
        faq7Answer:
            'Yes! You get full root SSH access to your VPS. Install additional software, customize configurations, or use it for other purposes beyond OpenClaw.',
        readyToOwnYourPrivacy: 'Ready to own your privacy?',
        ctaDescription:
            "Join thousands who've deployed their own VPN with ClawHost. No technical skills required — just one click.",
        deployOpenClawNow: 'Deploy OpenClaw Now',
        selfHostInstead: 'Self Host Instead',
        noCreditCardRequired: 'No credit card required',
        deployIn60Seconds: 'Deploy in 60 seconds'
    }
} as const

export type Translations = typeof en
