import { useState, useRef, useEffect } from 'react'
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react'
import { z } from 'zod'
import { Section } from '../components/section'
import { Checkbox } from '@components/checkbox/checkbox'
import { Switch } from '@components/switch/switch'
import { Slider } from '@components/slider/slider'
import { FormInput } from '@components/form-input/form-input'
import { FieldHint } from '@components/field-hint/field-hint'
import { AutocompleteCell } from '@components/autocomplete-cell/autocomplete-cell'
import { AnimatedSearch } from '@components/animated-search/animated-search'
import { GooeyInput } from '@components/gooey-input/gooey-input'
import { useImageUpload } from '@components/use-image-upload/use-image-upload'
import { useToast } from '@components/toast/toast-context'
import { PasswordSetup } from '@components/password-setup/password-setup'
import visibilityData from '../../../_resources_/Visibility V3/visibility-V3.json'
import { suggestions } from '../data'

function AnimatedEyeToggle({ visible, size = 20 }: { visible: boolean; size?: number }) {
  const playerRef = useRef<DotLottie | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const p = playerRef.current
    if (!p) return
    // Erstes Mounten überspringen: Toggle-Animation soll nur auf User-Aktion
    // reagieren, nicht beim initialen Render.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    p.setMode(visible ? 'reverse' : 'forward')
    p.play()
  }, [visible])

  return (
    <div style={{ filter: 'var(--icon-invert, invert(1))' }}>
      <DotLottieReact
        dotLottieRefCallback={(d) => { playerRef.current = d }}
        data={visibilityData as Record<string, unknown>}
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
      className="border-border bg-card flex max-w-xl flex-col gap-4 rounded-xl border p-6 shadow-sm"
    >
      <FormInput
        type="text"
        label="Name"
        hint="Vor- und Nachname, wie er auf deinem Ausweis steht."
        placeholder="Anna Müller"
        value={form.name}
        error={errors.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value
          setForm(f => ({ ...f, name: v }))
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          validate('name', e.target.value)
        }}
      />
      <FormInput
        type="email"
        label="E-Mail"
        placeholder="anna@beispiel.de"
        value={form.email}
        error={errors.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value
          setForm(f => ({ ...f, email: v }))
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          validate('email', e.target.value)
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
          hint="Volljährig (ab 18) und höchstens 120 — wir prüfen die Eingabe gegen ein Zod-Schema."
          hintPosition="right"
          placeholder="18–120"
          value={form.age}
          error={errors.age}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value
            setForm(f => ({ ...f, age: v }))
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            validate('age', e.target.value)
          }}
        />
        <FormInput
          type="url"
          label="Website"
          placeholder="https://"
          value={form.website}
          error={errors.website}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value
            setForm(f => ({ ...f, website: v }))
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            validate('website', e.target.value)
          }}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-accent cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-95"
        >
          Absenden
        </button>
        <button
          type="button"
          onClick={() => { setForm({ name: '', email: '', phone: '', age: '', website: '' }); setErrors({}) }}
          className="border-border text-foreground cursor-pointer rounded-md border bg-transparent px-4 py-2 text-sm transition-colors hover:bg-white/5"
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
    <div className="border-border bg-card max-w-96 overflow-hidden rounded-xl border shadow-sm">
      {/* Demo zone: clicking the empty state forwards to the file picker
          inside useImageUpload. Keyboard users tab to the hidden file input. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        onClick={!previewUrl ? handleThumbnailClick : undefined}
        className={`relative flex h-48 items-center justify-center transition-colors ${
          previewUrl ? 'cursor-default' : 'cursor-pointer bg-white/2 hover:bg-white/4'
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={fileName ?? 'Preview'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground text-center">
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
      <div className="border-border flex items-center justify-between border-t p-3 px-4 text-[0.8125rem]">
        <span className={`max-w-[70%] truncate ${fileName ? 'text-foreground' : 'text-muted-foreground'}`}>
          {fileName ?? 'No file selected'}
        </span>
        <div className="flex gap-2">
          {previewUrl && (
            <button
              onClick={handleRemove}
              className="border-border cursor-pointer rounded-md border bg-transparent px-2.5 py-1 text-xs text-red-500 transition-colors hover:bg-red-500/10"
            >
              Remove
            </button>
          )}
          <button
            onClick={handleThumbnailClick}
            className={`cursor-pointer rounded-md px-2.5 py-1 text-xs transition-opacity active:scale-95 ${
              previewUrl ? 'border-border text-foreground border bg-transparent' : 'bg-accent text-white'
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
            onMatch={(_pw) => add({ title: 'Match!', description: 'Passwörter stimmen überein.', variant: 'success' })}
          />
        </div>
      </Section>

      <Section title="FormInput + Zod" description="Schema-driven inputs with real-time validation and error shake. Hier mit hint-Prop bei Name und Alter — Tooltip + aria-describedby.">
        <FormInputDemo />
      </Section>

      <Section title="FieldHint" description="Info-Icon mit Tooltip für Labels. Per Tab fokussierbar, sr-only-Text zusätzlich im A11y-Tree.">
        <div className="border-border bg-card flex max-w-xl flex-col gap-5 rounded-xl border p-6 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="fieldhint-demo-tax"
                className="text-muted-foreground block text-[12px] font-medium tracking-wider uppercase"
              >
                Steuer-ID
              </label>
              <FieldHint
                id="fieldhint-demo-tax-hint"
                content="11-stellige Steuer-Identifikationsnummer (nicht zu verwechseln mit der Steuernummer des Finanzamts)."
              />
            </div>
            <input
              id="fieldhint-demo-tax"
              aria-describedby="fieldhint-demo-tax-hint"
              placeholder="12 345 678 901"
              className="bg-card border-border text-foreground focus:border-accent h-11 rounded-xl border px-3 text-sm transition-colors outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="fieldhint-demo-iban"
                className="text-muted-foreground block text-[12px] font-medium tracking-wider uppercase"
              >
                IBAN
              </label>
              <FieldHint
                id="fieldhint-demo-iban-hint"
                position="right"
                content="Internationale Kontonummer. In Deutschland 22 Stellen, beginnend mit „DE“."
              />
            </div>
            <input
              id="fieldhint-demo-iban"
              aria-describedby="fieldhint-demo-iban-hint"
              placeholder="DE00 0000 0000 0000 0000 00"
              className="bg-card border-border text-foreground focus:border-accent h-11 rounded-xl border px-3 font-mono text-sm transition-colors outline-none"
            />
          </div>

          <p className="text-muted-foreground border-border border-t pt-1 text-[12px]">
            Tipp: Mit <kbd className="border-border rounded border bg-white/5 px-1.5 py-0.5 text-[10px]">Tab</kbd> auf das Icon fokussieren — der Tooltip öffnet auch via Keyboard.
          </p>
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
        <div className="border-border bg-card flex flex-col gap-6 rounded-xl border p-10">
          <GooeyInput
            placeholder="Weine durchsuchen..."
            onSubmit={(v) => add({ title: 'Suche gestartet', description: `Suchen nach: "${v}"`, variant: 'default' })}
          />
          <p className="text-muted-foreground text-[0.7rem]">Esc zum Schließen · Enter zum Absenden</p>
        </div>
      </Section>

      <Section title="AnimatedSearch" description="Search icon that morphs into an expanding input field.">
        <div className="border-border bg-card flex flex-col items-center gap-6 rounded-xl border p-10">
          <AnimatedSearch
            placeholder="Search components..."
            onSearch={(v) => add({ title: 'Search', description: `Searching for: ${v}`, variant: 'default' })}
          />
          <p className="text-muted-foreground text-[0.7rem]">Spring physics powered icon morph</p>
        </div>
      </Section>

      <Section title="useImageUpload" description="Hook for image upload with preview and removal logic.">
        <ImageUploadDemo />
      </Section>
    </>
  )
}
