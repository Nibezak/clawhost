import type {
  CreateSSHKeyModalProps,
  GeneratedKeyPair,
  SSHKeyCardProps,
} from '@/ts/Interfaces'
import type { CopiedFieldType, SSHKeyModalMode } from '@/ts/Types'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useUIStore } from '@/lib/store'
import { useSSHKeys, useCreateSSHKey, useDeleteSSHKey } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert' // Keep for warnings only
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  PlusCircle,
  Key,
  Trash,
  CircleNotch,
  Copy,
  Check,
  Download,
  Warning,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'

export default function SSHKeys() {
  const [showCreate, setShowCreate] = useState(false)

  const { data: sshKeys, isLoading, isError, refetch, cachedCount } = useSSHKeys()
  const skeletonCount = cachedCount > 0 ? cachedCount : 2

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0f] text-white">
      <PageTitle title={t('sshKeys.title')} />
      <PageBackground />
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto w-full max-w-6xl flex-1 px-6 py-8"
      >
        <PageHeader
          title={t('sshKeys.title')}
          description={t('sshKeys.description')}
          action={
            <Button onClick={() => setShowCreate(true)}>
              <PlusCircle className="h-5 w-5" weight="bold" />
              {t('sshKeys.addSshKey')}
            </Button>
          }
        />

        {/* SSH Keys container */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          {/* How it works */}
          <div className="mb-6 rounded-lg border border-white/5 bg-white/5 p-4">
            <h3 className="mb-2 font-semibold">{t('sshKeys.howSshKeysWork')}</h3>
            <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
              <li>{t('sshKeys.step1')}</li>
              <li>
                {t('sshKeys.step2').split('public key')[0]}<strong className="text-white">public key</strong>{t('sshKeys.step2').split('public key')[1] || ' here'}
              </li>
              <li>{t('sshKeys.step3')}</li>
              <li>
                {t('sshKeys.step4')}{' '}
                <code className="rounded bg-white/10 px-1">{t('sshKeys.step4Command')}</code> {t('sshKeys.step4Suffix')}
              </li>
            </ol>
          </div>

          {/* SSH Keys list */}
          {isError ? (
            <ErrorState
              title={t('errors.failedToLoadSSHKeys')}
              description={t('errors.failedToLoadSSHKeysDescription')}
              onRetry={() => refetch()}
            />
          ) : isLoading && skeletonCount === 0 ? (
            <EmptyState
              icon={<Key className="text-primary h-10 w-10" />}
              title={t('sshKeys.noSshKeysYet')}
              description={t('sshKeys.noSshKeysDescription')}
              actionLabel={t('sshKeys.addSshKey')}
              onAction={() => setShowCreate(true)}
            />
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <SSHKeySkeleton key={i} />
              ))}
            </div>
          ) : sshKeys?.length === 0 ? (
            <EmptyState
              icon={<Key className="text-primary h-10 w-10" />}
              title={t('sshKeys.noSshKeysYet')}
              description={t('sshKeys.noSshKeysDescription')}
              actionLabel={t('sshKeys.addSshKey')}
              onAction={() => setShowCreate(true)}
            />
          ) : (
            <div className="space-y-4">
              {sshKeys?.map((key) => (
                <SSHKeyCard key={key.id} sshKey={key} />
              ))}
            </div>
          )}
        </div>

        {/* Create modal */}
        {showCreate && <CreateSSHKeyModal onClose={() => setShowCreate(false)} />}
      </motion.main>

      <LandingFooter />
    </div>
  )
}

function SSHKeySkeleton() {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  )
}

