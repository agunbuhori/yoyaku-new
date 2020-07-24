<template lang="pug">
    .wrapper.bg-light
        Header
        section
            .head-history
                div(v-bind:class="{ 'is-active': isActive == 'year' }")
                    a.item__his(v-on:click="isActive = 'year'") Per Tahun
                div(v-bind:class="{ 'is-active': isActive == 'service' }")
                    a.item__his(v-on:click="isActive = 'service'") Per Layanan
            .item-history(v-bind:class="{ 'is-active': isActive == 'year' }")
                .years(v-for="i in 5")
                    .dated
                        h3.date 19
                        h6.month Feb
                        span.tag.is-primary 2020
                    .dated__detail(@click="modalDetail()")
                        h3.t-tosca Dr. Erick Francisco, Sp.A, M Kes
                        .detail__desc
                            h4.has-text-grey Dokter Umum
                            h4.has-text-weight-bold.has-text-black RKM0123131
                        h6.title_detail Gejala
                        ul
                        li lorem ipsum dolor sit amet
                        li lorem ipsum dolor sit amet
            .item-history(v-bind:class="{ 'is-active': isActive == 'service' }")
                .service(@click="toggleContent(0)")
                    .item_service
                        h4.has-text-weight-bold.t-tosca Dr. Erick Francisco, Sp.A, M Kes
                        h6.has-text-weight-bold.has-text-grey Dokter Umum
                        h6.has-text-weight-bold RKM0123131
                    .icon_service
                        span(:class="showContent[0] ? 'ti-angle-up' : 'ti-angle-down'")
                .bottom-history(v-show="showContent[0]")
                    .categories-year
                        a.item(v-for="i in 7")
                            span 2020
                    table.table.is-bordered
                        thead
                            tr
                                th Tanggal
                                th Keterangan
                        tbody
                            tr
                                td Senin, 9 Feb 2020
                                td 
                                    ul
                                    li ui lorem ipsum dolor si amet lorem ipsum dolor sit 
                                    li lorem ipsum dolor  
            .modal-history
                .modal(v-bind:class="{'is-active':isShow}")
                    .modal-background
                    .modal-card
                        button.delete.btn-close(aria-label="close" @click='closeModal()')
                        .modal-card-body.body-history
                            .dated__detail(@click="modalDetail()")
                            h3.t-tosca Dr. Erick Francisco, Sp.A, M Kes
                            .detail_desc
                                h4.has-text-grey Dokter Umum
                                h4.has-text-weight-bold.has-text-black RKM0123131
                            h6.pt Gejala
                            ul
                            li lorem ipsum dolor sit amet
                            li lorem ipsum dolor sit amet
        BottomNav
</template>

<script>
import BottomNav from '~/components/BottomNav';
import Header from '~/components/Header';

export default {
    components: {
        BottomNav,
        Header
    },
    data() {
        return {
            isShow: false,
            isActive: 'year',
            snapshot: {},
            snapshotLoaded: false,
            showContent: {
                0: false,
            },
        }
    },
    computed: {
        authentication() {
            return this.$store.state.authentication
        }
    },
    mounted() {
        // this.getSnapshot();
    },
    methods: {
        getSnapshot() {
            this.$axios.get("profile")
            .then(response => {
                const {status, data} = response;
                
                if (status === 200) {
                    this.snapshotLoaded = true;
                    this.snapshot = data;
                }
            })
        },
        toggleContent(id) {
          this.showContent[id] = ! this.showContent[id];
        },
        modalDetail: function() {
            this.isShow = true;
        },
        closeModal: function() {
            this.isShow = false;
        },
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';
$item: 150px
$padding-item: 10px

.head-history
    background-color: white
    top: 0
    display: flex
    justify-content: space-arounds
    text-align: center
    
    div
        padding: $gap2
        width: 100%
        a 
            color: #000
        &.is-active 
            border-bottom: 3px solid  $tosca
            a 
                color: $tosca

.item-history
    display: none
    &.is-active 
        display: block
    .years
        width: 100%
        display: flex
        justify-content: space-between        

        .dated  
            background: white
            display: flex
            align-items: center
            justify-content: center
            flex-direction: column
            text-align: center
            float: left
            width: 25%
            color: $tosca
            line-height: 1.0
            border-bottom: 1px solid #ddd
            border-right: 1px solid #ddd
            position: relative
            .date
                font-size: 20pt
                font-weight: bold
            .month
                font-size: 18px
                font-weight: 800

            .tag
                margin-top: 5px
            &__detail
                background: white
                border-radius: 6px
                width: 75%
                margin: $gap2
                padding: 10px
                width: 100%
                border: 1px solid #ededed

                .title_detail
                    background: $light-tosca
                    padding: 5px
                    border-radius: 5px 

                
            &__desc
                padding-top: $padding-item
                display: flex
                justify-content: space-between
    .service
        background-color: white
        border-radius: 5px
        margin-bottom: 10px
        width: 100%
        display: flex
        border: 1px solid #ededed
        border-radius: 5px

        .item_service
            padding: $gap1
            width: 80%
        
        .icon_service
            width: 20%
            text-align: center
            padding-top: 25px
            .ti-angle-down
                font-size: 20px
            .ti-angle-up
                font-size: 20px

    .bottom-history
            background-color: white
            padding: 10px
            border: 1px solid #ededed
            border-radius: 5px

            .categories-year
                margin-bottom: 10px
                display: flex
                overflow-x: scroll
                border-radius: $br1
                background: #f1f1f1

                .item
                    text-align: center
                    padding: $padding-item
                    width: $item
                    height: auto
                    white-space: nowrap
                    color: #333
                    font-weight: 500
                    font-size: 15px

                    &.active 
                        background-color: $tosca
                        border-color: $tosca 
                        color: white
            table   
                thead
                    background: $light-tosca
                    th
                        text-align: center
    .modal-history 
        .delete 
            z-index: 15
        
        .modal-card-body 
            border-radius: 6px !important
            
        
                    

.t-tosca    
    color: $tosca
    font-size: 13pt
.pt 
    padding-top: $gap1
</style> 