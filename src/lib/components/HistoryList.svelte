<script lang="ts">
  import type { HistoryItem } from '$lib/stores/tts';

  type Props = {
    items?: HistoryItem[];
    onUse: (item: HistoryItem) => void;
    onClear: () => void;
  };

  let {
    items = [],
    onUse,
    onClear
  }: Props = $props();
</script>

<div>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h2 class="h5 fw-bold mb-0">Recent History</h2>
    <button type="button" class="btn btn-sm btn-outline-secondary" onclick={onClear} disabled={items.length === 0}>
      Clear
    </button>
  </div>

  {#if items.length === 0}
    <p class="text-secondary mb-0">No speech history yet.</p>
  {:else}
    <div class="d-grid gap-2">
      {#each items as item}
        <button
          type="button"
          class="btn btn-light border text-start"
          onclick={() => onUse(item)}
        >
          <div class="fw-semibold text-truncate">{item.text}</div>
          <div class="small text-secondary mt-1">
            {item.voiceName || 'Default voice'} · Rate {item.rate.toFixed(1)} · Pitch {item.pitch.toFixed(1)}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>