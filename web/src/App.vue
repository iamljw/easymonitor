<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.pointer {
    cursor: pointer;
}
.search-con {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0;
    .search {
        &-col {
            display: inline-block;
            width: 200px;
        }
        &-input {
            display: inline-block;
            width: 200px;
            margin-left: 2px;
        }
        &-btn {
            margin-left: 2px;
        }
    }
}
#tip-w {
    display: flex;
    padding: 10px 0;
    justify-content: flex-start;
}
</style>
