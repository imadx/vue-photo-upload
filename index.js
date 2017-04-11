const LiveEdit = {
    install(Vue, options) {
        const VuePhotoUpload = require('./Component/PhotoUpload')
        Vue.component(VuePhotoUpload.name, VuePhotoUpload)
    }
};

export default PhotoUpload;