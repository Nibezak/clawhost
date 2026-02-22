import type { Translations } from '../types'

const es: Translations = {
    common: {
        loading: 'Cargando...',
        save: 'Guardar',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        delete: 'Eliminar',
        deleting: 'Eliminando...',
        back: 'Volver',
        create: 'Crear',
        done: 'Listo',
        copy: 'Copiar',
        copied: 'Copiado.',
        copiedWithLabel: '{{label}} copiado.',
        show: 'Mostrar',
        hide: 'Ocultar',
        tryAgain: 'Intentar de nuevo',
        addKey: 'Agregar clave',
        close: 'Cerrar',
        none: 'Ninguno',
        all: 'Todos',
        unknown: 'Desconocido',
        pageNotFound: 'Página no encontrada',
        closeNotification: 'Cerrar notificación',
        beta: 'Beta',
        brandName: 'ClawHost',
        legalEmail: 'legal@clawhost.cloud'
    },
    setup: {
        welcomeTitle: 'Bienvenido a ClawHost Go',
        welcomeDescription: 'Configura tu perfil para comenzar.',
        whatsYourName: '¿Cómo te llamas?',
        namePlaceholder: 'Ingresa tu nombre',
        nameHint: 'Siempre puedes configurarlo más tarde.',
        getStarted: 'Comenzar'
    },
    language: {
        en: 'English',
        fr: 'Français',
        es: 'Español',
        de: 'Deutsch',
        switchLanguage: 'Idioma'
    },
    theme: {
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema',
        toggleTheme: 'Cambiar tema'
    },
    nav: {
        claws: 'Claws',
        playground: 'Playground',
        sshKeys: 'Claves SSH',
        account: 'Cuenta',
        billing: 'Facturación',
        signOut: 'Cerrar sesión',
        admin: 'Admin',
        login: 'Acceder',
        deploy: 'Desplegar',
        deployOpenClaw: 'Desplegar OpenClaw',
        mainNavigation: 'Navegacion principal',
        toggleMenu: 'Alternar menu'
    },
    footer: {
        website: 'Sitio web',
        copyright: 'ClawHost. Todos los derechos reservados.',
        termsOfService: 'Términos de servicio',
        privacyPolicy: 'Política de privacidad',
        getInTouch: 'Contáctanos',
        brandDescription:
            'Despliega OpenClaw en tu propio VPS con un solo clic. Privacidad total, recursos dedicados, sin infraestructura compartida.',
        builtBy: 'Creado por',
        supportedBy: 'Apoyado por',
        product: 'Producto',
        howItWorks: 'Proceso',
        features: 'Funciones',
        pricing: 'Precios',
        faq: 'Preguntas',
        blog: 'Blog',
        changelog: 'Historial de cambios',
        featureRequests: 'Solicitudes de funciones',
        compare: 'Comparación completa',
        legalAndMore: 'Otros',
        documentation: 'Documentación',
        productDescription:
            'Infraestructura lista para producción con despliegue de OpenClaw en un clic, gestionado de principio a fin — construye, lanza y avanza más rápido con IA.'
    },
    errors: {
        somethingWentWrong: '¡Algo salió mal!',
        couldNotLoadData:
            'No pudimos cargar los datos. Por favor, intenta de nuevo.',
        notFound: 'Página no encontrada.',
        pageNotFoundDescription:
            'La página que buscas no existe o ha sido movida.',
        goToHomepage: 'Ir al inicio',
        failedToLoadClaws: 'Error al cargar los claws.',
        failedToLoadClawsDescription:
            'No pudimos cargar tus Claws. Por favor, verifica tu conexión e intenta de nuevo.',
        failedToLoadSSHKeys: 'Error al cargar las claves SSH.',
        failedToLoadSSHKeysDescription:
            'No pudimos cargar tus claves SSH. Por favor, verifica tu conexión e intenta de nuevo.',
        failedToUpdateProfile: 'Error al actualizar el perfil.',
        failedToAddSSHKey: 'Error al agregar la clave SSH.',
        failedToCreateClaw: 'Error al crear el claw.',
        failedToLoadLocations:
            'Error al cargar las ubicaciones. Por favor, intenta de nuevo.',
        failedToLoadPlans:
            'Error al cargar los planes. Por favor, intenta de nuevo.',
        invalidPlan: 'Plan seleccionado no válido.',
        invalidLocation: 'Por favor, selecciona una ubicación.',
        failedToGenerateKeyPair:
            'Error al generar el par de claves. Por favor, genera las claves localmente.',
        unableToLoadPricing:
            'No se pudieron cargar los precios. Por favor, intenta más tarde.',
        noPasswordAvailable: 'No hay contraseña disponible para este claw.',
        clawLimitReached:
            'Has alcanzado el límite de 50 claws. Por favor, contacta a soporte para aumentar este límite.',
        sshKeyLimitReached:
            'Has alcanzado el límite de 50 claves SSH. Por favor, contacta a soporte para aumentar este límite.'
    },
    api: {
        missingRequiredFields: 'Faltan campos obligatorios.',
        clawNotFound: 'Claw no encontrado.',
        clawRenamed: 'Claw renombrado con éxito.',
        invalidClawName:
            'El nombre del claw debe tener entre 1 y 50 caracteres.',
        userNotFound: 'Usuario no encontrado.',
        sshKeyNotFound: 'Clave SSH no encontrada.',
        pendingClawNotFound: 'Claw pendiente no encontrado.',
        clawNotScheduledForDeletion:
            'El claw no está programado para eliminación.',
        clawLimitReached:
            'Has alcanzado el límite de 50 claws. Por favor, contacta a soporte para aumentar este límite.',
        sshKeyLimitReached:
            'Has alcanzado el límite de 50 claves SSH. Por favor, contacta a soporte para aumentar este límite.',
        volumeSizeInvalid:
            'El tamaño del volumen debe ser entre 10 y 10240 GB.',
        paymentNotConfigured: 'El pago no está configurado para este plan.',
        invalidSshKeyFormat: 'Formato de clave pública SSH no válido.',
        sshKeyInUse:
            'Esta clave SSH está siendo utilizada por uno o más claws.',
        inputTooLong: 'La entrada excede la longitud máxima permitida.',
        invalidEnvVars: 'Nombres o valores de variables de entorno no válidos.',
        invalidEmailFormat: 'Formato de correo electrónico no válido.',
        plusAddressingNotAllowed:
            'No se permite el uso del signo + en el correo electrónico para iniciar sesión.',
        invalidRedirectUrl: 'URL de redirección no válida.',
        fileTooLarge:
            'El contenido del archivo excede el tamaño máximo permitido.',
        nameAndKeyRequired: 'El nombre y la clave pública son obligatorios.',
        nameTooLong: 'El nombre debe tener 100 caracteres o menos.',
        noBillingAccount: 'No se encontró cuenta de facturación.',
        orderIdRequired: 'El ID de orden es obligatorio.',
        orderNotFound: 'Orden no encontrada.',
        emailRequired: 'El correo electrónico es obligatorio.',
        redirectUrlRequired: 'La URL de redirección es obligatoria.',
        invalidWebhook: 'Webhook no válido.',
        failedToStartClaw: 'Error al iniciar el claw.',
        failedToStopClaw: 'Error al detener el claw.',
        failedToRestartClaw: 'Error al reiniciar el claw.',
        failedToDeleteClaw: 'Error al eliminar el claw.',
        failedToCreateClaw: 'Error al crear el claw.',
        invalidProvider: 'Proveedor no válido.',
        invalidPlan: 'Plan seleccionado no válido.',
        planBelowMinimumMemory:
            'Este plan no cumple con el requisito mínimo de memoria.',
        invalidLocation: 'Ubicación seleccionada no válida.',
        failedToSyncClaw: 'Error al sincronizar el estado del servidor.',
        failedToProvisionClaw: 'Error al aprovisionar el claw.',
        failedToInitiatePurchase: 'Error al iniciar la compra.',
        failedToCancelDeletion: 'Error al cancelar la eliminación.',
        failedToHardDeleteClaw: 'Error al eliminar el claw permanentemente.',
        failedToCancelScheduledDeletion:
            'Error al cancelar la eliminación programada.',
        failedToCreateSshKey: 'Error al crear la clave SSH.',
        failedToDeleteSshKey: 'Error al eliminar la clave SSH.',
        failedToUpdateProfile: 'Error al actualizar el perfil.',
        failedToGetProfile: 'Error al obtener el perfil.',
        failedToGetInvoice: 'Error al obtener la factura.',
        failedToGetCustomerPortal: 'Error al obtener el portal del cliente.',
        failedToGetBillingHistory:
            'Error al obtener el historial de facturación.',
        failedToGetStats: 'Error al obtener las estadísticas.',
        failedToFetchLocations: 'Error al obtener las ubicaciones.',
        failedToFetchPlans: 'Error al obtener los planes.',
        failedToFetchVolumePricing: 'Error al obtener los precios de volumen.',
        failedToFetchPlanAvailability:
            'Error al obtener la disponibilidad del plan.',
        failedToSendEmail: 'Error al enviar el correo electrónico.',
        failedToGetVersion: 'Error al obtener la versión.',
        failedToGetVersions: 'Error al obtener las versiones.',
        failedToInstallVersion: 'Error al instalar la versión.',
        installVersionSuccess: 'Versión instalada con éxito.',
        invalidVersion: 'Formato de versión inválido.',
        outdatedVersion: 'Esta versión es obsoleta y no se puede instalar.',
        failedToGetDiagnostics: 'Error al conectar con la instancia.',
        failedToGetDiagnosticsDescription:
            'No se pudieron obtener los diagnósticos. La instancia puede estar fuera de línea o iniciando.',
        failedToGetLogs: 'Error al cargar los registros.',
        failedToGetLogsDescription:
            'No se pudieron obtener los registros de esta instancia. Por favor, intenta más tarde.',
        failedToRepairClaw: 'Error al reparar la instancia.',
        repairSuccess: 'Instancia reparada exitosamente.',
        repairGatewayNotResponding:
            'Reparación aplicada pero el gateway aún no responde. Puede necesitar más tiempo para iniciar.',
        failedToReinstallClaw: 'Error al reinstalar la instancia.',
        reinstallSuccess: 'Instancia reinstalada exitosamente.',
        reinstallGatewayNotResponding:
            'Reinstalación completada pero el gateway aún no responde. Puede necesitar más tiempo para iniciar.',
        failedToExportClaw: 'Error al exportar los datos del claw.',
        clawNotReady: 'El claw no está listo para exportar.',
        exportRateLimited:
            'Este claw fue exportado recientemente. Por favor, espera antes de exportar de nuevo.',
        failedToListFiles: 'Error al listar los archivos de la instancia.',
        failedToReadFile: 'Error al leer el archivo.',
        failedToUpdateFile: 'Error al guardar el archivo.',
        invalidFilePath: 'Ruta de archivo no válida.',
        fileNotEditable: 'Este tipo de archivo no se puede editar.',
        invalidJsonConfig: 'JSON no válido.',
        fileSaveSuccess: 'Archivo guardado.',
        rateLimitExceeded: 'Por favor, espera antes de solicitar otro código.',
        otpExpiredOrNotFound:
            'Código expirado o no encontrado. Por favor, solicita uno nuevo.',
        otpMaxAttemptsReached:
            'Demasiados intentos fallidos. Por favor, solicita un nuevo código.',
        otpInvalidCode: 'Código no válido. Por favor, intenta de nuevo.',
        internalServerError: 'Ocurrió un error interno.',
        invalidCredentials: 'Credenciales no válidas.',
        accountLinked: 'Cuenta vinculada correctamente.',
        webhookProcessingFailed: 'Error al procesar el webhook.',
        adminAccessDenied: 'Se requiere acceso de administrador.',
        clawsFetched: 'Claws obtenidos exitosamente.',
        clawFetched: 'Claw obtenido exitosamente.',
        clawSynced: 'Claw sincronizado exitosamente.',
        clawStarted: 'Claw iniciado exitosamente.',
        clawStopped: 'Claw detenido exitosamente.',
        clawRestarted: 'Claw reiniciado exitosamente.',
        clawCreated: 'Claw creado exitosamente.',
        clawDeleted: 'Claw eliminado exitosamente.',
        clawDeletionScheduled: 'Eliminación del claw programada.',
        clawDeletionCancelled: 'Eliminación del claw cancelada.',
        clawHardDeleted: 'Claw eliminado permanentemente.',
        clawPurchaseInitiated: 'Compra iniciada exitosamente.',
        sshKeysFetched: 'Claves SSH obtenidas exitosamente.',
        sshKeyCreated: 'Clave SSH creada exitosamente.',
        sshKeyDeleted: 'Clave SSH eliminada exitosamente.',
        profileFetched: 'Perfil obtenido exitosamente.',
        profileUpdated: 'Perfil actualizado exitosamente.',
        statsFetched: 'Estadísticas obtenidas exitosamente.',
        billingHistoryFetched:
            'Historial de facturación obtenido exitosamente.',
        invoiceFetched: 'Factura obtenida exitosamente.',
        customerPortalFetched:
            'URL del portal del cliente obtenida exitosamente.',
        plansFetched: 'Planes obtenidos exitosamente.',
        locationsFetched: 'Ubicaciones obtenidas exitosamente.',
        volumePricingFetched: 'Precios de volumen obtenidos exitosamente.',
        planAvailabilityFetched:
            'Disponibilidad del plan obtenida exitosamente.',
        agentsFetched: 'Agentes obtenidos exitosamente.',
        agentsFetchFailed:
            'No se pudo conectar con la instancia para obtener los agentes.',
        agentConfigFetched: 'Configuración del agente obtenida exitosamente.',
        agentConfigUpdated:
            'Configuración del agente actualizada exitosamente.',
        agentConfigUpdateFailed:
            'No se pudo actualizar la configuración del agente.',
        agentCreated: 'Agente creado exitosamente.',
        agentCreateFailed: 'No se pudo crear el agente en la instancia.',
        agentDeleted: 'Agente eliminado exitosamente.',
        agentDeleteFailed: 'No se pudo eliminar el agente de la instancia.',
        cannotDeleteMainAgent: 'No se puede eliminar el único agente restante.',
        agentNameInvalid:
            'El nombre del agente solo puede contener letras, números y guiones.',
        agentNameDuplicate: 'Ya existe un agente con este nombre.',
        diagnosticsFetched: 'Diagnósticos obtenidos exitosamente.',
        logsFetched: 'Registros obtenidos exitosamente.',
        filesFetched: 'Archivos obtenidos exitosamente.',
        fileFetched: 'Archivo obtenido exitosamente.',
        otpSent: 'Código enviado exitosamente.',
        otpVerified: 'Código verificado exitosamente.',
        webhookReceived: 'Webhook recibido.',
        unauthorized: 'No autorizado.',
        invalidToken: 'Token no válido.',
        notFound: 'No encontrado.',
        healthOk: 'La API está funcionando.',
        channelsFetched: 'Canales obtenidos exitosamente.',
        channelsUpdated: 'Canales actualizados exitosamente.',
        channelsUpdateFailed: 'No se pudieron actualizar los canales.',
        channelsFetchFailed: 'No se pudieron obtener los canales.',
        channelMissingRequired:
            'Faltan campos obligatorios para el canal habilitado.',
        whatsappPairStarted: 'Emparejamiento de WhatsApp iniciado.',
        whatsappPairFailed: 'Error al emparejar WhatsApp.',
        whatsappAlreadyPaired: 'WhatsApp ya está emparejado.',
        whatsappUnsupported:
            'Esta instancia aún no soporta el emparejamiento de WhatsApp.',
        bindingsFetched: 'Vinculaciones obtenidas exitosamente.',
        bindingsFetchFailed: 'No se pudieron obtener las vinculaciones.',
        bindingsUpdated: 'Vinculaciones actualizadas exitosamente.',
        bindingsUpdateFailed: 'No se pudieron actualizar las vinculaciones.',
        bindingsInvalidFormat: 'Formato de vinculación inválido.',
        bindingsInvalidChannel: 'Canal no soportado en la vinculación.',
        bindingsDuplicateChannel:
            'Un canal solo puede estar vinculado a un agente.',
        skillsFetched: 'Habilidades obtenidas exitosamente.',
        skillsUpdated: 'Habilidades actualizadas exitosamente.',
        skillsUpdateFailed: 'No se pudieron actualizar las habilidades.',
        skillsFetchFailed: 'No se pudieron obtener las habilidades.',
        agentSkillsFetched: 'Habilidades del agente obtenidas exitosamente.',
        agentSkillsUpdated: 'Habilidades del agente actualizadas exitosamente.',
        agentSkillsUpdateFailed:
            'No se pudieron actualizar las habilidades del agente.',
        agentSkillsFetchFailed:
            'No se pudieron obtener las habilidades del agente.',
        invalidSkillName:
            'El nombre de la habilidad solo puede contener letras, números, guiones y guiones bajos.',
        skillNotFound: 'Habilidad no encontrada.',
        clawHubSearchSuccess: 'Búsqueda en ClawHub completada.',
        clawHubSearchFailed: 'No se pudo buscar en ClawHub.',
        clawHubFetched: 'Habilidades de ClawHub obtenidas.',
        clawHubFetchFailed:
            'No se pudieron obtener las habilidades de ClawHub.',
        clawHubInstalled: 'Habilidad instalada desde ClawHub.',
        clawHubInstallFailed: 'No se pudo instalar la habilidad desde ClawHub!',
        clawHubRemoved: 'Habilidad de ClawHub eliminada.',
        clawHubRemoveFailed: 'No se pudo eliminar la habilidad de ClawHub!',
        clawHubUpdated: 'Habilidad actualizada.',
        clawHubUpdateFailed: 'No se pudo actualizar la habilidad de ClawHub!',
        clawHubUpdatesFetched: 'Verificación de actualizaciones completada.',
        clawHubUpdatesFailed: 'No se pudieron verificar las actualizaciones.',
        invalidAuthMethod: 'Método de autenticación no válido.',
        authMethodNotConnected:
            'Este método de autenticación no está conectado.',
        authMethodConnected: 'Método de autenticación conectado exitosamente.',
        authMethodDisconnected:
            'Método de autenticación desconectado exitosamente.',
        failedToConnectAuthMethod:
            'Error al conectar el método de autenticación.',
        failedToDisconnectAuthMethod:
            'Error al desconectar el método de autenticación.',
        featureRequestsFetched:
            'Solicitudes de funcionalidades obtenidas con éxito.',
        featureRequestCreated: 'Solicitud de funcionalidad creada con éxito.',
        featureRequestUpvoted: 'Voto actualizado.',
        featureRequestStatusUpdated: 'Estado de la solicitud actualizado.',
        featureRequestDeleted: 'Solicitud de funcionalidad eliminada.',
        failedToCreateFeatureRequest: 'Error al crear la solicitud!',
        failedToUpvoteFeatureRequest: 'Error al actualizar el voto!',
        failedToUpdateFeatureRequestStatus: 'Error al actualizar el estado!',
        failedToDeleteFeatureRequest: 'Error al eliminar la solicitud!',
        featureRequestNotFound: 'Solicitud de funcionalidad no encontrada!',
        featureRequestLimitReached:
            'Has alcanzado el máximo de {{limit}} solicitudes abiertas!',
        featureRequestTotalLimitReached:
            'El tablero de solicitudes está lleno ({{limit}} solicitudes). Por favor espera a que se resuelvan las solicitudes existentes!',
        featureRequestTitleRequired: 'El título es obligatorio!',
        featureRequestDescriptionRequired: 'La descripción es obligatoria!',
        featureRequestTitleTooShort:
            'El título debe tener al menos {{min}} caracteres!',
        featureRequestTitleTooLong:
            'El título debe tener {{max}} caracteres o menos!',
        featureRequestDescriptionTooShort:
            'La descripción debe tener al menos {{min}} caracteres!',
        featureRequestDescriptionTooLong:
            'La descripción debe tener {{max}} caracteres o menos!',
        featureRequestInvalidStatus: 'Estado inválido!',
        featureRequestUpdated: 'Solicitud de funcionalidad actualizada.',
        failedToUpdateFeatureRequest: 'Error al actualizar la solicitud!',
        noChangesProvided: 'No se proporcionaron cambios!',
        platformRequired: 'Se requiere al menos una plataforma!',
        invalidPlatform: 'Valor de plataforma no válido!',
        featureRequestImplementationLimitReached:
            'Este usuario ya tiene {{limit}} solicitudes de funcionalidades en progreso!'
    },
    emails: {
        otpSubject: 'Tu código de inicio de sesión de ClawHost',
        otpPreview: 'Tu código de inicio de sesión de ClawHost: {{code}}',
        otpHeading: 'Tu código de inicio de sesión es:',
        otpExpiry:
            'El código expira en 10 minutos. Si no fuiste tú, ignora este correo.'
    },
    auth: {
        signIn: 'Iniciar sesión',
        signInDescription:
            'Inicia sesión en tu cuenta de ClawHost para administrar tus instancias de OpenClaw.',
        signingIn: 'Iniciando sesión...',
        verifyCode: 'Verificar código',
        checkYourEmail: 'Revisa tu correo',
        checkYourEmailHeading: 'Revisa tu correo',
        codeSentTo: 'Enviamos un código de 6 dígitos a',
        signInToDeployOpenClaw:
            'Inicia sesión para administrar y desplegar instancias de OpenClaw.',
        emailAddress: 'Correo electrónico',
        emailPlaceholder: 'ejemplo@clawhost.cloud',
        continueWithEmail: 'Continuar con correo',
        otpDescription:
            'Te enviaremos un código para iniciar sesión. Sin contraseña.',
        welcomeBack: 'Bienvenido de nuevo.',
        resendIn: 'Reenviar en {{seconds}}s',
        resendCode: 'Reenviar código',
        changeEmail: 'Cambiar correo',
        invalidCode: 'Código no válido',
        invalidEmailFormat:
            'Por favor, introduce una dirección de correo electrónico válida.',
        plusAddressingNotAllowed:
            'No se permite el uso del signo + en el correo electrónico para iniciar sesión.',
        or: 'o',
        continueWithGoogle: 'Continuar con Google',
        continueWithGithub: 'Continuar con GitHub',
        agreementNotice: 'Al continuar, aceptas nuestros',
        termsOfService: 'Términos de servicio',
        andWord: 'y',
        privacyPolicy: 'Política de privacidad'
    },
    account: {
        title: 'Cuenta',
        description:
            'Administra la configuración de tu cuenta de ClawHost y tu información de perfil.',
        accountSettings: 'Cuenta',
        manageYourAccount:
            'Administra tu perfil y la configuración de tu cuenta.',
        profileInformation: 'Información del perfil',
        profileDescription: 'Tu información personal y nombre para mostrar.',
        noNameSet: 'Sin nombre establecido',
        joined: 'Registro',
        claws: 'claws',
        sshKeys: 'claves',
        displayName: 'Nombre para mostrar',
        enterYourName: 'Ingresa tu nombre',
        emailAddress: 'Correo electrónico',
        emailNotEditable: 'El correo no es editable. Contacta a soporte.',
        profileUpdatedSuccessfully: 'Perfil actualizado exitosamente.',
        billingHistory: 'Historial de facturación',
        billingDescription: 'Tu historial de pagos y facturas',
        date: 'Fecha',
        product: 'Producto',
        amount: 'Monto',
        status: 'Estado',
        statusPaid: 'Pagado',
        statusPending: 'Pendiente',
        statusRefunded: 'Reembolsado',
        statusPartiallyRefunded: 'Parcialmente reembolsado',
        billingReasonPurchase: 'Compra',
        billingReasonSubscriptionCreate: 'Nueva suscripción',
        billingReasonSubscriptionCycle: 'Renovación',
        billingReasonSubscriptionUpdate: 'Actualización de suscripción',
        noBillingHistory: 'Sin facturación',
        noBillingHistoryDescription:
            'No tienes historial de pagos, una vez que despliegues tu primer claw deberás ver tu facturación aquí.',
        failedToLoadBilling: 'Error al cargar el historial de facturación.',
        viewInvoice: 'Ver factura',
        failedToLoadInvoice: 'Error al cargar la factura.',
        couponApplied: 'Cupón: {{name}}',
        manageBilling: 'Administrar facturación',
        failedToLoadPortal: 'Error al abrir el portal de facturación.',
        connectedAccounts: 'Cuentas conectadas',
        connectedAccountsDescription:
            'Administra los métodos de inicio de sesión vinculados a tu cuenta.',
        authEmail: 'Correo',
        authGoogle: 'Google',
        authGithub: 'GitHub',
        authConnected: 'Conectado',
        authConnect: 'Conectar',
        authDisconnect: 'Desconectar',
        emailCannotBeDisconnected:
            'El correo siempre está conectado como tu método principal de inicio de sesión.',
        providerConnected: '{{provider}} conectado exitosamente.',
        providerDisconnected: '{{provider}} desconectado exitosamente.',
        providerEmailMismatch:
            'Solo puedes conectar cuentas que usen la misma dirección de correo!',
        settings: 'Configuración',
        settingsDescription: 'Administra las preferencias de tu panel.',
        showAllClaws: 'Mostrar todos los claws de todos los usuarios',
        openLinksWindowed: 'Abrir enlaces en vista de ventana',
        openLinksWindowedDescription: 'Cuando está activado, los enlaces externos se abren dentro de la aplicación en lugar del navegador del sistema.'
    },
    billing: {
        title: 'Facturación',
        description:
            'Consulta tu historial de pagos y administra tu facturación.',
        billingHistory: 'Facturación',
        manageYourBilling:
            'Consulta tu historial de pagos y administra tus facturas.',
        billingDescription: 'Tu historial de pagos y facturas',
        date: 'Fecha',
        product: 'Producto',
        amount: 'Monto',
        status: 'Estado',
        statusPaid: 'Pagado',
        statusPending: 'Pendiente',
        statusRefunded: 'Reembolsado',
        statusPartiallyRefunded: 'Parcialmente reembolsado',
        billingReasonPurchase: 'Compra',
        billingReasonSubscriptionCreate: 'Nueva suscripción',
        billingReasonSubscriptionCycle: 'Renovación',
        billingReasonSubscriptionUpdate: 'Actualización de suscripción',
        noBillingHistory: 'Sin facturación',
        noBillingHistoryDescription:
            'No tienes historial de pagos, una vez que despliegues tu primer claw deberás ver tu facturación aquí.',
        failedToLoadBilling: 'Error al cargar el historial de facturación.',
        failedToLoadBillingDescription:
            'No pudimos cargar tu historial de facturación. Por favor, verifica tu conexión e intenta de nuevo.',
        viewInvoice: 'Ver factura',
        failedToLoadInvoice: 'Error al cargar la factura.',
        couponApplied: 'Cupón: {{name}}',
        manageBilling: 'Administrar facturación',
        failedToLoadPortal: 'Error al abrir el portal de facturación.'
    },
    dashboard: {
        title: 'Claws',
        description:
            'Visualiza y administra tus instancias de OpenClaw desplegadas. Inicia, detiene, reinicia y monitorea tus servidores VPS.',
        claw: 'claw',
        clawsPlural: 'claws',
        clawCountLabel: '{{count}} claws',
        clawCountLabelSingular: '{{count}} claw',
        newClaw: 'Nuevo Claw',
        noClawsYet: 'Sin Claws',
        noClawsDescription:
            'No se encontró ningún claw desplegado. Pero puedes desplegar tu primer claw en cualquier momento desde $10/m. Solo usa IA.',
        deleteClaw: 'Eliminar Claw',
        deleteClawConfirmation: '¿Estás seguro de que deseas eliminar',
        deleteClawWarning:
            'Tu suscripción será cancelada y el servidor será eliminado al final de tu período de facturación actual. Puedes seguir usándolo hasta entonces.',
        actionCannotBeUndone: 'Esta acción no se puede deshacer.',
        start: 'Iniciar',
        stop: 'Detener',
        restart: 'Reiniciar',
        stopClaw: 'Detener Claw',
        stopClawConfirmation:
            '¿Estás seguro de que deseas detener el servidor? Esto terminará todo lo que se está ejecutando, incluyendo OpenClaw, pero puedes iniciarlo en cualquier momento. Detener no detiene la facturación — elimina el servidor para dejar de ser cobrado.',
        restartClaw: 'Reiniciar Claw',
        restartClawConfirmation:
            '¿Estás seguro de que deseas reiniciar el servidor? Esto terminará todo lo que se está ejecutando, incluyendo OpenClaw.',
        copyPassword: 'Copiar contraseña',
        copySshWithKey: 'Copiar SSH (con clave)',
        copySshWithPassword: 'Copiar SSH (con contraseña)',
        connect: 'Copiar comando SSH',
        sshCommandCopied: 'Comando SSH copiado.',
        sshCommandWithPasswordCopied: 'Comando SSH con contraseña copiado.',
        passwordCopiedToClipboard: 'Contraseña copiada al portapapeles.',
        plan: 'Servidor',
        location: 'Ubicación',
        ip: 'IP',
        domain: 'Dominio',
        ipAddress: 'Dirección IP',
        port: 'Puerto',
        monthlyCost: 'Costo mensual',
        serverId: 'ID del servidor',
        created: 'Creado',
        sshKey: 'Clave SSH',
        storage: 'Almacenamiento',
        provider: 'Proveedor',
        nextBilling: 'Próxima facturación',
        lastBilling: 'Última facturación',
        version: 'Versión',
        gatewayToken: 'Token del gateway',
        gatewayTokenDescription:
            'Usa este token para autenticarte con tu gateway',
        scheduledForDeletion: 'Programado para eliminación',
        scheduledDeletionShort: 'Se elimina el {{date}}',
        deletionDate: 'Este claw será eliminado el {{date}}',
        deletionTooltip:
            'Programado para eliminación el {{date}}. Para cancelar, usa el menú.',
        cancelDeletion: 'Cancelar eliminación',
        deletionCancelled: 'Eliminación cancelada.',
        scheduleDeletion: 'Programar eliminación',
        hardDelete: 'Eliminar inmediatamente',
        hardDeleteClaw: 'Eliminar inmediatamente',
        hardDeleteConfirmation:
            '¿Estás seguro de que deseas eliminar este claw inmediatamente? Perderás el tiempo restante de tu período de facturación actual. Esta acción no se puede deshacer.',
        diagnostics: 'Diagnósticos',
        diagnosticsDescription:
            'Verifica el estado de tu instancia de OpenClaw.',
        diagnosticsStatus: 'Estado',
        diagnosticsLogs: 'Registros',
        diagnosticsRepair: 'Reparar',
        diagnosticsRepairDescription:
            'Elimina los límites de memoria, aplica la configuración de servicio más reciente y reinicia el gateway. Esto soluciona los problemas más comunes.',
        diagnosticsRepairSuccess: 'Instancia reparada exitosamente.',
        diagnosticsRepairFailed:
            'Reparación aplicada pero el gateway aún no responde.',
        diagnosticsLoading: 'Conectando a la instancia...',
        diagnosticsNoLogs:
            'No hay registros disponibles. Inicia tu instancia para generar registros.',
        diagnosticsIssueDetected: 'Se detectó un problema con tu instancia.',
        diagnosticsHealthy: 'Tu instancia está funcionando normalmente.',
        diagnosticsPort: 'Puerto 18789',
        diagnosticsMemory: 'Memoria',
        logsDescription:
            'Últimas 100 líneas del registro de tu gateway, actualizándose automáticamente.',
        scrollToBottom: 'Ir a los nuevos registros',
        fileExplorer: 'Explorador de archivos',
        fileExplorerRoot: 'openclaw',
        fileExplorerDescription:
            'Explora y edita archivos de configuración de OpenClaw en tu instancia.',
        fileExplorerWarning:
            'Los cambios incorrectos pueden dañar tu instancia. Edita con cuidado.',
        fileExplorerSelectFile: 'Selecciona un archivo para ver su contenido.',
        fileExplorerReadOnly: 'Solo lectura',
        fileExplorerSave: 'Guardar',
        fileExplorerSaved: 'Archivo guardado.',
        fileExplorerInvalidJson:
            'JSON no válido. Por favor, corrige los errores de sintaxis antes de guardar.',
        fileExplorerNoFiles: 'No se encontraron archivos',
        updateInstance: 'Actualizar instancia',
        updateInstanceSuccess: 'Instancia actualizada exitosamente.',
        updateInstanceFailed: 'Error al actualizar la instancia!',
        startFailed: 'Error al iniciar el claw!',
        renameSuccess: 'Claw renombrado exitosamente.',
        renameFailed: 'Error al renombrar el claw!',
        renameInvalidChars: 'Solo se permiten letras, números y guiones.',
        reinstallInstance: 'Reinstalar instancia',
        reinstallClaw: 'Reinstalar instancia',
        reinstallClawConfirmation:
            'Esto reinstalará OpenClaw y restablecerá todas las configuraciones de esta instancia. Tus datos y servidor se conservarán, pero todos los servicios serán reiniciados. ¿Continuar?',
        reinstallInstanceSuccess: 'Instancia reinstalada exitosamente.',
        reinstallInstanceFailed: 'Error al reinstalar la instancia!',
        exportData: 'Exportar Claw (.zip)',
        exportStarted:
            'Preparando la exportación, esto puede tardar un momento...',
        exportFailed: 'Error al exportar los datos del claw!',
        exportRateLimited: 'Puedes exportar de nuevo en {{minutes}} minutos.',
        exportRateLimitedSeconds:
            'Puedes exportar de nuevo en {{seconds}} segundos.',
        configuringTooltip:
            'Esto puede tardar un poco. Depende de OpenClaw, la ubicación del servidor y Cloudflare DNS.',
        paymentSuccess: 'Tu claw se está creando y configurando.',
        dnsSetupBanner: 'Configura el DNS local para acceder a tus claws vía subdominio.clawhost.',
        dnsSetupButton: 'Configurar DNS',
        dnsSetupSuccess: 'Resolvedor DNS configurado exitosamente.',
        dnsSetupError: '¡Error al configurar el resolvedor DNS!',
        chatTab: 'Chat',
        playgroundTab: 'Playground',
        userTab: 'Usuario',
        adminTab: 'Admin',
        adminTitle: 'Admin',
        adminDescription: 'Administra todos los claws de la plataforma.',
        adminNoClaws: 'Aún no hay claws en la plataforma.',
        adminAccessDenied: 'No tienes permiso para acceder a esta página.',
        owner: 'Propietario',
        status: {
            running: 'Ejecutándose',
            stopped: 'Detenido',
            off: 'Apagado',
            starting: 'Iniciando',
            stopping: 'Deteniendo',
            creating: 'Creando',
            configuring: 'Configurando',
            initializing: 'Preparando',
            migrating: 'Migrando',
            rebuilding: 'Reconstruyendo',
            restarting: 'Reiniciando',
            unreachable: 'Inaccesible',
            deleting: 'Eliminando',
            scheduledDeletion: 'Eliminación programada',
            awaitingPayment: 'Esperando pago',
            unknown: 'Desconocido'
        }
    },
    chat: {
        explorer: 'Explorador',
        selectAgent: 'Selecciona un agente',
        selectAgentDescription:
            'Elige un agente de la barra lateral para comenzar a chatear',
        noAgents: 'No hay agentes disponibles',
        noAgentsDescription:
            'Despliega un claw para comenzar a chatear con agentes',
        openSidebar: 'Abrir barra lateral',
        clawNotReady: 'El claw aún no está listo',
        notConfigured: 'No configurado',
        addAgent: 'Agregar agente'
    },
    createClaw: {
        title: 'Desplegar OpenClaw',
        description: 'Configura tu servidor y comienza a construir con IA.',
        clawName: 'Nombre',
        clawNamePlaceholder: 'ej. panda-acogedor',
        clawNameInvalidChars: 'Solo se permiten letras, números y guiones.',
        provider: 'Proveedor',
        providerHetzner: 'Hetzner',
        providerDigitalOcean: 'DigitalOcean',
        providerVultr: 'Vultr',
        providerLocal: 'Local',
        providerAws: 'AWS',
        comingSoon: 'Pronto',
        location: 'Ubicación',
        locationUnavailable: 'No disponible',
        locationUnavailableForPlan: 'No disponible',
        plan: 'Servidor',
        planUnavailable: 'No disponible',
        providerAtCapacity:
            'Debido a la alta demanda, temporalmente nos hemos quedado sin servidores de este proveedor. Estamos trabajando activamente para resolver esto.',
        advancedOptions: 'Opciones avanzadas opcionales',
        rootPassword: 'Contraseña root',
        rootPasswordPlaceholder: 'Ingresa una contraseña o genera una',
        autoGeneratePasswordHint:
            'Deja vacío para generar automáticamente una contraseña segura.',
        regeneratePassword: 'Regenerar contraseña',
        sshKeyOptional: 'Clave SSH',
        noSshKeyPasswordOnly: 'Sin clave SSH (solo contraseña)',
        noSshKeysConfigured: 'No hay claves SSH configuradas',
        addSshKeyForPasswordlessLogin:
            'Agrega una clave SSH para inicio de sesión sin contraseña',
        additionalStorageOptional: 'Almacenamiento adicional',
        volumeStorage: 'Almacenamiento de volumen',
        vpsServer: 'Servidor VPS',
        openClawPreinstalled: 'OpenClaw preinstalado',
        storageWithSize: 'Almacenamiento',
        totalMonthly: 'Total mensual',
        creating: 'Creando...',
        proceedToPayment: 'Pagar ${{amount}} para desplegar',
        selectServerToContinue: 'Selecciona un servidor para continuar',
        selectLocationToContinue: 'Selecciona una ubicación para continuar',
        clawCreated: 'Claw creado.',
        assigning: 'Asignando...',
        rootPasswordSaveThis: 'Contraseña root (guarda esto)',
        sshCommandUsingKey: 'Comando SSH (usando tu clave)',
        sshCommandWithPassword: 'Comando SSH (con contraseña)',
        passwordCopied: 'Contraseña copiada.',
        planSpec: '{{cpu}} vCPU / {{memory}} GB RAM / {{disk}} GB SSD',
        volumeUnit: 'GB',
        volumeMin: '0 GB',
        volumeMax: '500 GB'
    },
    sshKeys: {
        title: 'Claves SSH',
        description:
            'Administra tus claves SSH para acceso seguro y sin contraseña a tus instancias de OpenClaw.',
        key: 'clave ssh',
        keys: 'claves ssh',
        addSshKey: 'Agregar clave SSH',
        howSshKeysWork: '¿Cómo conectar una clave SSH?',
        step1: 'Genera un par de claves SSH en tu computadora (o usa uno existente).',
        step2: 'Agrega la clave pública aquí.',
        step3: 'Selecciona la clave al crear una nueva instancia.',
        step4: 'Conéctate con',
        step4Command: 'ssh root@your-server-ip',
        step4Suffix: '- sin contraseña necesaria.',
        noSshKeysYet: 'Sin claves SSH',
        noSshKeysDescription:
            'No hay claves SSH agregadas en tu cuenta, puedes agregarlas en cualquier momento y conectarte con tus claws desplegados.',
        deleteConfirmation:
            '¿Estás seguro de que deseas eliminar esta clave SSH?',
        deleteKey: 'Eliminar clave SSH',
        deleteKeyConfirmation: '¿Estás seguro de que deseas eliminar',
        sshKeyAddedSuccessfully: 'Clave SSH agregada exitosamente.',
        addSshKeyModalTitle: 'Agregar clave SSH',
        addSshKeyModalDescription:
            'Agrega una clave SSH para autenticación sin contraseña',
        iHaveAnSshKey: 'Clave existente',
        generateNewKey: 'Crear nueva',
        name: 'Nombre',
        namePlaceholder: 'ej: mi-macbook',
        publicKey: 'Clave pública',
        publicKeyPlaceholder: 'ssh-rsa AAAA... o ssh-ed25519 AAAA...',
        publicKeyHint: 'Encuentra tu clave pública en',
        publicKeyPath1: '~/.ssh/id_ed25519.pub',
        publicKeyPathOr: 'o',
        publicKeyPath2: '~/.ssh/id_rsa.pub',
        important: 'Importante:',
        dontHaveSshKey: '¿No tienes una clave SSH? Genera una:',
        sshKeygenCommand: 'ssh-keygen -t ed25519 -C "your-email@example.com"',
        keyName: 'Nombre de la clave',
        keyNamePlaceholder: 'Mi clave generada',
        importantAfterGenerating:
            'Después de generar, debes descargar y guardar tu clave privada. No podremos recuperarla si la pierdes.',
        generateKeyPair: 'Generar par de claves',
        orGenerateLocallyRecommended: 'O genera localmente (recomendado)',
        runThisInYourTerminal: 'Ejecuta esto en tu terminal:',
        thenSwitchToIHave:
            'Luego cambia a "Clave existente" y pega la clave pública.',
        savePrivateKeyNow:
            'Guarda tu clave privada AHORA. Descárgala antes de cerrar este diálogo. No podrás verla de nuevo.',
        privateKeyKeepSecret: 'Clave privada (mantén en secreto)',
        downloadPrivateKey: 'Descargar clave privada',
        publicKeyWillBeSaved: 'Clave pública (será guardada)',
        savePublicKey: 'Guardar clave pública'
    },
    landing: {
        title: 'Despliega OpenClaw. Un clic. Listo.',
        description:
            'Despliega OpenClaw en tu propio VPS con un solo clic. Alojamiento en la nube auto-hospedable con acceso root completo, ubicaciones globales y precios transparentes.',
        badge: 'OpenClaw simplificado',
        tutorialBadge: 'Mira. Despliega.',
        heroTitle1: 'Despliega OpenClaw.',
        heroTitle2: 'Un clic. Listo.',
        heroDescription:
            'Infraestructura lista para producción con despliegue de OpenClaw en un clic, gestionado de principio a fin — construye, lanza y avanza más rápido con IA.',
        goToClaws: 'Ir a Claws',
        selfHost: 'Código abierto',
        startingPrice: 'Desde',
        locations: 'Ubicaciones',
        servers: 'Servidores',
        zeroCount: 'Cero',
        zeroConfig: 'Sin configuración',
        dashboardPreviewTitle: 'Claws',
        dashboardPreviewSubtitle: '5 claws agregados',
        deployNew: 'Desplegar nuevo',
        running: 'Ejecutándose',
        latency: 'latencia',
        howItWorks: 'Proceso',
        threeStepsToPrivacy: 'Tres pasos hacia OpenClaw',
        howItWorksDescription:
            'De cero a un OpenClaw completamente desplegado para usar 24/7 con acceso completo.',
        step1Title: 'Selecciona servidor',
        step1Description:
            'Elige entre más de 30 ubicaciones globales en tres proveedores. Creamos un VPS dedicado solo para ti en segundos.',
        step2Title: 'Instalación automática',
        step2Description:
            'OpenClaw viene preinstalado con un enlace directo y los detalles del VPS. Sin configuración necesaria.',
        step3Title: 'Es tuyo',
        step3Description:
            'Acceso completo a OpenClaw y al VPS, sin límites en lo que puedes lograr.',
        features: 'Funciones',
        whyClawHost: 'Todas las funciones',
        featuresDescription:
            'Por qué vale la pena probarnos, las características no mienten.',
        zeroConfigDescription:
            'Ahorra horas de configuración de servidor y OpenClaw. Está preinstalado y listo en minutos.',
        ownedData: 'Datos 100% tuyos',
        ownedDataDescription:
            'Tu propio servidor, tus datos. Sin infraestructura compartida, sin registros, sin terceros. En línea 24/7.',
        fullSpeed: 'Velocidad máxima',
        fullSpeedDescription:
            'Recursos VPS dedicados significan sin limitaciones, ancho de banda completo e internet ultra rápido.',
        globalLocations: 'Ubicaciones globales',
        globalLocationsDescription:
            'Despliega OpenClaw en más de 30 regiones globales en Hetzner, DigitalOcean o Vultr y elige la ubicación más cercana a ti.',
        fullSshAccess: 'Acceso SSH completo',
        fullSshAccessDescription:
            'Acceso root completo a tu servidor. Es tuyo, así que instala cualquier cosa y personaliza todo.',
        secure: 'Seguro',
        secureDescription:
            'Protegido por defecto contra vulnerabilidades SSL, malware y amenazas de seguridad comunes.',
        payAsYouGo: 'Precios simples',
        payAsYouGoDescription:
            'Precios basados en lo que necesitas. Sin facturas altas forzadas por servidores de baja calidad. Cancela en cualquier momento.',
        customSubdomains: 'Acceso en línea',
        customSubdomainsDescription:
            'Olvida las redes locales. Accede a tu OpenClaw de forma segura desde cualquier lugar con un subdominio.',
        autoUpdates: 'Actualizaciones automáticas',
        autoUpdatesDescription:
            'Olvida las actualizaciones y los parches de seguridad. El servidor y OpenClaw se mantienen actualizados automáticamente.',
        testimonials: 'Testimonios',
        whatPeopleSay: 'Lo que dice la gente',
        testimonialsDescription:
            'No solo confíes en nuestra palabra. Mira cómo otros despliegan OpenClaw.',
        testimonial1Quote:
            'Por fin, mi propio servidor de IA. La configuración tomó 30 segundos y lo he estado usando por meses sin problemas.',
        testimonial1Author: 'Alex Chen',
        testimonial1Role: 'Desarrollador de software',
        testimonial2Quote:
            'Ya no comparto recursos con otros. Mi instancia de OpenClaw maneja todo lo que le exijo.',
        testimonial2Author: 'Maria Santos',
        testimonial2Role: 'Nómada digital',
        testimonial3Quote:
            'El despliegue en un clic es real. No soy nada técnico pero puse mi OpenClaw a funcionar en menos de un minuto.',
        testimonial3Author: 'James Wilson',
        testimonial3Role: 'Freelancer',
        testimonial4Quote:
            'Me encanta poder ver exactamente lo que está corriendo en mi servidor. Control total sobre mi configuración de IA.',
        testimonial4Author: 'Sophie Kim',
        testimonial4Role: 'Entusiasta de IA',
        pricing: 'Precios',
        simpleTransparentPricing: 'Precios simples y transparentes',
        pricingDescription:
            'Elige entre más de 45 servidores en nuestros proveedores según tus necesidades.',
        planColumn: 'Servidor',
        vCpuColumn: 'vCPU',
        ramColumn: 'RAM',
        storageColumn: 'Almacenamiento',
        monthlyColumn: 'Precio',
        tierShared: 'vCPU compartido',
        tierDedicated: 'vCPU dedicado',
        tierArm: 'Ampere (ARM)',
        tierRegular: 'Rendimiento regular',
        tierHighPerformance: 'Alto rendimiento',
        tierHighFrequency: 'Alta frecuencia',
        recommended: 'Recomendado',
        perMonth: '/mes',
        deploy: 'Desplegar',
        select: 'Seleccionar',
        openClawPreinstalled: 'OpenClaw preinstalado',
        unlimitedBandwidth: 'Ancho de banda ilimitado',
        rootSshAccess: 'Acceso root SSH completo',
        onlineAllDay: 'En línea 24/7',
        highQualityInternet: 'Internet de alta calidad',
        faqTitle: 'Preguntas',
        frequentlyAskedQuestions: 'Preguntas frecuentes',
        faqDescription: 'Todas las preguntas frecuentes, respondidas.',
        faq1Question: '¿Qué es ClawHost?',
        faq1Answer:
            'ClawHost es una plataforma creada para hacer OpenClaw accesible para todos. Permite tanto a usuarios no técnicos como a desarrolladores ejecutar OpenClaw sin administrar infraestructura. Nosotros manejamos servidores, disponibilidad, seguridad y mantenimiento — tú solo usas OpenClaw.',
        faq2Question: '¿Qué es OpenClaw?',
        faq2Answer:
            'OpenClaw es una capa de acceso seguro auto-hospedada para tus herramientas y servicios de IA. Está preconfigurado para seguridad y rendimiento, así que puedes desplegarlo y conectarte al instante.',
        faq3Question:
            '¿En qué se diferencia de otras herramientas de IA o plataformas hospedadas?',
        faq3Answer:
            'A diferencia de las herramientas de IA hospedadas, ClawHost te da un servidor real con OpenClaw instalado. Tú eres dueño de la infraestructura, controlas todo y no estás limitado por una plataforma compartida o un modelo.',
        faq4Question: '¿Necesito conocimientos técnicos?',
        faq4Answer:
            'No. Nosotros manejamos toda la infraestructura, configuración y mantenimiento. Puedes configurar y administrar OpenClaw a través de su interfaz, conectar canales y personalizar el uso — sin tocar servidores ni infraestructura.',
        faq5Question: '¿Qué ubicaciones están disponibles?',
        faq5Answer:
            'Ofrecemos más de 30 ubicaciones de servidores en todo el mundo a través de Hetzner, DigitalOcean y Vultr, incluyendo EE.UU., Europa, Asia y más. Puedes desplegar OpenClaw en múltiples servidores en diferentes regiones si es necesario.',
        faq6Question: '¿Cuánto cuesta?',
        faq6Answer:
            'Los precios se basan en el servidor que selecciones. Con más de 45 opciones de servidor que van desde nivel básico hasta alto rendimiento en tres proveedores, tú eliges lo que se adapte a tus necesidades y presupuesto.',
        faq7Question: '¿Puedo acceder a mi servidor directamente?',
        faq7Answer:
            'Sí. Además del acceso a OpenClaw vía URL de subdominio, tienes acceso completo al servidor y su infraestructura subyacente, dándote libertad total para personalizar y ejecutar lo que necesites.',
        faq8Question: '¿Dónde están alojados los servidores?',
        faq8Answer:
            'Todos los servidores están alojados en Hetzner Cloud, DigitalOcean y Vultr, proveedores de nube confiables conocidos por su hardware de alto rendimiento y excelente disponibilidad, utilizados por infraestructuras a gran escala.',
        comparison: 'Comparación',
        comparisonTitle: '¿En qué nos diferenciamos?',
        comparisonDescription:
            'Solo hay una plataforma comparable, y nuestro enfoque se centra en servidores reales y propiedad total en lugar de limitaciones.',
        others: 'Otros',
        comparisonOpenClawUs: 'Acceso completo a OpenClaw',
        comparisonOpenClawOthers: 'Solo chat, sin administración',
        comparisonPricingUs: 'Precios transparentes, especificaciones claras',
        comparisonPricingOthers:
            'Especificaciones ocultas, precios poco claros',
        comparisonOwnershipUs: 'Tu servidor es completamente tuyo',
        comparisonOwnershipOthers: 'No eres dueño de nada',
        comparisonSubdomainUs: 'Acceso vía subdominio',
        comparisonSubdomainOthers: 'Acceso solo con canales sociales',
        comparisonInfraUs: 'Infraestructura bajo demanda',
        comparisonInfraOthers: 'Servidores limitados',
        comparisonDataUs: 'Tus datos son tuyos',
        comparisonDataOthers: 'Tus datos no son tuyos',
        comparisonMultipleUs: 'Múltiples OpenClaw, un solo Claw',
        comparisonMultipleOthers: 'Solo un OpenClaw',
        comparisonAgentsUs: 'Múltiples agentes por Claw',
        comparisonAgentsOthers: 'Solo un agente',
        comparisonOpenSourceUs: 'Completamente código abierto',
        comparisonOpenSourceOthers: 'Código cerrado',
        comparisonExportUs: 'Exporta tu OpenClaw a cualquier lugar',
        comparisonExportOthers: 'Dependencia del proveedor',
        comparisonProvidersUs: 'Múltiples proveedores de servidores',
        comparisonProvidersOthers: 'Un solo proveedor',
        comparisonSocialsUs: 'Presencia en redes sociales',
        comparisonSocialsOthers: 'Sin redes sociales',
        seeFullComparison: 'Ver comparación completa',
        comparisonCtaText:
            'Comparamos con SimpleClaw, MyClaw.ai y más — función por función.',
        readyToOwnYourPrivacy: '¿Listo para desplegar OpenClaw?',
        ctaDescription:
            'Obtén un servidor dedicado con OpenClaw preinstalado. Acceso root completo, ubicaciones globales y listo en minutos. Es tuyo en todo momento.',
        deployOpenClawNow: 'Desplegar OpenClaw',
        selfHostInstead: 'Auto-hospedar en su lugar',
        noCreditCardRequired: 'Configuración instantánea',
        deployIn60Seconds: 'Seguro',
        demoClawStarted: 'Claw iniciado.',
        demoClawStopped: 'Claw detenido.',
        demoClawRestarting: 'Reiniciando claw...',
        demoClawRestarted: 'Claw reiniciado.',
        demoClawDeleted: 'Claw eliminado.',
        demoStatus: '{{running}} ejecutándose, {{total}} en total'
    },
    blog: {
        title: 'Blog',
        description:
            'Guías, tutoriales y noticias sobre OpenClaw e infraestructura auto-hospedada.',
        readingTime: '{{minutes}} min de lectura',
        publishedOn: 'Publicado el {{date}}',
        writtenBy: 'Por {{author}}',
        backToBlog: 'Volver al blog',
        noPosts: 'Sin publicaciones aún',
        noPostsDescription:
            'Las publicaciones del blog llegarán pronto. Vuelve más tarde.'
    },
    changelog: {
        title: 'Historial de cambios',
        description:
            'Sigue las actualizaciones, nuevas funciones y mejoras de ClawHost.',
        subtitle:
            'Todas las actualizaciones, nuevas funciones y mejoras de ClawHost.',
        upcomingRelease: 'En proceso',
        upcomingReleaseTitle: 'Móvil, escritorio y más',
        upcomingReleaseDescription:
            'Administra tus instancias de OpenClaw desde cualquier lugar. Apps nativas para móvil y escritorio, además de mejoras continuas de la plataforma.',
        upcomingReleaseFeature1:
            'App móvil nativa para monitorear y administrar tus instancias de OpenClaw en movimiento',
        upcomingReleaseFeature2:
            'App de escritorio local para auto-hospedar OpenClaw en macOS, Windows y Linux',
        upcomingReleaseFeature3: 'Soporte de temas oscuro y claro',
        upcomingReleaseFeature4:
            'Mejoras de rendimiento, estabilidad y capacidad de respuesta',
        upcomingReleaseFeature5:
            'Soporte multilingüe con inglés, francés, español y alemán',
        upcomingReleaseFeature6:
            'Páginas de comparación con análisis completos frente a competidores',
        upcomingReleaseFeature7:
            'Refactorización de la estructura de funciones del playground y simplificaciones',
        upcomingReleaseFeature8:
            'Solicitudes de funciones gestionadas y publicadas automáticamente por los agentes de OpenClaw',
        release10Date: '22 de febrero de 2026',
        release10Title: 'Solicitudes de funciones y correcciones de errores',
        release10Description:
            'Las solicitudes de funciones de la comunidad ahora son gestionadas automáticamente por los agentes de OpenClaw, además de correcciones para la instalación de habilidades y el cambio de proveedor de modelo.',
        release10Feature1:
            'Solicitudes de funciones gestionadas y publicadas automáticamente por los agentes de OpenClaw',
        release10Feature2:
            'Corrección de habilidades que a veces no se instalaban desde el marketplace de ClawHub',
        release10Feature3:
            'Corrección del cambio de proveedor de modelo que no se reflejaba y seguía usando el modelo inicial',
        release10Feature4:
            'Varias mejoras y correcciones de errores en la plataforma',
        release9Date: '21 de febrero de 2026',
        release9Title: 'Comparaciones, refactorización del playground y más',
        release9Description:
            'Páginas de comparación con competidores, reestructuración de funciones del playground, soporte multilingüe y mejoras generales de rendimiento.',
        release9Feature1: 'Soporte de temas oscuro y claro',
        release9Feature2:
            'Soporte multilingüe con inglés, francés, español y alemán',
        release9Feature3:
            'Páginas de comparación con análisis completos frente a competidores',
        release9Feature4:
            'Versiones de OpenClaw, actualiza con un clic o instala cualquier versión al instante',
        release9Feature5:
            'Refactorización de la estructura de funciones del playground y simplificaciones',
        release9Feature6:
            'Mejoras de rendimiento, estabilidad y capacidad de respuesta',
        release8Date: '18 de febrero de 2026',
        release8Title: 'Tema claro, rendimiento y estabilidad',
        release8Description:
            'Soporte de tema claro, mejoras de rendimiento y experiencia, y mejoras de estabilidad y capacidad de respuesta.',
        release8Feature1: 'Modos de tema claro, oscuro y del sistema',
        release8Feature2: 'Mejoras de rendimiento y experiencia',
        release8Feature3: 'Mejoras de estabilidad y capacidad de respuesta',
        release7Date: '16 de febrero de 2026',
        release7Title: 'Refactorización del chat y entrada de voz',
        release7Description:
            'Grandes mejoras en el chat y playground con interacción por voz, mercado de habilidades ClawHub y archivos adjuntos para agentes.',
        release7Feature1:
            'Refactorización del chat y playground para una experiencia más fluida y responsiva',
        release7Feature2:
            'Interacción por voz en chats, graba y transcribe voz directamente en el navegador',
        release7Feature3:
            'Integración de habilidades de ClawHub con más de 5,000 habilidades disponibles para instalar y administrar',
        release7Feature4:
            'Vista y uso de archivos adjuntos para agentes, envía imágenes y documentos en el chat',
        release6Date: '16 de febrero de 2026',
        release6Title: 'Canales, habilidades y chat con agentes',
        release6Description:
            'Control total sobre tus canales, habilidades y agentes de OpenClaw. Administra y chatea con todo directamente desde el panel.',
        release6Feature1:
            'Administra canales directamente, agrega, elimina y configura canales sin tocar el servidor',
        release6Feature2:
            'Administra habilidades directamente, instala, actualiza y organiza habilidades de agentes desde el panel',
        release6Feature3:
            'Chatea con tus agentes desde el playground, interactúa con cualquier agente en tiempo real',
        release6Feature4:
            'Inicia sesión con Google o GitHub, autenticación rápida y segura sin códigos por correo',
        release1Date: '8 de febrero de 2026',
        release1Title: 'Lanzamiento inicial',
        release1Description:
            'El primer lanzamiento oficial de ClawHost. Despliega OpenClaw en tu propio VPS con un solo clic.',
        release1Feature1: 'Despliegue de OpenClaw en un clic en Hetzner Cloud',
        release1Feature2:
            'Panel para administrar claws, iniciar, detener, reiniciar y eliminar instancias',
        release1Feature3:
            '18 planes de servidor Hetzner con vCPU dedicado, RAM y opciones de almacenamiento',
        release1Feature4:
            '6 ubicaciones de servidor Hetzner en EE.UU., Europa y Asia',
        release1Feature5:
            'Administración de claves SSH para acceso sin contraseña al servidor',
        release1Feature6:
            'Soporte de almacenamiento de volumen adicional hasta 10 TB',
        release1Feature7:
            'Autenticación con enlace mágico, sin contraseñas necesarias',
        release1Feature8:
            'Acceso en línea a OpenClaw a través de subdominios seguros',
        release1Feature9:
            'Integración de pagos con precios transparentes por servidor',
        release1Feature10:
            'Historial de facturación y administración de facturas',
        release1Feature11:
            'Aprovisionamiento automático con OpenClaw preinstalado y configurado',
        release2Date: '8 de febrero de 2026',
        release2Title: 'DigitalOcean y más',
        release2Description:
            'Infraestructura multi-proveedor y una nueva forma de mantenerte al día con todo en ClawHost.',
        release2Feature1: 'DigitalOcean como segundo proveedor de nube',
        release2Feature2:
            '7 planes de servidor DigitalOcean con vCPU dedicado, RAM y opciones de almacenamiento',
        release2Feature3:
            'Más de 10 ubicaciones de servidor DigitalOcean en EE.UU., Europa, Asia y más',
        release2Feature4:
            'Página de historial de cambios para seguir todas las actualizaciones y lanzamientos de la plataforma',
        release3Date: '10 de febrero de 2026',
        release3Title: 'Información del servidor',
        release3Description:
            'Mayor visibilidad y control sobre tus servidores, directamente desde el panel.',
        release3Feature1:
            'Registros del servidor en tiempo real transmitidos directamente en el panel',
        release3Feature2:
            'Diagnósticos del servidor con reparación automática en un clic para problemas de servicio',
        release3Feature3:
            'Explorador de archivos integrado y editor JSON para archivos de configuración del servidor',
        release4Date: '11 de febrero de 2026',
        release4Title: 'Proveedor Vultr',
        release4Description:
            'Vultr como tercer proveedor de nube con 22 planes de servidor y más de 30 ubicaciones globales.',
        release4Feature1: 'Vultr como tercer proveedor de nube',
        release4Feature2:
            '22 planes de servidor Vultr en los niveles Regular, Alto rendimiento y Alta frecuencia',
        release4Feature3:
            'Más de 30 ubicaciones de servidor Vultr en EE.UU., Europa, Asia y más',
        release5Date: '14 de febrero de 2026',
        release5Title: 'Agentes y exportación de datos',
        release5Description:
            'Playground de agentes, administración multi-agente y exportación de datos portable para tus instancias de OpenClaw.',
        release5Feature1:
            'Playground de agentes y resumen en un clic, agrega y administra múltiples agentes',
        release5Feature2: 'Exporta tu OpenClaw como un archivo zip portable',
        release5Feature3:
            'Playground interactivo con visualización de grafo de Claws y agentes',
        release5Feature4:
            'Se eliminó la alternancia entre vista de cuadrícula y lista en favor de un diseño de panel unificado'
    },
    playground: {
        title: 'Playground',
        description:
            'Visualiza tus Claws y sus agentes en un grafo interactivo.',
        subtitle: 'Topología de agentes a través de tu infraestructura',
        noClawsYet: 'Sin Claws',
        noClawsDescription: 'Despliega tu primer Claw para interactuar con él.',
        loadingAgents: 'Agentes',
        unreachable: 'Inaccesible',
        offline: 'Fuera de línea',
        noAgents: 'Sin agentes',
        agentCount: '{{count}} agente',
        agentCountPlural: '{{count}} agentes',
        agentModel: 'Modelo',
        zoomLabel: '{{percent}}%',
        fitView: 'Centrar',
        nodesOutOfView: 'Claws fuera de vista',
        nodeOutOfView: 'Claw fuera de vista',
        addAgent: 'Agregar agente',
        closeDetails: 'Cerrar',
        tabInfo: 'Info',
        tabLogs: 'Registros',
        tabDiagnostics: 'Salud',
        loadingTip1:
            '¿Sabías que puedes ejecutar múltiples agentes dentro de un solo OpenClaw?',
        loadingTip2: '¿Sabías que OpenClaw es de código abierto?',
        loadingTip3:
            'ClawHost es el primer proyecto en permitir hospedaje de OpenClaw con un solo clic.',
        tabChat: 'Chat',
        tabConfiguration: 'Configuración',
        tabSettings: 'Ajustes',
        tabEnvs: 'Vars',
        agentOnClaw: 'en {{clawName}}',
        cannotDeleteDefaultAgent:
            'El agente predeterminado no puede ser eliminado',
        configurationModel: 'Modelo',
        configurationModelPlaceholder: 'Selecciona un modelo',
        configurationModelDescription:
            'El modelo de IA que usa este agente. Cambiar el modelo puede requerir configurar la clave API correspondiente.',
        configurationEnvVars: 'Variables de entorno',
        configurationEnvVarsDescription:
            'Claves API y variables de entorno almacenadas en ~/.openclaw/.env en la instancia.',
        configurationAddEnvVar: 'Agregar variable',
        configurationKeyPlaceholder: 'NOMBRE_VARIABLE',
        configurationValuePlaceholder: 'valor',
        configurationSave: 'Guardar',
        configurationSaving: 'Guardando...',
        configurationSaved: 'Configuración del agente guardada.',
        configurationSaveFailed:
            'Error al guardar la configuración del agente.',
        configurationLoading: 'Cargando configuración...',
        configurationLoadFailed: 'Error al cargar la configuración del agente.',
        configurationLoadFailedDescription:
            'No se pudo obtener la configuración de este agente. Por favor, intenta más tarde.',
        configurationRemoveVar: 'Eliminar',
        configurationApiKey: 'Clave API',
        configurationApiKeyDescription:
            'Requerida para {{modelName}}. Esta clave se almacena en ~/.openclaw/.env en la instancia.',
        configurationApiKeyPlaceholder: 'Ingresa tu clave API',
        tabVariables: 'Variables',
        variablesDescription:
            'Variables de entorno almacenadas en ~/.openclaw/.env en esta instancia.',
        variablesEmpty: 'No se encontraron variables de entorno.',
        variablesAddVariable: 'Agregar variable',
        variablesSave: 'Guardar variables',
        variablesSaving: 'Guardando...',
        variablesSaved: 'Variables de entorno guardadas.',
        variablesSaveFailed: 'Error al guardar las variables de entorno!',
        variablesLoading: 'Cargando variables...',
        variablesLoadFailed: 'Error al cargar las variables de entorno.',
        variablesLoadFailedDescription:
            'No se pudieron obtener las variables de esta instancia. Por favor, intenta más tarde.',
        variablesInvalidKey: 'Solo letras, números y guiones bajos.',
        variablesEmptyValue: 'El valor no puede estar vacío.',
        variablesDuplicateKey: 'Nombre de variable duplicado.',
        variablesDeleteTitle: 'Eliminar variable',
        variablesDeleteDescription:
            '¿Estás seguro de que deseas eliminar {{key}}? Esto la eliminará inmediatamente de la instancia.',
        variablesDeleteConfirm: 'Eliminar',
        variablesDontAskAgain: 'No volver a preguntar al eliminar variables en esta sesión',
        variablesDeleted: 'Variable eliminada.',
        addAgentTitle: 'Agregar agente',
        addAgentDescription: 'Agrega un nuevo agente a {{clawName}}.',
        addAgentName: 'Nombre',
        addAgentNamePlaceholder: 'Ingresa el nombre del agente',
        addAgentModel: 'Modelo',
        addAgentModelPlaceholder: 'Selecciona un modelo (opcional)',
        addAgentApiKey: 'Clave API',
        addAgentApiKeyPlaceholder: 'Ingresa tu clave API (opcional)',
        addAgentApiKeyConfigured:
            '{{envVar}} ya configurado. Editable en la pestaña Variables después de agregar.',
        addAgentSubmit: 'Agregar agente',
        addAgentSuccess: 'Agente agregado exitosamente.',
        addAgentFailed: 'Error al agregar el agente!',
        deleteAgent: 'Eliminar agente',
        deleteAgentTitle: 'Eliminar agente',
        deleteAgentDescription:
            '¿Estás seguro de que deseas eliminar el agente "{{agentName}}"? Esta acción no se puede deshacer. Las variables de entorno no serán eliminadas.',
        deleteAgentConfirm: 'Eliminar',
        agentDontAskAgain: 'No volver a preguntar al eliminar agentes en esta sesión',
        deleteAgentDeleting: 'Eliminando...',
        deleteAgentSuccess: 'Agente eliminado exitosamente.',
        deleteAgentFailed: 'Error al eliminar el agente!',
        configurationName: 'Nombre',
        configurationNamePlaceholder: 'Ingresa el nombre del agente',
        configurationNameDescription: 'Solo letras, números y guiones.',
        agentNameRequired: 'El nombre del agente es obligatorio.',
        agentNameInvalidChars: 'Solo se permiten letras, números y guiones.',
        agentNameDuplicate: 'Ya existe un agente con este nombre.',
        chatConnecting: 'Conectando...',
        chatAuthenticating: 'Autenticando...',
        chatDisconnected: 'Desconectado',
        chatError: 'Error de conexión',
        chatConnected: 'Conectado',
        chatInputPlaceholder: 'Escribe un mensaje...',
        chatInputDisabled: 'Conéctate para chatear con este agente',
        chatSend: 'Enviar',
        chatAbort: 'Detener',
        chatLoadingHistory: 'Cargando mensajes...',
        chatNoMessages: 'Sin mensajes aún.',
        chatNoMessagesDescription:
            'Envía un mensaje para iniciar una conversación con este agente.',
        chatErrorMessage: 'Ocurrió un error al generar una respuesta.',
        chatAbortedMessage: 'La respuesta fue detenida.',
        chatReadOnlyPlaceholder: 'Chat disponible en tus propios Claws.',
        chatReadOnlyUser:
            '¡Hola! ¿Puedes ayudarme a configurar un proyecto Node.js?',
        chatReadOnlyAssistant:
            '¡Por supuesto! Puedo ayudarte a inicializar un nuevo proyecto Node.js. ¿Te gustaría que cree un package.json con algunas dependencias comunes?',
        chatConnectionFailed: 'Error al conectar con este agente.',
        chatConnectionFailedDescription:
            'Asegúrate de que el Claw esté ejecutándose y sea accesible.',
        chatNotConfigured: 'Agente no configurado.',
        chatNotConfiguredDescription:
            'Selecciona un modelo y configura una clave API en la pestaña de Configuración para comenzar a chatear.',
        chatConfigureButton: 'Configurar agente',
        chatToday: 'Hoy',
        chatYesterday: 'Ayer',
        chatExpandFullscreen: 'Expandir chat',
        chatAttachFile: 'Adjuntar archivo',
        chatDropFiles: 'Suelta archivos para adjuntar',
        chatDropFilesDescription:
            'Imágenes, PDFs y archivos de texto hasta 5 MB.',
        chatVoiceInput: 'Entrada de voz',
        chatVoiceListening: 'Escuchando...',
        chatVoiceNotSupported:
            'La entrada de voz no es compatible con este navegador.',
        chatAttachmentNotSupported:
            'Este tipo de archivo no es compatible. Usa imágenes, PDFs o archivos de texto.',
        chatNoPreview: 'Vista previa no disponible.',
        chatDownloadFile: 'Descargar archivo',
        chatScrollToBottom: 'Ir al final',
        tabChannels: 'Canales',
        channelsDescription:
            'Configura los canales de mensajería para esta instancia. Los mensajes se enrutan a los agentes mediante vínculos.',
        channelsWhatsApp: 'WhatsApp',
        channelsWhatsAppPairDevice: 'Vincular dispositivo',
        channelsWhatsAppPairing: 'Esperando código QR...',
        channelsWhatsAppScanQr:
            'Escanea este código QR con WhatsApp para vincular tu dispositivo.',
        channelsWhatsAppScanInstructions:
            'Abre WhatsApp > Ajustes > Dispositivos vinculados > Vincular un dispositivo',
        channelsWhatsAppPaired: 'WhatsApp vinculado exitosamente.',
        channelsWhatsAppPairFailed:
            'Error en el emparejamiento. Inténtalo de nuevo.',
        channelsWhatsAppAlreadyPaired: 'WhatsApp ya está vinculado.',
        channelsWhatsAppUnpair: 'Desvincular',
        channelsWhatsAppUnsupported:
            'El emparejamiento de WhatsApp no está disponible en esta instancia. Actualiza OpenClaw a una versión más reciente para habilitarlo.',
        channelsTelegram: 'Telegram',
        channelsDiscord: 'Discord',
        channelsSlack: 'Slack',
        channelsSignal: 'Signal',
        channelsEnabled: 'Habilitado',
        channelsAccount: 'Número de teléfono de la cuenta',
        channelsAccountPlaceholder: '+15551234567',
        channelsBotToken: 'Token del bot',
        channelsBotTokenPlaceholder: 'Ingresa el token del bot',
        channelsAppToken: 'Token de la app',
        channelsAppTokenPlaceholder: 'Ingresa el token de la app',
        channelsToken: 'Token del bot',
        channelsTokenPlaceholder: 'Ingresa el token del bot',
        channelsSigningSecret: 'Secreto de firma',
        channelsSigningSecretPlaceholder: 'Ingresa el secreto de firma',
        channelsDmPolicy: 'Política de DM',
        channelsDmPolicyOpen: 'Abierto',
        channelsDmPolicyPairing: 'Emparejamiento',
        channelsDmPolicyAllowlist: 'Lista de permitidos',
        channelsDmPolicyDisabled: 'Deshabilitado',
        channelsAllowFrom: 'Permitir desde',
        channelsAllowFromPlaceholder: 'IDs permitidos, separados por coma',
        channelsSave: 'Guardar',
        channelsSaved: 'Canales actualizados exitosamente.',
        channelsSaveFailed: 'Error al actualizar los canales!',
        channelsLoading: 'Cargando canales...',
        channelsLoadFailed: 'Error al cargar los canales.',
        channelsLoadFailedDescription:
            'No se pudo obtener la configuración de los canales. Por favor, intenta de nuevo.',
        channelsNoChanges: 'No hay cambios que guardar.',
        bindingsDescription:
            'Asigna canales de mensajería a este agente. Cada canal solo puede ser enrutado a un agente a la vez.',
        bindingsNoChannels: 'No hay canales habilitados.',
        bindingsNoChannelsDescription:
            'Habilita canales en la configuración de la instancia primero, luego asígnalos a los agentes aquí.',
        bindingsSaving: 'Guardando...',
        bindingsSaved: 'Vinculaciones actualizadas exitosamente.',
        bindingsSaveFailed: '¡Error al actualizar las vinculaciones!',
        tabSkills: 'Habilidades',
        skillsDescription:
            'Administra habilidades compartidas disponibles para todos los agentes en esta instancia.',
        skillsSearch: 'Buscar habilidades...',
        skillsNoResults: 'Ninguna habilidad coincide con tu búsqueda.',
        skillsEmpty: 'Sin Skills',
        skillsSave: 'Guardar habilidades',
        skillsSaved: 'Habilidades actualizadas exitosamente.',
        skillsSaveFailed: 'Error al actualizar las habilidades!',
        skillsLoading: 'Cargando habilidades...',
        skillsLoadFailed: 'Error al cargar las habilidades.',
        skillsLoadFailedDescription:
            'No se pudo obtener la configuración de las habilidades. Por favor, intenta de nuevo.',
        agentSkillsDescription:
            'Habilidades instaladas en el espacio de trabajo de este agente.',
        agentSkillsInstalling: 'Instalando...',
        agentSkillsInstalled: 'Habilidad instalada exitosamente.',
        agentSkillsInstallFailed: 'Error al instalar la habilidad!',
        agentSkillsRemoving: 'Eliminando...',
        agentSkillsRemoved: 'Habilidad eliminada exitosamente.',
        agentSkillsRemoveFailed: 'Error al eliminar la habilidad!',
        agentSkillsEmpty: 'No hay habilidades instaladas.',
        agentSkillsEmptyDescription:
            'Instala una habilidad para extender las capacidades de este agente.',
        agentSkillsNamePlaceholder: 'Nombre de la habilidad',
        agentSkillsConfirmRemove: '¿Eliminar habilidad "{{skillName}}"?',
        agentSkillsConfirmRemoveDescription:
            'Esto eliminará la habilidad del espacio de trabajo del agente.',
        skillsBundledTab: 'Integradas',
        skillsClawHubTab: 'ClawHub',
        clawHubSearch: 'Buscar habilidades en ClawHub...',
        clawHubNoResults: 'No se encontraron habilidades en ClawHub.',
        clawHubEmpty: 'No hay habilidades de ClawHub instaladas.',
        clawHubEmptyDescription:
            'Busca e instala habilidades desde el mercado de ClawHub.',
        clawHubInstall: 'Instalar',
        clawHubInstalled: 'Habilidad instalada desde ClawHub.',
        clawHubInstallFailed: 'Error al instalar la habilidad desde ClawHub!',
        clawHubRemove: 'Eliminar',
        clawHubRemoved: 'Habilidad de ClawHub eliminada.',
        clawHubRemoveFailed: 'Error al eliminar la habilidad de ClawHub!',
        clawHubUpdate: 'Actualizar',
        clawHubUpdated: 'Habilidad actualizada desde ClawHub.',
        clawHubUpdateFailed: 'Error al actualizar la habilidad de ClawHub!',
        clawHubUpdateAvailable: 'v{{version}} disponible',
        clawHubBy: 'por {{author}}',
        clawHubDownloads: '{{count}} descargas',
        clawHubVersion: 'v{{version}}',
        clawHubLoadFailed: 'Error al cargar ClawHub.',
        clawHubLoadFailedDescription:
            'No se pudo conectar al mercado de ClawHub. Por favor, intenta de nuevo.',
        tabVersions: 'Versiones',
        versionsSearch: 'Buscar versiones...',
        versionsEmpty: 'No se encontraron versiones',
        versionsEmptyDescription: 'Ninguna versión coincide con tu búsqueda.',
        versionsErrorDescription: 'Error al cargar las versiones.',
        versionsChangelog: 'Ver changelogs en npm',
        versionCurrent: 'Actual',
        versionLatest: 'Última',
        versionInstall: 'Instalar',
        versionInstalling: 'Instalando...',
        versionInstallSuccess: 'Versión {{version}} instalada con éxito.',
        versionInstallFailed: 'Error al instalar la versión!',
        versionDownloads: '{{count}} descargas',
        versionChangelog: 'Changelog',
        versionOutdated: 'Obsoleto',
        settingsName: 'Nombre',
        settingsNamePlaceholder: 'Ingresa el nombre del claw',
        settingsNameDescription: 'Solo letras, números y guiones.',
        subdomain: 'Subdominio',
        subdomainPlaceholder: 'Ingresa el subdominio',
        subdomainDescription: 'Letras minúsculas y números, 3-20 caracteres.',
        subdomainInvalid: 'Usa solo 3-20 letras minúsculas y números.',
        subdomainUpdated: 'Subdominio actualizado exitosamente.',
        subdomainUpdateFailed: '¡Error al actualizar el subdominio!',
        subdomainInUse: '¡Este subdominio es usado por otro claw!',
        settingsSave: 'Guardar',
        settingsSaving: 'Guardando...'
    },
    privacy: {
        title: 'Política de privacidad',
        description:
            'Conoce cómo ClawHost recopila, usa y protege tus datos personales.',
        lastUpdated: 'Última actualización: 17 de febrero de 2026',
        introTitle: '1. Introducción',
        introText:
            'ClawHost ("nosotros", "nuestro" o "nos") está comprometido a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando usas nuestro Servicio.',
        authTitle: '2. Autenticación',
        authText:
            'ClawHost usa Google Firebase Authentication para administrar cuentas de usuario. Puedes iniciar sesión con correo electrónico, Google o GitHub. Al usar estos métodos de inicio de sesión, aceptas sus respectivos términos y políticas de privacidad. Estos proveedores pueden recopilar datos básicos como tu dirección de correo electrónico, nombre e información del dispositivo. Solo almacenamos tu dirección de correo electrónico y nombre para mostrar.',
        collectTitle: '3. Información que recopilamos',
        collectText: 'Recopilamos información de las siguientes maneras:',
        personalInfoTitle: 'Información personal',
        personalInfoEmail:
            'Dirección de correo electrónico (para creación de cuenta y comunicación)',
        personalInfoName: 'Nombre (opcional, para personalización)',
        personalInfoPayment:
            'Información de pago (procesada de forma segura por proveedores externos)',
        serverInfoTitle: 'Información del servidor',
        serverInfoConfig:
            'Configuración y estado del servidor (alojado en Hetzner Cloud)',
        serverInfoIp: 'Dirección IP y ubicación del servidor',
        serverInfoResources:
            'Asignación de recursos (CPU, RAM, almacenamiento)',
        useTitle: '4. Cómo usamos tu información',
        useText: 'Usamos la información recopilada para:',
        useProvide: 'Proporcionar y mantener nuestro Servicio',
        useTransactions:
            'Procesar transacciones y enviar información de facturación',
        useNotices: 'Enviar avisos y actualizaciones importantes',
        useSupport: 'Responder a solicitudes de soporte al cliente',
        useAnalyze:
            'Monitorear y analizar patrones de uso para mejorar nuestro Servicio',
        useFraud: 'Detectar y prevenir fraude o abuso',
        sharingTitle: '5. Compartición y divulgación de datos',
        sharingText:
            'No vendemos tu información personal. Podemos compartir información con:',
        sharingProviders:
            'Proveedores de servicio que ayudan a operar nuestro Servicio (ej., proveedores de infraestructura en la nube)',
        sharingLegal:
            'Autoridades legales cuando lo requiera la ley o para proteger nuestros derechos',
        sharingBusiness:
            'Socios comerciales en caso de fusión, adquisición o venta de activos',
        securityTitle: '6. Seguridad de datos',
        securityText:
            'Implementamos medidas técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye cifrado, servidores seguros y evaluaciones de seguridad regulares.',
        retentionTitle: '7. Retención de datos',
        retentionText:
            'Retenemos tu información personal mientras tu cuenta esté activa o sea necesario para proporcionarte servicios. Podemos retener cierta información según lo requiera la ley o para propósitos comerciales legítimos.',
        rightsTitle: '8. Tus derechos',
        rightsText: 'Dependiendo de tu ubicación, puedes tener derecho a:',
        rightsAccess: 'Acceder a tus datos personales',
        rightsCorrect: 'Corregir datos inexactos',
        rightsDelete: 'Solicitar la eliminación de tus datos',
        rightsObject: 'Oponerte al procesamiento de tus datos',
        rightsPortability: 'Portabilidad de datos',
        rightsWithdraw: 'Retirar el consentimiento en cualquier momento',
        cookiesTitle: '9. Cookies y seguimiento',
        cookiesText:
            'No usamos cookies. La autenticación se maneja a través de Firebase y no depende de cookies almacenadas en tu navegador.',
        transfersTitle: '10. Transferencias internacionales de datos',
        transfersText:
            'Tu información puede ser transferida y procesada en países distintos al tuyo. Nos aseguramos de que existan las medidas de protección adecuadas para proteger tus datos de acuerdo con esta Política de Privacidad.',
        eligibilityTitle: '11. Elegibilidad',
        eligibilityText:
            'Nuestro Servicio está disponible para todos. No hay restricciones de edad para usar ClawHost.',
        changesTitle: '12. Cambios a esta política',
        changesText:
            'Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos de cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización".',
        contactTitle: '13. Contáctanos',
        contactText:
            'Si tienes preguntas sobre esta Política de Privacidad o deseas ejercer tus derechos, por favor contáctanos en'
    },
    terms: {
        title: 'Términos de servicio',
        description:
            'Lee los términos y condiciones para usar los servicios de ClawHost.',
        lastUpdated: 'Última actualización: 17 de febrero de 2026',
        acceptanceTitle: '1. Aceptación de términos',
        acceptanceText:
            'Al acceder y usar ClawHost ("Servicio"), aceptas y te comprometes a cumplir con los términos y disposiciones de este acuerdo. Si no estás de acuerdo con estos términos, por favor no uses nuestro Servicio.',
        serviceTitle: '2. Descripción del servicio',
        serviceText:
            'ClawHost proporciona despliegue de OpenClaw en un clic en servidores dedicados. Permitimos a los usuarios desplegar, administrar y acceder a instancias de OpenClaw preconfiguradas con acceso root completo y recursos dedicados.',
        authTitle: '3. Autenticación',
        authText:
            'ClawHost usa Google Firebase Authentication para administrar el inicio de sesión. Puedes autenticarte con correo electrónico, Google o GitHub. Al usar estos métodos, aceptas los respectivos términos y políticas de privacidad de Google y GitHub. Estos proveedores pueden recopilar información básica como tu dirección de correo electrónico, nombre y datos del dispositivo.',
        responsibilitiesTitle: '4. Responsabilidades del usuario',
        responsibilitiesText: 'Aceptas:',
        responsibilitiesAccurate:
            'Proporcionar información de registro precisa y completa',
        responsibilitiesSecurity:
            'Mantener la seguridad de las credenciales de tu cuenta',
        responsibilitiesCompliance:
            'Usar el Servicio en cumplimiento con todas las leyes aplicables',
        responsibilitiesLegal:
            'No usar el Servicio para ningún propósito ilegal o no autorizado',
        responsibilitiesAccess:
            'No intentar obtener acceso no autorizado a ningún sistema o red',
        prohibitedTitle: '5. Usos prohibidos',
        prohibitedText: 'No puedes usar nuestro Servicio para:',
        prohibitedMalware:
            'Distribuir malware, virus o cualquier software dañino',
        prohibitedDos:
            'Realizar ataques de denegación de servicio o abuso de red',
        prohibitedSpam: 'Enviar spam o comunicaciones no solicitadas',
        prohibitedIllegal: 'Alojar o distribuir contenido ilegal',
        prohibitedIp:
            'Violar derechos de terceros incluyendo propiedad intelectual',
        prohibitedMining: 'Minar criptomonedas',
        prohibitedOther:
            'Cualquier otra actividad ilegal o dañina que determinemos como inapropiada a nuestra discreción',
        paymentTitle: '6. Pagos y facturación',
        paymentText:
            'Los servicios se facturan mensualmente a tarifa fija. Todos los pagos no son reembolsables. Cuando pagas por un servidor, tienes acceso durante todo el período de facturación. Si cancelas, la cancelación toma efecto al final del período de facturación actual. Los precios están sujetos a cambios con aviso razonable. El incumplimiento de pago puede resultar en la suspensión o terminación de tu cuenta.',
        availabilityTitle: '7. Disponibilidad del servicio',
        availabilityText:
            'Nos esforzamos por mantener alta disponibilidad pero no garantizamos acceso ininterrumpido al Servicio. Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del Servicio en cualquier momento con o sin previo aviso.',
        liabilityTitle: '8. Limitación de responsabilidad',
        liabilityText:
            'En la máxima medida permitida por la ley, ClawHost no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, ni de ninguna pérdida de beneficios o ingresos, ya sea incurrida directa o indirectamente.',
        terminationTitle: '9. Terminación',
        terminationText:
            'Podemos terminar o suspender tu cuenta y acceso al Servicio inmediatamente, sin previo aviso, por conducta que creamos viola estos Términos o es dañina para otros usuarios, para nosotros o para terceros, o por cualquier otra razón.',
        changesToTermsTitle: '10. Cambios a los términos',
        changesToTermsText:
            'Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos a los usuarios de cualquier cambio material por correo electrónico o a través del Servicio. El uso continuado del Servicio después de dichas modificaciones constituye la aceptación de los términos actualizados.',
        contactTitle: '11. Información de contacto',
        contactText:
            'Si tienes alguna pregunta sobre estos Términos, por favor contáctanos en'
    },
    mobile: {
        messages: 'Mensajes',
        settings: 'Configuración',
        comingSoon: 'Próximamente',
        messagesPlaceholder: 'Los mensajes y notificaciones aparecerán aquí.',
        settingsPlaceholder:
            'La configuración de la cuenta y las preferencias aparecerán aquí.',
        signIn: 'Iniciar sesión',
        signInDescription:
            'Inicia sesión para administrar tus instancias de OpenClaw.',
        enterEmail: 'Correo electrónico',
        emailPlaceholder: 'ejemplo@clawhost.cloud',
        continueWithEmail: 'Continuar con correo',
        otpDescription:
            'Te enviaremos un código para iniciar sesión. Sin contraseña.',
        sending: 'Enviando...',
        checkYourEmail: 'Revisa tu correo',
        codeSentTo: 'Enviamos un código de 6 dígitos a',
        enterCode: 'Ingresa el código de tu correo',
        resendCode: 'Reenviar código',
        resendIn: 'Reenviar en {{seconds}}s',
        changeEmail: 'Cambiar correo',
        invalidCode: 'Código no válido',
        codeExpired: 'Código expirado. Por favor, solicita uno nuevo.',
        signingIn: 'Iniciando sesión...',
        signOut: 'Cerrar sesión',
        signedInAs: 'Sesión iniciada como',
        loadMore: 'Cargar más',
        chatWithYourClaw: 'Chatea con tu Claw',
        deployClaw: 'Desplegar Claw',
        deployYourFirstClaw: 'Despliega tu primer Claw'
    },
    productHunt: {
        liveOn: 'En vivo en',
        productHunt: 'Product Hunt',
        celebrate: 'Apóyanos y disfruta',
        discount: '10% de descuento',
        yourFirstMonth: 'en tu primer mes',
        upvoteNow: 'Vótanos'
    },
    featureRequests: {
        title: 'Solicitudes de funcionalidades',
        description: 'Vota por funcionalidades y sugiere nuevas.',
        subtitle:
            'Ayuda a dar forma al futuro de OpenClaw solicitando y votando funcionalidades.',
        submitRequest: 'Enviar solicitud',
        noRequestsYet: 'Sin solicitudes',
        noRequestsDescription: 'Aún no se han enviado solicitudes de funcionalidades. Sé el primero en compartir tus ideas.',
        statusAwaitingApproval: 'Pendiente de aprobación',
        statusRequested: 'Solicitada',
        statusMarkedForImplementation: 'Marcada para implementación',
        statusImplemented: 'Implementada',
        sortByUpvotes: 'Más votadas',
        sortByNewest: 'Más recientes',
        sortByStatus: 'Por estado',
        upvote: 'Votar',
        upvoted: 'Votado',
        signInToUpvote: 'Inicia sesión para votar.',
        signInToSubmit: 'Inicia sesión para enviar una solicitud.',
        requestedBy: 'Solicitada por',
        submitModalTitle: 'Enviar una solicitud de funcionalidad',
        submitModalDescription:
            'Describe la funcionalidad que te gustaría ver. Nuestros agentes de IA revisarán e implementarán las solicitudes aprobadas.',
        featureTitle: 'Título',
        featureTitlePlaceholder: 'Título de la funcionalidad',
        featureTitleMinLength:
            'El título debe tener al menos {{min}} caracteres.',
        featureTitleMaxLength:
            'El título debe tener {{max}} caracteres o menos.',
        featureDescription: 'Descripción',
        featureDescriptionPlaceholder:
            'Describe la funcionalidad que deseas, el problema que resuelve y cómo la imaginas.',
        featureDescriptionMinLength:
            'La descripción debe tener al menos {{min}} caracteres.',
        featureDescriptionMaxLength:
            'La descripción debe tener {{max}} caracteres o menos.',
        submitting: 'Enviando...',
        submitted: 'Solicitud de funcionalidad enviada.',
        failedToSubmit: 'Error al enviar la solicitud!',
        requestLimitReached:
            'Has alcanzado el máximo de {{limit}} solicitudes abiertas.',
        agentBannerTitle: 'Impulsado por los agentes de OpenClaw',
        agentBannerDescription:
            'Las solicitudes son revisadas y desarrolladas por los agentes de OpenClaw alojados en ClawHost. Vota por las funcionalidades que más deseas.',
        changeStatus: 'Cambiar estado',
        deleteRequest: 'Eliminar solicitud',
        deleteConfirmation:
            '¿Estás seguro de que deseas eliminar esta solicitud?',
        statusUpdated: 'Estado de la solicitud actualizado.',
        failedToUpdateStatus: 'Error al actualizar el estado!',
        deleted: 'Solicitud de funcionalidad eliminada.',
        failedToDelete: 'Error al eliminar!',
        upvoteToggled: 'Voto actualizado.',
        failedToUpvote: 'Error al actualizar el voto!',
        editModalTitle: 'Editar solicitud',
        editModalDescription:
            'Actualizar los detalles y el estado de la solicitud.',
        updated: 'Solicitud de funcionalidad actualizada.',
        failedToUpdate: 'Error al actualizar la solicitud!',
        status: 'Estado',
        dontAskAgain: 'No volver a preguntar al eliminar solicitudes en esta sesión',
        platforms: 'Plataformas',
        platformDesktop: 'Escritorio',
        platformMobile: 'Móvil',
        platformWeb: 'Web',
        platformRequired: 'Selecciona al menos una plataforma'
    },
    compare: {
        title: 'Comparación completa',
        description:
            'Descubre cómo ClawHost se compara con otras plataformas de alojamiento OpenClaw.',
        badge: 'Comparación',
        feature: 'Plataforma',
        lastUpdated: 'Última actualización: febrero 2026',
        competitorClawHost: 'ClawHost',
        competitorSimpleClaw: 'SimpleClaw',
        competitorMyClawAi: 'MyClaw.ai',
        categoryInfrastructure: 'Infraestructura',
        categoryPricing: 'Precios & Facturación',
        categoryDeployment: 'Despliegue & Configuración',
        categoryManagement: 'Gestión de OpenClaw',
        categorySecurity: 'Datos & Seguridad',
        categoryMonitoring: 'Monitoreo & Mantenimiento',
        categorySupport: 'Soporte & Plataforma',
        featureServerOwnership: 'Propiedad del servidor',
        featureProviderChoice: 'Elección de proveedor cloud',
        featureDedicatedResources: 'Recursos dedicados',
        featureRootAccess: 'Acceso root/SSH completo',
        featureServerLocations: 'Ubicaciones de servidores',
        featureStartingPrice: 'Precio inicial',
        featureTransparentPricing: 'Precios transparentes',
        featurePowerfulServers: 'Servidores potentes, menor precio',
        featureLocationSelection: 'Seleccionar ubicación del servidor',
        featureSubdomainAccess: 'Acceso por subdominio',
        featureThemes: 'Temas claro y oscuro',
        featureSetupTime: 'Tiempo de configuración',
        featureTechnicalSkill: 'Habilidades técnicas requeridas',
        featureOneClickDeploy: 'Despliegue con un clic',
        featureMultipleInstances: 'Múltiples instancias',
        featureMultipleAgents: 'Múltiples agentes por instancia',
        featureSkillsMarketplace: 'Marketplace de habilidades',
        featureChannelSupport: 'Soporte de canales',
        featureAgentConfig: 'Configuración de agentes',
        featureDataOwnership: 'Propiedad total de datos',
        featureDataExport: 'Exportación de datos',
        featureBackups: 'Copias de seguridad',
        featureSecurityHardening: 'Fortalecimiento de seguridad',
        featureSslTls: 'SSL/TLS',
        featureOpenSource: 'Código abierto',
        featureAutoUpdates: 'Actualizaciones automáticas',
        featureDiagnostics: 'Diagnósticos en tiempo real',
        featureLogStreaming: 'Streaming de registros',
        featureRepairTools: 'Herramientas de reparación',
        featureSupportChannels: 'Canales de soporte',
        featureMultiLanguage: 'Interfaz multilingüe',
        featureMobileApp: 'Aplicación móvil',
        featureDesktopApp: 'Aplicación de escritorio',
        featureSocials: 'Redes sociales',
        dedicatedVps: 'VPS dedicado',
        sharedContainers: 'Contenedores compartidos',
        isolatedContainers: 'Contenedores aislados',
        threeProviders: 'Hetzner, DigitalOcean, Vultr',
        singleProvider: 'Proveedor único',
        fullyDedicated: 'Totalmente dedicado',
        shared: 'Compartido',
        fullRootSsh: 'Root + SSH completo',
        noAccess: 'Sin acceso',
        thirtyPlusLocations: '30+ ubicaciones',
        limitedLocations: 'Limitado',
        fromTenMonth: 'Desde $10/mes',
        aboutFortyFourMonth: '~$44/mes promedio',
        fromNineteenMonth: '$19–79/mes',
        clearSpecsPricing: 'Especificaciones y precios claros',
        unclearPricing: 'Precios poco claros',
        fixedTiers: '3 niveles fijos',
        minutes: 'Minutos',
        underOneMinute: 'Menos de 1 minuto',
        thirtySeconds: '30 segundos',
        noneRequired: 'Ninguna',
        minimal: 'Mínima',
        unlimited: 'Ilimitadas',
        singleInstance: 'Única',
        fiveThousandSkills: '5.000+ habilidades (ClawHub)',
        noMarketplace: 'Sin marketplace',
        allChannels: 'WhatsApp, Telegram, Discord, Slack, Signal',
        telegramDiscord: 'Telegram, Discord',
        discordGithubSlack: 'Discord, GitHub, Slack',
        fullConfig: 'Configuración completa',
        limitedConfig: 'Limitada',
        zipExport: 'Exportación ZIP',
        noExport: 'Sin exportación',
        volumeStorage: 'Almacenamiento en volúmenes',
        noBackups: 'Sin copias de seguridad',
        dailyBackups: 'Copias de seguridad diarias',
        included: 'Incluido',
        notIncluded: 'No incluido',
        managed: 'Gestionado',
        manual: 'Manual',
        liveMonitoring: 'Monitoreo en vivo',
        liveLogs: 'Registros en vivo',
        oneClickRepair: 'Reparación con un clic',
        emailGithub: 'Email, GitHub',
        communityOnly: 'Solo comunidad',
        prioritySupport: 'Soporte 24/7 (Pro+)',
        fourLanguages: '4 idiomas',
        englishOnly: 'Solo inglés',
        available: 'Disponible',
        comingSoon: 'Próximamente',
        notAvailable: 'No disponible',
        disclaimer: '¿Algo cambió o es incorrecto? Escríbenos a',
        disclaimerOr: 'o abre un pull request en',
        github: 'GitHub',
        ctaTitle: '¿Listo para ver la diferencia?',
        ctaDescription:
            'Despliega OpenClaw en tu propio servidor dedicado. Propiedad total, precios transparentes y listo en minutos.'
    }
} as const

export default es
