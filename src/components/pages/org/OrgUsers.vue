<template>

    <div v-if="org">        
        <us-card title="Users">
            <us-card-body>                        
                <us-list-group v-if="users">
                    <us-list-group-item v-for="user in users" :key="user.id" @click="selectedUser = user" :class="{'active':selectedUser && selectedUser.id == user.id}">
                        <i class="fas fa-user mr-1"></i>        
                        <span v-if="user.fullName">{{user.fullName}}</span>
                        <span v-else>{{user.uuid}}</span>
                        <us-tag variant="info" class="float-right">{{user.level}}</us-tag>
                    </us-list-group-item>
                </us-list-group>   
            </us-card-body>

        </us-card>    

    </div>

</template>
<script>
import OrganizationUser from '../../../models/OrganizationUser';
export default {
    name: "org-users",
    data(){
        return {
            selectedUser: null,
            users: null
        }
    }, 
    props: ['org'],
    watch: {
        org(){
            this.getUsers();
        }
    },
    mounted(){
        this.getUsers();
    },    
    methods: {
        async getUsers(){
            this.$log('Entering get org users')
            if (!this.org){
                return;
            }
            this.$log('Getting org users')
            let orgUser = new OrganizationUser(this.org.id);
            this.users = await orgUser.getAll();
        }
    } 
};
</script>
<style lang="scss">
</style>
