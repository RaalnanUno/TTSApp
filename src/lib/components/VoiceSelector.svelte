<script lang="ts">
  type Props = {
    voices?: SpeechSynthesisVoice[];
    selectedVoiceName?: string;
    onChange: (value: string) => void;
  };

  let {
    voices = [],
    selectedVoiceName = '',
    onChange
  }: Props = $props();
</script>

<div>
  <label for="voice" class="form-label fw-semibold">Voice</label>

  <select
    id="voice"
    class="form-select"
    value={selectedVoiceName}
    on:change={(e) => onChange((e.currentTarget as HTMLSelectElement).value)}
  >
    {#if voices.length === 0}
      <option value="">No voices found yet</option>
    {:else}
      {#each voices as voice}
        <option value={voice.name} selected={voice.name === selectedVoiceName}>
          {voice.name} ({voice.lang})
        </option>
      {/each}
    {/if}
  </select>
</div>