---
hide:
  - navigation
  - toc
---
# ROI editor for the ìmg class of Berry

<style>
    html{
        height: 100%;
    }
    body {
    height: 100%;
    font-family: system-ui, sans-serif;
    margin: 0px;
    padding: 0px;
    color: gray;
    background:  linear-gradient(
        rgb(204, 241, 255),
    transparent
  ),
  linear-gradient(
    90deg,
    rgb(248 253 205),
    transparent
  ),
  linear-gradient(
    -90deg,
    rgb(255, 211, 216),
    transparent
  );
  background-repeat: no-repeat;
  background-attachment: fixed;
    }

    .green {
    background-color: rgba(221, 221, 221, 0.76);
    color: gray;
    font-size: inherit;
    }
    .roi {
    background-color: rgba(221, 221, 221, 0.76);
     }

    .blue {
    background-color: rgb(184, 195, 241);
    border-color: transparent;
    width: 330px;
    margin: 10px;
    margin-left: auto;
    margin-right: auto;
    padding: 5px;
    /* border-radius: 1rem; */
    text-align: center;
    color: gray;
    }

    .parent {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    }

   .box {
    flex: 1 1 330px; /*  Stretching: */
    flex: 0 1 330px; /*  No stretching: */
    margin: 5px;
    padding: 1em;
    /* border-radius: 1rem; */
   }
    
   .boxl {
    /* flex: 0 1 700px;  No stretching: */
    margin: 5px;
    padding: 1em;
    /* border-radius: 1rem; */
   }
</style>


<div class="parent" id="app" onload="initROIeditor()">
    <div class="boxl green"><span id="img-header"></span>
        <img id="full-image" style="position:relative">
        <canvas id="canvas"
            style="position:absolute; left: 0px; top: 0px">
        </canvas>
    </div>
    <div class="box green">
        <p>Create ROI which will be the input tensor for TFL:</p>
        <p id="image-size"></p>
        <div>
            <tr>
            <td>Width:</td>
            <td><input type="number" id="roi_w" min="0" max="96" value="32" onchange="changeROIw()" class="box green"><br></td>
            </tr>
            <tr>
            <td>Height:</td>
            <td><input type="number" id="roi_h" min="0" max="96" value="32" onchange="changeROIh()" class="box green"><br></td>
            </tr>
            <tr>
            <td>Rotation:</td>
            <td><input type="number" id="roi_r" min="0" max="6.2" value="0" onchange="changeROIr()" class="box green"><br></td>
            </tr>
            <tr>
            <td>Scale X:</td>
            <td><input type="number" id="roi_scX" min="0" max="100" value="1" onchange="changeROIscX()" class="box green"><br></td>
            </tr>
            <tr>
            <td>Scale Y:</td>
            <td><input type="number" id="roi_scY" min="0" max="100" value="1" onchange="changeROIscY()" class="box green"><br></td>
            </tr>
        </div>
        <button class="md-button" id="addROI_btn" onclick="addROI()">
            Add ROI<br>
        </button>
    </div>
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.min.js"></script>
<script src="../extra_javascript/roi_editor.js">></script>
