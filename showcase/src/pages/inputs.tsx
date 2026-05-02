import { useState, useRef, useEffect } from 'react'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { z } from 'zod'
import { Section } from '../components/section'
import { Checkbox } from '@components/checkbox/checkbox'
import { Switch } from '@components/switch/switch'
import { Slider } from '@components/slider/slider'
import { FormInput } from '@components/form-input/form-input'
import { AutocompleteCell } from '@components/autocomplete-cell/autocomplete-cell'
import { AnimatedSearch } from '@components/animated-search/animated-search'
import { GooeyInput } from '@components/gooey-input/gooey-input'
import { useImageUpload } from '@components/use-image-upload/image-upload'
import { useToast } from '@components/toast/toast'
import { PasswordSetup } from '@components/password-setup/password-setup'
import visibilityData from '../../../_resources_/Visibility V3/visibility-V3.json'
import { suggestions } from '../data'

function AnimatedEyeToggle({ visible, size = 20 }: { visible: boolean; size?: number }) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const anim = lottieRef.current
    if (!anim) return
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    anim.setDirection(visible ? -1 : 1)
    anim.play()
  }, [visible])

  return (
    <div style={{ filter: 'var(--icon-invert, invert(1))' }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={visibilityData}
        loop={false}
        autoplay={false}
        style={{ width: size, height: size }}
      />
    </div>
  )
}

const signupSchema = z.object({
  name: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.email('Ungültige E-Mail-Adresse'),
  phone: z.string().min(6, 'Telefonnummer zu kurz'),
  age: z.number({ error: 'Bitte eine Zahl eingeben' }).int('Ganze Zahl').min(18, 'Mindestalter 18').max(120, 'Zu hoch'),
  website: z.url('Ungültige URL').optional().or(z.literal('')),
})

function FormInputDemo() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', age: '', website: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
  const { add } = useToast()

  function validate(field: keyof typeof form, val: string) {
    const res = signupSchema.shape[field].safeParse(
      field === 'age' ? (val === '' ? undefined : Number(val)) : val
    )
    setErrors(prev => ({ ...prev, [field]: res.success ? undefined : res.error.issues[0].message }))
    return res.success
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const result = signupSchema.safeParse({
      name: form.name,
      email: form.email,
      phone: form.phone,
      age: form.age === '' ? undefined : Number(form.age),
      website: form.website,
    })
    
    if (result.success) {
      setErrors({})
      add({ title: 'Success', description: 'Alle Felder valide.', variant: 'success' })
      return
    }

    const flat: Partial<Record<keyof typeof form, string>> = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof typeof form
      if (!flat[key]) flat[key] = issue.message
    }
    setErrors(flat)
    add({ title: 'Ungültige Eingaben', description: 'Bitte Fehler beheben.', variant: 'danger' })
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="border border-border rounded-xl bg-card p-6 shadow-sm max-w-xl flex flex-col gap-4"
    >
      <FormInput
        type="text"
        label="Name"
        placeholder="Anna Müller"
        value={form.name}
        error={errors.name}
        onChange={(e) => {
          const v = e.target.value
          setForm(f => ({ ...f, name: v }))
          validate('name', v)
        }}
      />
      <FormInput
        type="email"
        label="E-Mail"
        placeholder="anna@beispiel.de"
        value={form.email}
        error={errors.email}
        onChange={(e) => {
          const v = e.target.value
          setForm(f => ({ ...f, email: v }))
          validate('email', v)
        }}
        leftIcon={
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
          </svg>
        }
      />
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          type="number"
          label="Alter"
          placeholder="18–120"
          value={form.age}
          error={errors.age}
          onChange={(e) => {
            const v = e.target.value
            setForm(f => ({ ...f, age: v }))
            validate('age', v)
          }}
        />
        <FormInput
          type="url"
          label="Website"
          placeholder="https://"
          value={form.website}
          error={errors.website}
          onChange={(e) => {
            const v = e.target.value
            setForm(f => ({ ...f, website: v }))
            validate('website', v)
          }}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium cursor-pointer transition-opacity active:scale-95 hover:opacity-90"
        >
          Absenden
        </button>
        <button
          type="button"
          onClick={() => { setForm({ name: '', email: '', phone: '', age: '', website: '' }); setServerErrors({}) }}
          className="px-4 py-2 rounded-md border border-border bg-transparent text-foreground text-sm cursor-pointer transition-colors hover:bg-white/5"
        >
          Zurücksetzen
        </button>
      </div>
    </form>
  )
}

