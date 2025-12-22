<script>
export default {
    name: 'Address'
}
</script>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    company: {
        type: String
    },

    streetAddress: {
        type: String
    },

    extendedAddress: {
        type: String
    },

    city: {
        type: String
    },

    state: {
        type: String
    },

    zip: {
        type: String
    },

    countryCode: {
        type: String
    },

    countryCodeInline: {
        type: Boolean,
        default: false
    },

    email: {
        type: String
    },

    phone: {
        type: String
    }
});

const formattedName = computed(() => {
    const val = [];

    if(props.firstName) {
        val.push(props.firstName.trim());
    }

    if(props.lastName) {
        val.push(props.lastName.trim());
    }

    return val.join(' ');
});

const formattedCompanyName= computed(() => {
    if(props.company) {
        return props.company.trim().toUpperCase();
    }

    return null;
});

const formattedCityStateZip= computed(() => {
    const val = [];

    if (props.city) {
        val.push(props.city.trim());
    }

    if(props.state || props.zip) {
        if (props.city.trim()) {
            val.push(',');
        }

        if (props.state) {
            val.push(' ' + props.state.trim());
        }

        if (props.zip) {
            // make sure zip is a string before trimming
            const z = props.zip + '';
            val.push(' ' + z.trim());
        }
    }

    if (props.countryCodeInline && props.countryCode) {
        if (
            (props.city && props.city.trim())
            || (props.state && props.state.trim())
            || (props.zip && props.zip.trim())
        ) {
            val.push(',');
        }
        val.push(props.countryCode);
    }

    return val.join('');
})
</script>

<template>
    <div>
        <div class="addressRow">{{ formattedName }}</div>
        <div class="addressRow" v-if="formattedCompanyName">{{ formattedCompanyName }}</div>
        <div class="addressRow" v-if="streetAddress">{{ streetAddress }}</div>
        <div class="addressRow" v-if="extendedAddress">{{ extendedAddress }}</div>
        <div class="addressRow">{{ formattedCityStateZip }}</div>
        <div class="addressRow" v-if="countryCode && !countryCodeInline" >{{ countryCode }}</div>
        <div class="addressRow" v-if="email">{{ email }}</div>
        <div v-if="phone">{{ phone }}</div>
    </div>
</template>

<style scoped>
.addressRow {
    margin-bottom: 2px;
}
</style>
