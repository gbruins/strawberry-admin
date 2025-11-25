import { reactive } from 'vue';

export default function usePagination(pageSize = 100, pageNo = 1) {

    const data = reactive({
        pageSize,
        pageNo,
    });

    function setData(d) {
        data.pageSize = d.pageSize;
        data.pageNo = d.pageNo;
    }

    function setPageSize(val) {
        const num = parseInt(val, 10);
        data.pageSize = isNaN(num) ? pageSize : num;
    }

    function setPageNumber(val) {
        const num = parseInt(val, 10);
        data.pageNo = isNaN(num) ? pageNo : num;
    }

    function resetPageNumber() {
        setPageNumber(1);
    }

    function resetPageSize() {
        setPageSize(pageSize);
    }

    function getPaginationApiParams() {
        return {
            _page: data.pageNo,
            _pageSize: data.pageSize
        }
    }

    return {
        data,
        setData,
        setPageSize,
        setPageNumber,
        resetPageNumber,
        resetPageSize,
        getPaginationApiParams
    }

}
