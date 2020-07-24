<template lang="pug">
    .container
        div
            .header-control
                .month
                    button
                            ion-icon(name="arrow-back")
                    h3 {{ month }}
                    button
                        ion-icon(name="menu")
                .week.ph2.pv2
                    div
                        .day M
                        .date 1
                    
                    div
                        .day S
                        .date 2
                    
                    div
                        .day S
                        .date 3
                    
                    div
                        .day R
                        .date 4
                    
                    div
                        .day K
                        .date 5
                    
                    div
                        .day J
                        .date.active 6
                    
                    div
                        .day S
                        .date 7
            .times.p2
                .time(v-for="time in times")
                    .hour 
                        h4 {{ time }}
                    .line
                    .col(v-for="column in columns")
                
            .splitter
                a(href="#" :class="active === 1 ? 'active' : ''" @click.prevent="active = 1; columns = new Array(1)")
                    svg(width="20" height="30" viewBox="0 20 90 20")
                        path#Combined_Shape(data-name="Combined Shape" d="M1,90a1,1,0,0,1-1-1V81a1,1,0,0,1,1-1H89a1,1,0,0,1,1,1v8a1,1,0,0,1-1,1Zm9-20A10.01,10.01,0,0,1,0,60V30A10.01,10.01,0,0,1,10,20H80A10.01,10.01,0,0,1,90,30V60A10.01,10.01,0,0,1,80,70Zm0-10H80V30H10ZM1,10A1,1,0,0,1,0,9V1A1,1,0,0,1,1,0H89a1,1,0,0,1,1,1V9a1,1,0,0,1-1,1Z" :fill="active === 1 ? 'white' : '#9EA3BB'")

                    span Hari Ini
                
                a(href="#" :class="active === 2 ? 'active' : ''" @click.prevent="active = 2; columns = new Array(3)")
                    svg(width="20" height="30" viewBox="0 20 101 20")
                        path#Combined_Shape(data-name="Combined Shape" d="M10.1,80A10.062,10.062,0,0,1,0,70V10A10.062,10.062,0,0,1,10.1,0H90.9A10.062,10.062,0,0,1,101,10V70A10.062,10.062,0,0,1,90.9,80ZM90.9,70V10H70.7V70ZM60.6,70V10H40.4V70ZM10.1,70H30.3V10H10.1Z" :fill="active === 2 ? 'white' : '#9EA3BB'")

                    span 3 Hari
                
                a(href="#" :class="active === 3 ? 'active' : ''" @click.prevent="active = 3; columns = new Array(7)")
                    svg(width="20" height="30" viewBox="0 20 101 20")
                        path#Combined_Shape(data-name="Combined Shape" d="M10.1,80A10.062,10.062,0,0,1,0,70V10A10.062,10.062,0,0,1,10.1,0H90.9A10.062,10.062,0,0,1,101,10V70A10.062,10.062,0,0,1,90.9,80ZM90.9,70V10H80.8V70ZM70.7,70V10H55.55V70ZM45.45,70V10H30.3V70ZM10.1,70H20.2V10H10.1Z" :fill="active === 3 ? 'white' : '#9EA3BB'")

                    span Minggu Ini
                
                a(href="#" :class="active === 4 ? 'active' : ''" @click.prevent="active = 4; columns = new Array(30)")
                    svg(width="20" height="30" viewBox="0 20 101 20")
                        g#Group_10426(data-name="Group 10426" transform="translate(-4491 -588)")
                            rect#Rectangle_Copy_4(data-name="Rectangle Copy 4" width="10.1" height="92.999" transform="translate(4587.999 622.949) rotate(90)" :fill="active === 4 ? 'white' : '#9EA3BB'")
                            path#Rectangle(d="M90.9,80H10.1A10.061,10.061,0,0,1,0,70V10A10.061,10.061,0,0,1,10.1,0H90.9A10.061,10.061,0,0,1,101,10V70A10.061,10.061,0,0,1,90.9,80ZM10.1,10V70H90.9V10Z" transform="translate(4491 588)" :fill="active === 4 ? 'white' : '#9EA3BB'")
                    span Semua
</template>

<script>
import headerAdmin from '~/components/HeaderAdmin';

export default {
    components: {
        headerAdmin,
    },
    data() {
        const times = [];

        function pad(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
        
        function time_convert(num) { 
            var hours = Math.floor(num / 60);  
            var minutes = num % 60;
            return pad(hours, 2) + ":" + pad(minutes, 2);         
        }
        
        for (let i = 1; i <= 24; i++) {
            times.push(time_convert(i*60));
        }

        return {
            month: "Januari",
            times,
            active: 1,
            columns: new Array(1)
        }
    },
    computed: {
        
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';

$splitter-height: 60px
$border-color: grey

.container 
    width: 100%  
    height: 100%  
    position: absolute  
    top: 0  
    left: 0  

.header-control 
    width: 100%  
    position: fixed  
    z-index: 9  
    background-color: white  
    border-bottom-left-radius: 20px  
    border-bottom-right-radius: 20px  
    overflow: hidden  
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1)  

    .month   
        display: flex  
        justify-content: space-between  
        align-items: center  
        border-bottom: 1px solid #ccc
        padding-top: $gap1
        padding-bottom: $gap1

        h3 
            font-weight: bold
            font-size: 20px

        button   
            font-size: 20pt  
            border: none  
            padding: 0  
            background: none 
    .week   
        display: flex  
        flex-direction: row  
        justify-content: space-between 
        padding-top: $gap1
        padding-bottom: $gap1 

        div   
            display: flex  
            flex-direction: column  

            .day, .date   
                font-weight: bold  
                width: 30px  
                height: 30px  
                @include centered  
                

            .day   
                @extend .text-muted  
                

            .date   
                &.active   
                    background-color: $tosca  
                    color: white  
                    border-radius: 15px  
.times   
    overflow: scroll  
    background-color: $light  
    height: 100%  
    padding-bottom: $splitter-height + 20  
    padding-top: 140px 

    .time   
        height: 80px  
        display: flex  
        flex-direction: row  
        
        .hour   
            height: 50px  
            min-width: 50px  
            position: absolute  

            h4   
                margin-top: -10px  

        .line   
            min-width: 20px  
            margin-left: 50px  

        .col, .line   
            border-top: 2px solid $border-color  
            border-right: 2px solid $border-color  

        .col   
            display: block  
            width: auto  
            flex: 1  
      
.splitter   
    height: $splitter-height  
    width: 100%  
    position: fixed  
    bottom: 0  
    left: 0  
    background-color: white  
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1)  
    display: flex  
    justify-content: space-around  


    a   
        color: #9EA3BB  
        @include centered  
        flex: 1  
        flex-direction: column  
        svg   
            width: 20px  
            // margin-bottom: 5px  
            
        
        span   
            font-size: 9pt  
            

        &.active   
            background-color: $tosca  
            color: white !important  

</style> 