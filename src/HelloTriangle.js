// Fragment shader program

class Triangle {
    constructor(color=[1.0,1.0,1.0,1.0], size=5.0,position=[], vertices = [],angle=90){
      //console.log("Tri Type", tri_type)
      this.type = 'triangle';
      this.position = position
      this.color = color;
      this.size = size;
      //this.tri_type = tri_type
      var xy = this.position      
      var d = this.size/200.0;
      this.vertices = [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]
      this.tri_type = document.getElementById("tri_type").value
      console.log("TRI TYPE!!!", this.tri_type)
      //console.log("Original Vertices ", this.vertices)
      //this.tri_type = tri_type
      var reflect_dist = (this.vertices[2] - this.vertices[0]) * -2
      if (this.tri_type == "right_left") {
        //this.vertices[0] = (this.vertices[0] * -1) + xy[0]
        this.vertices[2] += reflect_dist
        //this.vertices[4] = (this.vertices[4] * -1)
      } else if (this.tri_type == "right_down") {
        reflect_dist = (this.vertices[5] - this.vertices[1]) * 2
        this.vertices[5] -= reflect_dist
      } else if (this.tri_type == "left_n_down") {        
        var reflect_dist_y = (this.vertices[5] - this.vertices[1]) * -2
        var reflect_dist_x = (this.vertices[2] - this.vertices[0]) * -2
        this.vertices[2] += reflect_dist_x
        this.vertices[5] += reflect_dist_y
      }
      console.log("reflect_dist", reflect_dist)
      console.log("New Verts", this.vertices)
      //this.vertices = new Float32Array([xy[0], xy[1]+d, xy[0], xy[1], xy[0]+d, xy[1]])
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
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  }
  
  
  
  render() {
    //console.log("Rendering...")
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
      //console.log("this.drawTriangle")
      this.drawTriangle(this.vertices);
  }
}
