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

                <!--
                <pre>{{tableData}}</pre>

                 <hot-table 
                    class="hot-container"
                    v-if="fields" 
                    licenseKey='non-commercial-and-evaluation'
                    :data="fields" 
                    :rowHeaders="true" 
                    :colHeaders="true">

                    See https://handsontable.com/docs/8.3.1/frameworks-wrapper-for-vue-hot-column.html 
                    <hot-column :title="column.label" :data="column.field" v-for="column in columns" :key="column.field" :type="column.type" :source="column.source">
                    </hot-column>

                </hot-table>                
                -->



                <vue-good-table     
                    v-if="fields"  
                    class="prime-table"             
                    :columns="columns"                    
                    :rows="fields">
                    <template slot="table-row" slot-scope="props">

                        <span v-if="props.column.type == 'tag'">
                            <us-tag 
                                class="cell-tag"
                                :variant="(props.column.classes) ? props.column.classes[props.row[props.column.field]] : 'light'" >
                                {{props.row[props.column.field]}}
                            </us-tag> 
                        </span>

                        <!--
                        <textarea v-else-if="props.column.type == 'text'" v-model="props.row[props.column.field]" class="cell-input">
                        </textarea>
                        -->

                        <span v-else-if="props.column.type == 'enum'">
                            <multiselect 
                                :options="props.column.values" 
                                placeholder=""
                                @select="onUpdated(props.column.field, props.row, props.column)"
                                v-model="props.row[props.column.field]">
                            </multiselect>
                        </span>

                        <span v-else-if="props.column.type == 'toggle'">
                            <us-tag 
                                class="cell-tag"
                                :variant="(props.column.classes) ? props.column.classes[props.row[props.column.field]] : 'light'" 
                                @click="toggleField(props.column.field, props.row, props.column)">
                                {{props.row[props.column.field]}}
                            </us-tag> 
                        </span>

    <!--
                        <us-form-combobox v-if="props.column.type == 'enum'" :options="props.column.values" v-model="props.formattedRow[props.column.field]"/>


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
                        -->         

                        <span v-else-if="props.column.editable == undefined || props.column.editable">
                            <input :type="props.column.type" v-model="props.row[props.column.field]" class="cell-input"/>
                        </span>

                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                        </span>                        
                    </template>
                </vue-good-table>


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
import Multiselect from 'vue-multiselect';
//import { HotTable, HotColumn } from '@handsontable/vue';
import Papa from 'papaparse';
import _ from 'lodash';

//import Schema from '../../../models/Schema';
import SchemaField from '../../../models/SchemaField';

export default {
    name: "manage-schema",
    components: {VueGoodTable, Multiselect},
    data(){
        return {
            mode: 'info',
            types: ['integer', 'float', 'percent', 'enum', 'text'],
            metaType: ['general', 'frequency', 'capacity', 'total'],            
            columns: [
                {label: 'Key', field: 'key', editable:false, type: 'tag'},
                //{label: 'Category', field: 'category', type: 'string'},
                {label: 'Type', field: 'type', type: 'enum', values: ['integer', 'float', 'percent', 'enum', 'text']},
                {label: 'Description', field: 'description', type: 'text'},
                {label: 'Notes', field: 'notes', type: 'text'},
                {label: 'Min', field: 'min', type: 'number', width:'8em'},
                {label: 'Max', field: 'max', type: 'number', width:'8em'},
                {label: 'Values', field: 'string', type: 'text'},
                {label: 'Status', field: 'status', type: 'toggle', values: ['active', 'deleted'], classes: {'active': 'success', 'deleted': 'danger'}},
                //{label: '', field: 'controls', sortable: false}
            ],
            fields: null,
            showModal: false,
            selectedField: null
        }
    },   
    computed: {
        org(){
            return this.$store.state.org;
        },
        csvData(){

            if (!this.fields){
                return null;
            }

            const keys = _.map(this.columns, 'field');
            const vals = _.map(this.fields, (o)=>{
                return _.pick(o, keys);
            });
            
            // Create header hash map
            let headerRow = {};    
            let tmp = [];

            for (let j=0; j<this.columns.length; j+=1){                
                if (_.indexOf(keys, this.columns[j].field) != -1){
                    headerRow[this.columns[j].field] = this.columns[j];
                    headerRow[this.columns[j].field].index = j;
                    if (!tmp[0]){
                        tmp[0] = [];
                    }
                    tmp[0][j] = this.columns[j].label;
                }
            }

            for (let i=0; i<this.fields.length; i+=1){
                let row = [];
                for (let j=0; j<keys.length; j+=1){
                    let field = headerRow[keys[j]].field;
                    let index = headerRow[keys[j]].index;
                    row[index] = this.fields[i][field];
                }
                this.$log(row);
                tmp.push(row);
            }

            return tmp;
        
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
        },

        toggleField(key, row, colMeta){
            let val = row[key];
            let cur_i = _.indexOf(colMeta.values, val);
            let next_i = cur_i + 1;

            if (next_i >= colMeta.values.length){
                next_i = 0;
            }
            
            row[key] = colMeta.values[next_i];
        },

        async onUpdated(key, row, colMeta){
            // Find in the original fields array
            for (let i=0; i<this.fields.length; i+=1){
                //this.$log(this.fields[i].key, row);
                if (this.fields[i].key == row[key]){
                    this.fields[i][row[key]] = row[key];
                    this.$log(this.fields[i]);
                    await this.fields[i].save();
                }

            }
        }
    } 
};
</script>
<style lang="scss">

@import "~vue-multiselect/dist/vue-multiselect.min.css";
//@import "~handsontable/dist/handsontable.full.css";

#ManageSchemaPage {

    .cell-tag {
        font-size:12.5px;
    }

    input.cell-input {
        border-color: transparent;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    textarea.cell-input {
        border-color: transparent;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .usa-combo-box__input{
        padding-top: 0;
        padding-bottom: 0; 
        padding-right: 0;
        font-size: 1em !important;  
        height: 1.7em;
        border-color: rgba(120,120,120, 0);
    }

    .usa-combo-box__list {
        font-size: 1em;
        border-color: rgba(120,120,120, 0);
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
