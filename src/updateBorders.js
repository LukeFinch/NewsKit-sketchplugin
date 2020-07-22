var sketch = require("sketch");
var SharedStyle = require('sketch/dom').SharedStyle



function getSharedStyles(type) {
  var myStyles = []
	if (sketch.version.sketch < 52) {
		var styles = (type == 0) ? MSDocument.currentDocument().documentData().layerStyles().objects() : MSDocument.currentDocument().documentData().layerTextStyles().objects();
	} else {
		var styles = (type == 0) ? MSDocument.currentDocument().documentData().allLayerStyles() : MSDocument.currentDocument().documentData().allTextStyles();
	}

	var sortByName = NSSortDescriptor.sortDescriptorWithKey_ascending("name",1);
	styles = styles.sortedArrayUsingDescriptors([sortByName]);
    styles.forEach(style => {myStyles.push(style)})
	return myStyles;
}

var styles = getSharedStyles(0)
//console.log(styles)

var groups =['02','03','04','05']


for( var g = 0; g < groups.length; g++){
var group = styles.filter(style => { return style.name().startsWith(groups[g])})



var names = group.map(obj => obj.name())
var colors = group.filter(style => {
if(!style.name().includes('borders'))
  return style
})

//console.log(colors)

var fills = colors.map(obj => {
let rObj = {}
if(!obj.name().startsWith('gradient')){
rObj.name = obj.name().split('/')[1];
}
if(obj.style().fills().length){
rObj.color = obj.style().fills()[0].color()
}
return rObj
})




var borders = group.filter(style => {
if(style.name().includes('borders')){return style}})


borders.forEach(border => {

token = border.name().split('/')[2].split('-')[0]
//console.log(token)
index = findWithAttr(fills,'name',token)
if(fills[index].color && fills[index].name){
border.style().borders()[0].color = fills[index].color
}
border.resetReferencingInstances()

})
}


function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}
