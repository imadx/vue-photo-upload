# Vue Photo Upload
### Simple UI for cropping, positioning and uploading a single photo.

## Installation
### 1. Install using npm  

```bash
npm install --save vue-photo-upload
```
### 2. Import *Vue* and *vue-photo-upload*

```javascript
import Vue from 'vue'  
import PhotoUpload from 'vue-photo-upload'  
Vue.use(PhotoUpload);
```

### 3. Include components with your app  

Within your Vue app, use, `<photo-upload></photo-upload>` as a `Vue.component`, with the following options.

```html
<photo-upload 
    :enableEdits="true"
    :photoDefault="defaultPhoto"
    buttonClass="btn btn-primary"
    :showMessages="true"
    @photo-submit="photo_upload"
    @photo-change="photo_changed"
    >
</photo-upload>
```

The `enableEdits`, and `photoDefault` props can be reactive.  
Use `photoDefault` can be used to include a default photo or an existing photo.
The `photo_upload` event emits `event` parameters and the `html5 file component`

```javascript
photo_upload: function(e, file){
    console.log(e,file)
}
```
