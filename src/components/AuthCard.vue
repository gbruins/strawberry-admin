<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// The centered card used by the login / forgot-password / reset-password pages.

defineProps<{ title: string }>();
</script>

<template>
    <div class="w-full max-w-96">
        <Card>
            <CardHeader>
                <CardTitle class="text-center text-xl">{{ title }}</CardTitle>
            </CardHeader>

            <CardContent>
                <slot />
            </CardContent>
        </Card>
    </div>
</template>
