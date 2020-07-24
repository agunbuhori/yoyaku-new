<template lang="pug">
    .wrapper-admin
        section
            .header-count
                .one
                    .img-wrapper
                        img(:src="authentication.images")
                    .detail
                        h6 {{ authentication.name }}
                        h5.tags {{ authentication.name }}
        section(v-if="queues.length > 1")
            .counter
                .number(@click="profilModal()")
                    span {{ count+1 }}
                .btn-count
                    button.button.is-rounded.is-navy.is-medium(@click="dataPending()" :disabled="count === queues.length") Pending
                    button.button.is-rounded.is-tosca.is-medium(@click="next()" :disabled="count === queues.length") {{ count === queues.length ? 'Lanjut' : 'Selesai' }}
                        span(class="ti-arrow-right") 
            .progress-count
                .progress-queue
                    .queues
                        label(v-for="(time, $index) in queues") {{ $index+1 }}
                    .progress-bar
                        .progress-indicator
                            .progress(:style="'width:'+ (count) * (100/ (queues.length-1)) +'%'")
                        .ball(:style="'left:'+ (count) * (100/ (queues.length-1)) +'%'")
                    .times
                        label(v-for="(time, $index) in queues") {{  getTime(time.time, $index) }}
        section.sec-3.section-menus
            .user-set
                .set-customer
                    nuxt-link(to="/admin/queue-today")
                        h2.has-text-navy.f30  {{ queues.length }}
                        h6 Jumlah
                .set-customer
                    nuxt-link(to="/admin/queue-today")
                        h2.has-text-navy.f30 {{ queues.length-count }}
                        h6 Sisa Antrian
            .user-set
                .set-customer
                    nuxt-link(to="/admin/pending")
                        span(class="ti-user")
                        h6.f12 List Pending
                .set-customer
                    nuxt-link(to="/admin/offline")
                        span(class="ti-pencil")
                        h6.f12 Daftar Offline
            .closed-button(@click='closeApp()')
                span(class="ti-split-v-alt")
                h6.f12 Tutup / Istirahat

        .modal-profile
            .modal.ph2(v-bind:class="{'is-active':isShow}")
                .modal-background
                .modal-card
                    header.modal-card-head
                        span(class="ti-angle-left" @click="backQueue()")
                        h1.modal-card-title {{count+1}}
                        span(class="ti-angle-right" @click="nextQueue()")
                    section.modal-card-body
                        h6.has-text-navy Nama
                        label {{ queue.m_name }}
                        h6.has-text-navy Umur
                        label {{ queue.age }}
                        h6.has-text-navy Alamat
                        label {{ queue.address }}
                        h6.has-text-navy Status
                        label Member
                        h6.has-text-navy {{ queue.number }}
                        .control
                            input.input(type='text' placeholder='1223' :disabled="disabled == 1")
                            button.button.is-tosca(@click="disabled = (disabled + 1) % 2")
                                ion-icon(name="create")
                    footer.modal-card-foot(@click='closeProfil')
                        label.is-size-6.has-text-danger Tutup
        
        .modal-app
            .modal.ph2(v-bind:class="{'is-active':isActive}")
                .modal-background
                .modal-card
                    button.delete.btn-close(@click='closeModal')
                    header.modal-card-head
                        p Istirahat
                    section.modal-card-body
                        //- button.button.w45.ml1(v-on:click="isHidden = false" v-bind:class="!isHidden ? 'is-tosca' : 'is-tosca is-outlined'")
                        //-     ion-icon(name="close-circle") 
                        //-     | Tutup
                        .timer(v-show="!isHidden")
                            .hour-group
                                .hour
                                    span(class="ti-angle-up" @click="hourAdd()")
                                    h5 {{ hoursBreak }}
                                    span(class="ti-angle-down" @click="hourDown()")
                                .hour
                                    span(class="ti-angle-up" @click="minutesAdd()")
                                    h5 {{ minute }}
                                    span(class="ti-angle-down" @click="minutesDown()")
                            button.is-tosca.is-fullwidth.button.mt2 Mulai
                        .form-close(v-show="isHidden")
                    //- footer.modal-card-foot
                    //-     label.is-size-6.has-text-danger 

