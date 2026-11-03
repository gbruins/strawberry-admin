<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { KeyRoundIcon, Trash2Icon } from '@lucide/vue';
import PageTitle from '@/components/layouts/PageTitle.vue';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Overlay from '@/components/Overlay.vue';
import PopConfirm from '@/components/PopConfirm.vue';
import KitchenStationUpsertModal from '@/components/kitchenStations/KitchenStationUpsertModal.vue';
import KitchenStationRotatePinModal from '@/components/kitchenStations/KitchenStationRotatePinModal.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const { t } = useI18n();
const { successToast } = useToast();
const $apiSearch = useApi('kitchenStation.search');
const $apiRevoke = useApi('kitchenStation.revoke');

interface KitchenStation {
    id: string;
    name: string;
    station_code: string;
    revoked_at: string | null;
}

const upsertModal = ref(null);
const rotatePinModal = ref(null);
const stations = ref<KitchenStation[]>([]);

function fetchData() {
    return $apiSearch.tryCatch(async () => {
        const response = await $apiSearch.run();
        stations.value = response.data || [];
    });
}

function onRevoke(id: string) {
    return $apiRevoke.tryCatch(async () => {
        await $apiRevoke.run(id);

        successToast({ title: t('Station revoked') });

        fetchData();
    });
}

onMounted(fetchData);
</script>

<template>
    <PageTitle>{{ t('Kitchen Stations') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal.show()">{{ t('Add kitchen station') }}</Button>
    </div>

    <Overlay :show="$apiSearch.isLoading.value">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{{ t('Name') }}</TableHead>
                    <TableHead>{{ t('Station code') }}</TableHead>
                    <TableHead>{{ t('Status') }}</TableHead>
                    <TableHead class="text-center">{{ t('Actions') }}</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-for="station in stations" :key="station.id">
                    <TableCell>{{ station.name }}</TableCell>
                    <TableCell class="font-mono">{{ station.station_code }}</TableCell>

                    <TableCell>
                        <Badge :variant="station.revoked_at ? 'destructive' : 'success'">
                            {{ station.revoked_at ? t('Revoked') : t('Active') }}
                        </Badge>
                    </TableCell>

                    <TableCell>
                        <div class="flex items-center justify-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                :disabled="!!station.revoked_at"
                                @click="rotatePinModal.show(station.id)">
                                <KeyRoundIcon />
                            </Button>

                            <PopConfirm v-if="!station.revoked_at" @confirm="onRevoke(station.id)">
                                {{ t('Revoke this station? Any logged-in tablet will be signed out immediately.') }}
                                <template #reference>
                                    <Button variant="destructive" size="icon">
                                        <Trash2Icon />
                                    </Button>
                                </template>
                            </PopConfirm>
                        </div>
                    </TableCell>
                </TableRow>

                <TableRow v-if="!stations.length">
                    <TableCell colspan="4" class="text-center text-muted-foreground">{{ t('No data') }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </Overlay>

    <KitchenStationUpsertModal ref="upsertModal" @success="fetchData" />
    <KitchenStationRotatePinModal ref="rotatePinModal" @success="fetchData" />
</template>
