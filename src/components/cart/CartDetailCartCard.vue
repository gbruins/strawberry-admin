<script>
export default {
    name: 'CartDetailCartCard'
}
</script>

<script setup>
import { ref } from 'vue';
import FigJsonTree from '@/components/figleaf/jsonTree/JsonTree.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigIcon from '@/components/figleaf/icon/FigIcon.vue';
import FigModal from '@/components/figleaf/modal/Modal.vue';
import FigTextCard from '@/components/figleaf/textCard/TextCard.vue';
import FigIconLabel from '@/components/figleaf/iconLabel/IconLabel.vue';

const props = defineProps({
    cart: {
        type: Object
    }
});

const cart_modal = ref(null);

function showCartDataModal() {
    cart_modal.value.show();
}
</script>

<template>
    <fig-text-card variant="white">
        <template v-slot:header_left>
            <fig-icon-label>
                <template v-slot:left>
                    <fig-icon
                        icon="cart"
                        width="26"
                        height="26"
                        :stroke-width="1" />
                </template>
                <div class="text-lg font-bold">{{ $t('Cart') }}</div>
            </fig-icon-label>
        </template>

        <fig-button
            variant="plain"
            size="sm"
            @click="showCartDataModal">{{ $t('view raw data') }}</fig-button>

        <!-- raw data modal -->
        <fig-modal
            ref="cart_modal"
            size="lg"
            close-button>
            <fig-json-tree
                :data="cart"
                :level="1" />
        </fig-modal>
    </fig-text-card>
</template>
