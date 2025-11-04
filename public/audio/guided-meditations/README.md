# Guided Meditation Audio Files

This folder contains the MP3 audio files for the Guided Meditations section.

## File Naming Convention

Please name your files according to the meditation category:

**Format:** `{category}-{sessionId}.mp3`

- `sleep-1.mp3`, `sleep-2.mp3`, `sleep-3.mp3`, etc. - Sleep Meditation
- `anxiety-1.mp3`, `anxiety-2.mp3`, `anxiety-3.mp3`, etc. - Anxiety Relief
- `focus-1.mp3`, `focus-2.mp3`, `focus-3.mp3`, etc. - Focus & Concentration
- `stress-1.mp3`, `stress-2.mp3`, `stress-3.mp3`, etc. - Stress Release
- `confidence-1.mp3`, `confidence-2.mp3`, `confidence-3.mp3`, etc. - Build Confidence
- `gratitude-1.mp3`, `gratitude-2.mp3`, `gratitude-3.mp3`, etc. - Gratitude Practice

**Example for Sleep Meditation:**
- `sleep-1.mp3` - Letting Go of the Day
- `sleep-2.mp3` - Body Scan for Deep Relaxation
- `sleep-3.mp3` - Breathing into Calm
- `sleep-4.mp3` - Safe Sanctuary
- `sleep-5.mp3` - Floating into Sleep

## Usage in Code

Files in this folder can be referenced using the `/audio/guided-meditations/` path in your code.

Example:
```tsx
<audio src="/audio/guided-meditations/sleep-1.mp3" />
```

## Folder Structure

```
public/
  audio/
    guided-meditations/
      sleep-1.mp3
      sleep-2.mp3
      anxiety-1.mp3
      ...
```

## Adding Files

1. Add your MP3 files to this folder following the naming convention above
2. Update the meditation data in `app/page.tsx` if needed
3. The app will automatically reference files from this location

