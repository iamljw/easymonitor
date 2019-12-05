<template>
<div>
    <h6>Request Headers</h6>
    <div
        class="content-w"
        v-for="[key, val] in Object.entries(JSON.parse(row.headers))"
        :key="key"
    >
        <strong style="fontSize:12px;">{{key}}: </strong><span style="fontSize:12px;">{{val}}</span>
    </div>
    <h6>Query String Parameters</h6>
    <div class="content-w">
        {{row.queryStrParams}}
    </div>
    <h6>Request Body</h6>
    <div class="content-w">
        {{row.requestBody}}
    </div>
    <h6>Response Body</h6>
    <div class="content-w">
        {{row.responseBody}}
    </div>
</div>
</template>
<script>
export default {
    name: 'ReqDetails',
    props: {
        row: Object
    },
    data() {
        return {
            
        }
    }
}
</script>
<style scoped lang="scss">
.content-w {
    margin-left: 24px;
}
</style>