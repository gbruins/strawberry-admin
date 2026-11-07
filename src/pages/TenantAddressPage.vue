<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Overlay from '@/components/Overlay.vue';
import FormField from '@/components/FormField.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const { t } = useI18n();
const { successToast } = useToast();
const $apiGet = useApi('tenant.get');
const $apiUpdate = useApi('tenant.updateAddress');

const defaults = () => ({
    address_line1: '',
    address_line2: '',
    address_city: '',
    address_state: '',
    address_postal_code: '',
    address_phone: ''
});

const form = reactive(defaults());

function fetchData() {
    return $apiGet.tryCatch(async () => {
        const response = await $apiGet.run();
        const tenant = response.data || {};

        for (const key of Object.keys(form) as (keyof typeof form)[]) {
            form[key] = tenant[key] || '';
        }
    });
}

function onSubmit() {
    if ($apiUpdate.isLoading.value) {
        return;
    }

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

                    <FormField :label="t('Address line 1')" for="tenant-address-line1">
                        <Input id="tenant-address-line1" v-model="form.address_line1" autocomplete="address-line1" />
                    </FormField>

                    <FormField :label="t('Address line 2')" for="tenant-address-line2">
                        <Input id="tenant-address-line2" v-model="form.address_line2" autocomplete="address-line2" />
                    </FormField>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField :label="t('City')" for="tenant-address-city">
                            <Input id="tenant-address-city" v-model="form.address_city" autocomplete="address-level2" />
                        </FormField>

                        <FormField :label="t('State')" for="tenant-address-state">
                            <Input id="tenant-address-state" v-model="form.address_state" autocomplete="address-level1" />
                        </FormField>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField :label="t('Postal code')" for="tenant-address-postal-code">
                            <Input id="tenant-address-postal-code" v-model="form.address_postal_code" autocomplete="postal-code" />
                        </FormField>

                        <FormField :label="t('Phone')" for="tenant-address-phone">
                            <Input id="tenant-address-phone" v-model="form.address_phone" type="tel" autocomplete="tel" />
                        </FormField>
                    </div>

                    <Button type="submit" :disabled="$apiUpdate.isLoading.value" class="w-fit">
                        {{ t('Save') }}
                    </Button>
                </form>
            </Overlay>
        </CardContent>
    </Card>
</template>
