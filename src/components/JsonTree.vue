<script setup lang="ts">
// Adapted from https://github.com/myst729/vue-json-tree/blob/master/src/json-tree.vue
import { ref, computed, onMounted } from 'vue';
import { ChevronDownIcon, ChevronRightIcon } from '@lucide/vue';

defineOptions({ name: 'JsonTree' });

interface Node {
    depth: number;
    last: boolean;
    primitive: boolean;
    key?: string;
    type: string;
    value: string | Node[];
}

const props = withDefaults(defineProps<{
    /** The data to display (an object/array, or a JSON string). */
    data?: unknown;
    /** Expand the tree to this depth initially. */
    level?: number;
    /** Internal: a pre-parsed node, when rendering a child. */
    kv?: Node;
}>(), {
    level: Infinity
});

const expanded = ref(true);
const hovered = ref(false);

function parse(data: unknown, depth = 0, last = true, key?: string): Node {
    const base = { depth, last, key };

    if (data === null) {
        return { ...base, primitive: true, type: 'null', value: 'null' };
    }

    if (typeof data !== 'object') {
        return { ...base, primitive: true, type: typeof data, value: JSON.stringify(data) };
    }

    if (Array.isArray(data)) {
        return { ...base, primitive: false, type: 'array', value: data.map((item, i) => parse(item, depth + 1, i === data.length - 1)) };
    }

    const entries = Object.entries(data as Record<string, unknown>);

    return {
        ...base,
        primitive: false,
        type: 'object',
        value: entries.map(([k, v], i) => parse(v, depth + 1, i === entries.length - 1, k))
    };
}

const parsed = computed<Node>(() => {
    if (props.kv) {
        return props.kv;
    }

    if (typeof props.data === 'undefined') {
        return parse('[json-tree] No data passed.');
    }

    if (typeof props.data === 'string') {
        try {
            return parse(JSON.parse(props.data));
        }
        catch {
            return parse('[json-tree] Invalid JSON passed in data prop.');
        }
    }

    return parse(props.data);
});

const children = computed(() => (Array.isArray(parsed.value.value) ? parsed.value.value : []));

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
                <ChevronDownIcon v-if="expanded" class="size-4 text-muted-foreground" />
                <ChevronRightIcon v-else class="size-4 text-muted-foreground" />
            </span>
            <span class="json-tree-indent" v-for="n in (parsed.depth * 2 + 1)" :key="n">&nbsp;</span>
            <span class="json-tree-key" v-if="parsed.key">{{ parsed.key }}:&nbsp;</span>
            <span class="json-tree-open">{{ parsed.type === 'array' ? '[' : '{' }}</span>
            <span class="json-tree-collapsed" v-show="!expanded">&nbsp;/*&nbsp;{{ $t('{num} items', { num: children.length }, children.length) }}&nbsp;*/&nbsp;</span>
            <span class="json-tree-close" v-show="!expanded">{{ parsed.type === 'array' ? ']' : '}' }}</span>
            <span v-show="!expanded && !parsed.last">,</span>
            <span class="json-tree-indent">&nbsp;</span>
        </span>

        <span class="json-tree-deeper" v-show="expanded">
            <JsonTree
                v-for="(item, index) in children"
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


<style scoped>
.json-tree {
    display: flex;
    flex-direction: column;
    color: var(--foreground);
    font-family: Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    line-height: 20px;
}

.json-tree-root {
    background-color: var(--muted);
    border-radius: 3px;
    margin: 2px 0;
    min-width: 560px;
    padding: 10px;
}

.json-tree-ending,
.json-tree-row {
    display: flex;
}

.json-tree-paired,
.json-tree-row:hover {
    background-color: var(--accent);
}

.json-tree-collapsed {
    color: var(--muted-foreground);
    font-weight: 400;
    font-style: italic;
}

.json-tree-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.json-tree-value-string {
    color: var(--destructive);
}

.json-tree-value-boolean,
.json-tree-value-number {
    color: var(--primary);
}

.json-tree-value-null {
    color: var(--muted-foreground);
}

.json-tree-open,
.json-tree-close {
    color: var(--muted-foreground);
}
</style>
