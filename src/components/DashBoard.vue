<template>
    <div class="container">

        <!-- Tabs -->
        <div class="tabs">
            <div class="btn"
                v-for="(item, index) in tabs"
                :key="index"
                :class="{'label-orange': item.name === tab_selected}"
                @click="tab_selected = item.name"
            >
                {{item.name}}
            </div>
        </div>

        <!-- Create tabs -->
        <CreateNote v-if="tab_selected === tabs[0].name" />

        <!-- List tabs -->
        <NoteList v-if="tab_selected === tabs[1].name" />

    </div>
</template>

<script>
import CreateNote from './CreateNote.vue'
import NoteList from './NoteList.vue'

export default {
    name: "DashBoard",
    components: { 
        CreateNote,
        NoteList
    },
    data() {
        return {
            tabs: [
                {
                    name: this.$t('create_new'),
                },
                {
                    name: this.$t('appointment_scheduled')
                }
            ],
            tab_selected: this.$t('appointment_scheduled')
        }
    }
};
</script>

