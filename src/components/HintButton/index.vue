<template>
    <a :title="title" style="margin: 10px;"> 
        <el-button v-bind="$attrs" v-on="$listeners" size="mini"></el-button>
    </a>
</template>

<script>
export default {
    name:'HintButton',
    props:['title']
}
</script>

<style>

</style>