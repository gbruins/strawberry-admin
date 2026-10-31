<script lang="ts">
export default {
    name: 'AddressDiscountsUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Overlay from '@/components/Overlay.vue';
import AllowedStreetsSelect from '@/components/allowedStreets/AllowedStreetsSelect.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('addressDiscount.create');
const $apiUpdate = useApi('addressDiscount.update');
const $apiRead = useApi('addressDiscount.read');
const { successToast } = useToast();

const open = ref(false);
const updateId = ref(null);

const form = reactive({
    street_number: '',
    allowed_street_id: '',
    discount_percent: 0,
    active: true
});

function getById(id) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.street_number = response.data?.street_number || '';
            form.allowed_street_id = response.data?.allowed_street_id || '';
            form.discount_percent = response.data?.discount_percent || 0;
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
                title: t('Address discount saved successfully')
            });

            hide();
            emit('success');
        }
    );
}

function hide() {
    open.value = false;
}

function resetData() {
    updateId.value = null;

    form.street_number = '';
    form.allowed_street_id = '';
    form.discount_percent = 0;
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
                <DialogTitle>{{ updateId ? t('Update address discount') : t('Create address discount') }}</DialogTitle>
                <DialogDescription class="sr-only">{{ updateId ? t('Update address discount') : t('Create address discount') }}</DialogDescription>
            </DialogHeader>

            <Overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
                <div class="grid grid-cols-1 gap-4">
                    <!-- street number -->
                    <div class="grid gap-1.5">
                        <Label for="address-discount-street-number">{{ t('Street number') }}</Label>
                        <Input id="address-discount-street-number" v-model="form.street_number" />
                    </div>

                    <!-- street name -->
                    <div class="grid gap-1.5">
                        <Label>{{ t('Street name') }}</Label>
                        <AllowedStreetsSelect v-model="form.allowed_street_id" />
                    </div>

                    <!-- discount percentage -->
                    <div class="grid gap-1.5">
                        <Label for="address-discount-percent">{{ t('Discount percentage') }}</Label>
                        <Input
                            id="address-discount-percent"
                            v-model.number="form.discount_percent"
                            type="number"
                            min="0"
                            max="100"
                            step="1" />
                    </div>

                    <!-- active -->
                    <div class="flex items-center gap-2">
                        <Checkbox id="address-discount-active" v-model="form.active" />
                        <Label for="address-discount-active">{{ t('Active') }}</Label>
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
