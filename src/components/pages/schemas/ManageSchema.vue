<template>
    <div v-if="schema" id="ManageSchemaPage">

        <div>
                    
            <us-button class="float-right" variant="link" @click="onAddField()"><i class="fas fa-plus-circle"></i> Add field</us-button>        
        </div> 

        <us-form @submit="onSubmit()" :validate="true" v-if="mode == 'edit'" class="mb-3">
            <us-form-group label="Schema Name">
                <us-form-input v-model="schema.name" :required="true"/>
            </us-form-group>            
            <us-form-group label="Schema Description">
                <us-form-textarea v-model="schema.description" :required="true"/>
            </us-form-group>            
            <div align="right">
                <us-button variant="light" type="button" @click="mode='info'"><i class="far fa-times-circle"></i> Cancel</us-button>
                <us-button type="submit"><i class="far fa-save"></i> Save</us-button>
            </div>            
        </us-form>

        <div v-else>
            <h2>{{schema.name}}
                <us-button variant="link" @click="mode='edit'" style="font-size:12px"><i class="fas fa-edit"></i></us-button>
            </h2>
            <p>{{schema.description}}</p>
        </div>

        <div class="pb-6">            

                <vue-good-table     
                    v-if="fields"  
                    class="prime-table"             
                    :columns="columns"
                    :rows="fields">
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'key'">
                            <us-tag variant="light">{{props.row.key}}</us-tag> 
                        </span>
                        <span v-else-if="props.column.field == 'type'">
                            <us-form-combobox :options="types" v-model="props.row.type"/>
                        </span>     
                        <span v-else-if="props.column.field == 'controls'">
                            <us-button variant="link" @click="onEditField(props.row)" style="font-size:12px" class="mr-1">
                                <i class="fas fa-edit"></i> edit
                            </us-button>
                            <us-button variant="link" @click="onEditField(props.row)" style="font-size:12px" class="text-danger">
                                <i class="fas fa-trash"></i> delete
                            </us-button>
                        </span>                                                                  
                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                        </span>                        
                    </template>
                </vue-good-table>
<!--
                <div v-if="!selectedField">
                    <div v-for="field in fields" :key="field.id" @click="onEditField(field)">
                        <us-tag variant="light" class="ml-1">{{field.key}}</us-tag>
                        <us-tag variant="light" class="ml-1">{{field.type}}</us-tag>
                        <p>{{field.description}}</p>
                        <p>{{field.notes}}</p>
                    </div>
                </div>


-->

        </div> 

        <!-- Edit field modal -->
        <us-modal v-model="showModal" title="Edit Field">

            <us-form @submit="onSubmit()" :validate="true" v-if="selectedField">

                <us-row>
                    <us-col>
                        <us-form-group label="key">
                            <us-form-input v-model="selectedField.key" :required="true"/>
                        </us-form-group>

                        <us-form-group label="category">
                            <us-form-input v-model="selectedField.category" />
                        </us-form-group>

                        <us-form-group label="type">
                            <us-form-combobox v-model="selectedField.type" :options="types"/>
                        </us-form-group>

                        <us-form-group label="notes">
                            <us-form-input v-model="selectedField.notes"/>
                        </us-form-group>     

                    </us-col>
                    <us-col>
                        <us-form-group label="min">
                            <us-form-input v-model="selectedField.min" type='number'/>
                        </us-form-group>

                        <us-form-group label="max">
                            <us-form-input v-model="selectedField.max" type='number'/>
                        </us-form-group>                        

                        <us-form-group label="values">
                            <us-form-input v-model="selectedField.values"/>
                        </us-form-group>              

                        <us-form-group label="description">
                            <us-form-input v-model="selectedField.description"/>
                        </us-form-group>            

                    </us-col>
                </us-row> 

            </us-form>

        </us-modal>


    </div>
</template>
<script>

import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

//import Schema from '../../../models/Schema';
import SchemaField from '../../../models/SchemaField';

export default {
    name: "manage-schema",
    components: {VueGoodTable},
    data(){
        return {
            mode: 'info',
            types: ['integer', 'float', 'percent', 'enum', 'text'],
            metaType: ['general', 'frequency', 'capacity', 'total'],
            columns: [
                {label: 'Key', field: 'key', editable: false},
                {label: 'Category', field: 'category', editable: false},
                {label: 'Type', field: 'type', editable: false},
                {label: 'Description', field: 'description', editable: true},
                {label: '', field: 'controls', sortable: false}
            ],
            fields: null,
            showModal: false,
            selectedField: null
        }
    },   
    computed: {
        org(){
            return this.$store.state.org;
        }        
    },    
    watch: {
        schema(){
            this.getFields();
        }
    },     
    props: ['schema'],
    mounted(){
        this.getFields();
    },
    methods: {
        
        async getFields(){

            if (!this.schema || !this.org){
                return;
            }

            let field = new SchemaField(this.org.id, this.schema.id); 
            this.fields = await field.getAll();
            
            //if (this.fields && this.fields.length){
            //    this.fields = this.fields[0];
            //}
        },

        onEditField(field){
            this.selectedField = field;
            this.showModal = true;
        },

        async onAddField(){
            if (!this.schema || !this.org){
                return;
            }
            let field = new SchemaField(this.org.id, this.schema.id); 
            await field.save();   
        }
    } 
};
</script>
<style lang="scss">

#ManageSchemaPage {

    .usa-combo-box__input{
        padding-top: 0;
        padding-bottom: 0; 
        padding-right: 0;
        font-size: 1em !important;  
        height: 1.7em;
        border-color: rgba(120,120,120, 0.3);
    }

    .usa-combo-box__list {
        border-color: rgba(120,120,120, 0.3);
    }

    .usx-toggle-btn {
        top: 0.3em;
        width: auto;
        font-size: 1em;
        line-height: 1em;
        right: 1px;
        height: auto;
        z-index: 100;
    }

    .usa-combo-box__clear-input {
        top: -4px;
        right: 20px;
        font-size: 1em;        
    }

}
</style>
