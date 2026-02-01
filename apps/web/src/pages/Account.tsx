import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { api, Instance } from '../lib/api'
import { useUIStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import { CircleNotch, HardDrive, Calendar } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'

export default function Account() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { showToast } = useUIStore()

  const [name, setName] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch profile to get name
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
    enabled: !!user,
  })

  // Initialize name from profile when loaded
  useEffect(() => {
    if (profile?.name) {
      setName(profile.name)
    }
  }, [profile?.name])

  // Use cached instances data from Dashboard
  const instances = queryClient.getQueryData<Instance[]>(['instances'])

  const updateMutation = useMutation({
    mutationFn: (newName: string) => api.updateProfile({ name: newName }),
    onSuccess: (data) => {
      setName(data.name || '')
      setHasChanges(false)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      showToast('Profile updated successfully!', 'success')
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to update profile.', 'error')
    },
  })

  const handleNameChange = (value: string) => {
    setName(value)
    setHasChanges(value !== (profile?.name || ''))
  }

  const handleSave = () => {
    updateMutation.mutate(name)
  }

  const email = user?.email || ''
  const displayName = name || profile?.name || email

  const getInitials = (text: string) => {
    if (!text) return '?'
    const parts = text.split(' ')
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    }
    return text.charAt(0).toUpperCase()
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '...'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const joinedDate = user?.metadata?.creationTime

  return (
<div className="relative min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <PageTitle title="Account" />
      <PageBackground />
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex-1 max-w-6xl mx-auto px-6 py-8 w-full"
      >
        <PageHeader
          title="Account Settings"
          description="Manage your account information"
        />

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="font-semibold mb-6">Profile Information</h3>

          <div className="flex items-start gap-6 mb-8">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-br from-[#ef5350] to-[#c62828] text-white text-4xl font-semibold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <p className="font-medium text-lg">
                  {name || profile?.name || 'No name set'}
                </p>
                <p className="text-muted-foreground text-sm">{email}</p>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(joinedDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4" />
                  <span>{instances?.length ?? 0} claws</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your name"
                maxLength={100}
              />
            </div>

            <div className="flex justify-end pt-6">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateMutation.isPending}
              >
                {updateMutation.isPending && (
                  <CircleNotch className="w-4 h-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </div>
        </div>
      </motion.main>

      <LandingFooter />
    </div>
  )
}
