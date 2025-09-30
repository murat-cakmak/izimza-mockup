<template>
  <Card class="p-m-2 p-text-center">
    <h3>{{ title }}</h3>
    <h1>{{ value }}</h1>
  </Card>
</template>

<script lang="ts" setup>
import Card from 'primevue/card';

interface Props { title: string; value: number; }
defineProps<Props>();
</script>
