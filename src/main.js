/**
 * Created by chenzhihua on 2018-12-25.
 */
import Vue from 'vue'

import App from './App.vue'

import Fill from './LogoFill.vue'
console.log(Fill)
Vue.component(Fill.name,Fill)
new Vue({
    el: '#app',
    data:{
        msg:"aaaaaaaa",
        lm:"qqqqqqqqqq"
    },
    components:{App}
})