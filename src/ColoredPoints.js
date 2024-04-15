// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

var gl;
var canvas;
var a_Position;
var u_FragColor;
var u_Size;
var triangle = false
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');  
  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    //console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {  
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  
    
  // Write the positions of vertices to a vertex shader
  var n = 3;
  console.log("I think there should be three of n. n's value is", n)
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
}
let color_storage = [1.0, 1.0, 1.0, 1.0]
var selected_Size = 50;
let segments = 5
let choose_shape = 0 //0 means point 1 means triangle 2 means circle
let shape_array = ['point', 'triangle', 'circle'];
function addActionsforHTMLUI() {;
document.getElementById("red_button").onclick = function() {color_storage = [1.0, 0.0, 0.0, 1.0];
updateSliders();}
document.getElementById("green_button").onclick = function() {color_storage = [0.0, 1.0, 0.0, 1.0];
updateSliders();}
document.getElementById("blue_button").onclick = function() {color_storage = [0.0, 0.0, 1.0, 1.0];
updateSliders();}
  

  document.getElementById("red").addEventListener("mouseup", function() {color_storage[0] = this.value / 100})
  document.getElementById("green").addEventListener("mouseup", function() {color_storage[1] = this.value / 100})    
  document.getElementById("blue").addEventListener("mouseup", function() {color_storage[2] = this.value/ 100})
  document.getElementById("size").addEventListener("mouseup", function() {selected_Size = this.value})
  document.getElementById("CircleSegs").addEventListener("mouseup", function() {segments = this.value})

  document.getElementById("clear").onclick = (function() {g_shapes_list = []; renderAllShapes()})
  document.getElementById("Triangle").onclick = (function() {choose_shape = 1})
  document.getElementById("point").onclick = (function() {choose_shape = 0})
  document.getElementById("circle_Point").onclick = (function() {choose_shape = 2})
}


function updateSliders(){
  document.getElementById("red").value = color_storage[0]*100;
  document.getElementById("green").value = color_storage[1]*100;
  document.getElementById("blue").value = color_storage[2]*100;
}


var g_shapes_list = [];




class Point {
  constructor(color=[1.0,1.0,1.0,1.0], size=5.0,position=[]) {
    this.type = 'point';
    this.position = position;
    this.color = color;
    this.Size = size
  }

  render() {
    ////console.log("Rendering...")
    // Pass the position of a point to a_Position variable
    var xy = this.position;
    gl.disableVertexAttribArray(a_Position);
    gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    gl.uniform1f(u_Size, this.Size)
    gl.drawArrays(gl.POINTS, 0, 1);
    console.log(this.color)
    // 
  }
}






function main() {

  setupWebGL();
  // Initialize shaders
  connectVariablesToGLSL();
  
  addActionsforHTMLUI();
  // Register function (event handler) to be called on a mouse press
 // if (canvas.ev == 1) {
    //var preserveDrawingBuffer = true
    //gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    //click()
  //}
  
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if(ev.buttons==1) {click(ev, gl, canvas, a_Position, u_FragColor)}}
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];
function click(ev) {
  var point;
  var rect = ev.target.getBoundingClientRect();  
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  if (choose_shape == 1) { 
    point = new Triangle(color=color_storage.slice(),size=selected_Size,position=[x, y])
    console.log("Triangle:\n", point);
  } else if (choose_shape == 0){
    //console.log("Getting point...")
    point = new Point(color_storage.slice(), selected_Size, [x, y])
  } else {
    point = new Circle(color=color_storage.slice(), size=selected_Size, position=[x, y], segments)
    // draw Circle

  }
  //console.log("COLOR FINAL", color_storage)
  //console.log("This is what happens when the canvas is clicked on.")
  //console.log("Obtaining X and Y coordinates of mouse pointer...")
  //console.log("Done.\nX Coordinate: ", x, "\nY Coordinate: ", y)

  // Store the coordinates to g_points array
  //console.lfog("Storing coordinates onto an array")
  
  //console.log("SIZE : ", point.size)
  g_shapes_list.push(point)
  //console.log(g_shapes_list)
  //console.log(point)
  renderAllShapes()
  
}

function renderAllShapes() {

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  let len = g_shapes_list.length;
  //console.log("Now for a for loop ", len, "long.")
  for(let i = 0; i < len; i++) {
    //console.log("g_shapes_list[i]: ", g_shapes_list[i])
    g_shapes_list[i].render()
    // Draw

    
  }
}


function DrawTriangle(vertices) {
  //var vertices = new Float32Array([
  //  0, 0.5,   -0.5, -0.5,   0.5, -0.5
  //]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}


