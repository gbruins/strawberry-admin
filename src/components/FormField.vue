<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Label } from '@/components/ui/label';

// Label + control + first validation error. Pass the Vuelidate field (`v$.title`) as `field`;
// the error shows once the field is dirty (useUpsertForm uses $autoDirty, and submit validates
// everything). Built-in validators get translated messages; pass `messages` for custom ones.

interface ValidationError {
    $validator: string;
    $message: string | { value: string };
    $params: Record<string, unknown>;
}

const props = defineProps<{
    label: string;
    /** id of the control, for the label's `for` */
    for?: string;
    field?: { $errors: ValidationError[] };
    /** Message per validator name, overriding the defaults below. */
    messages?: Record<string, string>;
    hint?: string;
}>();

const { t } = useI18n();

const error = computed(() => {
    const err = props.field?.$errors?.[0];

    if (!err) {
        return null;
    }

    const custom = props.messages?.[err.$validator];

    if (custom) {
        return custom;
    }

    const params = err.$params;

    switch (err.$validator) {
        case 'required': return t('required');
        case 'minValue': return t('must be at least {min}', { min: params.min });
        case 'maxValue': return t('must be at most {max}', { max: params.max });
        case 'minLength': return t('must be at least {min} characters', { min: params.min });
        case 'maxLength': return t('must be at most {max} characters', { max: params.max });
        default: return typeof err.$message === 'string' ? err.$message : err.$message.value;
    }
});
</script>

<template>
    <div class="grid gap-1.5">
        <Label :for="props.for">{{ label }}</Label>
        <slot />
        <p v-if="hint && !error" class="text-sm text-muted-foreground">{{ hint }}</p>
        <p v-if="error" class="text-sm text-destructive" role="alert">{{ error }}</p>
    </div>
</template>
