<template lang="pug">
    .wrapper-admin.bg-light
        headerAdmin
        section.se-1
            .set-image
                .service-image
                    img(:src="imageData != null ? imageData : service.picture " )
                    label.label(for="files") Pilih foto
                    input.hidden(type="file" @change="previewImage" accept="image/*" id="files")
        section.sec-2
            .form-setting.mt-g2
                .field
                  label.label.has-text-navy Nama
                  .control
                    input.input(type='text' placeholder='Budi Yoyaku' v-model="service.name")
                .field
                  label.label.has-text-navy Kategori
                  .control
                    input.input(type='text' placeholder='Dokter/Salon/Restoran' v-model="service.category")
                .field
                  label.label.has-text-navy Telephone
                  .control
                    input.input(type='text' placeholder='+89173292' v-model="service.telephone")
                .field
                  label.label.has-text-navy Biaya Premium
                  .control
                    input.input(type='number' placeholder='3000' v-model="service.premium_price")
                .field
                  label.label.has-text-navy Biaya (Mulai dari)
                  .control
                    input.input(type='text' placeholder='2000' v-model="service.price")
                .field
                  label.label.has-text-navy Pengalaman / Telah beroperasi
                  .control
                    input.input(type='number' placeholder='10' v-model="service.since")
                .field(v-if="snapshotLoaded")
                    label.label.has-text-navy Jadwal
                    .control
                        label.checkbox.title-hour
                            input(type='checkbox' value="monday"  :checked="monday !== {}")
                            |   SEN
                    .schedule
                        .group-hour
                            .control
                                vue-timepicker(v-model="monday.time_start" format="HH:mm" name="monday")
                            .control
                                vue-timepicker(v-model="monday.time_end" format="HH:mm" name="monday")
                    .control
                        label.checkbox.title-hour
                            input(type='checkbox' value="tuesday"  :checked="tuesday !== {}")
                            |   SEL
                    .schedule
                        .group-hour
                            .control
                                vue-timepicker(v-model="tuesday.time_start" format="HH:mm" name="tuesday")
                            .control
                                vue-timepicker(v-model="tuesday.time_end" format="HH:mm" name="tuesday")
                    .control
                        label.checkbox.title-hour
                            input(type='checkbox' value="wednesday"  :checked="wednesday !== {}")
                            |   RAB
                    .schedule
                        .group-hour
                            .control
                                vue-timepicker(v-model="wednesday.time_start" format="HH:mm" name="wednesday")
                            .control
                                vue-timepicker(v-model="wednesday.time_end" format="HH:mm" name="wednesday")
                    .control
                        label.checkbox.title-hour
                            input(type='checkbox' value="thursday"  :checked="thursday !== {}")
                            |   KAM
                    .schedule
                        .group-hour
                            .control
                                vue-timepicker(v-model="thursday.time_start" format="HH:mm" name="thursday")
                            .control
                                vue-timepicker(v-model="thursday.time_end" format="HH:mm" name="thursday")
                    .control
                        label.checkbox.title-hour
                            input(type='checkbox' value="friday"  :checked="friday !== {}")
                            |   JUM
                    .schedule
                        .group-hour
                            .control
                                vue-timepicker(v-model="friday.time_start" format="HH:mm" name="friday")
                            .control
                                vue-timepicker(v-model="friday.time_end" format="HH:mm" name="friday")
                    .control
                        label.checkbox.title-hour
                            input(type='checkbox' value="saturday"  :checked="saturday !== {}")
                            |   SAB
                    .schedule
                        .group-hour
                            .control
                                vue-timepicker(v-model="saturday.time_start" format="HH:mm" name="saturday")
                            .control
                                vue-timepicker(v-model="saturday.time_start" format="HH:mm" name="saturday")
                    .control
                        label.checkbox.title-hour
                            input(type='checkbox' value="sunday"  :checked="sunday !== {}")
                            |   MIN
                    .schedule
                        .group-hour
                            .control
                                vue-timepicker(v-model="sunday.time_start" format="HH:mm" name="sunday")
                            .control
                                vue-timepicker(v-model="sunday.time_end" format="HH:mm" name="sunday")                    
                .field
                  label.label.has-text-navy Rata - Rata Perantrian 
                  .control
                    .select.is-fullwidth
                      select(v-model="service.queue_estimation")
                        option(value="15") 15 Menit
                        option(value="20") 20 Menit
                        option(value="25") 25 Menit
                .field
                  label.label.has-text-navy Deskripsi 
                  .control
                    textarea.textarea(placeholder='Berpengalaman di bidang ...' v-model="service.description")
                .field
                  label.label.has-text-navy Alamat
                  .control
                    textarea.textarea(placeholder='Jl. Asia Afrika no.23' v-model="service.address")
            button.button.is-tosca.is-fullwidth.mt-g2(@click="postService()") Simpan

