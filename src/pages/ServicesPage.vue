<script setup lang="ts">
import { reactive, computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTimestamp } from '@vueuse/core';
import PageTitle from '@/components/layouts/PageTitle.vue';
import SearchFilterLayout from '@/components/layouts/SearchFilterLayout.vue';
import { TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import ListTable from '@/components/ListTable.vue';
import SortableTableHead from '@/components/SortableTableHead.vue';
import RowActions from '@/components/RowActions.vue';
import PopConfirm from '@/components/PopConfirm.vue';
import DateTimePicker from '@/components/DateTimePicker.vue';
import Format8601 from '@/components/Format8601.vue';
import ServiceUpsertModal from '@/components/services/ServiceUpsertModal.vue';
import ServiceAvailabilityModal from '@/components/services/ServiceAvailabilityModal.vue';
import { MailIcon, PackageIcon } from '@lucide/vue';
import useApi from '@/composables/useApi';
import useListPage from '@/composables/useListPage';
import useToast from '@/composables/useToast';
import { useMenus } from '@/composables/useLookups';
import { serviceHasEnded, nextUpcomingServiceId, menuProblem, type ServiceWindow } from '@/utils/services';

interface Service extends ServiceWindow {
    notes: string | null;
    service_menu_id: string | null;
    max_per_order: number;
    inventory_count: number;
    last_notified_at: string | null;
}

const { t } = useI18n();
const { successToast, addToast } = useToast();
const $apiNotify = useApi('notification.send');
const menus = useMenus();
const upsertModal = useTemplateRef('upsertModal');
const availabilityModal = useTemplateRef('availabilityModal');
// Reactive clock so "Next" and the notify button update as services start/end while the page is open.
const now = useTimestamp({ interval: 60_000 });

// Defaults to "now" so past services aren't shown on first load — staff manage upcoming
// openings here, not a historical log. Clear it to see everything, including past.
const filters = reactive({
    endsAfter: new Date().toISOString() as string | null
});

const list = useListPage<Service>({
    search: 'service.search',
    remove: 'service.delete',
    defaultSort: { by: 'start_at', desc: true },
    params: () => filters.endsAfter ? { end_at: JSON.stringify({ gte: filters.endsAfter }) } : {}
});

const nextUpcomingId = computed(() => nextUpcomingServiceId(list.rows, now.value));

const MENU_PROBLEM_LABELS = {
    deleted: () => t('Menu deleted'),
    unpublished: () => t('Menu not published')
};

function menuProblemLabel(service: Service) {
    const problem = menuProblem(service.service_menu_id, menus.byId.value);
    return problem ? MENU_PROBLEM_LABELS[problem]() : null;
}

function onNotify(id: string) {
    return $apiNotify.tryCatch(async () => {
        const response = await $apiNotify.run(id);

        if (response.data.recipientCount === 0) {
            addToast({ title: t('No subscribers to notify yet') });
            return;
        }

        successToast({
            title: t('Notification sent'),
            text: t('Sent to {count} subscriber(s)', { count: response.data.recipientCount })
        });

        list.fetch();
    });
}
</script>

<template>
    <PageTitle>{{ t('Service') }}</PageTitle>

    <div class="mb-4 text-right">
        <Button @click="upsertModal?.show()">{{ t('Add service') }}</Button>
    </div>

    <SearchFilterLayout @apply="list.applyFilters">
        <template #filters>
            <div class="grid gap-1.5">
                <Label>{{ t('Ends after') }}</Label>
                <DateTimePicker v-model="filters.endsAfter" />
            </div>
        </template>

        <ListTable :list="list" :columns="7">
            <template #head>
                <SortableTableHead sort-key="start_at">{{ t('Start at') }}</SortableTableHead>
                <SortableTableHead sort-key="end_at">{{ t('End at') }}</SortableTableHead>
                <TableHead>{{ t('Notes') }}</TableHead>
                <TableHead>{{ t('Menu') }}</TableHead>
                <TableHead class="text-right">{{ t('Max per order') }}</TableHead>
                <SortableTableHead sort-key="inventory_count" class="text-right">{{ t('Dough count') }}</SortableTableHead>
                <TableHead class="text-right">{{ t('Actions') }}</TableHead>
            </template>

            <template #row="{ row }">
                <TableCell>
                    <div class="flex items-center gap-2">
                        <Format8601 :date="row.start_at" />
                        <Badge v-if="row.id === nextUpcomingId" variant="success" data-test="next-upcoming">{{ t('Next') }}</Badge>
                    </div>
                </TableCell>
                <TableCell>
                    <Format8601 :date="row.end_at" />
                </TableCell>
                <TableCell>
                    {{ row.notes }}
                    <div v-if="row.last_notified_at" class="text-sm text-muted-foreground" data-test="last-notified">
                        {{ t('Notified') }} <Format8601 :date="row.last_notified_at" />
                    </div>
                </TableCell>
                <TableCell>
                    {{ row.service_menu_id ? menus.byId.value.get(row.service_menu_id)?.title : '' }}
                    <div v-if="menuProblemLabel(row)" class="text-sm text-amber-700" data-test="menu-problem">
                        {{ menuProblemLabel(row) }}
                    </div>
                </TableCell>
                <TableCell class="text-right">{{ row.max_per_order }}</TableCell>
                <TableCell class="text-right">{{ row.inventory_count }}</TableCell>
                <TableCell>
                    <RowActions @edit="upsertModal?.show(row.id)" @delete="list.remove(row.id)">
                        <!-- Mark menu products out of stock for this one service -->
                        <Button
                            v-if="row.service_menu_id && !serviceHasEnded(row, now)"
                            variant="ghost"
                            size="icon"
                            data-test="service-stock"
                            :aria-label="t('Stock')"
                            :title="t('Stock')"
                            @click="availabilityModal?.show(row.id)">
                            <PackageIcon />
                        </Button>

                        <!-- Hidden once the opening has ended, so staff can't advertise one that's gone. -->
                        <PopConfirm v-if="!serviceHasEnded(row, now)" @confirm="onNotify(row.id)">
                            <template #reference>
                                <!-- Disabled while a send is in flight: unlike delete, a duplicate
                                notify isn't idempotent — it really does double-email everyone. -->
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    data-test="notify-subscribers"
                                    :aria-label="t('Notify subscribers')"
                                    :title="t('Notify subscribers')"
                                    :disabled="$apiNotify.isLoading.value">
                                    <MailIcon />
                                </Button>
                            </template>
                            {{ row.last_notified_at ? t('Notify subscribers again about this opening?') : t('Notify subscribers about this opening?') }}
                        </PopConfirm>
                    </RowActions>
                </TableCell>
            </template>
        </ListTable>
    </SearchFilterLayout>

    <ServiceUpsertModal ref="upsertModal" @success="list.fetch" />
    <ServiceAvailabilityModal ref="availabilityModal" />
</template>
