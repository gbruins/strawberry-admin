<script setup lang="ts">
</script>

<template>
    <Teleport defer to="#layout-header-title">
        <div class="page-title"><slot /></div>
    </Teleport>
</template>

<style scoped>
.page-title {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-800);
    display: flex;
    align-items: center;
}
</style>
