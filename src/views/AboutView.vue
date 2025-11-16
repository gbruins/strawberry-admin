<script setup lang="ts">
import  { ref, onMounted } from 'vue';
import Button from 'primevue/button';
import useApi from '@/composables/useApi';

const $apiProductSearch = useApi('product.search');
const $apiProductRead = useApi('product.read');
const $apiProductCreate = useApi('product.create');
const $apiProductUpdate = useApi('product.update');
const $apiProductDelete = useApi('product.delete');

const createdProductId = ref<string | null>(null);

function getProducts() {
    return $apiProductSearch.tryCatch(
        async () => {
            const response = await $apiProductSearch.run();
        }
    );
}

function getProduct() {
    return $apiProductRead.tryCatch(
        async () => {
            const response = await $apiProductRead.run('28a97dc5-134f-4524-88cf-3b7d2ee6094a');
        }
    );
}

function createProduct() {
    return $apiProductCreate.tryCatch(
        async () => {
            const response = await $apiProductCreate.run({
                title: 'New Product',
                description: 'A brand new product',
                product_type: 1,
                base_price: 1999,
                published: true
            });
            createdProductId.value = response.data.id
            console.log('Product created successfully', response.data);
        }
    );
}

function updateProduct() {
    return $apiProductUpdate.tryCatch(
        async () => {
            const response = await $apiProductUpdate.run(createdProductId.value, {
                title: 'Updated Product Title'
            });
            console.log('Product updated successfully', response.data);
        }
    );
}

function deleteProduct() {
    return $apiProductDelete.tryCatch(
        async () => {
            const response = await $apiProductDelete.run(createdProductId.value);
            console.log('Product deleted successfully', response.data);
        }
    );
}

onMounted(async () => {
    getProducts();
    // getProduct();
    // await createProduct();
    // await updateProduct();
    // await deleteProduct();
});
</script>

<template>
    <div class="pr-4">
        <Button label="Submit" />
    </div>
</template>

<style>
</style>
