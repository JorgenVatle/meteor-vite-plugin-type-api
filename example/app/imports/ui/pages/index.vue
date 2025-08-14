<template>
  <div>
    <h1>Hello, world!</h1>
    <form @submit.prevent="form.submit()">
      <button type="submit">Create link</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { createLink } from '../../api';

const form = reactive({
    data: {
        href: '',
        text: '',
    },
    error: null as Error | null,
    async submit() {
        try {
            await createLink(form.data);
        } catch (error) {
            form.error = new Error('Failed to create link', { cause: error });
            console.error(form.error);
        }
    }
})
</script>