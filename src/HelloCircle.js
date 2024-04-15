// Fragment shader program

class Circle {
  constructor(color=[1.0,1.0,1.0,1.0], size=5.0,position=[],circle_segments=5){
    this.type = 'triangle';
    this.position = position;
    this.color = color;
    this.size = size/2;
    var xy = this.position; 
    this.d = this.size/200.0;
    this.seg = circle_segments;
    this.vertices = this.initVertexArray(circle_segments)
}

initVertexArray(seg_num){
  let vertices = [];
  let angle = 2*Math.PI / seg_num;
  let angle_incr;
  let incr2;
  for(let i=0; i<seg_num; i++) {
    angle_incr = i * angle 
    let x = this.d * Math.cos(angle_incr) + this.position[0];
    let y = this.d * Math.sin(angle_incr) + this.position[1];
    vertices.push(x);
    vertices.push(y);
    incr2 = (i + 1) * angle 
    x = this.d * Math.cos(incr2) + this.position[0];
    y = this.d * Math.sin(incr2) + this.position[1];
    vertices.push(x);
    vertices.push(y);    
    vertices.push(this.position[0]);
    vertices.push(this.position[1]); 
  }
  return vertices;
}


drawTriangle(vertices) {
  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // if (a_Position < 0) {
  //   console.log('Failed to get the storage location of a_Position');
  //   return -1;
  // }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  
  gl.drawArrays(gl.TRIANGLES, 0, 3*this.seg);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

}



render() {
  console.log("Rendering...")
  // Pass the position of a point to a_Position variable
  // gl.disableVertexAttribArray(a_Position);
  var Xy = this.position;
  var size = this.size;
  var rgba = this.color;

  // Pass the position of a point to a_Position variable
  // gl.vertexAttrib3f(a_Position, Xy[0], Xy[1], 0.0);

  // Pass the size of a point to u_Size variable
  gl.uniform1f(u_Size, size);

  // Pass the color of a point to u_FragColor variable
  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
  // Draw triangl
    console.log("this.drawTriangle")
    this.drawTriangle(this.vertices);
}
}
