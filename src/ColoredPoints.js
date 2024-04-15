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
    console.log('Failed to get the rendering context for WebGL');
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
let tri_type;
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

  document.getElementById("picture").onclick = (function() { drawPicture(); })
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
    // Pass the position of a point to a_Position variable
    var xy = this.position;
    gl.disableVertexAttribArray(a_Position);
    gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    gl.uniform1f(u_Size, this.Size)
    gl.drawArrays(gl.POINTS, 0, 1);
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

    tri_type = document.getElementById("tri_type").value
    console.log("Tri_type outside", tri_type)
    point = new Triangle(color=color_storage.slice(),size=selected_Size,position=[x, y],vertices=[],tri_type)
  } else if (choose_shape == 0){
    point = new Point(color_storage.slice(), selected_Size, [x, y])
  } else {
    point = new Circle(color=color_storage.slice(), size=selected_Size, position=[x, y], segments)
    // draw Circle
  }
  g_shapes_list.push(point)
  console.log(point)
  renderAllShapes()
  
}

function renderAllShapes() {

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  let len = g_shapes_list.length;
  for(let i = 0; i < len; i++) {
    console.log(g_shapes_list[i])
    g_shapes_list[i].render();
    // Draw

    
  }
}


function addTriangle(color, vertices){
  g_shapes_list.push(new Triangle(color, 1.0, [0, 0], vertices))
}

function drawPicture(){
  // 20 + triangles

  // addTriangle([1, 0, 0, 1], [ 0.0, 0.0, 
  //                             0.0, 1.0,
  //                             1.0, 0.0]);
                          
  //addTriangle([1, 0.69, 0, 1], [ 
  //  0.0, 0.0,
  //  0.0, -1.0, 
  //  -1.0, 0.0]);
  g_shapes_list = []; 
  //renderAllShapes()
  water = new Point([0.0, 0.71, 1.0, 1.0], 400, [0, 0])
  tail1 = new Triangle([1, 1, 0.24, 1], 34.5, [-0.85, -0.29],[],"isosceles_left")
  tail2 = new Triangle([1, 1, 0.24, 1], 34.5, [-0.85, -0.475],[],"isosceles_left")
  fishbody1 = new Point([1, 0.69, 0, 1], 72, [-0.5999884271621704, -.3])
  fishbody2 = new Point([1, 0.69, 0, 1], 72, [-0.2999884271621704, -.3])
  fishbody3 = new Point([1, 0.69, 0, 1], 72, [0.0519884271621704,  -.3])
  big_bubble = new Circle([0, 1, .95, 1], 101, [0.7850115728378296, 0.6749884271621704], 24)
  small_bubble = new Circle([0, 1, .95, 1], 60, [0.5850115728378296, 0.2749884271621704], 24)
  fish_head = new Circle([1, 0.69, 0, 1], 75, [0.2550115728378296, -0.3], 7)  
  fish_eye_outer = new Point([1, 1, 1, 1], 25, [0.1600115728378296, -0.3050115728378296])
  fish_eye_inner = new Point([0, 0, 0, 1], 15, [0.1800115728378296, -0.27501157283782957])
  fin_1 = new Triangle([1, 1, 0.24, 1], 50,  [-0.3399884271621704, -0.12334490716457366])
  fin_2 = new Triangle([1, 1, 0.24, 1], 50,  [-0.3399884271621704, -0.47334490716457366],[],"right_down")
  smile = new Triangle([1, 1, 0.24, 1], 15, [0.3200115728378296,-0.3550115728378296],[],"right_down")
  //fish_head_top = new Triangle([1, 0.69, 0, 1], 72,)
  g_shapes_list.push(water)
  g_shapes_list.push(tail1) 
  g_shapes_list.push(tail2) 
  g_shapes_list.push(fishbody1)
  g_shapes_list.push(fishbody2)
  g_shapes_list.push(fishbody3)
  g_shapes_list.push(fish_head)                 
  g_shapes_list.push(fish_eye_outer)    
  g_shapes_list.push(fish_eye_inner)  
  g_shapes_list.push(fin_1)
  g_shapes_list.push(fin_2)
  g_shapes_list.push(big_bubble)                     
  g_shapes_list.push(small_bubble)       
  g_shapes_list.push(smile)         
  // addTriangle([1, 0.69, 0, 1], [ 
  //   0.0, 0.0,
  //   0.0, -1.0, 
  //   -1.0, 0.0]);
  renderAllShapes();
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


