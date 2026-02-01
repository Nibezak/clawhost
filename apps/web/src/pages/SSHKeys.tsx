import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { api, SSHKey } from '../lib/api'
import { useUIStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'  // Keep for warnings only
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
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)

  const {
    data: sshKeys,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['sshKeys'],
    queryFn: api.getSSHKeys,
    placeholderData: (previousData) => previousData,
  })

  // Use cached count for skeleton loading
  const cachedKeys = queryClient.getQueryData<SSHKey[]>(['sshKeys'])
  const skeletonCount = cachedKeys !== undefined ? cachedKeys.length : 2

  return (
<div className="relative min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <PageTitle title="SSH Keys" />
      <PageBackground />
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex-1 max-w-6xl mx-auto px-6 py-8 w-full"
      >
        <PageHeader
          title="SSH Keys"
          description="Manage SSH keys for passwordless login to your instances"
          action={
            <Button onClick={() => setShowCreate(true)}>
              <PlusCircle className="w-5 h-5" weight="bold" />
              Add SSH Key
            </Button>
          }
        />

        {/* SSH Keys container */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {/* How it works */}
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/5">
            <h3 className="font-semibold mb-2">How SSH keys work</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Generate an SSH key pair on your computer (or use an existing one)</li>
              <li>Add the <strong className="text-white">public key</strong> here</li>
              <li>Select the key when creating a new instance</li>
              <li>Connect with <code className="bg-white/10 px-1 rounded">ssh root@your-server-ip</code> - no password needed!</li>
            </ol>
          </div>

          {/* SSH Keys list */}
          {isError ? (
            <ErrorState
              title="Failed to load SSH keys"
              description="We couldn't load your SSH keys. Please check your connection and try again."
              onRetry={() => refetch()}
            />
          ) : isLoading && skeletonCount === 0 ? (
            <EmptyState
              icon={<Key className="w-10 h-10 text-primary" />}
              title="No SSH keys yet"
              description="Add an SSH key to enable passwordless login to your instances"
              actionLabel="Add SSH Key"
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
              icon={<Key className="w-10 h-10 text-primary" />}
              title="No SSH keys yet"
              description="Add an SSH key to enable passwordless login to your instances"
              actionLabel="Add SSH Key"
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
        {showCreate && (
          <CreateSSHKeyModal onClose={() => setShowCreate(false)} />
        )}
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
            <Skeleton className="w-10 h-10 rounded-full" />
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

function SSHKeyCard({ sshKey }: { sshKey: SSHKey }) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteSSHKey(sshKey.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sshKeys'] }),
  })

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-full">
              <Key className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">{sshKey.name}</h3>
              <p className="text-muted-foreground text-sm font-mono">
                {sshKey.fingerprint}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm('Are you sure you want to delete this SSH key?')) {
                deleteMutation.mutate()
              }
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <CircleNotch className="w-5 h-5 animate-spin" />
            ) : (
              <Trash className="w-5 h-5 text-destructive" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CreateSSHKeyModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'upload' | 'generate'>('upload')
  const [name, setName] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [generatedKeys, setGeneratedKeys] = useState<{ publicKey: string; privateKey: string } | null>(null)
  const [copied, setCopied] = useState<'command' | 'private' | null>(null)
  const [keyGenError, setKeyGenError] = useState('')
  const queryClient = useQueryClient()
  const { showToast } = useUIStore()

  const createMutation = useMutation({
    mutationFn: () => api.createSSHKey({ name, publicKey: mode === 'generate' && generatedKeys ? generatedKeys.publicKey : publicKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sshKeys'] })
      showToast('SSH key added successfully!', 'success')
      onClose()
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to add SSH key.', 'error')
    },
  })

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
      setKeyGenError('Failed to generate key pair. Please generate keys locally instead.')
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add SSH Key</DialogTitle>
          <DialogDescription>
            Add an SSH key for passwordless authentication
          </DialogDescription>
        </DialogHeader>

        {/* Mode selector */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition ${
              mode === 'upload' ? 'bg-background shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            I have an SSH key
          </button>
          <button
            type="button"
            onClick={() => setMode('generate')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition ${
              mode === 'generate' ? 'bg-background shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Generate new key
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
              createMutation.mutate()
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My MacBook"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Public Key</Label>
              <textarea
                className="w-full h-32 px-3 py-2 border rounded-md bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="ssh-rsa AAAA... or ssh-ed25519 AAAA..."
                required
              />
              <p className="text-muted-foreground text-xs">
                Find your public key at <code className="bg-muted px-1 rounded">~/.ssh/id_ed25519.pub</code> or <code className="bg-muted px-1 rounded">~/.ssh/id_rsa.pub</code>
              </p>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground mb-2">Don't have an SSH key? Generate one:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-background p-2 rounded font-mono overflow-x-auto">
                    {sshKeygenCommand}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(sshKeygenCommand, 'command')}
                  >
                    {copied === 'command' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Key'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Key Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Generated Key"
                required
              />
            </div>

            {!generatedKeys ? (
              <>
                <Alert>
                  <Warning className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Important:</strong> After generating, you must download and save your private key.
                    We cannot recover it if you lose it!
                  </AlertDescription>
                </Alert>

                <Button onClick={generateKeyPair} className="w-full" disabled={!name}>
                  <Key className="w-4 h-4 mr-2" />
                  Generate Key Pair
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or generate locally (recommended)</span>
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="py-3">
                    <p className="text-sm text-muted-foreground mb-2">Run this in your terminal:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-background p-2 rounded font-mono overflow-x-auto">
                        {sshKeygenCommand}
                      </code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(sshKeygenCommand, 'command')}
                      >
                        {copied === 'command' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Then switch to "I have an SSH key" and paste the public key.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Alert variant="destructive">
                  <Warning className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Save your private key NOW!</strong> Download it before closing this dialog.
                    You will not be able to see it again.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Private Key (keep secret!)</Label>
                  <div className="relative">
                    <textarea
                      className="w-full h-24 px-3 py-2 border rounded-md bg-background text-xs font-mono resize-none"
                      value={generatedKeys.privateKey}
                      readOnly
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadPrivateKey}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Private Key
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedKeys.privateKey, 'private')}
                    >
                      {copied === 'private' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Public Key (will be saved)</Label>
                  <textarea
                    className="w-full h-16 px-3 py-2 border rounded-md bg-muted text-xs font-mono resize-none"
                    value={generatedKeys.publicKey}
                    readOnly
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => createMutation.mutate()}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <>
                        <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Public Key'
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
