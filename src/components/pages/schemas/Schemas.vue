<template>
	<us-container fluid="full">

        <us-tabs>
            <us-tab title="Definition" active>
                <manage-schema :schema="schema"></manage-schema>
            </us-tab>
            <us-tab title="Data Mapping">
                <data-mapping :schema="schema"></data-mapping>
            </us-tab>
            <us-tab title="Import Data">
                <data-import :schema="schema"></data-import>
            </us-tab>
        </us-tabs>

        
	</us-container>
</template>
<script>
import Schema from '../../../models/Schema';
import ManageSchema from './ManageSchema';
import DataMapping from './DataMapping';
import DataImport from './DataImport';

export default {
    name: "schemas",
    components: {ManageSchema, DataMapping, DataImport},
    data(){
        return {
            link: 'info',
            schema: null,
            schemas: null
        }
    },
    computed: {
        org(){
            return this.$store.state.org;
        }        
    },   
    watch: {
        org(newVal){
            if (newVal){
                this.getSchemas();
            }
        }
    }, 
    mounted(){
        this.getSchemas();
    },
    methods: {

        async createSchema(){
             let schema = new Schema(this.org.id);
             await schema.save();
             if (!this.schemas){
                 this.schemas = [];
             }
             this.schemas.push(this.schema);
             if (this.schemas && this.schemas.length){
                this.schema = this.schemas[0];
             }
        },

        async getSchemas(){

            if (!this.org){
                return;
            }

            let schema = new Schema(this.org.id);
            this.schemas = await schema.getAll();
            
            if (this.schemas && this.schemas.length){
                this.schema = this.schemas[0];
            }

        }
    }
};
</script>
<style lang="scss">
</style>
