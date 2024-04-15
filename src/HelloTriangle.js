// Fragment shader program

class Triangle {
    constructor(color=[1.0,1.0,1.0,1.0], size=5.0,position=[], vertices = [],tri_type){
      this.type = 'triangle';
      this.position = position
      this.color = color;
      this.size = size;
      this.tri_type = tri_type
      var xy = this.position      
      var d = this.size/200.0;
      let angle = 90;
      this.vertices = [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]
      console.log("Point 1:", this.vertices[0],this.vertices[1])
      console.log("Point 2:", this.vertices[2],this.vertices[3])
      console.log("Point 3:", this.vertices[4],this.vertices[5])

      var reflect_dist = (this.vertices[2] - this.vertices[0]) * -2
      
      let width = this.vertices[2] - this.vertices[0]; //we want the width to be the same as the height 
      let height = this.vertices[5] - this.vertices[1]
      if (this.tri_type == "right_left") {
        this.vertices[2] += reflect_dist
      } else if (this.tri_type == "right_down") {
        reflect_dist = (this.vertices[5] - this.vertices[1]) * 2
        this.vertices[5] -= reflect_dist
      } else if (this.tri_type == "left_n_down") {        
        var reflect_dist_y = (this.vertices[5] - this.vertices[1]) * -2
        var reflect_dist_x = (this.vertices[2] - this.vertices[0]) * -2
        this.vertices[2] += reflect_dist_x
        this.vertices[5] += reflect_dist_y
      } else if (this.tri_type == "equilateral") {
        //if each length is equal get 
        //length between first two xes 
        this.vertices[5] = this.vertices[1] + (this.vertices[2] - this.vertices[0])
        this.vertices[4] = (this.vertices[2] + this.vertices[0]) / 2
      } else if (this.tri_type == "isosceles") {        
        this.vertices[4] = (this.vertices[2] + this.vertices[0]) / 2
        this.vertices[5] = this.vertices[1] + (d*2)      
      } else if (this.tri_type == "isosceles_down") {   
        this.vertices[4] = (this.vertices[2] + this.vertices[0]) / 2
        this.vertices[5] = this.vertices[1] - (d*2) //recalculate width and height
        width = this.vertices[2] - this.vertices[0]; //we want the width to be the same as the height 
        height = this.vertices[5] - this.vertices[1] //y2 needs to have width added to it 
        //this.vertices[3] += width
        //this.vertices[2] = this.vertices[0] //x1 = x2
        console.log("Post transformation")
        console.log("Point 1:", this.vertices[0],this.vertices[1])
        console.log("Point 2:", this.vertices[2],this.vertices[3])
        console.log("Point 3:", this.vertices[4],this.vertices[5])
    } else if (this.tri_type == "isosceles_left") {   
      this.vertices[4] = (this.vertices[2] + this.vertices[0]) / 2
      this.vertices[5] = this.vertices[1] + (d*2) //recalculate width and height
      // console.log("Post transformation")
      // console.log("Point 1 (Bottom Left):", this.vertices[0],this.vertices[1])
      // console.log("Point 2 (Bottom Right):", this.vertices[2],this.vertices[3])
      // console.log("Point 3 (Top):", this.vertices[4],this.vertices[5])
      this.vertices[3] += width //BLy (Bottom Left) gets width
      this.vertices[0] = this.vertices[2] //x1 = x2
      this.vertices[5] = this.vertices[1] + width/2
      this.vertices[4] -= (height + width/2)
      // console.log("Rotation")      
      // console.log("Point 1 (Bottom Left):", this.vertices[0],this.vertices[1])
      // console.log("Point 2 (Bottom Right):", this.vertices[2],this.vertices[3])
      // console.log("Point 3 (Top):", this.vertices[4],this.vertices[5])
    } else if (this.tri_type == "isosceles_right") {   
      this.vertices[4] = (this.vertices[2] + this.vertices[0]) / 2
      this.vertices[5] = this.vertices[1] + (d*2) //recalculate width and height
      // console.log("Post transformation")
      // console.log("Point 1 (Bottom Left):", this.vertices[0],this.vertices[1])
      // console.log("Point 2 (Bottom Right):", this.vertices[2],this.vertices[3])
      // console.log("Point 3 (Top):", this.vertices[4],this.vertices[5])
      this.vertices[3] += width //BLy (Bottom Left) gets width
      this.vertices[0] = this.vertices[2] //x1 = x2
      this.vertices[5] = this.vertices[1] + width/2
      this.vertices[4] += (height + width)
      // console.log("Rotation")      
      // console.log("Point 1 (Bottom Left):", this.vertices[0],this.vertices[1])
      // console.log("Point 2 (Bottom Right):", this.vertices[2],this.vertices[3])
      // console.log("Point 3 (Top):", this.vertices[4],this.vertices[5])
    }
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
    this.drawTriangle(this.vertices);
  }
}
