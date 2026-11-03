<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Overlay from '@/components/Overlay.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const { t } = useI18n();
const { successToast } = useToast();
const $apiGet = useApi('tenant.get');
const $apiUpdate = useApi('tenant.updateAddress');

const form = reactive({
    address_line1: '',
    address_line2: '',
    address_city: '',
    address_state: '',
    address_postal_code: '',
    address_phone: ''
});

function fetchData() {
    return $apiGet.tryCatch(async () => {
        const response = await $apiGet.run();
        const tenant = response.data || {};

        form.address_line1 = tenant.address_line1 || '';
        form.address_line2 = tenant.address_line2 || '';
        form.address_city = tenant.address_city || '';
        form.address_state = tenant.address_state || '';
        form.address_postal_code = tenant.address_postal_code || '';
        form.address_phone = tenant.address_phone || '';
    });
}

function onSubmit() {
    return $apiUpdate.tryCatch(async () => {
        await $apiUpdate.run({ ...form });
        successToast({ title: t('Address saved successfully') });
    });
}

onMounted(fetchData);
</script>

<template>
    <PageTitle>{{ t('Store Address') }}</PageTitle>

    <Card class="max-w-xl">
        <CardContent>
            <Overlay :show="$apiGet.isLoading.value">
                <form class="grid grid-cols-1 gap-4" @submit.prevent="onSubmit">
                    <p class="text-sm text-muted-foreground">
                        {{ t('Shown to customers in the order-ready email, so they know where to pick up.') }}
                    </p>

                    <div class="grid gap-1.5">
                        <Label for="tenant-address-line1">{{ t('Address line 1') }}</Label>
                        <Input id="tenant-address-line1" v-model="form.address_line1" />
                    </div>

                    <div class="grid gap-1.5">
                        <Label for="tenant-address-line2">{{ t('Address line 2') }}</Label>
                        <Input id="tenant-address-line2" v-model="form.address_line2" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-1.5">
                            <Label for="tenant-address-city">{{ t('City') }}</Label>
                            <Input id="tenant-address-city" v-model="form.address_city" />
                        </div>

                        <div class="grid gap-1.5">
                            <Label for="tenant-address-state">{{ t('State') }}</Label>
                            <Input id="tenant-address-state" v-model="form.address_state" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-1.5">
                            <Label for="tenant-address-postal-code">{{ t('Postal code') }}</Label>
                            <Input id="tenant-address-postal-code" v-model="form.address_postal_code" />
                        </div>

                        <div class="grid gap-1.5">
                            <Label for="tenant-address-phone">{{ t('Phone') }}</Label>
                            <Input id="tenant-address-phone" v-model="form.address_phone" />
                        </div>
                    </div>

                    <Button type="submit" :disabled="$apiUpdate.isLoading.value" class="w-fit">
                        {{ t('Save') }}
                    </Button>
                </form>
            </Overlay>
        </CardContent>
    </Card>
</template>
