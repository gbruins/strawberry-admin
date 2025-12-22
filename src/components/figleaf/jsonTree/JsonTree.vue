<script>
// This component was borrowed heavily from
// https://github.com/myst729/vue-json-tree/blob/master/src/json-tree.vue
export default {
    name: 'JsonTree'
}
</script>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import isString from 'lodash.isstring';
import FigIcon from '@/components/figleaf/icon/FigIcon.vue'

const props = defineProps({
    /**
     * The JSON data to display.
     */
    data: {},

    /**
     * The maximum depth to expand the tree to.
     */
    level: {
        type: Number,
        default: Infinity
    },

    kv: {
        type: Object
    }
});

const { t } = useI18n();

const expanded = ref(true);
const hovered = ref(false);

const parsed = computed(() => {
    if (props.kv) {
        return props.kv;
    }

    let result;

    try {
        if (isString(props.data)) {
            result = JSON.parse(props.data);
        }
        else if (typeof props.data !== 'undefined') {
            result = props.data;
        }
        else {
            result = '[fig-json-tree] No data passed.';
            console.warn(result);
        }
    }
    catch (e) {
        result = '[fig-json-tree] Invalid JSON passed in data prop.';
        console.warn(result);
    }
    finally {
        return parse(result);
    }
});


function parse (data, depth = 0, last = true, key = undefined) {
    let kv = {
        depth,
        last,
        primitive: true,
        // key: JSON.stringify(key) // this wraps quotation marks around the key
        key: key
    }

    if (typeof data !== 'object') {
        return Object.assign(
            kv,
            {
                type: typeof data,
                value: JSON.stringify(data)
            }
        );
    }

    if (data === null) {
        return Object.assign(
            kv,
            {
                type: 'null',
                value: 'null'
            }
        );
    }

    if (Array.isArray(data)) {
        let value = data.map((item, index) => {
            return parse(item, depth + 1, index === data.length - 1)
        });

        return Object.assign(
            kv,
            {
                primitive: false,
                type: 'array',
                value
            }
        );
    }

    let keys = Object.keys(data);

    let value = keys.map((key, index) => {
        return parse(data[key], depth + 1, index === keys.length - 1, key)
    });

    return Object.assign(
        kv,
        {
            primitive: false,
            type: 'object',
            value
        }
    )
}

onMounted(() => {
    expanded.value = parsed.value.depth < props.level;
});
</script>

<template>
    <span class="json-tree" :class="{'json-tree-root': parsed.depth === 0}">
        <span class="json-tree-row" v-if="parsed.primitive">
        <span class="json-tree-indent" v-for="n in (parsed.depth * 2 + 4)" :key="n">&nbsp;</span>
        <span class="json-tree-key" v-if="parsed.key">{{ parsed.key }}:&nbsp;</span>
        <span class="json-tree-value" :class="'json-tree-value-' + parsed.type" :title="`${parsed.value}`">{{ `${parsed.value}` }}</span>
        <span v-if="!parsed.last">,</span>
        <span class="json-tree-indent">&nbsp;</span>
    </span>

    <span class="json-tree-deep" v-if="!parsed.primitive">
        <span class="json-tree-row cursor-pointer" @click="expanded = !expanded" @mouseover="hovered = true" @mouseout="hovered = false">
            <span class="json-tree-indent">&nbsp;</span>
            <span class="flex items-center">
                <fig-icon
                    :icon="expanded ? 'chevron-down' : 'chevron-right'"
                    :width="16"
                    :height="16"
                    stroke="#5c5b5b"
                    :stroke-width="2" />
            </span>
            <span class="json-tree-indent" v-for="n in (parsed.depth * 2 + 1)" :key="n">&nbsp;</span>
            <span class="json-tree-key" v-if="parsed.key">{{ parsed.key }}:&nbsp;</span>
            <span class="json-tree-open">{{ parsed.type === 'array' ? '[' : '{' }}</span>
            <span class="json-tree-collapsed" v-show="!expanded">&nbsp;/*&nbsp;{{ $t('{num} items', { num: parsed.value.length }, parsed.value.length) }}&nbsp;*/&nbsp;</span>
            <span class="json-tree-close" v-show="!expanded">{{ parsed.type === 'array' ? ']' : '}' }}</span>
            <span v-show="!expanded && !parsed.last">,</span>
            <span class="json-tree-indent">&nbsp;</span>
        </span>

        <span class="json-tree-deeper" v-show="expanded">
            <json-tree
                v-for="(item, index) in parsed.value"
                :key="index"
                :kv="item"
                :level="level" />
        </span>

        <span class="json-tree-row" v-show="expanded">
            <span class="json-tree-ending" :class="{'json-tree-paired': hovered}">
                <span class="json-tree-indent" v-for="n in (parsed.depth * 2 + 4)" :key="n">&nbsp;</span>
                <span class="json-tree-close">{{ parsed.type === 'array' ? ']' : '}' }}</span>
                <span v-if="!parsed.last">,</span>
                <span class="json-tree-indent">&nbsp;</span>
            </span>
        </span>
      </span>
    </span>
</template>


<style scope>
.json-tree {
    display: flex;
    flex-direction: column;
    color: #881280;
    font-family: Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    line-height: 20px;
}

.json-tree-root {
    background-color: #f7f8f9;
    border-radius: 3px;
    margin: 2px 0;
    min-width: 560px;
    padding: 10px;
}

.json-tree-ending,
.json-tree-row {
    display: flex;
    /* border-radius: 2px; */
}

.json-tree-paired,
.json-tree-row:hover {
    background-color: var(--color-blue-100);
}

.json-tree-collapsed {
    color: var(--color-gray-400);
    font-weight: 400;
    font-style: italic;
}

.json-tree-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.json-tree-value-string {
    color: var(--color-red-600);
}

.json-tree-value-boolean,
.json-tree-value-number {
    color: var(--color-blue-700);
}

.json-tree-value-null {
    color: var(--color-gray-400);
}

.json-tree-open,
.json-tree-close {
    color: var(--color-gray-500);
}
</style>
