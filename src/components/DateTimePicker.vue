<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { CalendarDate } from '@internationalized/date';
import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { CalendarIcon, XIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';

const props = defineProps({
    modelValue: {
        type: String,
        default: null
    },

    timezone: {
        type: String,
        default: 'America/Los_Angeles'
    },

    clearable: {
        type: Boolean,
        default: true
    },

    enableTime: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();
const open = ref(false);
const calendarDate = ref(null);
const timeValue = ref('00:00');

function zonedPartsFromIso(iso) {
    if (!iso) {
        return null;
    }

    const zoned = toZonedTime(new Date(iso), props.timezone);

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

    emit('update:modelValue', fromZonedTime(wallClock, props.timezone).toISOString());
}

function onCalendarSelect(val) {
    calendarDate.value = val;
    emitFromParts();
}

function onTimeInput() {
    emitFromParts();
}

function onClear(e) {
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
    return formatInTimeZone(new Date(props.modelValue), props.timezone, fmt);
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
            <Calendar v-model="calendarDate" @update:model-value="onCalendarSelect" />
            <div v-if="enableTime" class="px-3 pb-3">
                <Input type="time" v-model="timeValue" @change="onTimeInput" />
            </div>
        </PopoverContent>
    </Popover>
</template>
