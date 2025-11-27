<script setup lang="ts">
import { ref, reactive, computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.js';
import FigFormInputText from '@/components/figleaf/form/text/FormText.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import useToast from '@/components/figleaf/toast/useToast';
import useApi from '@/composables/useApi';

const $apiLogin = useApi('auth.login');
const { errorToast } = useToast();
const router = useRouter();
const { t } = useI18n();
const appStore = useAppStore();

const form = reactive({
    username: '',
    password: ''
});

const buttonIsEnabled = computed(() => {
    return form.username?.trim().length && form.password?.trim().length;
});

function onSubmit() {
    return $apiLogin.tryCatch(
        async () => {
            const response = await $apiLogin.run({
                ...form
            });

            appStore.loggedInUser = response.data.username;
            appStore.updateAllowedStreetsState();
            appStore.updateProductTypesState();
            router.push({ name: 'dashboard' });
        },
        () => {
            appStore.loggedInUser = null;
        }
    );
}
</script>

<template>
    <div class="mx-auto w-96 mt-24">
        <div class="text-2xl font-semibold mb-6 text-center text-gray-500">
            {{ $t('Login') }}
        </div>
        <div class="p-10 border border-gray-200 rounded shadow-lg bg-gray-50">
            <form class="grid grid-cols-1 gap-4 " @submit.prevent="onSubmit">
                <fig-form-input-text
                    v-model="form.username"
                    :placeholder="$t('Username')" />

                <fig-form-input-text
                    v-model="form.password"
                    :placeholder="$t('Password')"
                    type="password"
                    :autocomplete="false" />

                <div>
                    <fig-button
                        type="submit"
                        variant="primary"
                        size="md"
                        block
                        :disabled="!buttonIsEnabled">
                        {{ $t('Login') }}
                    </fig-button>
                </div>
            </form>
        </div>
    </div>
</template>
