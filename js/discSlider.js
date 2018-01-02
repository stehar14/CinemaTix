// On page ready function to initialize selectable dropdowns on discover page
$(document).ready(function() {
  $('select').material_select();
});

// Function to control release year slider on discover page
var snapSlider = document.getElementById('slider-snap');
noUiSlider.create(snapSlider, {
 start: [1970, 2018],
 connect: true,
 step: 1,
 orientation: 'horizontal',
 range: {
   'min': 1970,
   'max': 2018
 },
 format: wNumb({
   decimals: 0
 })
});
// Display values on release year slider
var snapValues = [
  document.getElementById('slider-snap-value-lower'),
  document.getElementById('slider-snap-value-upper')
];
snapSlider.noUiSlider.on('update', function( values, handle ) {
  snapValues[handle].innerHTML = values[handle];
});