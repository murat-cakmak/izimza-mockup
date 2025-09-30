<template>
  <Card class="p-m-2" style="width: 200px;">
    <h4>{{ user.name }}</h4>
    <p>{{ user.type }}</p>
  </Card>
</template>

<script lang="ts" setup>
import Card from 'primevue/card';

interface User { id: number; name: string; type: string; }
defineProps<{ user: User }>();
</script>
