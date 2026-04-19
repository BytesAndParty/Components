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
import { useImageUpload } from '@components/use-image-upload/use-image-upload'
import { useToast } from '@components/toast/toast'
import { PasswordConfirmation } from '@components/password-confirmation/password-confirmation'
import { PasswordSetup } from '@components/password-setup/password-setup'
import visibilityData from '../../../_resources_/Visibility V3/visibility-V3.json'
import { suggestions } from '../data'

// Lottie Eye-Toggle: spielt vorwärts wenn visible=true, rückwärts wenn false.
// Muss module-level sein damit React die Instanz nicht bei jedem Re-render neu mountet.
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

function PasswordConfirmationDemo() {
  const [password] = useState('weinhaus2024')

  return (
    <div className="max-w-96 space-y-4">
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
          Password (pre-filled)
        </label>
        <input
          type="text"
          readOnly
          value="weinhaus2024"
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--foreground)',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
          Confirm password
        </label>
        <PasswordConfirmation
          password={password}
          placeholder="Type to confirm..."
        />
      </div>
      <p className="text-muted-foreground text-xs">
        Each dot shows green (match) or red (mismatch). Shake on overflow, bounce on full match.
      </p>
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

const emailSchema = signupSchema.shape.email
const phoneSchema = signupSchema.shape.phone
const ageSchema = signupSchema.shape.age
const urlSchema = signupSchema.shape.website
const nameSchema = signupSchema.shape.name

function FormInputDemo() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', age: '', website: '' })
  const [serverErrors, setServerErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
  const { add } = useToast()

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
      setServerErrors({})
      add({ title: 'Success', description: 'Alle Felder valide.', variant: 'success' })
      return
    }
    const flat: Partial<Record<keyof typeof form, string>> = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof typeof form
      if (!flat[key]) flat[key] = issue.message
    }
    setServerErrors(flat)
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
        schema={nameSchema}
        value={form.name}
        onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        forceError={serverErrors.name ?? null}
      />
      <FormInput
        type="email"
        label="E-Mail"
        placeholder="anna@beispiel.de"
        schema={emailSchema}
        value={form.email}
        onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        forceError={serverErrors.email ?? null}
        leftIcon={
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
          </svg>
        }
      />
      <FormInput
        type="tel"
        label="Telefon"
        placeholder="+49 151 …"
        autoFormatPhone
        schema={phoneSchema}
        value={form.phone}
        onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
        forceError={serverErrors.phone ?? null}
        description="Automatische Formatierung für DE / US — andere Länder werden gruppiert."
      />
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          type="number"
          label="Alter"
          placeholder="18–120"
          min={18}
          max={120}
          schema={ageSchema}
          value={form.age}
          onChange={(v) => setForm((f) => ({ ...f, age: v }))}
          forceError={serverErrors.age ?? null}
        />
        <FormInput
          type="url"
          label="Website (optional)"
          placeholder="https://"
          schema={urlSchema}
          value={form.website}
          onChange={(v) => setForm((f) => ({ ...f, website: v }))}
          forceError={serverErrors.website ?? null}
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
        <p className="text-muted-foreground text-xs ml-auto">
          Live: onBlur · Server: onSubmit via forceError
        </p>
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
            <p className="text-[0.7rem] opacity-50 mt-1">JPG, PNG, GIF, WebP</p>
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
  const [priceRange, setPriceRange] = useState(35)
  const { add } = useToast()

  return (
    <>
      <Section title="Checkbox" description="Animated checkbox with stroke-draw checkmark and scale-from-center fill.">
        <div className="flex flex-col gap-4">
          <Checkbox label="Accept terms and conditions" size="md" />
          <Checkbox label="Subscribe to newsletter" size="md" defaultChecked />
          <div className="flex gap-6">
            <Checkbox label="Small" size="sm" />
            <Checkbox label="Medium" size="md" />
            <Checkbox label="Large" size="lg" />
          </div>
          <Checkbox label="Disabled" size="md" disabled />
        </div>
      </Section>

      <Section title="Switch" description="iOS-style toggle with thumb squish animation on press.">
        <div className="flex flex-col gap-4">
          <Switch label="Dark mode" size="md" />
          <Switch label="Notifications" size="md" defaultChecked />
          <div className="flex gap-6">
            <Switch label="Small" size="sm" />
            <Switch label="Medium" size="md" />
            <Switch label="Large" size="lg" />
          </div>
          <Switch label="Disabled" size="md" disabled />
        </div>
      </Section>

      <Section title="FormInput + Zod v4" description="Schema-driven text/email/tel/number inputs. Validates via any .safeParse() validator — Zod v4 shown here. Error shake, success checkmark, accessible aria-invalid/-describedby.">
        <FormInputDemo />
      </Section>

      <Section title="Slider" description="Range slider with drag-to-set, keyboard steering, thumb squish on grab, and accent-aware fill.">
        <div className="flex flex-col gap-8 max-w-96">
          <Slider
            label="Volume"
            value={volume}
            onChange={setVolume}
            formatValue={(v) => `${v} %`}
          />
          <Slider
            label="Max. Preis"
            value={priceRange}
            onChange={setPriceRange}
            min={0}
            max={200}
            step={5}
            formatValue={(v) => `€ ${v}`}
          />
          <div className="flex flex-col gap-5">
            <Slider label="Small" defaultValue={25} size="sm" />
            <Slider label="Medium" defaultValue={50} size="md" />
            <Slider label="Large" defaultValue={75} size="lg" />
          </div>
          <Slider label="Disabled" defaultValue={40} disabled />
        </div>
        <p className="text-muted-foreground text-xs mt-4">
          Tab zum Fokussieren, dann <code>←</code>/<code>→</code> zum Steuern, <code>PgUp</code>/<code>PgDn</code> für große Sprünge, <code>Home</code>/<code>End</code> für Min/Max.
        </p>
      </Section>

      <Section title="AutocompleteCell" description="Input field with filtered autocomplete suggestions.">
        <div className="max-w-96">
          <AutocompleteCell
            value={autocompleteValue}
            onChange={setAutocompleteValue}
            suggestions={suggestions}
            placeholder="Search tools & frameworks..."
          />
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Try: "re", "type", "vi", "dr", "node"
        </p>
      </Section>

      <Section title="GooeyInput" description="Icon-only circle that morphs into a full input via SVG-goo filter. ~1.2s slow morph for liquid feel.">
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <div className="p-10 flex flex-col gap-8 items-start">
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-muted-foreground text-sm">Default (accent):</span>
              <GooeyInput
                placeholder="Weine durchsuchen..."
                onSubmit={(v) => add({ title: 'Suche', description: `"${v}"`, variant: 'default' })}
              />
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-muted-foreground text-sm">Wider + custom color:</span>
              <GooeyInput
                placeholder="Was suchen Sie?"
                width={420}
                color="#10b981"
                onSubmit={(v) => add({ title: 'Suche', description: `"${v}"`, variant: 'success' })}
              />
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-muted-foreground text-sm">Fast (600 ms):</span>
              <GooeyInput
                placeholder="Schnell..."
                duration={600}
                color="#ec4899"
              />
            </div>
          </div>
          <div className="border-t border-border p-3 px-8 flex justify-between text-[0.7rem] text-muted-foreground bg-white/[0.01]">
            <span>GooeyInput · SVG goo filter · morph</span>
            <span>Esc zum Schließen · Enter zum Absenden</span>
          </div>
        </div>
      </Section>

      <Section title="AnimatedSearch" description="Search icon that morphs into an expanding search input field.">
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <div className="p-12 px-8 flex flex-col items-center gap-8">
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground text-sm">Click the icon:</span>
              <AnimatedSearch
                placeholder="Search components..."
                onSearch={(v) => add({ title: 'Search', description: `Searching for: ${v}`, variant: 'default' })}
              />
            </div>
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground text-sm">Wider variant:</span>
              <AnimatedSearch
                placeholder="What are you looking for?"
                expandedWidth={360}
                onSearch={(v) => add({ title: 'Search', description: `Searching for: ${v}`, variant: 'default' })}
              />
            </div>
          </div>
          <div className="border-t border-border p-3 px-8 flex justify-between text-[0.7rem] text-muted-foreground bg-white/[0.01]">
            <span>AnimatedSearch · spring physics · icon morph</span>
            <span>Esc to close · Enter to submit</span>
          </div>
        </div>
      </Section>

      <Section title="useImageUpload" description="Hook for image upload with preview and cleanup.">
        <ImageUploadDemo />
      </Section>

      <Section title="PasswordConfirmation" description="Per-character visual feedback for password confirmation fields.">
        <PasswordConfirmationDemo />
      </Section>

      <Section title="PasswordSetup" description="Complete password creation with strength meter, generate, copy, and dot-based confirmation.">
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
    </>
  )
}
