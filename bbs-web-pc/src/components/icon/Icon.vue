<template>
    <icomoon :iconSet="iconSet" icon="" v-bind="props" />
</template>


<script setup lang="ts">
    import { Icomoon } from "vue-icomoon";
 // import iconSet from "@/components/icon/selection.json";
    import iconSet from "../../components/icon/selection.json";

    const props = defineProps({  
        name:{  
          type:String,  
          required:true  
        }
    }) 

</script>
