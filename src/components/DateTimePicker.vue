<script setup lang="ts">
import { ref, shallowRef, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { CalendarDate, type DateValue } from '@internationalized/date';
import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { CalendarIcon, XIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/stores/app';

const props = withDefaults(defineProps<{
    /** ISO-8601 instant, or null */
    modelValue?: string | null;
    /** Defaults to the logged-in admin's own tenant — only pass this to edit a time in some OTHER zone. */
    timezone?: string | null;
    clearable?: boolean;
    enableTime?: boolean;
}>(), {
    modelValue: null,
    timezone: null,
    clearable: true,
    enableTime: true
});

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>();

const { t } = useI18n();
const appStore = useAppStore();
const open = ref(false);
// shallowRef: a deep ref would unwrap CalendarDate's class type and no longer match <Calendar>'s DateValue.
const calendarDate = shallowRef<CalendarDate | null>(null);
const timeValue = ref('00:00');

const effectiveTimezone = computed(() => props.timezone || appStore.timezone || 'UTC');

function zonedPartsFromIso(iso: string | null) {
    if (!iso) {
        return null;
    }

    const zoned = toZonedTime(new Date(iso), effectiveTimezone.value);

    return {
        date: new CalendarDate(zoned.getFullYear(), zoned.getMonth() + 1, zoned.getDate()),
        time: `${String(zoned.getHours()).padStart(2, '0')}:${String(zoned.getMinutes()).padStart(2, '0')}`
    };
}

watch(
    () => props.modelValue,
    (newVal) => {
        const parts = zonedPartsFromIso(newVal);
        calendarDate.value = parts?.date || null;
        timeValue.value = parts?.time || '00:00';
    },
    { immediate: true }
);

function emitFromParts() {
    if (!calendarDate.value) {
        emit('update:modelValue', null);
        return;
    }

    const [hours, minutes] = (timeValue.value || '00:00').split(':').map(Number);
    const { year, month, day } = calendarDate.value;

    // y/m/d/h/m below represent the wall-clock time in props.timezone,
    // which fromZonedTime reinterprets as that timezone's instant.
    const wallClock = new Date(year, month - 1, day, hours || 0, minutes || 0, 0);

    emit('update:modelValue', fromZonedTime(wallClock, effectiveTimezone.value).toISOString());
}

function onCalendarSelect(val: DateValue | undefined) {
    calendarDate.value = val ? new CalendarDate(val.year, val.month, val.day) : null;
    emitFromParts();
}

function onTimeInput() {
    emitFromParts();
}

function onClear(e: Event) {
    e.stopPropagation();
    calendarDate.value = null;
    timeValue.value = '00:00';
    emit('update:modelValue', null);
}

const displayLabel = computed(() => {
    if (!props.modelValue) {
        return null;
    }

    const fmt = props.enableTime ? 'MMM d, yyyy h:mm a' : 'MMM d, yyyy';
    return formatInTimeZone(new Date(props.modelValue), effectiveTimezone.value, fmt);
});
</script>

<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <Button type="button" variant="outline" class="w-full justify-start font-normal">
                <CalendarIcon class="size-4" />
                <span :class="{ 'text-muted-foreground': !displayLabel }">{{ displayLabel || t('Select date') }}</span>
                <XIcon
                    v-if="clearable && modelValue"
                    class="ml-auto size-3.5 opacity-50 hover:opacity-100"
                    @click="onClear" />
            </Button>
        </PopoverTrigger>

        <PopoverContent class="w-auto p-0">
            <Calendar :model-value="calendarDate ?? undefined" @update:model-value="onCalendarSelect" />
            <div v-if="enableTime" class="px-3 pb-3">
                <Input type="time" v-model="timeValue" @change="onTimeInput" />
            </div>
        </PopoverContent>
    </Popover>
</template>