</template>

<script>
import VueTimepicker from 'vue2-timepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';
import headerAdmin from '~/components/HeaderAdmin';

export default {
    components: {
        headerAdmin,
        VueTimepicker
    },
    data() {
        return {
            dateFilter: null,
            imageData: null,
            inputs: [],
            monday: {},
            tuesday: {},
            wednesday: {},
            thursday: {},
            friday: {},
            saturday: {},
            day: "",
            service: {},
            snapshotLoaded: false
        }
    },
    computed: {
        datas() {
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
        getSnapshot() {
            this.$axios.$get("schedules?service_id="+this.admin.id)
            .then(response => {
                this.service = response;
                this.snapshotLoaded = true;

                response.schedules.forEach(item => {
                    if (item.day === 'monday')
                        this.monday = item;
                    
                    if (item.day === 'tuesday')
                        this.tuesday = item;

                    if(item.day === 'wednesday')
                        this.wednesday = item;

                    if(item.day === 'thursday')
                        this.thursday = item;
                    
                    if(item.day === 'friday')
                        this.friday = item;

                    if(item.day === 'saturday')
                        this.saturday = item;

                    if(item.day === 'sunday')
                        this.sunday = item;
                    
                });
            });
        },
        previewImage: function (event) {
            var input = event.target;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.imageData = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
      },
      postService() {
        //   window.location.href = "/admin";
          this.$axios.$post("setting", {
            name: this.service.name,
            category: this.service.category,
            telephone: this.service.telephone,
            premium_price: this.service.premium_price,
            price: this.service.price,
            since: this.service.since,
            day: this.service.day,
            days: {
                monday: this.monday,
                tuesday: this.tuesday,
                thursday: this.thursday,
                saturday: this.saturday,
                friday: this.friday,
                sunday: this.sunday,
                wednesday: this.wednesday
            },
            time_end: this.service.time_end,
            queue_estimation: this.service.queue_estimation,
            address: this.service.address,
            service_id: this.admin.id
          })
          .then(response => {
              localStorage.setItem('admin', JSON.stringify(response));
              window.location.href = '/admin';
          })
      }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';

.control 
    width:  100%

.set-image
    top: 0
    justify-content: center
    text-align: center
    padding: $gap2

    .service-image
        justify-content: center
        align-items: center
        label 
            text-decoration: underline
            color: $tosca
            text-align: center
        img 
            border-radius: 50%
            width: 100px
            height: 100px
        .hidden 
            visibility: hidden
.show
    display: block

.hide
    display: hide            

.form-setting
    .field
        .schedule
            margin-bottom: $gap1

            .group-hour
                display: flex
                margin-bottom: $gap1
                .hour
                    width: 85%
            .checkbox
                font-size: 15px
                width: 80px
                padding-top: $gap2
            


.bg-light
    background: #F7F9FB

.mt-g1
    margin-top: $gap1

.mt-g2
    margin-top: $gap2

.ml-5
    margin-left: 5px

.has-text-navy
    color: $blue-navy
    font-weight: 600

.title-hour
    color: $blue-navy
    font-weight: 600

</style> 