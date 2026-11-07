<script setup lang="ts" generic="T extends string | number | boolean">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';

const props = withDefaults(defineProps<{
    options?: { label: string, value: T }[];
    placeholder?: string;
    clearable?: boolean;
}>(), {
    options: () => [],
    clearable: false
});

const modelValue = defineModel<T | null>();

const { t } = useI18n();
const open = ref(false);

const selectedLabel = computed(() => props.options.find((option) => option.value === modelValue.value)?.label ?? null);
const hasValue = computed(() => modelValue.value !== null && modelValue.value !== undefined);

function onSelect(value: T) {
    modelValue.value = value;
    open.value = false;
}

function onClear(event: Event) {
    event.stopPropagation();
    modelValue.value = null;
}
</script>

<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <Button
                type="button"
                variant="outline"
                role="combobox"
                :aria-expanded="open"
                class="w-full justify-between font-normal">
                <span class="truncate" :class="{ 'text-muted-foreground': !selectedLabel }">{{ selectedLabel || placeholder || t('Select...') }}</span>
                <span class="flex items-center gap-1 shrink-0">
                    <XIcon
                        v-if="clearable && hasValue"
                        class="size-3.5 opacity-50 hover:opacity-100"
                        :aria-label="t('Clear')"
                        @click="onClear" />
                    <ChevronsUpDownIcon class="size-4 opacity-50" />
                </span>
            </Button>
        </PopoverTrigger>

        <PopoverContent class="p-0">
            <Command>
                <CommandInput :placeholder="t('Search')" />
                <CommandList>
                    <CommandEmpty>{{ t('No data') }}</CommandEmpty>
                    <CommandGroup>
                        <CommandItem
                            v-for="option in options"
                            :key="String(option.value)"
                            :value="option.label"
                            @select="onSelect(option.value)">
                            <CheckIcon :class="['size-4', modelValue === option.value ? 'opacity-100' : 'opacity-0']" />
                            {{ option.label }}
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
