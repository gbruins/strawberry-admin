<script lang="ts">
export default {
    name: 'KitchenStationUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive } from 'vue';
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
const $apiCreate = useApi('kitchenStation.create');
const { successToast } = useToast();

const open = ref(false);

const form = reactive({
    name: '',
    pin: ''
});

const validationRules = {
    name: { required },
    pin: { required, minLength: minLength(4), maxLength: maxLength(6), numeric }
};

const v$ = useVuelidate(validationRules, form);

function resetData() {
    form.name = '';
    form.pin = '';
    v$.value.$reset();
}

function show() {
    resetData();
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

    return $apiCreate.tryCatch(
        async () => {
            const response = await $apiCreate.run({ name: form.name, pin: form.pin });

            successToast({
                title: t('Station created: {code}', { code: response.data.station_code }),
                text: t('Give this code and PIN to the kitchen tablet to log in.'),
                timeout: 0
            });

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
                <DialogTitle>{{ t('Create kitchen station') }}</DialogTitle>
                <DialogDescription class="sr-only">{{ t('Create kitchen station') }}</DialogDescription>
            </DialogHeader>

            <Overlay :show="$apiCreate.isLoading.value">
                <div class="grid grid-cols-1 gap-4">
                    <div class="grid gap-1.5">
                        <Label for="kitchen-station-name">{{ t('Name') }}</Label>
                        <Input id="kitchen-station-name" v-model="form.name" placeholder="e.g. Kitchen Tablet" />
                        <div v-if="v$.name.$dirty && v$.name.required.$invalid" class="text-sm text-destructive">{{ t('required') }}</div>
                    </div>

                    <div class="grid gap-1.5">
                        <Label for="kitchen-station-pin">{{ t('PIN (4-6 digits)') }}</Label>
                        <Input id="kitchen-station-pin" v-model="form.pin" inputmode="numeric" maxlength="6" />
                        <div v-if="v$.pin.$dirty && v$.pin.required.$invalid" class="text-sm text-destructive">{{ t('required') }}</div>
                        <div
                            v-else-if="v$.pin.$dirty && (v$.pin.minLength.$invalid || v$.pin.numeric.$invalid)"
                            class="text-sm text-destructive">{{ t('must be 4-6 digits') }}</div>
                    </div>
                </div>
            </Overlay>

            <DialogFooter class="sm:justify-center">
                <Button @click="onSubmit">{{ t('Submit') }}</Button>
                <Button variant="ghost" @click="hide">{{ t('Cancel') }}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
