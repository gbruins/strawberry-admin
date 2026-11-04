<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { LockIcon, LogOutIcon } from '@lucide/vue';
import { useKitchenStationStore } from '@/stores/kitchenStation';
import useApi from '@/composables/useApi';
import PinPad from '@/components/kitchen/PinPad.vue';

// No automatic idle-lock — the one action an idle tap could trigger (completing a ticket, which
// emails the customer) already has its own confirm dialog, so a timer mostly just interrupted
// staff mid-shift for little remaining benefit. Locking is manual only, via the button below.

const { t } = useI18n();
const router = useRouter();
const kitchenStore = useKitchenStationStore();
const $apiVerifyPin = useApi('kitchen.verifyPin');

const pin = ref('');
const unlockError = ref(false);

function manualLock() {
    pin.value = '';
    unlockError.value = false;
    kitchenStore.lock();
}

function attemptUnlock() {
    unlockError.value = false;

    return $apiVerifyPin.tryCatch(async () => {
        const response = await $apiVerifyPin.run({ pin: pin.value });

        if (response.data?.valid) {
            kitchenStore.unlock();
            pin.value = '';
        }
        else {
            unlockError.value = true;
            pin.value = '';
        }
    });
}

// Navigate away first, then clear the session — KitchenBoardPage's poll timer keeps running
// until it unmounts (as part of this same navigation), so clearing the token first lets it fire
// one more request with no Authorization header, surfacing a spurious 401 on every logout.
async function onLogout() {
    await router.push({ name: 'kitchen_login' });
    kitchenStore.clearSession();
}
</script>

<template>
    <div class="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden">
        <header
            v-if="kitchenStore.stationSessionToken"
            class="flex items-center justify-between gap-4 border-b px-6 py-4 shrink-0">
            <div class="text-lg font-semibold">
                {{ kitchenStore.tenantName }}
                <span class="text-muted-foreground font-normal">— {{ kitchenStore.stationName }}</span>
            </div>

            <div class="flex items-center gap-2">
                <button
                    type="button"
                    class="flex items-center gap-2 h-12 px-4 rounded-lg bg-muted active:bg-muted-foreground/20"
                    @click="manualLock">
                    <LockIcon class="size-5" />
                    <span>{{ t('Lock') }}</span>
                </button>

                <button
                    type="button"
                    class="flex items-center gap-2 h-12 px-4 rounded-lg bg-muted active:bg-muted-foreground/20"
                    @click="onLogout">
                    <LogOutIcon class="size-5" />
                    <span>{{ t('Log out') }}</span>
                </button>
            </div>
        </header>

        <main class="flex-1 overflow-auto p-4">
            <slot />
        </main>

        <div
            v-if="kitchenStore.stationSessionToken && kitchenStore.locked"
            class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-sm">
            <div class="text-xl font-semibold">{{ t('{station} is locked', { station: kitchenStore.stationName }) }}</div>

            <div class="h-8 text-2xl font-mono tracking-widest">{{ '•'.repeat(pin.length) || ' ' }}</div>

            <div v-if="unlockError" class="text-destructive text-sm">{{ t('Incorrect PIN') }}</div>

            <PinPad v-model="pin" @submit="attemptUnlock">
                <template #enter>{{ t('Unlock') }}</template>
            </PinPad>
        </div>
    </div>
</template>
