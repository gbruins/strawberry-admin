<script setup lang="ts">
import type { Component } from 'vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// A Card with the bordered icon + title header used by the detail pages.

defineProps<{
    title: string;
    icon?: Component;
}>();
</script>

<template>
    <Card>
        <CardHeader class="border-b">
            <CardTitle class="flex items-center gap-2 text-lg font-bold">
                <component :is="icon" v-if="icon" class="size-6" />
                {{ title }}
            </CardTitle>
        </CardHeader>

        <CardContent>
            <slot />
        </CardContent>
    </Card>
</template>
