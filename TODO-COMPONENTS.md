# TODO Components

Offene Komponenten die noch gebaut werden muessen.

---

## BounceCards / Image Gallery

- **Status**: Pending
- **Dep**: `gsap`
- **Notes**: Unterhalb einer Bildergalerie verwenden. Klick auf Thumbnail → großes Bild oben wechselt.
- **Usage**:
    ```tsx
    <BounceCards
      images={images}
      containerWidth={500}
      containerHeight={250}
      animationDelay={1}
      animationStagger={0.08}
      easeType="elastic.out(1, 0.5)"
      transformStyles={transformStyles}
      enableHover={false}
    />
    ```

---

## Particles

- **Status**: Pending
- **Reference**: https://reactbits.dev/backgrounds/particles
- **Notes**: Testweise auf eine Card oder Section. Canvas-basiert.
- **Usage**:
    ```tsx
    <Particles
      particleColors={["#ffffff"]}
      particleCount={200}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={100}
      moveParticlesOnHover
    />
    ```
