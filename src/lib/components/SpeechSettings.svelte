<script lang="ts">
  type Props = {
    rate?: number;
    pitch?: number;
    volume?: number;
    onRateChange: (value: number) => void;
    onPitchChange: (value: number) => void;
    onVolumeChange: (value: number) => void;
  };

  let {
    rate = 1,
    pitch = 1,
    volume = 1,
    onRateChange,
    onPitchChange,
    onVolumeChange
  }: Props = $props();
</script>

<div>
  <h2 class="h5 fw-bold mb-4">Speech Settings</h2>

  <div class="mb-4">
    <label for="rate" class="form-label fw-semibold">Rate: {rate.toFixed(1)}</label>
    <input
      id="rate"
      type="range"
      class="form-range"
      min="0.5"
      max="2"
      step="0.1"
      value={rate}
      on:input={(e) => onRateChange(Number((e.currentTarget as HTMLInputElement).value))}
    />
  </div>

  <div class="mb-4">
    <label for="pitch" class="form-label fw-semibold">Pitch: {pitch.toFixed(1)}</label>
    <input
      id="pitch"
      type="range"
      class="form-range"
      min="0"
      max="2"
      step="0.1"
      value={pitch}
      on:input={(e) => onPitchChange(Number((e.currentTarget as HTMLInputElement).value))}
    />
  </div>

  <div class="mb-0">
    <label for="volume" class="form-label fw-semibold">Volume: {volume.toFixed(1)}</label>
    <input
      id="volume"
      type="range"
      class="form-range"
      min="0"
      max="1"
      step="0.1"
      value={volume}
      on:input={(e) => onVolumeChange(Number((e.currentTarget as HTMLInputElement).value))}
    />
  </div>
</div>