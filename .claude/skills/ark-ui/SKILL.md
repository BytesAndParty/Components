---
name: ark-ui
description: Cached reference for `@ark-ui/react` (v5.39) — Root+Parts-Pattern, Subpath-Imports, Anatomie von ColorPicker/ImageCropper/Dialog/Popover/Portal/SignaturePad/Tour/DownloadTrigger/SegmentGroup/FocusTrap, Inline-Style-Fallen bei ColorPicker/ImageCropper. Load before building or modifying an Ark UI component, when Ark UI is the mandated headless lib in the project, or when debugging Ark UI part composition/data-scope attributes.
---

## Was dieser Skill ist

Gecachte API-Referenz für Ark UI (React), damit gegen die tatsächliche v5-API gearbeitet wird statt gegen Trainings-Wissen, das älteren Radix-/Headless-UI-Gewohnheiten folgt. Ark UI ist in diesem Ökosystem die Standard-Headless-Lib (siehe Artelier-Guidelines) — Radix/Headless UI/shadcn sind hier bewusst nicht der Weg.

Bei jeder Aufgabe, die eine Ark-UI-Komponente anlegt, erweitert oder debuggt, den Inhalt aus `reference.md` heranziehen, bevor aus dem Gedächtnis eine API geraten wird.

## References

- `reference.md` — Root+Parts-Anatomie, Subpath-Import-Konventionen, `data-scope`-Attribute, Komponenten-Übersicht, Inline-Style-Fallen (ColorPicker, ImageCropper), dazu eigene Abschnitte zu Download Trigger und Segment Group.

## Notes

- Gecachter Snapshot, Stand siehe `reference.md`-Kopfzeile. Bei Verdacht auf Veraltung: installierte Version im Projekt (`node_modules/@ark-ui/react/package.json`, Feld `version`) und neueste veröffentlichte Version (`bun info @ark-ui/react version`) prüfen und gegen die Live-Doku (ark-ui.com) abgleichen, statt der Referenz blind zu vertrauen.
- Master-Quelle ist `__AI-Workflow__/skills/live-docs-collection/ark-ui/` (`ark-ui.md`, `download-trigger.md`, `segment-group.md`), gepflegt über `/live-docs-update`. Änderungen dort fließen nicht automatisch hierher — nach einem Update dieser Datei neu generieren.
