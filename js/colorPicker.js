// Colors to pick
let colorList = [
            "#AF8091"
          , "#7E9B7E"
          , "#E76F51"
          , "#FFC7B8"
          , "#ABE6FF"
          , "#A074C3"
          , "#FEE873"
          , "#18D1BB"
          , "#546480"
          , "#DF5961"
          , "#EA5FC3"
          , "#A585FF"
          , "#37AF75"
          , "#FCAC5C"
          , "#CAD4D9"
          , "#8E1189"
];

// Creating the divs for the colors
let colorContainer = document.getElementById('color-container');
// Looping through the color list and creating div circles
for(let i = 0; i < colorList.length; i++) {
    colorContainer.innerHTML += '<div class="color-pick"></div>'
}

// Class of each color div
let colorPicker = document.getElementsByClassName('color-pick');
// Chosen color frame
let outputColor = document.getElementById('output-color');


// Assignin colors, looping through each circle
for (let i=0; i < colorPicker.length; i++) {
    // Changing the color from the colorlist
    colorPicker[i].style.backgroundColor = colorList[i];
    // Listening for the click on each color and calling changecolor function
    colorPicker[i].addEventListener('click', function() {
        changeColor(colorList[i], i);
    })
}

// Changing color on output by adding active class to the color-pick div
changeColor = (color, activeColor) => {
    for (let i = 0; i < colorPicker.length; i++) {
        // First remove the active class from all elements
        colorPicker[i].classList.remove('activeColor');
    }
    // Then adding the active class and changing color
    colorPicker[activeColor].classList.add('activeColor');
    outputColor.style.backgroundColor = color;
}