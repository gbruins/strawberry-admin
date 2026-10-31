<script lang="ts">
export default {
    name: 'AllowedStreetsUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Overlay from '@/components/Overlay.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('allowedStreet.create');
const $apiUpdate = useApi('allowedStreet.update');
const $apiRead = useApi('allowedStreet.read');
const { successToast } = useToast();
const appStore = useAppStore();

const open = ref(false);
const updateId: Ref<string | null> = ref(null);

const form = reactive({
    street_name: '',
    active: true
});

function getById(id: string) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.street_name = response.data?.street_name || '';
            form.active = response.data?.active !== undefined ? response.data.active : true;

            updateId.value = id;
        }
    );
}

function onSubmit() {
    const api = updateId.value ? $apiUpdate : $apiCreate;
    const formData = updateId.value ? { id: updateId.value, ...form } : { ...form };

    return api.tryCatch(
        async () => {
            await api.run({
                ...formData
            });

            successToast({
                title: t('Allowed street saved successfully')
            });

            hide();
            appStore.updateAllowedStreetsState();
            emit('success');
        }
    );
}

function hide() {
    open.value = false;
}

function resetData() {
    updateId.value = null;

    form.street_name = '';
    form.active = true;
}

function show(id) {
    resetData();

    if(id) {
        getById(id);
    }

    open.value = true;
}

defineExpose({
    show
});
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{{ updateId ? t('Update allowed street') : t('Create allowed street') }}</DialogTitle>
                <DialogDescription class="sr-only">{{ updateId ? t('Update allowed street') : t('Create allowed street') }}</DialogDescription>
            </DialogHeader>

            <Overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
                <div class="grid grid-cols-1 gap-4">
                    <!-- street name -->
                    <div class="grid gap-1.5">
                        <Label for="allowed-street-name">{{ t('Street name') }}</Label>
                        <Input id="allowed-street-name" v-model="form.street_name" />
                    </div>

                    <!-- active -->
                    <div class="flex items-center gap-2">
                        <Checkbox id="allowed-street-active" v-model="form.active" />
                        <Label for="allowed-street-active">{{ t('Active') }}</Label>
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
