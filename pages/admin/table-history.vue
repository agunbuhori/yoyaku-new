<template lang="pug">
    .wrapper-admin.bg-light
        headerAdmin
        section.sec-1
            .top_list
                h3.title-today {{ now }}
                h3.title-today {{ time }}
                .field-search
                    span(class="ti-search")
                    input.input(type="text" placeholder="Cari Nama atau Nomor" v-model="search")
                .groups-filter
                    button.button.is-rounded.is-tosca.is-outlined(@click="sort = sort === 1 ? 0 : 1") {{ sort === 0 ? 'A - Z' : 'Z - A' }}
                    button.button.is-rounded.is-tosca.is-outlined(@click="sortlatest()") Terbaru
                    button.button.is-rounded.is-tosca.is-outlined Terlama
        section.sec-2
            table.table.is-striped.is-narrow.is-hoverable.is-fullwidth
              thead
                tr
                  th No
                  th Nama
                  th No. RM
                  th Keluhan
              tbody
                tr(v-for="(queue, $index) in filteredItems")
                    td {{ sort === 0 ? $index+1 : filteredItems.length - $index }}
                    td {{ JSON.parse(queue.detail).name }}
                    td
                        u.f10.text-tosca(@click="oldMember(queue)" v-if="!queue.number") Member
                        u(v-if="queue.recid") {{ queue.recid }}
                    td {{ queue.complaint }}
                
        
        .modal-profile
            .modal.ph2(v-bind:class="{'is-active':isShow}")
                .modal-background
                .modal-card(v-if="queue.detail")
                    header.modal-card-head
                        label.modal-card-title {{ JSON.parse(queue.detail).name  }}
                    section.modal-card-body
                        h6.has-text-navy Nama
                        label {{ JSON.parse(queue.detail).name }}
                        h6.has-text-navy.mt-g1 Umur
                        label {{ JSON.parse(queue.detail).age }}
                        h6.has-text-navy.mt-g1 Jenis Kelamin
                        label {{ JSON.parse(queue.detail).gender }}
                        h6.has-text-navy.mt-g1 Alamat
                        label {{ JSON.parse(queue.detail).address }}
                        h6.has-text-navy.mt-g1 Status
                        label.tag.tag-tosca Member / New
                        h6.has-text-navy.mt-g1 No RM
                        .control
                            input.input.rm(type='text' v-model="rm" placeholder='1223')
                    footer.modal-card-foot(@click='postProfile()')
                        label Tutup
</template>

<script>
import headerAdmin from '~/components/HeaderAdmin';
import moment from 'moment';
import 'moment/locale/id';

export default {
    components: {
        headerAdmin
    },
    data() {
        return {
            isActive: false,
            isShow: false,
            queue: {},
            queues: [],
            now: moment().format('dddd, DD MMMM YYYY'),
            time: moment().format('HH:mm'),
            rm: '',
            sort: 0,
            search: ''
        }
    },
    computed: {
        authentication() {
            return this.$store.getters.loggedInUser
        },
        admin() {
            return this.$store.state.admin;
        },
        filteredItems() {
            return this.queues.filter(item => {
                if (JSON.parse(item.detail))
                return JSON.parse(item.detail).name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
                || item.recid.toLowerCase().indexOf(this.search.toLowerCase()) > -1
            }).sort((a, b) => {
                if (this.sort === 1)
                    return b.recid - a.recid
                else
                    return a.recid - b.recid
            });
        }
    },
    mounted() {
        this.getSnapshot();
    },
    methods: {
        getSnapshot() {
            this.$axios.$get("histories?service_id="+this.admin.id)
            .then(response => {
                this.queues = response;
            })
        },
        sortlatest() {
            return this.queues.filter(item => {
                // return JSON.parse(item.detail).number === 0 || queues.number !== queues[index-1].number; 
            }).sort((a, b) => {
                if(a.num === b.num){
                    return b.number - a.number;
                    console.log(this.queues);
                }
            });

        },
        newMember : function() {
          this.isShow = true;
        },
        oldMember : function(queue) {
            this.queue = queue;
            this.isShow = true;
        },
        postProfile() {
            console.log(this.queue)
            this.$axios.$post("record", {  
                uid: this.queue.uid,
                service_id: this.admin.id,
                number: this.rm,
            })
            .then(response => {
                this.getSnapshot();
            })
            this.isShow = false;
        },
        back: function () {
            this.$router.back()
        },
        format(date) {
            return moment(date).format('HH:mm')
        },
        paddy(num, padlen, padchar) {
            var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
            var pad = new Array(1 + padlen).join(pad_char);
            return (pad + num).slice(-pad.length);
        },
        getTime(time) {
            return moment(time).format('HH:mm');
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';

.top_list 
    text-align: center

    .title-today
        color: $blue-navy
        font-size: 20px
        font-weight: 600
        margin-bottom: $gap2

    .field-search
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1)
        display: flex
        border-radius: 30px
        border: 1px solid #ccc
        margin-bottom: $gap2
        background: #fff

        span
            padding: $gap2
        .input
            margin-right: 15px
            margin-top: 5px
            border: none !important
            box-shadow: none !important
            
    .groups-filter
        display: flex
        justify-content: space-between

.table  
    thead  
        background-color: $tosca 
        tr  
            &.odd  
                background: #ffffff 
            &.even  
                background: #dbecef 
        th  
            color: white 
            text-align: center 
    tbody  
        padding: 10px 
        td  
            text-align: center 
        td.customer-name  
            text-align: left 
            width: 70% 
            font-size: 12pt 
        td.numbering  
            width: 30% 
        tbody tr:not(.is-selected):nth-child(even)  
        background-color: #dbecef 

.modal-profile

    .modal-card-head
        text-align: center
        background: $tosca

        .modal-card-title
            color: white 
            font-size: 20px
            font-weight: bold  

    .modal-card-foot  
        background: white
        border: none
        justify-content: center

        label 
            color: $red
            font-size: 16px
            text-align: center
            font-weight: 600
.rm 
    background-color: #f1f2f2
    
.tag-tosca
    background: $tosca !important
    color: white

.bg-light
    background: #F7F9FB

.mt-g1
    margin-top: $gap1

.mt-g2
    margin-top: $gap2

.has-text-navy
    color: $blue-navy
    font-weight: 600

</style> 