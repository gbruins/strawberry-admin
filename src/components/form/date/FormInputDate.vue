<script>
export default {
    name: 'FormInputDate'
}
</script>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import FormText from '../text/FormText.vue';
import useDate from '../../../composables/useDate.js';

const props = defineProps({
    modelValue: {
        type: String,
        default: null
    },

    config: {
        type: Object,
        default: () => {
            return {
                wrap: false,
                defaultDate: null,
                enableTime: true
            };
        }
    },

    timezone: {
        type: String,
        default: () => {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
    },

    inclusiveSeconds: {
        type: Boolean,
        default: false
    },

    clearable: {
        type: Boolean,
        default: true
    },

    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'update:modelValue',
    'close',
    'open'
]);

const { t } = useI18n();
const {
    dateTo8601,
    format8601,
    updateSecondsOfIso8601,
    isDateObject,
    convertIsoDateToTimezone
} = useDate();

const selectedDate = ref(null);
const formInputDateTime = ref(null);

let Pickr = null;

function zonedTimeToUtcWithoutZ(date) {
    if (date) {
        if (isDateObject(date)) {
            date = fromZonedTime(date, props.timezone).toISOString().replace('Z', '');
        }

        return updateSecondsOfIso8601(date, props.inclusiveSeconds ? 59 : 0);
    }
}

function emitInput(date) {
    emit('update:modelValue', zonedTimeToUtcWithoutZ(date));
}

function emitClose(date) {
    emit('close', zonedTimeToUtcWithoutZ(date));
}

function emitOpen(date) {
    emit('open', zonedTimeToUtcWithoutZ(date));
}

function onClear() {
    Pickr.clear();
    emitInput(null);
}

/*
* Config options: https://flatpickr.js.org/options/
* Events:  https://flatpickr.js.org/events/
* Formatting tokens:  https://flatpickr.js.org/formatting/
*/
function getConfig() {
    const config = Object.assign(
        {},
        {
            dateFormat: 'Y-m-dTH:i:S',
            altFormat: 'd/M/Y h:i K',
            altInput: true,
            allowInput: false,
            enableTime: true,
            hourIncrement: 1,
            minuteIncrement: 1,
            // defaultDate: props.modelValue || null,
            formatDate: (date, format) => {
                const dateFormat = props.config?.enableTime === false
                    ? t('date.format.mdy')
                    : t('date.format.mdy_hm');

                const formatted = format8601(
                    dateTo8601(date),
                    dateFormat,
                    props.timezone
                );

                return formatted;
            },

            // https://flatpickr.js.org/localization
            locale: {
                weekdays: {
                    shorthand: [
                        t('date.weekday.sunday.short'),
                        t('date.weekday.monday.short'),
                        t('date.weekday.tuesday.short'),
                        t('date.weekday.wednesday.short'),
                        t('date.weekday.thursday.short'),
                        t('date.weekday.friday.short'),
                        t('date.weekday.saturday.short')
                    ],
                    longhand: [
                        t('date.weekday.sunday'),
                        t('date.weekday.monday'),
                        t('date.weekday.tuesday'),
                        t('date.weekday.wednesday'),
                        t('date.weekday.thursday'),
                        t('date.weekday.friday'),
                        t('date.weekday.saturday')
                    ]
                },
                months: {
                    shorthand: [
                        t('date.month.1.short'),
                        t('date.month.2.short'),
                        t('date.month.3.short'),
                        t('date.month.4.short'),
                        t('date.month.5.short'),
                        t('date.month.6.short'),
                        t('date.month.7.short'),
                        t('date.month.8.short'),
                        t('date.month.9.short'),
                        t('date.month.10.short'),
                        t('date.month.11.short'),
                        t('date.month.12.short')
                    ],
                    longhand: [
                        t('date.month.1'),
                        t('date.month.2'),
                        t('date.month.3'),
                        t('date.month.4'),
                        t('date.month.5'),
                        t('date.month.6'),
                        t('date.month.7'),
                        t('date.month.8'),
                        t('date.month.9'),
                        t('date.month.10'),
                        t('date.month.11'),
                        t('date.month.12')
                    ]
                }
            },

            // event hooks
            onChange: (selectedDates, dateStr, instance) => {
                emitInput(selectedDates[0]);
            },
            onClose: (selectedDates) => {
                emitClose(selectedDates[0]);
            },
            onOpen: (selectedDates) => {
                emitOpen(selectedDates[0]);
            }
        },
        props.config,
        {
            wrap: false // needs to be false
        }
    );

    return config;
}

watch(
    () => props.config,
    (newVal) => {
        if (!Pickr) {
            return;
        }

        const cfg = getConfig();

        // Dont pass hooks to configs again
        // otherwise previously set hooks will be stop working
        delete cfg.onChange;
        delete cfg.onClose;
        delete cfg.onOpen;

        Pickr.set(cfg);
    },
    { deep: true }
);

watch(
    () => props.modelValue,
    (newVal) => {
        selectedDate.value = newVal ? convertIsoDateToTimezone(newVal, props.timezone) : null;

        // newVal may be a timestamp with a seconds value.
        // Emitting here so the client can have the correct value
        // which will have the seconds reset to 0 or 59 depending on the inclusiveSeconds prop
        emitInput(newVal);
    },
    { immediate: true }
)

onMounted(() => {
    // no action needed if Pickr is already initialized
    if (Pickr) {
        return;
    }

    Pickr = flatpickr(
        formInputDateTime.value.$el.querySelector('input'),
        getConfig()
    );
});

onBeforeUnmount(() => {
    if (Pickr) {
        Pickr.destroy();
    }

    Pickr = null;
});
</script>


<template>
    <form-text
        v-model="selectedDate"
        :clearable="clearable"
        :disabled="disabled"
        @clear="onClear"
        ref="formInputDateTime"
        class="fig-input-date" />
</template>


<style>
.fig-input-date .form-input[readonly] {
    background-color: #fff !important;
    cursor: pointer !important;
}
</style>
