<script setup lang="ts">
type IconName =
  | 'mail'
  | 'phone'
  | 'linkedin'
  | 'pin'
  | 'arrow-right'
  | 'external'
  | 'check'
  | 'copy'
  | 'grid'
  | 'briefcase'
  | 'flask'
  | 'checklist'
  | 'sparkle'
  | 'activity'
  | 'search'
  | 'x'

defineProps<{ name: IconName }>()
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="name === 'mail'">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </template>
    <template v-else-if="name === 'phone'">
      <path d="M14.05 3a9 9 0 0 1 6.95 6.95M14.05 6.5a4.5 4.5 0 0 1 3.45 3.45" />
      <path d="M3 5.5C3 14.06 9.94 21 18.5 21a1.5 1.5 0 0 0 1.5-1.5v-2.2a1.5 1.5 0 0 0-1.24-1.48l-3.36-.6a1.5 1.5 0 0 0-1.48.65l-.9 1.35a12.2 12.2 0 0 1-5.72-5.72l1.35-.9a1.5 1.5 0 0 0 .65-1.48l-.6-3.36A1.5 1.5 0 0 0 6.7 3H4.5A1.5 1.5 0 0 0 3 4.5Z" />
    </template>
    <template v-else-if="name === 'linkedin'">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6M7.5 7.51v.01M12 16.5v-3.75a2.25 2.25 0 0 1 4.5 0V16.5M12 12.75V16.5" />
    </template>
    <template v-else-if="name === 'pin'">
      <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </template>
    <template v-else-if="name === 'arrow-right'">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </template>
    <template v-else-if="name === 'external'">
      <path d="M14 4h6v6M20 4 10 14M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="m5 12 5 5L20 7" />
    </template>
    <template v-else-if="name === 'copy'">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </template>
    <template v-else-if="name === 'grid'">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </template>
    <template v-else-if="name === 'briefcase'">
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M2.5 12.5h19" />
    </template>
    <template v-else-if="name === 'flask'">
      <path d="M9 3h6M10 3v6.2l-5.2 8.4A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 1.7-3L14 9.2V3" />
      <path d="M7.5 15h9" />
    </template>
    <template v-else-if="name === 'checklist'">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="m7.5 12 2 2 4-4M7.5 16.5h5" />
    </template>
    <template v-else-if="name === 'sparkle'">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />
    </template>
    <template v-else-if="name === 'activity'">
      <path d="M3 12h4l2 8 4-16 2 8h6" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </template>
    <template v-else-if="name === 'x'">
      <path d="M18 6 6 18M6 6l12 12" />
    </template>
  </svg>
</template>
