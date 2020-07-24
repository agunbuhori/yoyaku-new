<template lang="pug">
    .wrapper-admin.bg-light
        headerAdmin
        section.sec-1
            .form-offline.mt-g2
                .field
                  label.label.has-text-navy Nama
                  .control
                    input.input(type='text' placeholder='Budi Yoyaku' required="" v-model="name")
                .field
                  label.label.has-text-navy Umur
                  .control
                    input.input(type='number' placeholder='12' required="" v-model="age")
                //- .field
                //-   label.label.has-text-navy Email
                //-   .control
                //-     input.input(type='email' placeholder='budi@gmail.com' required="" v-model="email")
                .field
                  label.label.has-text-navy No RM
                  .control
                    input.input(type='email' placeholder='0123' required="" v-model="recid")
                .field
                  label.label.has-text-navy No WhatsApp
                  .control
                    input.input(type='text' placeholder='+628923102938' required="" v-model="whatsapp")
                .field
                  label.label.has-text-navy Alamat
                  .control
                    textarea.textarea(placeholder='Jl. Asia Afrika no.23' v-model="address")
            button.button.is-tosca.is-fullwidth.mt-g2(@click="order()") Simpan

</template>

<script>
import 'vue2-datepicker/index.css';
import DatePicker from 'vue2-datepicker';
import headerAdmin from '~/components/HeaderAdmin';

export default {
    components: {
        headerAdmin,
        DatePicker
    },
    data() {
        return {
            dateFilter: null,
            name: "",
            gender: "",
            age: "",
            whatsapp: "",
            email: "",
            address: "",
        }
    },
    computed: {
        admin() {
            return this.$store.state.admin;
        },
    },
    mounted() {
    },
    methods: {
        order() {
            const { name, gender, age, whatsapp, recid, address } = this;
            this.$axios.$post("queue", {
                uid: "xx",
                name,
                gender,
                age,
                whatsapp,
                recid,
                address,
                serviceId: this.admin.id,
                time: ""
            })
            .then(response => {
                alert(10)
            })
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';
    
.queue-box
    background-color: white
    max-width: 100%
    position: relative
    border-radius: 5px
    border: 1px solid #ddd
    text-align: center
    padding: $gap1

    h6 
        font-size: 16px
        font-weight: 500
    
    h1 
        font-size: 35pt
        font-weight: 700

.bg-light
    background: #F7F9FB

.mt-g1
    margin-top: $gap1

.mt-g2
    margin-top: $gap2

.has-text-navy
    color: $blue-navy
    font-weight: 600

.is-center
    text-align: center

</style> 