</template>

<script>
import VueTimepicker from 'vue2-timepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';
import moment from 'moment';
import 'moment/locale/id';

export default {
    components: {
    },
    
    data() {
        return {
            // socket: io("http://192.168.1.120:4200", {}),
            count: 0,
            countModal: 0,
            hoursBreak: 0,
            minute: 0,
            isActive: false,
            isShow: false,
            disabled: 1,
            isHidden: false,
            limitHour: 23,
            limitMinute: 59,
            slider: 0,
            queues: [],
            queue: {
                detail: {}
            },
            hours: Array.from({ length: 10 }).map((_, i) => i + 8),
            times: null,
            queuesData: []
        }
    },
    computed: {
        authentication() {
            return this.$store.state.admin;
        },
        admin() {
            return this.$store.state.admin;
        },
    },
    mounted() {
        this.getSnapshot();
    },
    methods: {
        logout() {
            this.$auth.logout()
            window.location.href = "/admin/signin";
        },
        getSnapshot() {
            this.$axios.$get("counter?service_id="+this.admin.id+'&done=2')
            .then(response => {
                this.queues = response;
                // response.forEach((item, index) => {
                //     if (true) {
                //         this.queues.push({...item, detail: JSON.parse(item.detail)});
                //         if (item.status > 0)
                //             this.count++;
                //     }
                // })
            })
        },
        next() {
            this.queue = this.queues[this.count];
            this.$axios.$post("next", {
                uid: this.queue.uid,
                service_id: this.admin.id,
            }).then(response => {
                this.count++;
            });
            // this.socket.emit("queue", {queue: this.count});
        },
        getTime(time, index) {
            return moment(time).format('HH:mm');
        },
        nextQueue() {
            
        },
        backQueue() {
            if (this.count == 0) {
                return 0
            }else {
                this.count--
            }
        },
        dataPending: function(){
            this.$router.push("/admin/pending")
        },
        back() {
            this.count--    
        },
        closeProfil : function() {
            this.isShow = false;
        },
        profilModal : function() {
            this.isShow = true;
            this.queue = this.queues[this.count];
        },
        closeApp: function() {
            this.isActive = true;
        },
        closeModal: function() {
            this.isActive = false;
        },
        hourAdd() {
            if (this.limitHour == this.hoursBreak ) {
                this.limitHour = 23
            } else {
                this.hoursBreak++
            }
        },
        hourDown() {
            if (this.hoursBreak == 0) {
                return 0
            }else {
                this.hoursBreak--
            }
        },
        minutesAdd() {
            if (this.limitMinute == this.hours ) {
                this.limitMinute = 59
            } else {
                this.minute++
            }
        },
        minutesDown() {
            if (this.minute == 0) {
                return 0
            }else {
                this.minute--
            }
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';

.header-count
    padding: $gap2
    display: flex 
    justify-content: space-between  
    .one
        display: flex
        .img-wrapper
            img
                width: 50px
                height: 50px
                border-radius: 50%
        .detail
            h6 
                margin-left: 15px
                font-weight: 600
                color: $blue-navy
            .tags
                padding: 5px 20px
                background-color: $tosca
                color: white
                border-radius: 25px
                font-size: 11px
                font-weight: bold
                margin-left: 10px
    .two
        button
            width: 50px
            height: 50px
            border: none
            border-radius: 5px
            background: $tosca
            padding: 5px
        .ti-settings
            color: white
            font-size: 30px
.counter
    width: 100%
    @include centered
    flex-direction: column

    .number 
        width: 280px
        height: 280px
        background-color: white
        border: 15px solid $light
        border-radius: 140px
        box-shadow: inset 0px 0px 15px rgba(0, 0, 0, 0.1)

        @include centered
        span 
            font-size: 75pt
            color: $blue-navy
    
    .btn-count
        width: 100%
        display: flex
        justify-content: space-around
        
        span 
           margin-bottom: -7px
           margin-left: 5px

.progress-count
    padding: 0 1rem
    overflow: hidden

    .progress-bar 
        width: 100%
        display: flex
        align-items: center
        position: relative

    .ball 
        width: 15px
        height: 15px
        background-color: white
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5)
        border-radius: 7.5px
        position: absolute
        transform: translateX(-50%)
        transition: 400ms
        

    .progress-indicator 
        width: 100%
        height: 5px
        background-color: grey
        border-radius: 5px
        overflow: hidden

        .progress 
            height: 5px
            background-color: $tosca
            transition: 400ms
        

    .progress-queue 
        width: 100%
        display: flex
        flex-direction: column
        .queues, .times 
            margin: 10px 0
            display: flex
            flex: 1
            justify-content: space-between

            label 
                font-weight: bold
                font-size: 10pt
    
    .progress-controls 
        .bar 
            display: flex
        .time 
            display: flex
            justify-content: space-around
            
.number-queue 
    background: white
    display: flex
    justify-content: space-around
    border-radius: 10px
    border: 1px solid #f1f1f1

    .total 
        padding: 5px
        text-align: center

        .f30 
            font-size: 30px  

.closed-button 
    margin-top: 1rem
    display: flex
    justify-content: center
    padding: $gap1
    background-color: white
    text-align: center
    color: $red
    padding: 10px
    border: 1px solid #f1f1f1
    border-radius: 5px


.user-set
    padding-top: 1rem
    display: flex
    justify-content: space-between

.set-customer 
    width: 45%
    border-radius: 10px
    text-align: center
    padding: 10px
    background: white
    border: 1px solid #f1f1f1

    h6 
        color: #000

    span 
        zoom: 2.0
        color: $tosca       

.section-menus 
    bottom: 0
    position: fixed
    width: 100%
    max-width: 600px
    background: #F7F9FB
    border-radius: 10px 10px 0px 0px


.modal-profile  
    .modal  
        .modal-card-head  
            background: $tosca 
            span
                font-size: 30px
                color: white 
            h1  
                color: white 
                text-align: center 
                font-size: 2.5rem 
             
        .modal-card-body  
            h6  
                margin-top: 0.75rem 
                color: $blue-navy 
                 
            .control  
                display: flex 
                justify-content: initial 

        footer  
            text-align: center 
            justify-content: center 
         

        .modal-card-foot  
            background: white 

.modal-app  
    .modal  
        .w45  
            width: 45%  !important
          
        .mx-datepicker  
            width: 100%  
            .mx-input  
                height: 43px  
                text-align: center  
              
            .mx-icon-calendar  
                display: none  
              
        .modal-card-head  
            background: $tosca  
            align-items: center  
            justify-content: center  
            p  
                color:  white 
                font-size: 14pt  
          
        .button-times  
            display: flex  
            justify-content: space-around  
          
        .timer  
            .hour-group  
                display: flex  
                justify-content: space-around  
                text-align: center  
                ion-icon  
                    zoom: 2.0  
          
        footer  
            text-align: center  
            justify-content: center  
            .modal-app   
        .modal   
            .w45   
                width: 45%  
              
            .mx-datepicker   
                width: 100%  
                .mx-input   
                    height: 43px  
                    text-align: center  
                  
                .mx-icon-calendar   
                    display: none  
                  
              
            .modal-card-head   
                background: tosca  
                align-items: center  
                justify-content: center  
                p   
                    color:  white 
                    font-size: 14pt  
              
            .button-times   
                display: flex  
                justify-content: space-around  
              
            .timer   
                .hour-group   
                    display: flex  
                    justify-content: space-around  
                    text-align: center  
                    ion-icon   
                        zoom: 2.0  
            footer   
                text-align: center  
                justify-content: center  
              

            .modal-card-foot   
                background:  white 

        .modal-card-foot  
            background:  white 
          
      
  

.bg-light
    background: #F7F9FB

.has-text-navy
    color: $blue-navy
    font-weight: 600

.mr1
    margin-right: 10px

.ml1
    margin-left: 10px

</style> 