var sketch = require("sketch");
var SharedStyle = require('sketch/dom').SharedStyle
var Style = require('sketch/dom').Style
var document =sketch.getSelectedDocument()

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
var inks = getSharedStyles(0).filter(style => { return style.name().startsWith('01')}).map(ink => {
rObj = {}
rObj.name = ink.name().split('/')[1]
rObj.color = ink.style().fills()[0].color()
return rObj
})



//console.log(inks)
var textStyles = getSharedStyles(1)


selectedStyle = document.getSharedTextStyleWithID(textStyles[0].objectID());
s = selectedStyle.getAllInstancesLayers()
//console.log(s)


textStyles.forEach(style => {
  selectedStyle = document.getSharedTextStyleWithID(style.objectID())
  il = style.name().split('/').length
  token = style.name().split('/')[il - 1]
  index = findWithAttr(inks, 'name', token)
  if(index > -1){
  inkColor = inks[index].color
  inkHex = inkColor.immutableModelObject().hexValue()
  inkAlpha = Math.round(inkColor.alpha()*255).toString(16)
  selectedStyle.style.textColor = '#'+inkHex+inkAlpha
  style.resetReferencingInstances()
}
  //style.style().primitiveTextStyle().encodedAttributes().MSAttributedStringColorAttribute = inks[index].color
})




// const { document } = context
// 
// // Get the first shared layer style in the document.
// const sharedLayerStyle = document.documentData().layerStyles().objects()[0]
// 
// // Create a placeholder layer that will be the source for updating the shared style.
// const placeholder = MSStyledLayer.new()
// 
// // Give the placeholder layer the exact same style as the shared layer style.
// placeholder.setStyle(sharedLayerStyle.style().copy())
// placeholder.setSharedStyleID(sharedLayerStyle.objectID())
// 
// // Now change the placeholder layer to have a green fill.
// placeholder.style().fills()[0].color = MSColor.colorWithNSColor(NSColor.greenColor())
// 
// // This is a way of avoiding having to add the placeholder to a page on the document
// // before the next step.
// placeholder.setDocumentData(document.documentData())
// 
// // Simulate the user clicking the sync button in the UI to apply the styles of the
// // placeholder to the shared layer style.
// const updater = MSShareableObjectUpdater.new()
// updater.setSelectedLayers(MSLayerArray.arrayWithLayer(placeholder))
// updater.performSyncAndOrUnlinkAction()


function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}
