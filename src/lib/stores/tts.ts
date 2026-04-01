import { browser } from '$app/environment';
import { derived, get, writable } from 'svelte/store';

export type HistoryItem = {
  id: string;
  text: string;
  createdAt: string;
  voiceName?: string;
  rate: number;
  pitch: number;
  volume: number;
};

export type TtsState = {
  text: string;
  voices: SpeechSynthesisVoice[];
  selectedVoiceName: string;
  rate: number;
  pitch: number;
  volume: number;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  history: HistoryItem[];
};

const HISTORY_KEY = 'tts-history';

function loadHistory(): HistoryItem[] {
  if (!browser) return [];

  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryItem[]) {
  if (!browser) return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

const initialState: TtsState = {
  text: '',
  voices: [],
  selectedVoiceName: '',
  rate: 1,
  pitch: 1,
  volume: 1,
  speaking: false,
  paused: false,
  supported: browser ? 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window : false,
  history: loadHistory()
};

function createTtsStore() {
  const { subscribe, update } = writable<TtsState>(initialState);

  function refreshVoices() {
    if (!browser || !('speechSynthesis' in window)) return;

    const voices = window.speechSynthesis.getVoices();

    update((state) => ({
      ...state,
      voices,
      selectedVoiceName: state.selectedVoiceName || voices[0]?.name || ''
    }));
  }

  function setText(text: string) {
    update((state) => ({ ...state, text }));
  }

  function setVoice(name: string) {
    update((state) => ({ ...state, selectedVoiceName: name }));
  }

  function setRate(rate: number) {
    update((state) => ({ ...state, rate }));
  }

  function setPitch(pitch: number) {
    update((state) => ({ ...state, pitch }));
  }

  function setVolume(volume: number) {
    update((state) => ({ ...state, volume }));
  }

  function stop() {
    if (!browser || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    update((state) => ({
      ...state,
      speaking: false,
      paused: false
    }));
  }

  function pause() {
    if (!browser || !('speechSynthesis' in window)) return;

    window.speechSynthesis.pause();

    update((state) => ({
      ...state,
      paused: true
    }));
  }

  function resume() {
    if (!browser || !('speechSynthesis' in window)) return;

    window.speechSynthesis.resume();

    update((state) => ({
      ...state,
      speaking: true,
      paused: false
    }));
  }

  function addHistoryItem(item: Omit<HistoryItem, 'id' | 'createdAt'>) {
    update((state) => {
      const next: HistoryItem = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...item
      };

      const history = [next, ...state.history].slice(0, 15);
      saveHistory(history);

      return {
        ...state,
        history
      };
    });
  }

  function useHistoryItem(item: HistoryItem) {
    update((state) => ({
      ...state,
      text: item.text,
      selectedVoiceName: item.voiceName || state.selectedVoiceName,
      rate: item.rate,
      pitch: item.pitch,
      volume: item.volume
    }));
  }

  function clearHistory() {
    update((state) => {
      saveHistory([]);
      return {
        ...state,
        history: []
      };
    });
  }

  function speak() {
    if (!browser || !('speechSynthesis' in window)) return;

    const state = get({ subscribe });
    const trimmed = state.text.trim();

    if (!trimmed) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(trimmed);
    const selectedVoice = state.voices.find((v) => v.name === state.selectedVoiceName);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = state.rate;
    utterance.pitch = state.pitch;
    utterance.volume = state.volume;

    utterance.onstart = () => {
      update((current) => ({
        ...current,
        speaking: true,
        paused: false
      }));
    };

    utterance.onend = () => {
      update((current) => ({
        ...current,
        speaking: false,
        paused: false
      }));
    };

    utterance.onerror = () => {
      update((current) => ({
        ...current,
        speaking: false,
        paused: false
      }));
    };

    window.speechSynthesis.speak(utterance);

    addHistoryItem({
      text: trimmed,
      voiceName: selectedVoice?.name,
      rate: state.rate,
      pitch: state.pitch,
      volume: state.volume
    });
  }

  function initialize() {
    if (!browser || !('speechSynthesis' in window)) return;

    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  return {
    subscribe,
    initialize,
    refreshVoices,
    setText,
    setVoice,
    setRate,
    setPitch,
    setVolume,
    speak,
    pause,
    resume,
    stop,
    clearHistory,
    useHistoryItem
  };
}

export const tts = createTtsStore();

export const canSpeak = derived(tts, ($tts) => $tts.supported && $tts.text.trim().length > 0);