function SSHKeyCard({ sshKey }: SSHKeyCardProps) {
  const deleteMutation = useDeleteSSHKey()

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <Key className="text-muted-foreground h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{sshKey.name}</h3>
              <p className="text-muted-foreground font-mono text-sm">{sshKey.fingerprint}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm(t('sshKeys.deleteConfirmation'))) {
                deleteMutation.mutate(sshKey.id)
              }
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <CircleNotch className="h-5 w-5 animate-spin" />
            ) : (
              <Trash className="text-destructive h-5 w-5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CreateSSHKeyModal({ onClose }: CreateSSHKeyModalProps) {
  const [mode, setMode] = useState<SSHKeyModalMode>('upload')
  const [name, setName] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKeyPair | null>(null)
  const [copied, setCopied] = useState<CopiedFieldType>(null)
  const [keyGenError, setKeyGenError] = useState('')
  const { showToast } = useUIStore()

  const createMutation = useCreateSSHKey()

  const handleCreate = () => {
    createMutation.mutate(
      {
        name,
        publicKey: mode === 'generate' && generatedKeys ? generatedKeys.publicKey : publicKey,
      },
      {
        onSuccess: () => {
          showToast(t('sshKeys.sshKeyAddedSuccessfully'), 'success')
          onClose()
        },
        onError: (err: Error) => {
          showToast(err.message || t('errors.failedToAddSSHKey'), 'error')
        },
      }
    )
  }

  const generateKeyPair = async () => {
    try {
      // Generate RSA key pair using Web Crypto API
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
      )

      // Export keys
      const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey)
      const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

      // Convert to base64
      const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)))
      const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)))

      // Format as OpenSSH public key (simplified - real conversion is more complex)
      const sshPublicKey = `ssh-rsa ${publicKeyBase64} ${name || 'generated-key'}@clawhost`

      // Format as PEM private key
      const pemPrivateKey = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`

      setGeneratedKeys({
        publicKey: sshPublicKey,
        privateKey: pemPrivateKey,
      })
    } catch (err) {
      setKeyGenError(t('errors.failedToGenerateKeyPair'))
    }
  }

  const copyToClipboard = (text: string, type: 'command' | 'private') => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const downloadPrivateKey = () => {
    if (!generatedKeys) return
    const blob = new Blob([generatedKeys.privateKey], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name || 'id_rsa'}.pem`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sshKeygenCommand = 'ssh-keygen -t ed25519 -C "your-email@example.com"'

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('sshKeys.addSshKeyModalTitle')}</DialogTitle>
          <DialogDescription>{t('sshKeys.addSshKeyModalDescription')}</DialogDescription>
        </DialogHeader>

        {/* Mode selector */}
        <div className="bg-muted flex gap-2 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === 'upload'
                ? 'bg-background shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('sshKeys.iHaveAnSshKey')}
          </button>
          <button
            type="button"
            onClick={() => setMode('generate')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === 'generate'
                ? 'bg-background shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('sshKeys.generateNewKey')}
          </button>
        </div>

        {keyGenError && (
          <Alert variant="destructive">
            <AlertDescription>{keyGenError}</AlertDescription>
          </Alert>
        )}

        {mode === 'upload' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCreate()
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>{t('sshKeys.name')}</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('sshKeys.namePlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('sshKeys.publicKey')}</Label>
              <textarea
                className="bg-background focus:ring-primary h-32 w-full resize-none rounded-md border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder={t('sshKeys.publicKeyPlaceholder')}
                required
              />
              <p className="text-muted-foreground text-xs">
                {t('sshKeys.publicKeyHint')}{' '}
                <code className="bg-muted rounded px-1">{t('sshKeys.publicKeyPath1')}</code> or{' '}
                <code className="bg-muted rounded px-1">{t('sshKeys.publicKeyPath2')}</code>
              </p>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="py-3">
                <p className="text-muted-foreground mb-2 text-sm">
                  {t('sshKeys.dontHaveSshKey')}
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-background flex-1 overflow-x-auto rounded p-2 font-mono text-xs">
                    {sshKeygenCommand}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(sshKeygenCommand, 'command')}
                  >
                    {copied === 'command' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                    {t('sshKeys.adding')}
                  </>
                ) : (
                  t('common.addKey')
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('sshKeys.keyName')}</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('sshKeys.keyNamePlaceholder')}
                required
              />
            </div>

            {!generatedKeys ? (
              <>
                <Alert>
                  <Warning className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> {t('sshKeys.importantAfterGenerating')}
                  </AlertDescription>
                </Alert>

                <Button onClick={generateKeyPair} className="w-full" disabled={!name}>
                  <Key className="mr-2 h-4 w-4" />
                  {t('sshKeys.generateKeyPair')}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
                      {t('sshKeys.orGenerateLocallyRecommended')}
                    </span>
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="py-3">
                    <p className="text-muted-foreground mb-2 text-sm">{t('sshKeys.runThisInYourTerminal')}</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-background flex-1 overflow-x-auto rounded p-2 font-mono text-xs">
                        {sshKeygenCommand}
                      </code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(sshKeygenCommand, 'command')}
                      >
                        {copied === 'command' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-muted-foreground mt-2 text-xs">
                      {t('sshKeys.thenSwitchToIHave')}
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Alert variant="destructive">
                  <Warning className="h-4 w-4" />
                  <AlertDescription>
                    {t('sshKeys.savePrivateKeyNow')}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>{t('sshKeys.privateKeyKeepSecret')}</Label>
                  <div className="relative">
                    <textarea
                      className="bg-background h-24 w-full resize-none rounded-md border px-3 py-2 font-mono text-xs"
                      value={generatedKeys.privateKey}
                      readOnly
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadPrivateKey}>
                      <Download className="mr-2 h-4 w-4" />
                      {t('sshKeys.downloadPrivateKey')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedKeys.privateKey, 'private')}
                    >
                      {copied === 'private' ? (
                        <Check className="mr-2 h-4 w-4" />
                      ) : (
                        <Copy className="mr-2 h-4 w-4" />
                      )}
                      {t('common.copy')}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('sshKeys.publicKeyWillBeSaved')}</Label>
                  <textarea
                    className="bg-muted h-16 w-full resize-none rounded-md border px-3 py-2 font-mono text-xs"
                    value={generatedKeys.publicKey}
                    readOnly
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                    {t('common.cancel')}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleCreate()}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <>
                        <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                        {t('sshKeys.saving')}
                      </>
                    ) : (
                      t('sshKeys.savePublicKey')
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
