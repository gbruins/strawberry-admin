<script lang="ts">
export default {
    name: 'KitchenStationRotatePinModal'
}
</script>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, numeric } from '@vuelidate/validators';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Overlay from '@/components/Overlay.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiRotate = useApi('kitchenStation.rotatePin');
const { successToast } = useToast();

const open = ref(false);
const stationId: Ref<string | null> = ref(null);

const form = reactive({
    pin: ''
});

const v$ = useVuelidate({ pin: { required, minLength: minLength(4), maxLength: maxLength(6), numeric } }, form);

function show(id: string) {
    stationId.value = id;
    form.pin = '';
    v$.value.$reset();
    open.value = true;
}

function hide() {
    open.value = false;
}

async function onSubmit() {
    const isValid = await v$.value.$validate();

    if (!isValid) {
        return;
    }

    return $apiRotate.tryCatch(
        async () => {
            await $apiRotate.run({ id: stationId.value, pin: form.pin });

            successToast({ title: t('PIN rotated — any logged-in tablet for this station must log in again') });

            hide();
            emit('success');
        }
    );
}

defineExpose({
    show
});
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{{ t('Rotate station PIN') }}</DialogTitle>
                <DialogDescription class="sr-only">{{ t('Rotate station PIN') }}</DialogDescription>
            </DialogHeader>

            <Overlay :show="$apiRotate.isLoading.value">
                <div class="grid gap-1.5">
                    <Label for="rotate-pin">{{ t('New PIN (4-6 digits)') }}</Label>
                    <Input id="rotate-pin" v-model="form.pin" inputmode="numeric" maxlength="6" />
                    <div v-if="v$.pin.$dirty && v$.pin.$invalid" class="text-sm text-destructive">{{ t('must be 4-6 digits') }}</div>
                </div>
            </Overlay>

            <DialogFooter class="sm:justify-center">
                <Button @click="onSubmit">{{ t('Submit') }}</Button>
                <Button variant="ghost" @click="hide">{{ t('Cancel') }}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
