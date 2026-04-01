<svelte:head>
  <title>TTS App</title>
  <meta name="description" content="Text to speech app built with SvelteKit and Bootstrap" />
</svelte:head>

<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';
  import TextInput from '$lib/components/TextInput.svelte';
  import VoiceSelector from '$lib/components/VoiceSelector.svelte';
  import SpeechSettings from '$lib/components/SpeechSettings.svelte';
  import PlaybackControls from '$lib/components/PlaybackControls.svelte';
  import HistoryList from '$lib/components/HistoryList.svelte';
  import { tts, canSpeak, type TtsState } from '$lib/stores/tts';
  import { onMount } from 'svelte';

  let state = $state<TtsState>({
    text: '',
    voices: [],
    selectedVoiceName: '',
    rate: 1,
    pitch: 1,
    volume: 1,
    speaking: false,
    paused: false,
    supported: false,
    history: []
  });

  let speakable = $state(false);

  onMount(() => {
    const unsub1 = tts.subscribe((value) => {
      state = value;
    });

    const unsub2 = canSpeak.subscribe((value) => {
      speakable = value;
    });

    tts.initialize();

    return () => {
      unsub1();
      unsub2();
    };
  });
</script>

<div class="container py-4 py-lg-5">
  <div class="row justify-content-center">
    <div class="col-12 col-xl-11">
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body p-4 p-lg-5">
          <div class="d-flex align-items-start justify-content-between flex-wrap gap-3">
            <div>
              <div class="text-uppercase text-secondary small fw-semibold mb-2">
                SvelteKit + Bootstrap
              </div>
              <h1 class="display-6 fw-bold mb-2">Text to Speech App</h1>
              <p class="text-secondary mb-0">
                Enter text, choose a voice, adjust the settings, and play speech directly in the browser.
              </p>
            </div>

            <div class="text-end">
              <span class="badge text-bg-primary fs-6">
                <i class="bi bi-volume-up me-1"></i>
                Web Speech API
              </span>
            </div>
          </div>

          {#if !state.supported}
            <div class="alert alert-warning mt-4 mb-0" role="alert">
              Your browser does not appear to support speech synthesis for this app.
              Chrome and Edge usually work best.
            </div>
          {/if}
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-8">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body p-4">
              <TextInput
                value={state.text}
                rows={8}
                placeholder="Type text to speak..."
                onInput={tts.setText}
              />

              <div class="mt-4">
                <VoiceSelector
                  voices={state.voices}
                  selectedVoiceName={state.selectedVoiceName}
                  onChange={tts.setVoice}
                />
              </div>

              <div class="mt-4">
                <PlaybackControls
                  canSpeak={speakable}
                  speaking={state.speaking}
                  paused={state.paused}
                  onSpeak={tts.speak}
                  onPause={tts.pause}
                  onResume={tts.resume}
                  onStop={tts.stop}
                />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="d-grid gap-4">
            <div class="card shadow-sm border-0">
              <div class="card-body p-4">
                <SpeechSettings
                  rate={state.rate}
                  pitch={state.pitch}
                  volume={state.volume}
                  onRateChange={tts.setRate}
                  onPitchChange={tts.setPitch}
                  onVolumeChange={tts.setVolume}
                />
              </div>
            </div>

            <div class="card shadow-sm border-0">
              <div class="card-body p-4">
                <HistoryList
                  items={state.history}
                  onUse={tts.useHistoryItem}
                  onClear={tts.clearHistory}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 text-secondary small">
        Character count: {state.text.length}
      </div>
    </div>
  </div>
</div>