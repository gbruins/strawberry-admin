<script>
export default {
    name: 'FormInputFileButton',
    inheritAttrs: false
}
</script>

<script setup>
import { ref, computed } from 'vue';
import FigButton from '../../button/Button.vue';
import { useI18n } from 'vue-i18n';
import DOMPurify from 'dompurify';

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false
    },

    disabled: {
        type: Boolean,
        default: false
    },

    directory: {
        type: Boolean,
        default: false
    },

    accept: {
        type: String,
        default: '*'
    },

    browseLabel: {
        type: String
    }
});

const emit = defineEmits(['input']);

defineExpose({
    clear
});

const { t } = useI18n();
const displayText = ref(props.browseLabel || t('Browse'));
const fileRef = ref(null);
const focused = ref(false);
const files = ref([]);

const hasFiles = computed(() => {
    return files.value?.length > 0;
});

const buttonIcon = computed(() => {
    return hasFiles.value ? null : 'upload';
});

function emitInput(val) {
    emit('input', val);
}

function setDisplayText(text) {
    displayText.value = DOMPurify.sanitize(text || props.browseLabel || t('Browse'));
}

function onFileChange(e) {
    // e.target.files is a FileList object
    files.value = Array.from(e.target.files);

    if (hasFiles.value) {
        setDisplayText(
            files.value.length === 1
                ? files.value[0].name
                : t('{num} files selected', { num: files.value.length }, files.value.length)
        );

        emitInput(files.value);
    }
    else {
        setDisplayText();
        emitInput(null);
    }
}

function onFocus() {
    focused.value = true;
}

function onBlur() {
    focused.value = false;
}

function browse() {
    fileRef.value.click();
}

function clear() {
    fileRef.value.value = '';
    files.value = [];
    setDisplayText();
    emitInput(null);
}
</script>


<template>
    <div
        class="fig-form-file-button"
        :class="{'outline-none ring ring-blue-300': focused && !disabled}">
        <div
            @mouseup="browse"
            @focus="onFocus"
            @blur="onBlur"
            @keydown.enter="browse"
            tabindex="0"
            :disabled="disabled">
            <fig-button
                variant="plain"
                :icon="buttonIcon"
                :disabled="disabled"
                v-bind="$attrs">{{ displayText }}</fig-button>
                <input
                    ref="fileRef"
                    type="file"
                    class="hidden"
                    :multiple="multiple"
                    :accept="accept"
                    :disabled="disabled"
                    @input="onFileChange"
                    @focus="onFocus"
                    @blur="onBlur">
        </div>
    </div>
</template>


<style scoped>
.fig-form-file-button {
    @apply inline-block focus:outline-none rounded;
}
</style>
```
