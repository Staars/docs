# Berry Python Import Assistant

<script src="../extra_javascript/python2berry.js"></script>

<textarea name="python_src" id="python_src" rows="20" cols="80">Source
</textarea>

<br>
<button onclick="python2berry()" class="md-button">Convert to Berry</button>
<br>


<textarea name="berry_src" id="berry_src" rows="20" cols="80">
</textarea>


### `img` class

Thin wrapper for image data, that allows format conversions and is able to reduce memory reallocations in certain scenarios.  
  
Supports following image types, which integer values are equal to the enum `pixformat_t` of Espressif's webcam driver:  
- `img.RGB565`      = 0  
- `img.RGB888`      = 5  
- `img.JPEG`        = 4  
- `img.GRAYSCALE`   = 3  

Create an instance of an image with `var i = img()`.  
Memory will be released automatically by Berrys garbage collecter after deletion of the instance.  

img Function|Parameters and details
:---|:---
from_jpeg|`img.from_jpeg(jpeg_buffer:bytes[, type:img.type]) -> nil` Copy JPEG image as byte buffer to the buffer of an `img` instance. If optional image type is provided, this will be converted on the fly. This will not reallocate the image buffer, if the size and format does not change.
from_buffer|`img.from_buffer(image_data:bytes,width:int:height:int,type:img.type) -> nil` Construct image from raw image data for the types `RGB565`, `RGB888` and `GRAYSCALE`.
get_buffer|`img.get_buffer([descriptor:bytes]) -> image_data:bytes` Returns the raw image data for any supported type. For `RGB565`, `RGB888` and `GRAYSCALE` a descriptor can be provided to get a ROI (region of interest).
convert_to|`img.convert_to(type:img.type) -> nil` Internal conversion of the image format.
info|`img.info() -> map` Returns a map with some infos about the current image.
  
The optional ROI descriptor is a representation of an affine matrix, which can be constructed in Berry:
```berry
def roi_dsc(m)
    var d = bytes(-24)
    d.setfloat(0,m["scaleX"])
    d.setfloat(4,m["shearX"])
    d.setfloat(8,m["shearY"])
    d.setfloat(12,m["scaleY"])
    d.seti(16,m["transX"],2)
    d.seti(18,m["transY"],2)
    d.seti(20,m["width"],2)
    d.seti(22,m["height"],2)
    return d
end
```
  
A simple web tool, to create such matrices is provided in the docs.
  

### `cam` module

Very small module to access a connected camera module with the purpose to have as much heap memory available as possible in comparison to the fully fledged webcam drivers for machine learning, but there are more possible applications. It is not intended to be a general replacement for the webcam drivers.
  
Tasmota Function|Parameters and details
:---|:---
cam.setup|`(mode:int) -> bool` Init camera hardware with the resolution (same value as command `wcresolution`).
cam.get_image|`([image:img[,type:img.type]]) -> bytes or nil` Takes a picture - without an additional option this is just a JPEG buffer. If an image instance is provided, the image data will go there. If an additional type is given, a conversion will happen on the fly. This will not lead to a memory reallocation, if there is no change for size and type of the image.
cam.info|`() -> map` Shows info map with last current resolution and camera mode 

Example:  

``` berry

# set background color to blue
scr = lv.scr_act()
scr.set_style_bg_color(lv.color(lv.COLOR_BLUE), lv.PART_MAIN | lv.STATE_DEFAULT)

# create a lv_img object as image view
cam_view = lv.img(scr)
cam_view.center()

i = img()

import cam
cam.setup(4) # 240 x 240
cam.get_image(i,i.RGB565)

def lv_img_dsc(image)
    var i = image.info()
    var dsc = bytes(24)
    dsc..0x19 # magic
    dsc..0x12 # cf RGB565
    dsc.add(0,2) # flags
    dsc.add(i["width"],2) # width
    dsc.add(i["height"],2) # height
    dsc.add(i["width"] * 2,2) # stride
    dsc.add(0,2) # reserved
    dsc.add(i["size"],4) # size
    dsc.add(i["buf_addr"],4) # data
    dsc.add(0,4) # reserved
    print(dsc)
    return dsc
end

descriptor = lv_img_dsc(i)
cam_view.set_src(descriptor) # bind cam_view to buffer of img

def video()
    cam.get_image(i,i.RGB565) # this will just update the buffer, no reallocation
    cam_view.invalidate()
    tasmota.set_timer(20,/->video()) # aim for 50 Hz
end

video()
```


