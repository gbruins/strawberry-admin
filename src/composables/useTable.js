import { ref, computed } from 'vue';

export default () => {
    const sortBy = ref(null);
    const sortDir = ref(false);
    const tableResults = ref([]);
    const tableTotalResultsCount = ref(0);

    const tableHasNoResults = computed(() => {
        return tableResults.value?.length === 0;
    });

    function onSort(val) {
        sortBy.value = val?.by || null;
        sortDir.value = val.isDesc ? 'desc' : 'asc';
    }

    function getSortApiParams() {
        if (!sortBy.value) {
            return {};
        }

        return {
            _sort: `${sortBy.value}:${sortDir.value}`
        }
    }

    function setTableResults(results) {
        tableResults.value = results;
    }

    function setTableTotalResultsCount(count) {
        if (count === undefined || count === null) {
            return;
        }

        tableTotalResultsCount.value = parseInt(count, 10) || 0;

        if (!tableTotalResultsCount.value || tableTotalResultsCount.value < 0) {
            tableResults.value = [];
        }
    }

    return {
        onSort,
        getSortApiParams,
        setTableResults,
        setTableTotalResultsCount,
        tableHasNoResults,
        tableResults,
        tableTotalResultsCount
    };
}
