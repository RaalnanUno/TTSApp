<script lang="ts">
  type Props = {
    value?: string;
    rows?: number;
    placeholder?: string;
    onInput: (value: string) => void;
  };

  let {
    value = '',
    rows = 8,
    placeholder = 'Type text to speak...',
    onInput
  }: Props = $props();
</script>

<div>
  <label for="tts-text" class="form-label fw-semibold">Text</label>

  <textarea
    id="tts-text"
    class="form-control"
    rows={rows}
    placeholder={placeholder}
    value={value}
    on:input={(e) => onInput((e.currentTarget as HTMLTextAreaElement).value)}
  ></textarea>
</div>