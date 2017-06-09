const PhotoUpload = {
    install: function(Vue, options) {
        const VuePhotoUpload = require('./Component/PhotoUpload')
        Vue.component(VuePhotoUpload.name, VuePhotoUpload)
    }
};

export default PhotoUpload;