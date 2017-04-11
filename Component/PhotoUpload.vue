<template>
    <div class="vue-photo-upload">
        <form class="vue-photo-upload-form" @submit.prevent="photo_submit">
            <canvas 
                v-show="(vue_photo_selected && enableEdits)"
                id="vue-photo-upload-canvas"
                class="rounded-circle m-auto large-profilePicture"
                width="256" height="256">
            </canvas>
            <img
                v-show="!(vue_photo_selected && enableEdits)"
                id="vue-photo-upload-img"
                :src="vue_photoDefault"
                class="rounded-circle m-auto large-profilePicture" />
            <div class="flex">
                <label for="vue-photo-upload-file-input">
                    <a :class="[buttonClass ? buttonClass : 'vue-photo-upload-btn']" v-show="enableEdits">Change Image</a>
                </label>
                <label for="vue-photo-upload-form-submit">
                    <a :class="[buttonClass ? buttonClass : 'vue-photo-upload-btn']" v-show="enableEdits">Upload Image</a>
                </label>
                
            </div>
            <input class="hidden"
                id="vue-photo-upload-file-input"
                type="file"
                accept="image/*"
                @change="photo_change">
            <input class="hidden"
                id="vue-photo-upload-form-submit"
                v-show="(vue_photo_selected && enableEdits)"
                type="submit"
                value="Upload Image">
            <span class="message" v-if="" v-show="vue_photo_selected && !enableEdits">Your edited image needs to be uploaded. Edit details to view.</span>
            <span class="message" v-if="" v-show="vue_photo_selected && enableEdits">Adjust the position and zoom level with your mouse</span>
        </form>
    </div>
</template>

<script>

export default {
    data: function(){
        return {
            vue_photoDefault: this.photoDefault, // default photo if nothing selected
            vue_photo_selected: null, // select photo img
            vue_photo_cropped: null, // selected photo canvas
            vue_photoFile: null, // selected photo blob
        }
    },
    name: 'PhotoUpload',
    props: {
        photoDefault:{
            type: String,
            required: true,
        },
        enableEdits:{
            type: Boolean,
            required: true,
        },
        buttonClass:{
            type: String
        },
        showMessages:{
            type: Boolean,
            default: false
        }
    },
    methods: {
        photo_submit: function(e){
            this.$emit('photo-submit', e, this.vue_photoFile);
            
            this.vue_photoDefault = this.vue_photo_cropped;

            this.vue_photo_selected = null;
            this.vue_photo_cropped = null;
            this.vue_photoFile = null;


            let canvas = document.getElementById('vue-photo-upload-canvas');

            canvas.__dragging = false;
            canvas.__zoom = 1;
            canvas.__position_x = 0;
            canvas.__position_y = 0;
            canvas.__last_positionX = canvas.height/2;
            canvas.__last_positionY = canvas.height/2;
        },
        photo_change: function(e){
            if (e.srcElement.files && e.srcElement.files[0]) {

                this._photoFile = e.srcElement.files[0];
                
                let reader = new FileReader();
                let vm = this;
                reader.onload = function (e) {

                    let img = new Image();
                    img.src = e.target.result;

                    img.onload = function(){ 
                        vm.drawImageOnCanvas(img);
                    };
                }
                reader.readAsDataURL(this._photoFile);
            } else {
                this.vue_photo_selected = null;
                this.vue_photo_cropped = null;
                this.vue_photoFile = null;

                this.vue_photoDefault = this.photoDefault;

                let canvas = document.getElementById('vue-photo-upload-canvas');

                canvas.__dragging = false;
                canvas.__zoom = 1;
                canvas.__position_x = 0;
                canvas.__position_y = 0;
                canvas.__last_positionX = canvas.height/2;
                canvas.__last_positionY = canvas.height/2;
            }

            this.$emit('photo-change', e);
        },
        drawImageOnCanvas: function(_img, x, y, zoom){

            let vm = this;

            let canvas = document.getElementById("vue-photo-upload-canvas");
            let ctx=canvas.getContext("2d");

            let img;
            if(_img) {
                img = _img;
                this.vue_photo_selected = _img;
            }else{
                img = this.vue_photo_selected;
            }

            let _dimension = Math.min(img.width, img.height);

            let _canvas_dimension = 256;


            let _x = x || 0;
            let _y = y || 0;
            let _zoom = zoom || 1;

            let _dimension_scaled_x = _canvas_dimension;
            let _dimension_scaled_y = _canvas_dimension;

            if(img.width < img.height){
                _dimension_scaled_y = img.height * _canvas_dimension / img.width ;
            } else {
                _dimension_scaled_x = img.width * _canvas_dimension / img.height ;
            }

            ctx.drawImage(img,
                0,
                0,
                img.width,
                img.height,
                -(_dimension_scaled_x - _canvas_dimension - _x*_zoom * 2)/2,
                -(_dimension_scaled_y - _canvas_dimension - _y*_zoom * 2)/2,
                _dimension_scaled_x*_zoom,
                _dimension_scaled_y*_zoom);

            // set canvas image as uploading image file
            canvas.toBlob(function(blob){
                vm.vue_photoFile = blob;
            });

            vm.vue_photo_cropped = canvas.toDataURL();
        },

    },
    mounted: function(){

        let canvas = document.getElementById('vue-photo-upload-canvas');
        let vm = this;

        canvas.__dragging = false;
        canvas.__zoom = 1;
        canvas.__position_x = 0;
        canvas.__position_y = 0;
        canvas.__last_positionX = canvas.height/2;
        canvas.__last_positionY = canvas.height/2;
        

        canvas.addEventListener('mousedown', function(e){
            canvas.__dragging = true;

            canvas.__last_positionX = e.offsetX;
            canvas.__last_positionY = e.offsetY;

        })
        canvas.addEventListener('mouseout', function(e){
            canvas.__dragging = false;
        });

        canvas.addEventListener('mouseup', function(e){
            canvas.__dragging = false;
        })
        canvas.addEventListener('mousemove', function(e){
            if(canvas.__dragging){
                canvas.__position_x += (e.offsetX - canvas.__last_positionX);
                canvas.__position_y += (e.offsetY - canvas.__last_positionY);

                canvas.__last_positionX = e.offsetX;
                canvas.__last_positionY = e.offsetY;

                vm.drawImageOnCanvas(null, canvas.__position_x, canvas.__position_y, canvas.__zoom);
            }
        })

        canvas.addEventListener('wheel', function(e){
            e.preventDefault();
            if(e.deltaY < 0){
                canvas.__position_x -= 10;
                canvas.__position_y -= 10;
                canvas.__zoom *= 1.1;
            } else {
                canvas.__position_x += 10;
                canvas.__position_y += 10;
                canvas.__zoom *= 0.9;                            
            }
            vm.drawImageOnCanvas(null, canvas.__position_x, canvas.__position_y, canvas.__zoom);
        })

    },

}    


</script>

<style scoped>
    
    label{
        margin: 0;
    }
    .vue-photo-upload{
        position: relative;
        cursor: pointer;
    }
    .vue-photo-upload canvas{
        cursor: move;

    }
    .vue-photo-upload-form{
        position: relative;
    }
    .hidden{
        display: none;
    }
    .label-block{
        display: block;
    }
    .vue-photo-upload-btn{
        text-align: center;
        padding: 1rem 2rem;
        background: rgba(0,0,0,1);
        color: #fff !important;
        margin: 0 auto;
        margin-top: 5px;
        display: inline-block;
    }
    .message{
        padding: 1rem;
        background: #eee;
        border-radius: 3px;
        display: flex;
        justify-content: center;
    }
    .flex{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

</style>