function ImageUploadDemo() {
  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload()

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden max-w-96 shadow-sm">
      <div
        onClick={!previewUrl ? handleThumbnailClick : undefined}
        className={`h-48 flex items-center justify-center relative transition-colors ${
          previewUrl ? 'cursor-default' : 'cursor-pointer bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={fileName ?? 'Preview'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <svg
              width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="mx-auto mb-3 opacity-50"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p className="text-[0.8125rem]">Click to upload an image</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="border-t border-border p-3 px-4 flex items-center justify-between text-[0.8125rem]">
        <span className={`truncate max-w-[70%] ${fileName ? 'text-foreground' : 'text-muted-foreground'}`}>
          {fileName ?? 'No file selected'}
        </span>
        <div className="flex gap-2">
          {previewUrl && (
            <button
              onClick={handleRemove}
              className="bg-transparent border border-border rounded-md text-red-500 px-2.5 py-1 text-xs cursor-pointer transition-colors hover:bg-red-500/10"
            >
              Remove
            </button>
          )}
          <button
            onClick={handleThumbnailClick}
            className={`rounded-md px-2.5 py-1 text-xs cursor-pointer transition-opacity active:scale-95 ${
              previewUrl ? 'bg-transparent border border-border text-foreground' : 'bg-accent text-white'
            }`}
          >
            {previewUrl ? 'Replace' : 'Browse'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function InputsPage() {
  const [autocompleteValue, setAutocompleteValue] = useState('')
  const [volume, setVolume] = useState(60)
  const { add } = useToast()

  return (
    <>
      <Section title="PasswordSetup" description="Fancy dot-based password creation with strength meter and reveal animations.">
        <div className="max-w-96">
          <PasswordSetup
            passwordLabel="Passwort"
            confirmLabel="Passwort bestätigen"
            passwordPlaceholder="Dein Passwort eingeben..."
            renderVisibilityIcon={(visible) => (
              <AnimatedEyeToggle visible={visible} size={20} />
            )}
            onMatch={(pw) => add({ title: 'Match!', description: 'Passwörter stimmen überein.', variant: 'success' })}
          />
        </div>
      </Section>

      <Section title="FormInput + Zod" description="Schema-driven inputs with real-time validation and error shake.">
        <FormInputDemo />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section title="Checkbox" description="Animated checkmark with scale-from-center fill.">
          <Checkbox label="Accept terms and conditions" defaultChecked />
        </Section>

        <Section title="Switch" description="iOS-style toggle with thumb squish animation.">
          <Switch label="Enable notifications" defaultChecked />
        </Section>
      </div>

      <Section title="Slider" description="Range slider with thumb squish on grab and accent-aware fill.">
        <div className="max-w-96">
          <Slider
            label="Volume Control"
            value={volume}
            onChange={setVolume}
            formatValue={(v) => `${v} %`}
          />
        </div>
      </Section>

      <Section title="AutocompleteCell" description="Input field with filtered autocomplete suggestions.">
        <div className="max-w-96">
          <AutocompleteCell
            value={autocompleteValue}
            onChange={setAutocompleteValue}
            suggestions={suggestions}
            placeholder="Search frameworks..."
          />
        </div>
      </Section>

      <Section title="GooeyInput" description="Icon-only circle that morphs into a full input via SVG-goo filter.">
        <div className="border border-border rounded-xl bg-card p-10 flex flex-col gap-6">
          <GooeyInput
            placeholder="Weine durchsuchen..."
            onSubmit={(v) => add({ title: 'Suche gestartet', description: `Suchen nach: "${v}"`, variant: 'default' })}
          />
          <p className="text-[0.7rem] text-muted-foreground">Esc zum Schließen · Enter zum Absenden</p>
        </div>
      </Section>

      <Section title="AnimatedSearch" description="Search icon that morphs into an expanding input field.">
        <div className="border border-border rounded-xl bg-card p-10 flex flex-col items-center gap-6">
          <AnimatedSearch
            placeholder="Search components..."
            onSearch={(v) => add({ title: 'Search', description: `Searching for: ${v}`, variant: 'default' })}
          />
          <p className="text-[0.7rem] text-muted-foreground">Spring physics powered icon morph</p>
        </div>
      </Section>

      <Section title="useImageUpload" description="Hook for image upload with preview and removal logic.">
        <ImageUploadDemo />
      </Section>
    </>
  )
}
