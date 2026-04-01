<script lang="ts">
  type Props = {
    canSpeak?: boolean;
    speaking?: boolean;
    paused?: boolean;
    onSpeak: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
  };

  let {
    canSpeak = false,
    speaking = false,
    paused = false,
    onSpeak,
    onPause,
    onResume,
    onStop
  }: Props = $props();
</script>

<div>
  <div class="d-flex flex-wrap gap-2">
    <button type="button" class="btn btn-primary" onclick={onSpeak} disabled={!canSpeak}>
      <i class="bi bi-play-fill me-1"></i>
      Speak
    </button>

    <button type="button" class="btn btn-outline-secondary" onclick={onPause} disabled={!speaking || paused}>
      <i class="bi bi-pause-fill me-1"></i>
      Pause
    </button>

    <button type="button" class="btn btn-outline-secondary" onclick={onResume} disabled={!speaking || !paused}>
      <i class="bi bi-play-circle me-1"></i>
      Resume
    </button>

    <button type="button" class="btn btn-outline-danger" onclick={onStop} disabled={!speaking && !paused}>
      <i class="bi bi-stop-fill me-1"></i>
      Stop
    </button>
  </div>
</div>